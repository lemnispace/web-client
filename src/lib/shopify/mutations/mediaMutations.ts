import {
  CreateMediaInput,
  FilesUserError,
  MediaNode,
  ProductNode,
  StagedUploadInput,
  StagedUploadTarget,
  UserError,
} from "@/lib/types/shopify";
import { parseClientResponse } from "@/utils/parsers";
import adminClient from "../adminClient";
interface StagedUploadsCreatePayload {
  stagedTargets: StagedUploadTarget[];
  userErrors?: FilesUserError[];
}

interface ProductCreateMediaInput {
  productId: string;
  media: CreateMediaInput[];
}

export interface StagedUploadsCreateResponse {
  stagedUploadsCreate: StagedUploadsCreatePayload;
}

export interface ProductCreateMediaResponse {
  productCreateMedia: {
    media: Pick<MediaNode, "id" | "status">[];
    mediaUserErrors: UserError[];
    product: Pick<ProductNode, "id">;
  };
}

export const stagedUploadsCreateMutation = /* GraphQL */ `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        resourceUrl
        url
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const productCreateMediaMutation = /* GraphQL */ `
  mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
    productCreateMedia(media: $media, productId: $productId) {
      media {
        id
        status
      }
      mediaUserErrors {
        field
        message
      }
      product {
        id
      }
    }
  }
`;

/**
 * Creates a staged upload. Shopify sets up temporary file targets so we can host file data (images, videos, etc).
 * @param input - The staged upload input.
 * @returns The staged upload target.
 * @throws Error if no staged target is returned from Shopify.
 */
export const stagedUploadsCreate = async (input: StagedUploadInput) => {
  try {
    const response = await adminClient.request<StagedUploadsCreateResponse>(
      stagedUploadsCreateMutation,
      {
        variables: {
          input: [input],
        },
      }
    );
    const data = parseClientResponse(response, "Error creating staged upload");
    const stagedTarget = data.stagedUploadsCreate.stagedTargets[0];
    if (!stagedTarget) {
      throw new Error("No staged target returned from Shopify");
    }
    return stagedTarget;
  } catch (error) {
    console.error("StagedUploadsCreate Error: ", error);
    throw error;
  }
};

export const productCreateMedia = async (input: ProductCreateMediaInput) => {
  try {
    const response = await adminClient.request<ProductCreateMediaResponse>(
      productCreateMediaMutation,
      {
        variables: {
          media: input.media,
          productId: input.productId,
        },
      }
    );
    const data = parseClientResponse(response, "Error creating product media");
    return data.productCreateMedia;
  } catch (error) {
    console.error("ProductCreateMedia Error: ", error);
    throw error;
  }
};
