import {
  duplicateProduct,
  productVariantUpdate,
} from "@/lib/shopify/mutations/productMutations";
import {
  createImageForProduct,
  stageImageForUpload,
} from "@/lib/shopify/mutations/stagedUploads";
import { ProductNode } from "@/lib/types/shopify";
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
}

type CreateCustomProductResponse = ApiResponse<
  ValidationErrors,
  unknown,
  CustomProductResponse
>;

const schema = z.object({
  productId: requiredStringSchema({
    name: "ProductId",
    description: "The ProductId of the product to use for customizations",
  }),
  variantTitle: requiredStringSchema({
    name: "VariantTitle",
    description:
      "The variantTitle of the variant associated with the product to use for customizations",
  }),
  file: requiredImageFileSchema(),
});

interface UpdateCustomProductParams {
  variantTitle: string;
  product: ProductNode;
  imageId: string;
  userId: string;
  originProductId: string;
  originProductVariantId: string;
}

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
        id: variant.metafields?.[VARIANT_METADATA_USER_ID_KEY].id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_USER_ID_KEY,
        value: userId,
      },
      {
        id: variant.metafields?.[VARIANT_METADATA_ORIGIN_PRODUCT_KEY].id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_ORIGIN_PRODUCT_KEY,
        value: originProductId,
      },
      {
        id: variant.metafields?.[VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY]
          .id,
        namespace: VARIANT_METADATA_NAMESPACE,
        key: VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY,
        value: new Date().toISOString(),
      },
      {
        id: variant.metafields?.[VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY]
          .id,
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

const createCustomProduct = async (
  _formData: FormData
): Promise<CreateCustomProductResponse> => {
  const userId = "bda86db3-d3c0-4983-99ec-87d4da67d874"; // replace with user id from session;
  const validatedFields = schema.safeParse({
    file: _formData.get("file"),
    productId: _formData.get("productId"),
    variantTitle: _formData.get("variantTitle"),
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
        // duplicate the modified product
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
    // create the image for the new product using the staged image
    const createImageForProductResponse = await createImageForProduct({
      productId: duplicateProductData.productDuplicate.newProduct.id,
      resourceUrl: stagedImageUploadResponse.resourceUrl,
    });
    // modify the variant to use the new image
    const updatedCustomVariant = await updateCustomProductVariant({
      product: duplicateProductData.productDuplicate.newProduct,
      variantTitle: validatedFields.data.variantTitle,
      imageId: createImageForProductResponse.mediaId,
      userId,
      originProductId: validatedFields.data.productId,
      originProductVariantId: validatedFields.data.variantTitle,
    });
    if (!updatedCustomVariant) {
      throw new Error("Failed to update custom product variant");
    }

    return {
      status: 200,
      data: {
        productId: duplicateProductData.productDuplicate.newProduct.id,
        productHandle: duplicateProductData.productDuplicate.newProduct.handle,
        variantId: updatedCustomVariant.id,
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
