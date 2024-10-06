import { ProductVariantOptionType } from "@/lib/shopify/types/product";
import { RequireFields } from "./genericTypes";
import {
  ApiResponse,
  Product,
  ProductWithCustomization,
  ServerErrorResponse,
  ValidationErrorResponse,
} from "./types";

/**
 * Checks if a value is defined (not undefined or null).
 *
 * @param value - The value to check.
 * @returns `true` if the value is defined, `false` otherwise.
 */
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

export const isFieldDefined =
  <T, K extends keyof T>(field: K) =>
  (item: T): item is RequireFields<T, K> => {
    return isDefined(item?.[field]);
  };

/**
 * Represents a product with a variant of a specific type.
 */
interface ProductWithVariant<T extends ProductVariantOptionType>
  extends Pick<Product, "variants"> {
  variants: Product["variants"] & { [key in T]: string };
}

/**
 * Checks if a product has a variant of the specified type.
 *
 * @param product - The product to check.
 * @param type - The variant option type to look for.
 * @returns `true` if the product has a variant of the specified type, `false` otherwise.
 */
export const hasVariant = <T extends ProductVariantOptionType>(
  product: Product,
  type: T
): product is Product & ProductWithVariant<T> =>
  product.variants?.some((variant) => type in variant) ?? false;

/**
 * Checks if a custom variant ID is valid for a given product.
 * @param product - The product with customization options.
 * @param customVariantId - The ID of the custom variant to check.
 * @returns A boolean indicating whether the custom variant ID is valid.
 */
export const isValidCustomVariantId = (
  product: ProductWithCustomization,
  customVariantId: string
) => {
  if (!product.customVariants) return false;
  return product.customVariants.some(
    (variant) => variant.id === customVariantId
  );
};

/**
 * Checks if a value is a number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number, `false` otherwise.
 */
export const isNumber = (value: unknown): value is number =>
  (typeof value === "number" || typeof value === "bigint") &&
  !isNaN(Number(value)) &&
  isFinite(Number(value));

/**
 * Checks if a value is a string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string, `false` otherwise.
 */
export const isString = (value: unknown): value is string =>
  typeof value === "string" && value !== "[object Object]";

/**
 * Checks if a value is a string that resembles JSON.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string that resembles JSON, `false` otherwise.
 */
export const isStringJSONLike = (value: unknown): value is string =>
  isString(value) && value.startsWith("{") && value.endsWith("}");

/**
 * Checks if a value is an object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Checks if a string value is a valid JSON.
 *
 * @param value - The string value to check.
 * @returns `true` if the string value is a valid JSON, `false` otherwise.
 */
export const isValidJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if a string value is empty (contains only whitespace characters).
 *
 * @param value - The string value to check.
 * @returns `true` if the string value is empty, `false` otherwise.
 */
export const isStringEmpty = (value: string): boolean =>
  value.trim().length === 0;

/**
 * Checks if an object is empty (has no properties).
 *
 * @param value - The object to check.
 * @returns `true` if the object is empty, `false` otherwise.
 */
export const isEmptyObject = (value: unknown): value is Record<string, never> =>
  isObject(value) && Object.keys(value).length === 0;

export const isEmptyArray = <T>(value: T[]): value is [] =>
  value.filter(isDefined).length === 0;

export const isServerErrorResponse = <SERVER_ERROR>(
  response: ApiResponse<unknown, SERVER_ERROR, unknown>
): response is ServerErrorResponse<SERVER_ERROR> => {
  return response.status === 500;
};

export const isValidationErrorResponse = <VALIDATION_ERROR>(
  response: ApiResponse<VALIDATION_ERROR, unknown, unknown>
): response is ValidationErrorResponse<VALIDATION_ERROR> => {
  return response.status >= 400 && response.status < 500;
};

export const isErrorResponse = <VALIDATION_ERROR, SERVER_ERROR>(
  response: ApiResponse<VALIDATION_ERROR, SERVER_ERROR, unknown>
): response is
  | ServerErrorResponse<SERVER_ERROR>
  | ValidationErrorResponse<VALIDATION_ERROR> => {
  return isServerErrorResponse(response) || isValidationErrorResponse(response);
};
