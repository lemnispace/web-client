import { collectionCreate } from "@/lib/shopify/mutations/collectionMutations";
import {
  duplicateProduct,
  productUpdate,
  productVariantUpdate,
} from "@/lib/shopify/mutations/productMutations";
import {
  createImageForProduct,
  stageImageForUpload,
} from "@/lib/shopify/mutations/stagedUploads";
import { fetchCollection } from "@/lib/shopify/queries/collectionQuery";
import { Collection, ProductNode } from "@/lib/types/shopify";
import {
  VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY,
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_ORIGIN_PRODUCT_KEY,
  VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY,
  VARIANT_METADATA_USER_ID_KEY,
} from "@/utils/constants";
import { getCustomProductId, getVariantByTitle } from "@/utils/getters";
import { mapProduct } from "@/utils/mappers";
import { parseApiResponse, parseClientResponse } from "@/utils/parsers";
import {
  requiredImageFileSchema,
  requiredStringSchema,
} from "@/utils/schemaValidators";
import { ApiResponse, ServerApiResponse } from "@/utils/types";
import { isErrorResponse } from "@/utils/validators";
import { NextResponse } from "next/server";
import { z } from "zod";

interface ValidationErrors {
  productId?: string[];
  file?: string[];
}

export interface CustomProductResponse {
  productId: string;
  productHandle: string;
  variantId: string;
  collection: Pick<Collection, "id" | "handle">;
}

type CreateCustomProductResponse = ApiResponse<
  ValidationErrors,
  unknown,
  CustomProductResponse
>;

interface UpdateCustomProductParams {
  variantTitle: string;
  product: ProductNode;
  imageId: string;
  userId: string;
  originProductId: string;
  originProductVariantId: string;
}

interface UpdateCustomProductVariantWithImageParams {
  customProduct: ProductNode;
  originProductId: string;
  originProductVariantId: string;
  userId: string;
  resourceUrl: string;
  variantTitle: string;
}

const schema = z.object({
  productId: requiredStringSchema({
    name: "ProductId",
    description: "The ProductId of the product to use for customizations",
  }),
  variantId: requiredStringSchema({
    name: "VariantId",
    description:
      "The VariantId of the variant associated with the product to use for customizations",
  }),
  variantTitle: requiredStringSchema({
    name: "VariantTitle",
    description:
      "The variantTitle of the variant associated with the product to use for customizations",
  }),
  file: requiredImageFileSchema(),
});

const getCollection = async (handle: string) => {
  const collectionResponse = await fetchCollection(handle, 1);
  return parseClientResponse(collectionResponse, "Error fetching collection")
    .collectionByHandle;
};

const createCollection = async (userId: string, productIds: string[]) => {
  const createCollectionResponse = await collectionCreate({
    title: userId,
    products: productIds,
  });
  const createdCollection = parseClientResponse(
    createCollectionResponse,
    "Error creating collection"
  );
  if (!createdCollection.collectionCreate.collection) {
    throw new Error("Failed to create collection");
  }
  return createdCollection.collectionCreate.collection;
};

const addProductToCollection = async (userId: string, productId: string) => {
  const collection = await getCollection(userId);
  if (!collection) {
    return await createCollection(userId, [productId]);
  }
  const productUpdateRespone = await productUpdate({
    id: productId,
    collectionsToJoin: [collection.id],
  });
  const updatedProduct = parseClientResponse(
    productUpdateRespone,
    "Error updating product"
  );
  if (!updatedProduct.productUpdate.product) {
    throw new Error("Failed to update product");
  }
  return collection;
};

const updateCustomProductVariant = async ({
  product,
  variantTitle,
  imageId,
  userId,
  originProductId,
  originProductVariantId,
}: UpdateCustomProductParams) => {
  const variant = getVariantByTitle(mapProduct(product), variantTitle);
  if (!variant) {
    throw new Error(`No variant found with title: ${variantTitle}`);
  }
  // modify the variant to use the new image
  const updateVariantResponse = await productVariantUpdate({
    id: variant.id,
    mediaId: imageId,
    metafields: [
      {
        type: "single_line_text_field",
        id: variant.metafields?.[VARIANT_METADATA_USER_ID_KEY]?.id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_USER_ID_KEY,
        value: userId,
      },
      {
        type: "product_reference",
        id: variant.metafields?.[VARIANT_METADATA_ORIGIN_PRODUCT_KEY]?.id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_ORIGIN_PRODUCT_KEY,
        value: originProductId,
      },
      {
        type: "date_time",
        id: variant.metafields?.[VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY]
          ?.id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY,
        value: new Date().toISOString(),
      },
      {
        type: "variant_reference",
        id: variant.metafields?.[VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY]
          ?.id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY,
        value: originProductVariantId,
      },
    ],
  });
  const parsedUpdateVariantResponse = parseClientResponse(
    updateVariantResponse,
    "Error updating variant image"
  );
  return parsedUpdateVariantResponse.productVariantUpdate.productVariant;
};

const updateCustomProductVariantWithImage = async ({
  customProduct,
  userId,
  resourceUrl,
  variantTitle,
  originProductId,
  originProductVariantId,
}: UpdateCustomProductVariantWithImageParams) => {
  // create the image for the new product using the staged image
  const createImageForProductResponse = await createImageForProduct({
    productId: customProduct.id,
    resourceUrl,
  });
  // modify the variant to use the new image
  const updatedCustomVariant = await updateCustomProductVariant({
    product: customProduct,
    variantTitle,
    imageId: createImageForProductResponse.mediaId,
    userId,
    originProductId,
    originProductVariantId,
  });
  if (!updatedCustomVariant) {
    throw new Error("Failed to update custom product variant");
  }
  return updatedCustomVariant;
};

const createCustomProduct = async (
  _formData: FormData
): Promise<CreateCustomProductResponse> => {
  const userId = "bda86db3-d3c0-4983-99ec-87d4da67d874"; // replace with user id from session;
  const validatedFields = schema.safeParse({
    file: _formData.get("file"),
    productId: _formData.get("productId"),
    variantTitle: _formData.get("variantTitle"),
    variantId: _formData.get("variantId"),
  });
  if (!validatedFields.success) {
    console.error(
      "Validation error:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      data: undefined,
      status: 400,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  try {
    const [stagedImageUploadResponse, duplicateProductResponse] =
      await Promise.all([
        // stage the image for upload (host the image on Shopify's servers)
        stageImageForUpload(
          validatedFields.data.file,
          getCustomProductId({
            productId: validatedFields.data.productId,
            variantTitle: validatedFields.data.variantTitle,
            userId,
          })
        ),
        // duplicate the product being customized to add the custom variant
        duplicateProduct({
          newStatus: "DRAFT",
          productId: validatedFields.data.productId,
          newTitle: getCustomProductId({
            userId,
            productId: validatedFields.data.productId,
            variantTitle: validatedFields.data.variantTitle,
          }),
        }),
      ]);

    const duplicateProductData = parseClientResponse(
      duplicateProductResponse,
      "Error duplicating product"
    );

    const [updatedCustomVariant, collection] = await Promise.all([
      // add the uploaded image & metafields to the new product variant
      await updateCustomProductVariantWithImage({
        customProduct: duplicateProductData.productDuplicate.newProduct,
        originProductId: validatedFields.data.productId,
        originProductVariantId: validatedFields.data.variantId,
        userId,
        resourceUrl: stagedImageUploadResponse.resourceUrl,
        variantTitle: validatedFields.data.variantTitle,
      }),
      // add the new product to the user's collection
      await addProductToCollection(
        userId,
        duplicateProductData.productDuplicate.newProduct.id
      ),
    ]);

    return {
      status: 200,
      data: {
        productId: duplicateProductData.productDuplicate.newProduct.id,
        productHandle: duplicateProductData.productDuplicate.newProduct.handle,
        variantId: updatedCustomVariant.id,
        collection: {
          id: collection.id,
          handle: collection.handle,
        },
      },
    };
  } catch (error) {
    console.error("Error creating custom product:", error);
    return {
      data: undefined,
      status: 500,
      errors: error,
    };
  }
};

export const POST = async (
  req: Request
): Promise<ServerApiResponse<CustomProductResponse>> => {
  try {
    const formData = await req.formData();
    const createCustomProductResponse = await createCustomProduct(formData);
    const result = await parseApiResponse(
      createCustomProductResponse,
      "Error creating custom product"
    );
    if (isErrorResponse(result)) {
      throw new Error(result.errors);
    }
    const { status, ...response } = result;
    return NextResponse.json(response, {
      status,
    });
  } catch (error) {
    console.error("Error creating custom product:", error);
    return NextResponse.json(
      { errors: "Error creating custom product", data: undefined },
      { status: 500 }
    );
  }
};
