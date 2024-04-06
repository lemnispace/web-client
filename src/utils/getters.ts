import { Product, ProductVariantOption } from "./types";

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
