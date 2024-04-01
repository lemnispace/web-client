import {
  Edges,
  ProductVariantEdge,
  ProductVariantOptionType,
} from "@/lib/types/shopify";
import { ProductVariantOption } from "./types";

/**
 * Maps the product variant nodes to an array of product variant options.
 * @example
 * const variants = {
 * edges: [
 *     {
 *       node: {...},
 *         selectedOptions: [
 *           {
 *             name: "Color",
 *             value: "Black",
 *           },
 *           {
 *             name: "Size",
 *             value: '18"x24"',
 *           },
 *         ],
 *       },
 *     },
 *   ],
 * };
 * let result = mapProductVariantNodeToProductVariantOption(variants);
 * result = [
 *   {
 *     name: "Color",
 *     values: ["Black"],
 *   },
 *   {
 *     name: "Size",
 *     values: ['18"x24"'],
 *   },
 * ]
 *
 * @param variants - The edges of product variant nodes.
 * @returns An array of product variant options.
 */
export const mapProductVariantNodeToProductVariantOption = (
  variants: Edges<ProductVariantEdge>
): ProductVariantOption[] => {
  const variantOptionsMap = new Map<ProductVariantOptionType, Set<string>>();
  variants.edges.forEach((edge) => {
    const variant = edge.node;
    variant.selectedOptions.forEach((option) => {
      const values = variantOptionsMap.get(option.name) || new Set<string>();
      values.add(option.value);
      variantOptionsMap.set(option.name, values);
    });
  });
  return Array.from(variantOptionsMap).map(([name, values]) => {
    return {
      name,
      values: Array.from(values),
    };
  });
};
