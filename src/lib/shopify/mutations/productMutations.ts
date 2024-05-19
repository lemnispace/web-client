import {
  ImageJobNode,
  ProductNode,
  ProductStatus,
  ProductVariantNode,
  UserError,
} from "@/lib/types/shopify";
import {
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_PREVIEW_IMAGE_KEY,
} from "@/utils/constants";
import adminClient from "../adminClient";
import { getNewProductVariantEdgesFragment } from "../fragments";

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

interface ProductVariantUpdateInput {
  id: string;
  mediaId: string;
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
          VARIANT_METADATA_NAMESPACE,
          VARIANT_METADATA_PREVIEW_IMAGE_KEY
        )}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const productVariantAppendMediaMutation = /* GraphQL */ `
  mutation productVariantAppendMedia(
    $productId: ID!
    $variantMedia: [ProductVariantAppendMediaInput!]!
  ) {
    productVariantAppendMedia(
      productId: $productId
      variantMedia: $variantMedia
    ) {
      product {
        id
      }
      productVariants {
        media(first: 10) {
          edges {
            node {
              mediaContentType
              preview {
                image {
                  url
                }
              }
            }
          }
        }
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

export async function productVariantUpdate(input: ProductVariantUpdateInput) {
  return adminClient.request<ProductVariantUpdateResponse>(
    productVariantUpdateMutation,
    {
      variables: {
        input,
      },
    }
  );
}
