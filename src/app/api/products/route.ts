/**
 * Customization Image Upload API
 *
 * This endpoint handles uploading customer customization images to shop-api.
 * Instead of duplicating products in Shopify, we now upload the customization
 * image to shop-api and return the image ID. This ID is later linked to the
 * cart item when adding to cart.
 *
 * Flow:
 * 1. Customer uploads customization image
 * 2. Image is stored in shop-api with user ID
 * 3. Image ID is returned to client
 * 4. When adding to cart, imageId is included in customizationData
 */

import { getDefaultProvider } from "@/lib/commerce";
import { getOrCreateVisitorId } from "@/utils/cookies/visitorId";
import { parseValidationErrors } from "@/utils/parsers";
import { ServerApiResponse } from "@/utils/types";
import {
  requiredImageFileSchema,
  requiredStringSchema,
} from "@/utils/validators/schemaValidators";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Response format for customization upload
 */
export interface CustomizationUploadResponse {
  imageId: string;
  imageUrl: string;
  productId: string;
  variantId: string;
  width?: number;
  height?: number;
}

/**
 * Alias for backwards compatibility
 */
export type CustomProductResponse = CustomizationUploadResponse;

/**
 * Validation schema for customization upload
 */
const schema = z.object({
  productId: requiredStringSchema({
    name: "ProductId",
    description: "The product ID to associate with this customization",
  }),
  variantId: requiredStringSchema({
    name: "VariantId",
    description: "The variant ID to associate with this customization",
  }),
  file: requiredImageFileSchema(),
});

/**
 * Validate form data from multipart request
 */
const validateFormData = (formData: FormData) => {
  const validatedFields = schema.safeParse({
    file: formData.get("file"),
    productId: formData.get("productId"),
    variantId: formData.get("variantId"),
  });

  const validationErrors = parseValidationErrors(validatedFields);
  if (!validatedFields.success || validationErrors) {
    console.error("Validation error:", validationErrors);
    return {
      errors: validationErrors ?? { code: "unknown", message: "validation failed" },
    };
  }

  return { data: validatedFields.data };
};

/**
 * POST /api/products/customizations
 *
 * Upload a customization image for a product variant.
 * The image is stored in shop-api and linked to the user.
 */
export const POST = async (
  req: Request
): Promise<ServerApiResponse<CustomizationUploadResponse>> => {
  try {
    // Get or create visitor ID for guest users
    const userId = getOrCreateVisitorId();

    // Parse multipart form data
    const formData = await req.formData();

    // Validate form data
    const validatedFields = validateFormData(formData);
    if (validatedFields.errors) {
      return NextResponse.json(
        { errors: validatedFields.errors, data: undefined },
        { status: 400 }
      );
    }

    const { file, productId, variantId } = validatedFields.data;

    // Get commerce provider (shop-api)
    const commerce = getDefaultProvider();

    // Upload customization image to shop-api
    const uploadResult = await commerce.uploadCustomizationImage(
      file as File,
      userId,
      {
        productId,
        variantId,
      }
    );

    // Return response with image info
    return NextResponse.json(
      {
        data: {
          imageId: uploadResult.id,
          imageUrl: uploadResult.url,
          productId,
          variantId,
          width: uploadResult.width,
          height: uploadResult.height,
        },
        errors: undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading customization image:", error);
    return NextResponse.json(
      {
        errors: "Error uploading customization image",
        data: undefined,
      },
      { status: 500 }
    );
  }
};
