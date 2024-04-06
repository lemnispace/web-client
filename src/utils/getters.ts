import { Product } from "./types";
/**
 * Retrieves a variant from a product by its ID.
 * @param product - The product object.
 * @param id - The ID of the variant to retrieve.
 * @returns The variant object with the specified ID, or undefined if not found.
 */

export const getVariantById = (product: Product, id: string) => {
  return product.variants?.find((variant) => variant.id === id);
};
