import {
  Edges,
  ProductVariantEdge,
  ProductVariantOptionType,
} from "@/lib/types/shopify";
import { ProductVariant } from "./types";
import { isDefined } from "./validators";

/**
 * Maps product variant nodes to product variants.
 *
 * @param {Edges<ProductVariantEdge>} variants - The product variant edges.
 * @returns {ProductVariant[]} - The mapped product variants.
 *
 * @example
 * const variants: Edges<ProductVariantEdge> = {
 *   edges: [
 *     {
 *       node: {
 *         id: '1',
 *         title: 'Variant 1',
 *         quantityAvailable: 10,
 *         price: 9.99,
 *         image: 'variant1.jpg',
 *         selectedOptions: [
 *           { name: 'color', value: 'red' },
 *           { name: 'size', value: 'small' },
 *         ],
 *       },
 *     },
 *     {
 *       node: {
 *         id: '2',
 *         title: 'Variant 2',
 *         quantityAvailable: 5,
 *         price: 14.99,
 *         image: 'variant2.jpg',
 *         selectedOptions: [
 *           { name: 'color', value: 'blue' },
 *           { name: 'size', value: 'medium' },
 *         ],
 *       },
 *     },
 *   ],
 * };
 *
 * const productVariants = mapProductVariantNodeToProductVariant(variants);
 * console.log(productVariants);
 * // Output:
 * // [
 * //   {
 * //     id: '1',
 * //     title: 'Variant 1',
 * //     quantityAvailable: 10,
 * //     price: 9.99,
 * //     image: 'variant1.jpg',
 * //     color: 'red',
 * //     size: 'small',
 * //   },
 * //   {
 * //     id: '2',
 * //     title: 'Variant 2',
 * //     quantityAvailable: 5,
 * //     price: 14.99,
 * //     image: 'variant2.jpg',
 * //     color: 'blue',
 * //     size: 'medium',
 * //   },
 * // ]
 */
export const mapProductVariantNodeToProductVariant = (
  variants: Edges<ProductVariantEdge>
): ProductVariant[] => {
  return variants.edges.map(({ node }) => {
    const variant: ProductVariant = {
      id: node.id,
      title: node.title,
      quantityAvailable: node.quantityAvailable,
      price: node.price,
      image: node.image && {
        src: node.image.url,
        alt: node.image.altText,
        width: node.image.width,
        height: node.image.height,
        id: node.image.id,
      },
    };
    node.selectedOptions.forEach((option) => {
      variant[option.name as ProductVariantOptionType] = option.value;
    });
    return variant;
  });
};

/**
 * Gets all unique values of a specific product variant option type from an array of product variants.
 *
 * @param {ProductVariant[]} variants - The array of product variants.
 * @param {ProductVariantOptionType} type - The product variant option type.
 * @returns {Array<ProductVariant[ProductVariantOptionType]>} - The array of unique values for the specified option type.
 */
export const getAllProductVariantOptions = (
  variants: ProductVariant[],
  type: ProductVariantOptionType
) => {
  return Array.from(new Set(variants.map((variant) => variant[type]))).filter(
    isDefined
  );
};
