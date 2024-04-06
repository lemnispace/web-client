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
