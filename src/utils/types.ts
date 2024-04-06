import {
  ProductPriceRange,
  ProductVariantNode,
  ProductVariantOptionType,
} from "@/lib/types/shopify";

export interface ProductImg {
  src: string;
  alt?: string;
  width: number;
  height: number;
  id: string;
}

export type ProductVariantOption = {
  [K in ProductVariantOptionType]?: string;
};

export interface ProductVariant
  extends ProductVariantOption,
    Omit<ProductVariantNode, "selectedOptions" | "image"> {
  image?: ProductImg;
}

export interface ProductItem {
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
}
