/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Edge Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type Edge<T> = {
  cursor: string;
  node: T;
};

export type Edges<T> = {
  edges: T[];
};

export type ProductVariantEdge = Edge<ProductVariantNode>;
export type MediaEdge = Edge<MediaNode>;
export type ImageEdge = Edge<Image>;
export type ProductEdge = Edge<ProductNode>;

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 File Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type FilesErrorCode =
  | "ALT_VALUE_LIMIT_EXCEEDED"
  | "BLANK_SEARCH"
  | "FILENAME_ALREADY_EXISTS"
  | "FILE_DOES_NOT_EXIST"
  | "FILE_LOCKED"
  | "INVALID"
  | "INVALID_DUPLICATE_MODE_FOR_TYPE"
  | "INVALID_FILENAME"
  | "INVALID_FILENAME_EXTENSION"
  | "INVALID_IMAGE_SOURCE_URL"
  | "INVALID_QUERY"
  | "MISMATCHED_FILENAME_AND_ORIGINAL_SOURCE"
  | "MISSING_ARGUMENTS"
  | "MISSING_FILENAME_FOR_DUPLICATE_MODE_REPLACE"
  | "NON_IMAGE_MEDIA_PER_SHOP_LIMIT_EXCEEDED"
  | "NON_READY_STATE"
  | "TOO_MANY_ARGUMENTS"
  | "UNACCEPTABLE_ASSET"
  | "UNACCEPTABLE_TRIAL_ASSET"
  | "UNACCEPTABLE_UNVERIFIED_TRIAL_ASSET"
  | "UNSUPPORTED_MEDIA_TYPE_FOR_FILENAME_UPDATE";

interface BaseFileError {
  code: FilesErrorCode;
  message: string;
}

export interface FilesUserError extends BaseFileError {
  field?: string[];
}

export interface FileError extends BaseFileError {
  details?: string;
}

export interface FileCreateInput {
  alt?: string;
  contentType?: FileContentType;
  duplicateResolutionMode?: FileCreateInputDuplicateResolutionMode;
  filename?: string;
  originalSource: string;
}

export type FileStatus = "FAILED" | "PROCESSING" | "READY" | "UPLOADED";

export type FileContentType = "FILE" | "IMAGE" | "VIDEO";

export type FileCreateInputDuplicateResolutionMode =
  | "APPEND_UUID"
  | "RAISE_ERROR"
  | "REPLACE";

export interface ShopifyFile {
  alt?: string;
  createdAt: string;
  fileErrors: FileError[];
  fileStatus: FileStatus;
  id: string;
  preview: MediaPreviewImage;
  updatedAt: string;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Media Types                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type MediaContentType =
  | "EXTERNAL_VIDEO"
  | "IMAGE"
  | "MODEL_3D"
  | "VIDEO";

export interface Image {
  id: string;
  url: string;
  altText?: string;
  height: number;
  width: number;
}

export interface MediaNode {
  id: string;
  alt?: string;
  mediaContentType: MediaContentType;
  previewImage: Image;
}

interface MediaPreviewImage {
  image?: Image;
  status: FileStatus;
}

export interface ImageJobNode {
  id: string;
  done: boolean;
}

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

export interface StagedUploadInput {
  /**
   * The size of the file to upload, in bytes.
   * This is required when the request's resource property is set to `VIDEO` or `MODEL_3D`
   */
  fileSize?: number;
  filename: string;
  /**
   * The HTTP method to be used when sending a request to upload the file using the returned staged upload target.
   * Possible values are POST and PUT.
   * @default POST
   * */
  httpMethod?: "POST" | "PUT";
  /**
   * The file's MIME type.
   * */
  mimeType: string;
  resource: StagedUploadTargetGenerateUploadResource;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Pricing Types                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface Money {
  amount: number;
  currencyCode: string;
}

export interface ProductPriceRange {
  maxVariantPrice: Money;
  minVariantPrice: Money;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                            Product Variant Types                             ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type ProductVariantOptionType = "Color" | "Size" | "Material" | "Style";

export interface ProductVariantMetafield {
  key: string;
  value: string;
  reference?: {
    id: string;
    image: Image;
  };
}

export interface ProductVariantNode {
  id: string;
  title: string;
  quantityAvailable?: number;
  price: Price;
  selectedOptions: Array<{ name: ProductVariantOptionType; value: string }>;
  image?: Image;
  metafield?: ProductVariantMetafield;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                Product Types                                 ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface ProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  priceRange: ProductPriceRange;
  productType?: string;
  images?: Edges<ImageEdge>;
  tags: string[];
  variants?: Edges<ProductVariantEdge>;
}

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  DRAFT = "DRAFT",
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Error Types                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface ErrorLocation {
  line: number;
  column: number;
}

export interface ErrorExtensions {
  code: string;
  documentation: string;
  requiredAccess: string;
}

export interface Error {
  message: string;
  locations: ErrorLocation[];
  path: string[];
  extensions: ErrorExtensions;
}

export interface UserError {
  field?: string[];
  message: string;
}
