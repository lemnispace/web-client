import { Collection } from "@/lib/shopify/types/collection";
import { Edge, Edges } from "@/lib/shopify/types/edge";
import { ProductNode } from "@/lib/shopify/types/product";
import { PRODUCT_METADATA_NAMESPACE } from "@/utils/constants";
import adminClient from "../adminClient";
import { getMetafieldsFragment } from "../fragments";

export type CollectionPayload = Pick<
  Collection,
  "id" | "title" | "handle" | "updatedAt"
> & {
  products: Edges<Edge<Pick<ProductNode, "id" | "metafields">>>;
};
interface CollectionResponse {
  collectionByHandle?: CollectionPayload;
}
export const collectionByHandleQuery = /* GraphQL */ `
  query getCollectionIdFromHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      updatedAt
      products(first: $first) {
        edges {
          cursor
          node {
            id
            ${getMetafieldsFragment(PRODUCT_METADATA_NAMESPACE)}
          }
        }
      }
    }
  }
`;

export function fetchCollection(handle: string, first = 99) {
  return adminClient.request<CollectionResponse>(collectionByHandleQuery, {
    variables: {
      handle,
      first,
    },
  });
}
