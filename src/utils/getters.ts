import { Product, ProductVariant, ProductVariantOption } from "./types";
import { isDefined, toInt } from "./validators";

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
  const matches = size.match(/\d+/g);

  // Check if exactly two matches are found (width and height)
  if (!matches || matches.length !== 2) {
    return undefined;
  }

  // Extract width and height from the matches
  const width = toInt(matches[0]);
  const height = toInt(matches[1]);

  // Check if both width and height are valid numbers
  if (!isDefined(width) || !isDefined(height)) {
    return undefined;
  }

  // Return an object with the extracted width and height
  return { width, height };
};
