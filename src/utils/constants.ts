/*
 ***************************************************************************
 *                                                                         *
 *                    Constants for the app                                *
 *                                                                         *
 ***************************************************************************
 */
export const MAX_IMG_FILE_SIZE_MB = 10;
export const MAX_IMG_FILE_SIZE = MAX_IMG_FILE_SIZE_MB * 1024 * 1024; // 10MB in bytes

/*
 ***************************************************************************
 *                                                                         *
 *                    Constants for the Shopify API                        *
 *                                                                         *
 ***************************************************************************
 */

/**
 * VARIANT METADATA
 */
export const VARIANT_METADATA_NAMESPACE = "custom";
export const VARIANT_METADATA_PREVIEW_IMAGE_KEY = "preview_image";
export const VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY =
  "origin_product_variant";
export const VARIANT_METADATA_ORIGIN_PRODUCT_KEY = "origin_product";
export const VARIANT_METADATA_USER_ID_KEY = "user_id";
export const VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY =
  "customization_timestamp";

export type VariantMetadataKey =
  | typeof VARIANT_METADATA_PREVIEW_IMAGE_KEY
  | typeof VARIANT_METADATA_ORIGIN_PRODUCT_VARIANT_KEY
  | typeof VARIANT_METADATA_ORIGIN_PRODUCT_KEY
  | typeof VARIANT_METADATA_USER_ID_KEY
  | typeof VARIANT_METADATA_CUSTOMIZATION_TIMESTAMP_KEY;

export type VariantMetadataNamespace = typeof VARIANT_METADATA_NAMESPACE;

/**
 * PRODUCT METADATA
 * */

export const PRODUCT_METADATA_NAMESPACE = "custom";
export const PRODUCT_METADATA_ORIGIN_PRODUCT_KEY = "origin_product";
export type ProductMetadataKey = typeof PRODUCT_METADATA_ORIGIN_PRODUCT_KEY;
/*
 ***************************************************************************
 *                                                                         *
 *                    Temporary Constants                                  *
 *                                                                         *
 ***************************************************************************
 */
export const TEMP_USER_ID = "bda86db3-d3c0-4983-99ec-87d4da67d874"; // replace with user id from session;
