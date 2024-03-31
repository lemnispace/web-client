import { ProductPriceRange, ProductVariantNode } from "@/lib/types/shopify";

export interface ProductItemImg {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductItem {
  id: string;
  name: string;
  priceRange: ProductPriceRange;
  description: string;
  descriptionHtml: string;
  type: string;
  tags: string[];
  variants: ProductVariantNode[];
  href: string;
  img?: ProductItemImg;
}
