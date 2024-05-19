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
  getCustomProductId,
  getErrorMessage,
  getVariantByTitle,
} from "@/utils/getters";
import { mapProduct } from "@/utils/mappers";
import { parseClientResponse } from "@/utils/parsers";
import {
  requiredImageFileSchema,
  requiredStringSchema,
} from "@/utils/schemaValidators";
import { ApiResponse } from "@/utils/types";
import { NextResponse } from "next/server";
import { z } from "zod";

interface ValidationErrors {
  productId?: string[];
  file?: string[];
}

interface CustomProductResponse {
  productId: string;
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
}

const updateCustomProductVariant = async ({
  product,
  variantTitle,
  imageId,
}: UpdateCustomProductParams) => {
  const variant = getVariantByTitle(mapProduct(product), variantTitle);
  if (!variant) {
    throw new Error(`No variant found with title: ${variantTitle}`);
  }
  // modify the variant to use the new image
  const updateVariantResponse = await productVariantUpdate({
    id: variant.id,
    mediaId: imageId,
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
    });
    if (!updatedCustomVariant) {
      throw new Error("Failed to update custom product variant");
    }

    return {
      status: 200,
      data: {
        productId: duplicateProductData.productDuplicate.newProduct.id,
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

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const result = await createCustomProduct(formData);
    if ("errors" in result && result.errors) {
      return NextResponse.json(result.errors, {
        status: result.status,
      });
    }
    return NextResponse.json(result, {
      status: result.status,
    });
  } catch (error) {
    console.error("Error creating custom product:", error);
    const errorMessage = await getErrorMessage(
      error,
      "Error creating custom product"
    );
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};
