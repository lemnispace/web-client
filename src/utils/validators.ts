import { ProductVariantOptionType } from "@/lib/types/shopify";
import { Product } from "./types";

/**
 * Checks if a value is defined (not undefined or null).
 *
 * @param value - The value to check.
 * @returns `true` if the value is defined, `false` otherwise.
 */
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
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
  product.variants?.some((variant) => variant[type]) ?? false;

/**
 * Checks if a value is a number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number, `false` otherwise.
 */
export const isNumber = (value: unknown): value is number =>
  typeof value === "number" && !isNaN(value) && isFinite(value);

/**
 * Converts a string value to an integer.
 *
 * @param value - The string value to convert.
 * @returns The converted integer value, or `undefined` if the input is not a valid number.
 */
export const toInt = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  const int = parseInt(value, 10);
  return isNumber(int) ? int : undefined;
};

/**
 * Converts a string value to a float.
 *
 * @param value - The string value to convert.
 * @returns The converted float value, or `undefined` if the input is not a valid number.
 */
export const toFloat = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }
  const float = parseFloat(value);
  return isNumber(float) ? float : undefined;
};
