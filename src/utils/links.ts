import { ProductVariantWithCustomization } from "./types";

export const NAVIGATION_LINKS = {
  home: "/",
  shop: "/shop",
  collections(collection: string) {
    return `/shop/collections/${collection}` as const;
  },
  product(productHandle: string) {
    return `/shop/products/${productHandle}` as const;
  },
  cart: "/cart",
} as const;

export const variantToQueryParams = (
  variant: ProductVariantWithCustomization
) => {
  const params = new URLSearchParams();
  // we need to add the variant id to the query params in the create page
  params.set("variant", variant.id);
  return params.toString();
};

export const getVariantCustomizeUrl = (
  baseUrl: string,
  variant: ProductVariantWithCustomization | undefined | null
) => {
  const url = `${baseUrl}/customize`;
  const params = variant && variantToQueryParams(variant);
  return params ? `${url}?${params}` : baseUrl;
};
