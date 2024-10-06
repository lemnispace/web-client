import { Edges } from "@/lib/shopify/types/edge";
import { ProductEdge, ProductNode } from "@/lib/shopify/types/product";
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
          variants(first: 99) {
            edges {
              cursor
              node {
                id
                title
                sku
              }
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

export const productWithMetafieldsQuery = (
  by: "handle" | "id"
) => /* GraphQL */ `
query getProductWithMetafields(${
  by === "handle" ? "$handle: String!" : "$id: ID!"
}) {
  product${by === "handle" ? "ByHandle(handle: $handle)" : "(id: $id)"} {
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
      VARIANT_METADATA_NAMESPACE,
      {
        includePriceWithoutSubfields: true,
      }
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

interface ProductByHandleResponse {
  productByHandle?: ProductNode;
}

type ProductWithMetafieldsResponse<BY extends "handle" | "id"> =
  BY extends "handle" ? ProductByHandleResponse : ProductResponse;

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

export async function fetchProductWithMetafields<BY extends "handle" | "id">(
  identifier: string,
  by: BY
) {
  const input = by === "handle" ? { handle: identifier } : { id: identifier };
  const response = await adminClient.request<ProductWithMetafieldsResponse<BY>>(
    productWithMetafieldsQuery(by),
    {
      variables: {
        ...input,
      },
    }
  );
  return response;
}
