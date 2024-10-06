// /lib/shopify/queries/draftOrderQuery.ts

import { DraftOrder } from "@/lib/shopify/types/draftorder";
import adminClient from "../adminClient";
import { draftOrderFragment } from "../fragments";

interface DraftOrdersResponse {
  draftOrders: {
    edges: {
      node: DraftOrder;
    }[];
  };
}

export async function fetchDraftOrders(query?: string) {
  const q = query ? `(query: "${query}")` : "";

  const graphqlQuery = /* GraphQL */ `
    query {
      draftOrders${q} {
        edges {
          node {
            ...DraftOrderFields
          }
        }
      }
    }
    ${draftOrderFragment}
  `;

  return adminClient.request<DraftOrdersResponse>(graphqlQuery);
}

export async function fetchDraftOrder(id: string) {
  const graphqlQuery = /* GraphQL */ `
    query {
      draftOrder(id: "${id}") {
        ...DraftOrderFields
      }
    }
    ${draftOrderFragment}
  `;

  return adminClient.request<DraftOrdersResponse>(graphqlQuery);
}
