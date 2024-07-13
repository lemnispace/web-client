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
  PRODUCT_METADATA_NAMESPACE,
  PRODUCT_METADATA_ORIGIN_PRODUCT_KEY,
  VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY,
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_ORIGIN_PRODUCT_KEY,
  VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY,
  VARIANT_METADATA_USER_ID_KEY,
} from "@/utils/constants";
import { getOrCreateVisitorId } from "@/utils/cookies/visitorId";
import { fetchCustomProductByOriginProduct } from "@/utils/fetchers";
import { getCustomProductId, getVariantByTitle } from "@/utils/getters";
import { mapCustomProduct, mapProduct } from "@/utils/mappers";
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
  userId: requiredStringSchema({
    name: "UserId",
    description: "The userId of the user creating the custom product",
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

const getOrCreateCollection = async (userId: string, productIds: string[]) => {
  const collection = await getCollection(userId);
  if (!collection) {
    return await createCollection(userId, productIds);
  }
  return collection;
};

const addProductToCollection = async (
  userId: string,
  productNode: ProductNode,
  referenceProductId: string
) => {
  const collection = await getOrCreateCollection(userId, [productNode.id]);
  const product = mapCustomProduct(productNode);
  const productUpdateResponse = await productUpdate({
    id: product.id,
    collectionsToJoin: [collection.id],
    metafields: [
      {
        type: "product_reference",
        id: product.metafields?.[PRODUCT_METADATA_ORIGIN_PRODUCT_KEY]?.id,
        namespace: PRODUCT_METADATA_NAMESPACE,
        key: PRODUCT_METADATA_ORIGIN_PRODUCT_KEY,
        value: referenceProductId,
      },
    ],
  });
  const updatedProduct = parseClientResponse(
    productUpdateResponse,
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
  const createImageForProductResponse = await createImageForProduct({
    productId: customProduct.id,
    resourceUrl,
  });
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

const fetchOrCreateCustomProduct = async (
  originProductId: string,
  userId: string
) => {
  const customProduct = await fetchCustomProductByOriginProduct({
    originProductId,
    userId,
  });
  if (customProduct) {
    return customProduct;
  }
  // If no custom product exists, duplicate the origin product
  const duplicateProductResponse = await duplicateProduct({
    newStatus: "DRAFT",
    productId: originProductId,
    newTitle: getCustomProductId({ userId, productId: originProductId }),
  });
  const duplicateProductData = parseClientResponse(
    duplicateProductResponse,
    "Error duplicating product"
  );
  return duplicateProductData.productDuplicate.newProduct;
};

const validateFormData = (formData: FormData) => {
  const validatedFields = schema.safeParse({
    file: formData.get("file"),
    productId: formData.get("productId"),
    variantTitle: formData.get("variantTitle"),
    variantId: formData.get("variantId"),
    userId: formData.get("userId"),
  });
  if (!validatedFields.success) {
    console.error(
      "Validation error:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  return { data: validatedFields.data };
};

interface CreateCustomProductParams {
  productId: string;
  variantId: string;
  variantTitle: string;
  file: File;
  userId: string;
}
const createCustomProduct = async (
  params: CreateCustomProductParams
): Promise<CreateCustomProductResponse> => {
  try {
    const [stagedImageUploadResponse, customProduct] = await Promise.all([
      stageImageForUpload(
        params.file,
        getCustomProductId({
          productId: params.productId,
          userId: params.userId,
        })
      ),
      fetchOrCreateCustomProduct(params.productId, params.userId),
    ]);

    const updatedCustomVariant = await updateCustomProductVariantWithImage({
      customProduct,
      originProductId: params.productId,
      originProductVariantId: params.variantId,
      userId: params.userId,
      resourceUrl: stagedImageUploadResponse.resourceUrl,
      variantTitle: params.variantTitle,
    });
    const collection = await addProductToCollection(
      params.userId,
      customProduct,
      params.productId
    );

    return {
      status: 200,
      data: {
        productId: customProduct.id,
        productHandle: customProduct.handle,
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
    const visitorId = getOrCreateVisitorId();
    const formData = await req.formData();
    formData.append("userId", visitorId);
    const validatedFields = validateFormData(formData);
    if (validatedFields.errors) {
      return NextResponse.json(
        { errors: validatedFields.errors, data: undefined },
        { status: 400 }
      );
    }
    const createCustomProductResponse = await createCustomProduct(
      validatedFields.data
    );
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
