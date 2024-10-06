import DOMPurify from "isomorphic-dompurify";
import { ProductMetadataKey, VariantMetadataKey } from "../constants";
import { ProductsResponse } from "../queries/productQuery";
import { Edge, Edges } from "../types/edge";
import { Image } from "../types/media";
import { ProductMetafield, ProductVariantMetafield } from "../types/metafields";
import { ProductPriceRange } from "../types/pricing";
import {
  ProductNode,
  ProductVariantEdge,
  ProductVariantNode,
  ProductVariantOptionType,
} from "../types/product";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                              Type Definitions                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */
type NavigationType = "Product";
export type GetNavigationLink = (href: string, type: NavigationType) => string;
interface ProductImg {
  src: string;
  alt?: string;
  width: number;
  height: number;
  id: string;
}

type ProductVariantOption = {
  [K in ProductVariantOptionType]?: string;
};

type ProductVariantMetafieldValue = Omit<ProductVariantMetafield, "key">;

type ProductVariantMetafields = {
  [K in VariantMetadataKey]?: ProductVariantMetafieldValue;
};

type ProductMetafieldValue = Omit<ProductMetafield, "key">;
type ProductMetafields = {
  [K in ProductMetadataKey]?: ProductMetafieldValue;
};
export interface ProductVariant
  extends ProductVariantOption,
    Omit<ProductVariantNode, "selectedOptions" | "image" | "metafields"> {
  image?: ProductImg;
  metafields?: ProductVariantMetafields;
}

interface ProductItem {
  id: string;
  name: string;
  priceRange: ProductPriceRange;
  description: string;
  descriptionHtml: string;
  type?: string;
  tags: string[];
  variants?: ProductVariant[];
  href: string;
  img?: ProductImg;
}

export interface Product extends ProductItem {
  images?: ProductImg[];
  metafields?: ProductMetafields;
}

export interface ProductWithCustomization extends Product {
  customVariants?: ProductVariant[];
  customProductId?: string;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Product Mappers                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export const mapMetafields = <DATA extends { key: string }, RESPONSE>(
  metafield: Edges<Edge<DATA>>
): RESPONSE => {
  const metafieldEntries = metafield.edges.map(({ node: { key, ...node } }) => {
    return [key, node];
  });
  return Object.fromEntries(metafieldEntries);
};

export const mapProducts = (
  productList: ProductsResponse | undefined,
  getNavigationLink: GetNavigationLink
): ProductItem[] => {
  if (!productList?.products?.edges) {
    return [];
  }
  return productList.products.edges.map((e) => {
    const img = e.node.images?.edges[0]?.node as Image | undefined;
    return {
      id: e.node.id,
      name: e.node.title,
      description: e.node.description,
      descriptionHtml: DOMPurify.sanitize(e.node.descriptionHtml),
      tags: e.node.tags,
      priceRange: e.node.priceRange,
      type: e.node.productType,
      href: getNavigationLink(e.node.handle, "Product"),
      img: img
        ? {
            alt: img.altText ?? e.node.title,
            src: img.url,
            width: img.width,
            height: img.height,
            id: img.id,
          }
        : undefined,
      variants:
        e.node.variants &&
        mapProductVariantNodeToProductVariant(e.node.variants),
    };
  });
};

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
      sku: node.sku,
      quantityAvailable: node.quantityAvailable,
      price: node.price,
      image: node.image && {
        src: node.image.url,
        alt: node.image.altText,
        width: node.image.width,
        height: node.image.height,
        id: node.image.id,
      },
      metafields: node.metafields && mapMetafields(node.metafields),
    };
    node.selectedOptions?.forEach((option) => {
      variant[option.name as ProductVariantOptionType] = option.value;
    });
    return variant;
  });
};

export function mapProduct(
  product: ProductNode,
  getNavigationLink: GetNavigationLink
): Product {
  const images = product.images?.edges.map(({ node }) => ({
    src: node.url,
    alt: node.altText,
    width: node.width,
    height: node.height,
    id: node.id,
  }));
  return {
    id: product.id,
    name: product.title,
    description: product.description,
    descriptionHtml: DOMPurify.sanitize(product.descriptionHtml),
    tags: product.tags,
    priceRange: product.priceRange,
    type: product.productType,
    href: getNavigationLink(product.handle, "Product"),
    images,
    metafields: product.metafields && mapMetafields(product.metafields),
    variants:
      product.variants &&
      mapProductVariantNodeToProductVariant(product.variants),
  };
}

export function mapCustomProduct(
  product: ProductNode,
  getNavigationLink: GetNavigationLink
) {
  const { variants, ...customProduct } = mapProduct(product, getNavigationLink);
  const metafields =
    product.metafields &&
    mapMetafields<ProductMetafield, ProductMetafields>(product.metafields);
  const validCustomVariants = variants?.filter((variant) => {
    const hasImage = Boolean(variant.image || variant.media);
    const hasMetafields = Boolean(variant.metafields);
    const hasValidMetafiels = Boolean(
      variant.metafields?.origin_product &&
        variant.metafields?.origin_product_variant &&
        variant.metafields.user_id
    );
    return hasImage && hasMetafields && hasValidMetafiels;
  });
  return { ...customProduct, metafields, variants: validCustomVariants };
}

export const mergeCustomProduct = (
  product: Product,
  customProduct?: ProductWithCustomization
): ProductWithCustomization => {
  return {
    ...product,
    customVariants: customProduct?.variants ?? customProduct?.customVariants,
    metafields: customProduct?.metafields,
    customProductId: customProduct?.id,
  };
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
    (x): x is string => Boolean(x)
  );
};
