import { createImage } from "@/lib/shopify/mutations/mediaMutations";
import { ShopifyFile } from "@/lib/types/shopify";
import { getErrorMessage } from "@/utils/getters";
import {
  requiredImageFileSchema,
  requiredStringSchema,
} from "@/utils/schemaValidators";
import { NextResponse } from "next/server";
import { z } from "zod";

interface UserProductImage {
  productId: string;
  variantId: string;
  img: File;
  userId: string;
}

type ValidationErrors = {
  productId?: string[];
  file?: string[];
};

type SuccessResponse = {
  status: number;
};

type ValidationErrorResponse = {
  data: undefined;
  status: 400;
  errors: ValidationErrors;
};

type ShopifyErrorResponse = {
  data: undefined;
  status: number;
  errors: unknown;
};

type CreateCustomProductResponse =
  | SuccessResponse
  | ValidationErrorResponse
  | ShopifyErrorResponse;

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
  file: requiredImageFileSchema(),
});

const uploadCustomProductImage = async (
  userProductImage: UserProductImage
): Promise<ShopifyFile> => {
  // combine the userid, productId, and variantId to create a unique filename
  const customProductId = `${userProductImage.userId}-${userProductImage.productId}-${userProductImage.variantId}`;
  try {
    const createdFiles = await createImage({
      filename: customProductId,
      img: userProductImage.img,
      alt: "custom product image",
    });
    return createdFiles[0];
  } catch (error) {
    console.error("Error uploading custom product image: ", error);
    const errMessage = await getErrorMessage(
      error,
      "Error uploading custom product image"
    );
    throw new Error(errMessage);
  }
};

const createCustomProduct = async (
  _formData: FormData
): Promise<CreateCustomProductResponse> => {
  const userId = "bda86db3-d3c0-4983-99ec-87d4da67d874"; // replace with user id from session;
  const validatedFields = schema.safeParse({
    file: _formData.get("file"),
    productId: _formData.get("productId"),
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
    // upload the image to Shopify
    const imgMedia = await uploadCustomProductImage({
      img: validatedFields.data.file,
      productId: validatedFields.data.productId,
      variantId: validatedFields.data.variantId,
      userId,
    });
    console.log("Image uploaded:", imgMedia);
    // TODO: duplicate the product
    // TODO: modify the variant to use the new image
    return {
      status: 200,
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
};
