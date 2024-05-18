import {
  ImageJobNode,
  ProductNode,
  ProductStatus,
  UserError,
} from "@/lib/types/shopify";
import {
  VARIANT_METADATA_NAMESPACE,
  VARIANT_METADATA_PREVIEW_IMAGE_KEY,
} from "@/utils/constants";
import adminClient from "../adminClient";
import { getVariantsFragment } from "../fragments";

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
    productVariant: {
      id: string;
      image: {
        id: string;
        url: string;
        altText: string;
      };
    };
    userErrors: UserError[];
  };
}

interface ProductVariantUpdateInput {
  id: string;
  imageId: string;
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
        variants(first: 99) ${getVariantsFragment(
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

export const productVariantUpdateMutation = /* GraphQL */ `
  mutation ProductVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      productVariant {
        id
        image {
          id
          url
          altText
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function duplicateProduct(input: ProductDuplicateInput) {
  return adminClient.request<ProductDuplicateResponse>(
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
}

export function updateProductVariantImage(input: ProductVariantUpdateInput) {
  return adminClient.request<ProductVariantUpdateResponse>(
    productVariantUpdateMutation,
    {
      variables: {
        input: {
          id: input.id,
          imageId: input.imageId,
        },
      },
    }
  );
}
