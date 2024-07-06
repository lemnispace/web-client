import { toFloat } from "./parsers";
import {
  Product,
  ProductVariant,
  ProductVariantOption,
  ProductWithCustomization,
} from "./types";
import {
  isDefined,
  isEmptyObject,
  isObject,
  isString,
  isStringEmpty,
  isStringJSONLike,
  isValidJSON,
} from "./validators";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Product Getters                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

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
 * Retrieves a variant from a product by its title.
 * @param product - The product object.
 * @param title - The title of the variant to retrieve.
 * @returns The first variant object with the specified title, or undefined if not found.
 */
export const getVariantByTitle = (product: Product, title: string) => {
  return product.variants?.find((variant) => variant.title === title);
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

interface CustomProductIdProps {
  userId: string;
  productId: string;
}
export const getCustomProductId = (product: CustomProductIdProps) => {
  return `product-${product.userId}-${product.productId}`;
};

export const getCustomProductByOriginProductId = <
  T extends Pick<ProductWithCustomization, "metafields">,
>(
  products: T[] | undefined,
  originProductId: string
) => {
  return products?.find(
    ({ metafields }) => metafields?.origin_product?.value === originProductId
  );
};

export const getCustomProductByOriginProductHandle = <
  T extends Pick<ProductWithCustomization, "metafields">,
>(
  products: T[] | undefined,
  originProductHandle: string
) => {
  return products?.find(
    ({ metafields }) =>
      metafields?.origin_product?.reference?.handle === originProductHandle
  );
};

export const getCustomVariantByOriginVariantId = <
  T extends Pick<ProductWithCustomization, "customVariants">,
>(
  product: T,
  originVariantId: string
) => {
  return product.customVariants?.find(
    (variant) =>
      variant.metafields?.origin_product_variant?.value === originVariantId
  );
};

export const getProductVariantByCustomVariantId = (
  product: ProductWithCustomization,
  customVariantId: string
) => {
  const originVariantId = product.customVariants?.find(
    (variant) => variant.id === customVariantId
  )?.metafields?.origin_product_variant?.value;
  return product.variants?.find((variant) => variant.id === originVariantId);
};
/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Error Getters                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

const statusErrorMap: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
};

/**
 * Retrieves the error message from a response object.
 * If the response contains a valid JSON error message, it will be returned.
 * Otherwise, the default error message will be returned.
 *
 * @param response - The response object.
 * @param defaultMessage - The default error message to return if no valid error message is found.
 * @returns A promise that resolves to the error message.
 */
const getResponseErrorMessage = async (
  response: Response,
  defaultMessage: string
): Promise<string> => {
  const errorMessage = statusErrorMap[response.status];

  try {
    const errorText = await response.text();
    if (isValidJSON(errorText)) {
      const errorData = JSON.parse(errorText);
      if (isString(errorData.message)) {
        return errorData.message;
      }
      if (isString(errorData.error)) {
        return errorData.error;
      }
      if (isObject(errorData.error)) {
        return getObjectErrorMessage(errorData.error, defaultMessage);
      }
    }
    if (
      isString(errorText) &&
      !isStringEmpty(errorText) &&
      !isStringJSONLike(errorText)
    ) {
      return errorText;
    }

    return errorMessage || defaultMessage;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorMessage || defaultMessage;
    }
    throw error;
  }
};

export const getArrayErrorMessage = (
  errors: unknown,
  delimeter = "; "
): string | undefined => {
  if (Array.isArray(errors)) {
    const errorMessages = errors.map((err) => {
      if (isString(err)) {
        return err;
      }
      if (isObject(err)) {
        if (isString(err.message)) {
          return err.message;
        }
        if (isString(err.error)) {
          return err.error;
        }
      }
      return null;
    });
    const message = errorMessages.filter(isDefined).join(delimeter);
    return message.trim() || undefined;
  }
};

/**
 * Returns the error message from an error object or a default message if the error object is empty.
 *
 * @param error - The error object.
 * @param defaultMessage - The default error message to return if the error object is empty.
 * @returns The error message.
 */
const getObjectErrorMessage = (
  error: Record<string, unknown>,
  defaultMessage: string
): string => {
  if (isEmptyObject(error)) {
    return defaultMessage;
  }
  if (isString(error.message)) {
    return error.message;
  }
  if (isString(error.error)) {
    return error.error;
  }
  if (Array.isArray(error.errors)) {
    return getArrayErrorMessage(error.errors) || defaultMessage;
  }
  return JSON.stringify(error);
};

/**
 * Retrieves the error message from the given error value.
 * If the error value is an instance of Error, it returns the error message.
 * If the error value is a string, it returns the string itself.
 * If the error value is an instance of Response, it returns the error message from the response.
 * If the error value is an object, it returns the error message from the object.
 * If none of the above conditions are met, it returns the default error message.
 *
 * @param error - The error object.
 * @param defaultMessage - The default error message to return if no specific error message is found.
 * @returns The error message.
 */
export const getErrorMessage = async (
  error: unknown,
  defaultMessage = "An error occurred"
): Promise<string> => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  if (isString(error)) {
    return error;
  }
  if (error instanceof Response) {
    return getResponseErrorMessage(error, defaultMessage);
  }
  if (isObject(error)) {
    return getObjectErrorMessage(error, defaultMessage);
  }
  return defaultMessage;
};

export const getuserErrorsFromResponseData = (
  data: Record<string, unknown>
) => {
  if (!data) {
    return undefined;
  }
  if ("userErrors" in data) {
    return data.userErrors;
  }
  const nestedData = getObjFirstValue(data);
  if (nestedData && isObject(nestedData) && "userErrors" in nestedData) {
    return nestedData.userErrors;
  }
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Utility Getters                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const getObjFirstValue = (obj: Record<string, unknown>) => {
  if (isObject(obj)) {
    const firstEntry = Object.entries(obj)?.[0];
    if (firstEntry) {
      return firstEntry[1];
    }
  }
};
