import {
  Collection,
  CollectionInput,
  RequireFields,
  UserError,
} from "@/lib/types/shopify";
import adminClient from "../adminClient";

/**
 * The payload returned by the `collectionCreate` mutation.
 */
interface CollectionCreatePayload {
  /**
   * The collection that has been created.
   */
  collection?: Collection;
  /**
   * The list of errors that occurred from executing the mutation.
   */
  userErrors: UserError[];
}

export interface CollectionCreateResponse {
  collectionCreate: CollectionCreatePayload;
}

export interface CollectionAddProductsResponse {
  collectionAddProducts: {
    collection?: Pick<Collection, "id" | "title">;
    userErrors: UserError[];
  };
}

type CreateCollectionInput = RequireFields<CollectionInput, "title">;

export const collectionCreateMutation = /* GraphQL */ `
  mutation CollectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      userErrors {
        field
        message
      }
      collection {
        id
        handle
        ruleSet {
          appliedDisjunctively
          rules {
            column
            relation
            condition
          }
        }
      }
    }
  }
`;

export const collectionAddProductsMutation = /* GraphQL */ `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function collectionCreate(input: CreateCollectionInput) {
  return adminClient.request<CollectionCreateResponse>(
    collectionCreateMutation,
    {
      variables: {
        input,
      },
    }
  );
}

export async function collectionAddProducts(id: string, productIds: string[]) {
  return adminClient.request<CollectionAddProductsResponse>(
    collectionAddProductsMutation,
    {
      variables: {
        id,
        productIds,
      },
    }
  );
}
