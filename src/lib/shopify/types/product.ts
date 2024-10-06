import { Edge, Edges } from "./edge";
import { Image, ImageEdge, MediaEdge } from "./media";
import {
  ProductMetafieldEdge,
  ProductVariantMetafieldEdge,
} from "./metafields";
import { Price, ProductPriceRange } from "./pricing";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                            Product Variant Types                             ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type ProductVariantOptionType = "Color" | "Size" | "Material" | "Style";

export interface ProductVariantNode {
  id: string;
  title: string;
  quantityAvailable?: number;
  price: Price | string;
  selectedOptions: Array<{ name: ProductVariantOptionType; value: string }>;
  image?: Image;
  metafields?: Edges<ProductVariantMetafieldEdge>;
  media?: Edges<MediaEdge>;
  sku?: string;
  product?: Partial<ProductNode>;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                Product Types                                 ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface ProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  priceRange: ProductPriceRange;
  productType?: string;
  images?: Edges<ImageEdge>;
  tags: string[];
  variants?: Edges<ProductVariantEdge>;
  metafields?: Edges<ProductMetafieldEdge>;
}

export type ProductStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Edge Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type ProductVariantEdge = Edge<ProductVariantNode>;
export type ProductEdge = Edge<ProductNode>;
