// /lib/shopify/mutations/draftOrderMutations.ts

import { DraftOrder } from "@/lib/shopify/types/draftorder";
import { DraftOrderInput } from "@/lib/shopify/types/input";
import adminClient from "../adminClient";
import { draftOrderFragment } from "../fragments";

interface DraftOrderCreateResponse {
  draftOrderCreate: {
    draftOrder: DraftOrder;
    userErrors: {
      field: [string];
      message: string;
    }[];
  };
}

interface DraftOrderUpdateResponse {
  draftOrderUpdate: {
    draftOrder: DraftOrder;
    userErrors: {
      field: [string];
      message: string;
    }[];
  };
}

export async function draftOrderCreate(input: DraftOrderInput) {
  const mutation = /* GraphQL */ `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          ...DraftOrderFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${draftOrderFragment}
  `;

  return adminClient.request<DraftOrderCreateResponse>(mutation, {
    variables: { input },
  });
}

export async function draftOrderUpdate(id: string, input: DraftOrderInput) {
  const mutation = /* GraphQL */ `
    mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
      draftOrderUpdate(id: $id, input: $input) {
        draftOrder {
          ...DraftOrderFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${draftOrderFragment}
  `;

  return adminClient.request<DraftOrderUpdateResponse>(mutation, {
    variables: { id, input },
  });
}
