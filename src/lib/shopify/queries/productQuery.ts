import { Edges, ProductEdge, ProductNode } from "@/lib/types/shopify";
import {
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_PREVIEW_IMAGE_KEY,
} from "@/utils/constants";
import {
  getVariantsFragment,
  imageFragment,
  moneyFragment,
} from "../fragments";
import storefrontClient from "../storefrontClient";

export const productsQuery = /* GraphQL */ `
  query getProducts($firstNProducts: Int!) {
    products(first: $firstNProducts) {
      edges {
        cursor
        node {
          id
          title
          description
          descriptionHtml
          handle
          tags
          priceRange {
            maxVariantPrice ${moneyFragment}
            minVariantPrice ${moneyFragment}
          }
          productType
          images(first: 1){
            edges{
              cursor
              node ${imageFragment}
            }
          }
        }
      }
    }
  }
`;

export const productQuery = /* GraphQL */ `
query getProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    descriptionHtml
    handle
    priceRange {
      maxVariantPrice ${moneyFragment}
      minVariantPrice ${moneyFragment}
    }
    variants(first: 99) ${getVariantsFragment(
      VARIANT_METADATA_NAMESPACE,
      VARIANT_METADATA_PREVIEW_IMAGE_KEY
    )}
  }
}
`;

export interface ProductsResponse {
  products?: Edges<ProductEdge>;
}

export function fetchProductList(firstNProducts: number) {
  return storefrontClient.request<ProductsResponse>(productsQuery, {
    variables: {
      firstNProducts,
    },
  });
}

export interface ProductResponse {
  product?: ProductNode;
}

export function fetchProduct(handle: string) {
  return storefrontClient.request<ProductResponse>(productQuery, {
    variables: {
      handle,
    },
  });
}
