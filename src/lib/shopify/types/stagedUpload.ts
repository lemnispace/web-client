/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Staged Upload Types                            ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type StagedUploadTargetGenerateUploadResource =
  | "BULK_MUTATION_VARIABLES"
  | "COLLECTION_IMAGE"
  | "FILE"
  | "IMAGE"
  | "MODEL_3D"
  | "PRODUCT_IMAGE"
  | "RETURN_LABEL"
  | "SHOP_IMAGE"
  | "URL_REDIRECT_IMPORT"
  | "VIDEO";

export interface StagedUploadTarget {
  /**
   * Parameters contain all the sensitive info we'll need to interact with the aws bucket.
   */
  parameters: { name: string; value: string }[];
  /**
   * Specific url that will contain your image data after you've uploaded the file to the aws staged target.
   */
  resourceUrl?: string;
  /**
   * Url you'll use to post data to aws. It's a generic s3 url that when combined with the params sends your data to the right place.
   */
  url?: string;
}
