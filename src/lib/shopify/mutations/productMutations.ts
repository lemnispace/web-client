import {
  ImageJobNode,
  ProductNode,
  ProductStatus,
  ProductVariantInput,
  ProductVariantNode,
  UserError,
} from "@/lib/types/shopify";
import { VARIANT_METADATA_NAMESPACE } from "@/utils/constants";
import adminClient from "../adminClient";
import {
  getMetafieldsFragment,
  getNewProductVariantEdgesFragment,
} from "../fragments";

export interface ProductDuplicateResponse {
  productDuplicate: {
    newProduct: ProductNode;
    imageJob?: ImageJobNode;
    userErrors: UserError[];
  };
}

interface ProductDuplicateInput {
  newStatus: ProductStatus;
  productId: string;
  newTitle: string;
}
export interface ProductVariantUpdateResponse {
  productVariantUpdate: {
    productVariant: Pick<ProductVariantNode, "id" | "title" | "media">;
    product: Pick<ProductNode, "id"> | null;
  };
}

export const productDuplicateMutation = /* GraphQL */ `
  mutation DuplicateProduct(
    $productId: ID!
    $newTitle: String!
    $includeImages: Boolean
    $newStatus: ProductStatus
  ) {
    productDuplicate(
      productId: $productId
      newTitle: $newTitle
      includeImages: $includeImages
      newStatus: $newStatus
    ) {
      newProduct {
        id
        title
        description
        descriptionHtml
        handle
        variants(first: 99) ${getNewProductVariantEdgesFragment(
          VARIANT_METADATA_NAMESPACE
        )}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const productVariantUpdateMutation = /* GraphQL */ `
  mutation UpdateProductVariant($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        id
      }
      productVariant {
        id
        title
        media(first: 1) {
          nodes {
            id
            alt
            mediaContentType
            preview {
              status
            }
          }
        }
        ${getMetafieldsFragment(VARIANT_METADATA_NAMESPACE)}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function duplicateProduct(input: ProductDuplicateInput) {
  const response = await adminClient.request<ProductDuplicateResponse>(
    productDuplicateMutation,
    {
      variables: {
        productId: input.productId,
        newTitle: input.newTitle,
        includeImages: false,
        newStatus: input.newStatus,
      },
    }
  );
  return response;
}

export async function productVariantUpdate(input: ProductVariantInput) {
  return adminClient.request<ProductVariantUpdateResponse>(
    productVariantUpdateMutation,
    {
      variables: {
        input,
      },
    }
  );
}
