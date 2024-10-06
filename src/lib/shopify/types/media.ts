import { Edge } from "./edge";

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

export interface BaseFileError {
  code: FilesErrorCode;
  message: string;
}

export interface FilesUserError extends BaseFileError {
  field?: string[];
}

export interface FileError extends BaseFileError {
  details?: string;
}

export type FileStatus = "FAILED" | "PROCESSING" | "READY" | "UPLOADED";

export type FileContentType = "FILE" | "IMAGE" | "VIDEO";

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
  status?: FileStatus;
}

export interface MediaPreviewImage {
  image?: Image;
  status: FileStatus;
}

export interface ImageJobNode {
  id: string;
  done: boolean;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Edge Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type MediaEdge = Edge<MediaNode>;
export type ImageEdge = Edge<Image>;
