import { Edges, ProductEdge, ProductNode } from "@/lib/types/shopify";
import { VARIANT_METADATA_NAMESPACE } from "@/utils/constants";
import adminClient from "../adminClient";
import {
  getNewProductVariantEdgesFragment,
  getVariantEdgesFragment,
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
    variants(first: 99) ${getVariantEdgesFragment(undefined)}
  }
}
`;

export const productWithMetafieldsQuery = /* GraphQL */ `
query getProductWithMetafields($id: ID!) {
  product(id: $id) {
    id
    title
    description
    descriptionHtml
    handle
    priceRange {
      maxVariantPrice ${moneyFragment}
      minVariantPrice ${moneyFragment}
    }
    variants(first: 99) ${getNewProductVariantEdgesFragment(
      VARIANT_METADATA_NAMESPACE
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

export function fetchCustomProduct(id: string) {
  return adminClient.request<ProductResponse>(productWithMetafieldsQuery, {
    variables: {
      id,
    },
  });
}
