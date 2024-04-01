import {
  ProductPriceRange,
  ProductVariantOptionType,
} from "@/lib/types/shopify";

export interface ProductItemImg {
  src: string;
  alt?: string;
  width: number;
  height: number;
  id: string;
}

export interface ProductVariantOption {
  name: ProductVariantOptionType;
  values: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  priceRange: ProductPriceRange;
  description: string;
  descriptionHtml: string;
  type?: string;
  tags: string[];
  variants?: ProductVariantOption[];
  href: string;
  img?: ProductItemImg;
}

export interface GroupedProductImages {
  [variantTitle: string]: ProductItemImg[];
}

export interface Product extends ProductItem {
  images?: GroupedProductImages;
}
