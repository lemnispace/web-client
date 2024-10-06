import { UserError } from "@/lib/shopify/types/error";
import {
  ProductUpdateInput,
  ProductVariantInput,
  ProductVariantsBulkInput,
} from "@/lib/shopify/types/input";
import { ImageJobNode } from "@/lib/shopify/types/media";
import {
  ProductNode,
  ProductStatus,
  ProductVariantNode,
} from "@/lib/shopify/types/product";
import { VARIANT_METADATA_NAMESPACE } from "@/utils/constants";
import adminClient from "../adminClient";
import {
  getMetafieldsFragment,
  getVariantEdgesWithMetafieldsFragment,
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
    userErrors: UserError[];
  };
}

export interface ProductUpdateResponse {
  productUpdate: {
    product: Pick<ProductNode, "id"> | null;
    userErrors: UserError[];
  };
}

export interface ProductVariantsBulkUpdateResponse {
  productVariantsBulkUpdate: {
    product: Pick<ProductNode, "id"> | null;
    productVariants: Pick<ProductVariantNode, "id">[];
    userErrors: UserError[];
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
        variants(first: 99) ${getVariantEdgesWithMetafieldsFragment(
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

export const productUpdateMutation = /* GraphQL */ `
  mutation UpdateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const productVariantsBulkUpdateMutation = /* GraphQL */ `
  mutation productVariantsBulkUpdate(
    $productId: ID!
    $variants: [ProductVariantsBulkInput!]!
  ) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      product {
        id
      }
      productVariants {
        id
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

export async function productUpdate(input: ProductUpdateInput) {
  return adminClient.request<ProductUpdateResponse>(productUpdateMutation, {
    variables: {
      input,
    },
  });
}

export async function productVariantsBulkUpdate(
  productId: string,
  variants: ProductVariantsBulkInput[]
) {
  return adminClient.request<ProductVariantsBulkUpdateResponse>(
    productVariantsBulkUpdateMutation,
    {
      variables: {
        productId,
        variants,
      },
    }
  );
}
