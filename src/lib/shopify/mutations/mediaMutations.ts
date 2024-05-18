import {
  FileCreateInput,
  FilesUserError,
  ShopifyFile,
  StagedUploadInput,
  StagedUploadTarget,
} from "@/lib/types/shopify";
import { getErrorMessage } from "@/utils/getters";
import { parseClientResponse } from "@/utils/parsers";
import adminClient from "../adminClient";

interface StagedUploadsCreatePayload {
  stagedTargets: StagedUploadTarget[];
  userErrors?: FilesUserError[];
}

/**
 * Response interface for the stagedUploadsCreate mutation.
 */
export interface StagedUploadsCreateResponse {
  stagedUploadsCreate: StagedUploadsCreatePayload;
}

interface FileCreatePayload {
  files: ShopifyFile[];
  userErrors?: FilesUserError[];
}

/**
 * Response interface for the fileCreate mutation.
 */
export interface FileCreateResponse {
  fileCreate: FileCreatePayload;
}

interface CreateImageInput {
  img: File;
  filename: string;
  alt: string;
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

export const fileCreateMutation = /* GraphQL */ `
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        alt
        createdAt
        fileStatus
        preview {
          image {
            id
            url
            altText
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

/**
 * Creates a staged upload. Shopify sets up temporary file targets so we can host file data (images, videos, etc).
 * @param input - The staged upload input.
 * @returns The staged upload target.
 * @throws Error if no staged target is returned from Shopify.
 */
const stagedUploadsCreate = async (input: StagedUploadInput) => {
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

/**
 * Posts a file to a staged target (a temp taget url hosted on shopify's servers).
 * @param stagedTarget - The staged upload target. This contains the URL and parameters to post the file to.
 * @param img - The file to post.
 * @throws Error if no URL is returned from Shopify or if there is an error posting the file.
 */
const postFileToStagedTarget = async (
  stagedTarget: StagedUploadTarget,
  img: File
) => {
  // Post the file data to the staged target
  const formData = new FormData();
  stagedTarget.parameters.forEach(({ name, value }) => {
    formData.append(name, value);
  });
  formData.append("file", img);

  if (!stagedTarget.url) {
    throw new Error("No URL returned from Shopify");
  }
  try {
    const response = await fetch(stagedTarget.url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errMessage = await getErrorMessage(
        response,
        "Error posting file to staged target"
      );
      throw new Error(errMessage);
    }
    return response;
  } catch (error) {
    const errMessage = await getErrorMessage(
      error,
      "Error posting file to staged target"
    );
    console.error("PostFileToStagedTarget Error: ", error);
    throw new Error(errMessage);
  }
};

const createImageFromStagedTarget = async (
  stagedTarget: StagedUploadTarget,
  fileOptions: { alt: string }
): Promise<FileCreatePayload> => {
  try {
    if (!stagedTarget.resourceUrl) {
      throw new Error("No resource URL returned from Shopify");
    }
    // Create the file in Shopify
    const fileInput: FileCreateInput = {
      originalSource: stagedTarget.resourceUrl,
      alt: fileOptions.alt,
      contentType: "IMAGE",
      duplicateResolutionMode: "RAISE_ERROR",
    };
    const response = await adminClient.request<FileCreateResponse>(
      fileCreateMutation,
      {
        variables: {
          files: [fileInput],
        },
      }
    );
    const data = parseClientResponse(
      response,
      "Error creating image from staged target"
    );
    return data.fileCreate;
  } catch (error) {
    console.error("CreateImageFromStagedTarget Error: ", error);
    const errMessage = await getErrorMessage(
      error,
      "Error creating image from staged target"
    );
    throw new Error(errMessage);
  }
};

/**
 * Creates an image in Shopify.
 * @param input - The image input.
 * @returns The file create response.
 * @throws Error if no resource URL is returned from Shopify.
 */
export const createImage = async ({
  img,
  filename,
  alt,
}: CreateImageInput): Promise<ShopifyFile[]> => {
  const mimeType = img.type;
  try {
    // Create a staged target (a temporary URL hosted on Shopify's servers)
    const stagedTarget = await stagedUploadsCreate({
      filename,
      httpMethod: "POST",
      mimeType,
      resource: "FILE",
    });
    // Post the file to the staged target
    await postFileToStagedTarget(stagedTarget, img);
    // Create the image in Shopify using the file uploaded to the staged target
    const response = await createImageFromStagedTarget(stagedTarget, { alt });
    if (response.userErrors?.length) {
      console.error("Error creating image: ", response.userErrors);
      throw new Error(
        response.userErrors?.[0]?.message || "Error creating image"
      );
    }
    if (!response.files.length) {
      throw new Error("No files returned from Shopify");
    }
    return response.files;
  } catch (error) {
    console.error("CreateImage Error: ", error);
    const errMessage = await getErrorMessage(
      error,
      "Error creating image in Shopify"
    );
    throw new Error(errMessage);
  }
};
