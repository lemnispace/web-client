import { Collection, Edge, Edges, ProductNode } from "@/lib/types/shopify";
import adminClient from "../adminClient";

export type CollectionPayload = Pick<
  Collection,
  "id" | "title" | "handle" | "updatedAt"
> & {
  products: Edges<Edge<Pick<ProductNode, "id">>>;
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
          }
        }
      }
    }
  }
`;

export function fetchCollection(handle: string, first = 20) {
  return adminClient.request<CollectionResponse>(collectionByHandleQuery, {
    variables: {
      handle,
      first,
    },
  });
}
