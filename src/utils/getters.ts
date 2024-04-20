import { Product, ProductVariant, ProductVariantOption } from "./types";
import { isDefined, toFloat } from "./validators";

/**
 * Retrieves a variant from a product by its ID.
 * @param product - The product object.
 * @param id - The ID of the variant to retrieve.
 * @returns The variant object with the specified ID, or undefined if not found.
 */
export const getVariantById = (product: Product, id: string) => {
  return product.variants?.find((variant) => variant.id === id);
};

/**
 * Retrieves a variant from a product by its variant options.
 * @param product - The product object.
 * @param variantOptions - The variant options to match.
 * @returns The variant object that matches the specified variant options, or undefined if not found.
 */
export const getVariantByValues = (
  product: Product,
  variantOptions: ProductVariantOption
) => {
  return product.variants?.find((variant) =>
    Object.entries(variantOptions).every(
      ([key, value]) => variant[key as keyof ProductVariantOption] === value
    )
  );
};

/**
 * Retrieves the dimensions (width and height) from a variant.
 * @param variant - The variant object.
 * @returns An object containing the width and height of the variant, or undefined if the dimensions cannot be extracted.
 */
export const getDimensionsFromVariant = (variant: ProductVariant) => {
  const size = variant.Size; // size like 18"x24" or "24x36" or 12x18 or etc...
  if (!size) {
    return undefined;
  }
  // Match digits in the size string
  const matches = size.match(/\d+(\.\d+)?/g);
  // Check if exactly two matches are found (width and height)
  if (!matches || matches.length !== 2) {
    return undefined;
  }
  // Extract width and height from the matches
  const width = toFloat(matches[0]);
  const height = toFloat(matches[1]);
  // Check if both width and height are valid numbers
  if (!isDefined(width) || !isDefined(height)) {
    return undefined;
  }
  // Return an object with the extracted width and height
  return { width, height };
};

/**
 * Attempts to retrieve the error message from an error value of any type.
 * @param error - The error value to retrieve the message from.
 * @param defaultMessage - The default error message to use if the error message cannot be extracted.
 * @returns A promise that resolves to the error message.
 */
export const getErrorMessage = async (
  error: unknown,
  defaultMessage = "An error occurred"
): Promise<string> => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  const statusErrorMap: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  if (error instanceof Response) {
    const errorMessage = statusErrorMap[error.status] as string | undefined;
    try {
      const errorData = await error.json();
      if (isObject(errorData)) {
        if (isString(errorData.message)) {
          return errorData.message;
        }
        if (isString(errorData.error)) {
          return errorData.error;
        }
      }
    } catch (parseError) {
      // Fallback to default message if parsing fails
      return errorMessage || defaultMessage;
    }

    if (errorMessage) {
      return errorMessage;
    }
  }

  if (isObject(error)) {
    if (isString(error.message)) {
      return error.message;
    }

    if (isString(error.error)) {
      return error.error;
    }

    if (Array.isArray(error.errors)) {
      const errorMessages = error.errors.map((err) => {
        if (isString(err)) {
          return err;
        }
        if (isObject(err) && isString(err.message)) {
          return err.message;
        }
        return JSON.stringify(err);
      });
      return errorMessages.join("; ");
    }

    return JSON.stringify(error);
  }

  return defaultMessage;
};

// Helper functions
const isString = (value: unknown): value is string => typeof value === "string";
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
