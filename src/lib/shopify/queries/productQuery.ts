import { Edges, ProductEdge, ProductNode } from "@/lib/types/shopify";
import {
  PRODUCT_METADATA_NAMESPACE,
  VARIANT_METADATA_NAMESPACE,
} from "@/utils/constants";
import adminClient from "../adminClient";
import {
  getMetafieldsFragment,
  getVariantEdgesFragment,
  getVariantEdgesWithMetafieldsFragment,
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

export const getProductQuery = (by: "handle" | "id") => /* GraphQL */ `
query getProduct(${by === "handle" ? "$handle: String!" : "$id: ID!"}) {
  product(${by === "handle" ? "handle: $handle" : "id: $id"}) {
    id
    title
    description
    descriptionHtml
    handle
    priceRange {
      maxVariantPrice ${moneyFragment}
      minVariantPrice ${moneyFragment}
    }
    variants(first: 99) ${getVariantEdgesFragment({
      includePrice: true,
      includeQuantityAvailable: true,
    })}
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
    ${getMetafieldsFragment(PRODUCT_METADATA_NAMESPACE)}
    variants(first: 99) ${getVariantEdgesWithMetafieldsFragment(
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

export type ProductVariables =
  | {
      handle: string;
    }
  | {
      id: string;
    };

export function fetchProduct(variables: ProductVariables) {
  if ("id" in variables && variables.id) {
    return storefrontClient.request<ProductResponse>(getProductQuery("id"), {
      variables: {
        id: variables.id,
      },
    });
  }
  if (!("handle" in variables) || !variables.handle) {
    throw new Error("Invalid product handle");
  }
  return storefrontClient.request<ProductResponse>(getProductQuery("handle"), {
    variables: {
      handle: variables.handle,
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
