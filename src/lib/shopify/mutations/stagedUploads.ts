import { CreateMediaInput } from "@/lib/shopify/types/input";
import { StagedUploadTarget } from "@/lib/shopify/types/stagedUpload";
import { getErrorMessage } from "@/utils/getters";
import { productCreateMedia, stagedUploadsCreate } from "./mediaMutations";

type StagedUploadImage = Required<
  Pick<StagedUploadTarget, "resourceUrl" | "url">
>;

interface CreateImageForProductInput {
  productId: string;
  resourceUrl: string;
  alt?: string;
}

interface createImageForProductResponse {
  mediaId: string;
  productId: string;
}

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

/**
 * Stages an image for upload to Shopify.
 * @param img - The image file.
 * @param filename - The filename to use for the image.
 * @returns The staged image URL.
 * @throws Error if there is an error staging the image.
 */
export const stageImageForUpload = async (
  img: File,
  filename: string
): Promise<StagedUploadImage> => {
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
    if (!stagedTarget.resourceUrl) {
      throw new Error("no resource URL found in staged target");
    }
    if (!stagedTarget.url) {
      throw new Error("no URL found in staged target");
    }
    return {
      resourceUrl: stagedTarget.resourceUrl,
      url: stagedTarget.url,
    };
  } catch (error) {
    console.error("stageImageForUpload Error: ", error);
    const errMessage = await getErrorMessage(
      error,
      "Error staging image for upload"
    );
    throw new Error(errMessage);
  }
};

export const createImageForProduct = async (
  input: CreateImageForProductInput
): Promise<createImageForProductResponse> => {
  try {
    // Create a staged target (a temporary URL hosted on Shopify's servers)
    const fileInput: CreateMediaInput = {
      originalSource: input.resourceUrl,
      alt: input.alt,
      mediaContentType: "IMAGE",
    };
    const productCreateMediaRespone = await productCreateMedia({
      media: [fileInput],
      productId: input.productId,
    });
    if (!productCreateMediaRespone.media.length) {
      throw new Error("No media created for product");
    }
    return {
      mediaId: productCreateMediaRespone.media[0].id,
      productId: productCreateMediaRespone.product.id,
    };
  } catch (error) {
    console.error(
      `Error creating image for productId: ${input.productId}`,
      error
    );
    throw error;
  }
};
