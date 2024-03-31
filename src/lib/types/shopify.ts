export type Edge<T> = {
  cursor: string;
  node: T;
};
export type Edges<T> = {
  edges: T[];
};

export type MediaContentType =
  | "EXTERNAL_VIDEO"
  | "IMAGE"
  | "MODEL_3D"
  | "VIDEO";

export interface Image {
  id: string;
  url: string;
  altText?: string;
  height: number;
  width: number;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface ProductVariantNode {
  id: string;
  title: string;
  quantityAvailable?: number;
  price: Price;
}

export type ProductVariantEdge = Edge<ProductVariantNode>;

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductPriceRange {
  maxVariantPrice: Money;
  minVariantPrice: Money;
}

export interface MediaNode {
  id: string;
  alt: string;
  mediaContentType: MediaContentType;
  previewImage: Image;
}

export type MediaEdge = Edge<MediaNode>;

export type ImageEdge = Edge<Image>;

export interface ProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  priceRange: ProductPriceRange;
  productType: string;
  images: Edges<ImageEdge>;
  tags: string[];
  variants: Edges<ProductVariantEdge>;
}

export type ProductEdge = Edge<ProductNode>;

export interface ErrorLocation {
  line: number;
  column: number;
}

export interface ErrorExtensions {
  code: string;
  documentation: string;
  requiredAccess: string;
}

export interface Error {
  message: string;
  locations: ErrorLocation[];
  path: string[];
  extensions: ErrorExtensions;
}
