/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Edge Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import {
  VariantMetadataKey,
  VariantMetadataNamespace,
} from "@/utils/constants";
import { RequireFields } from "@/utils/genericTypes";
import { CountryCode } from "./shopifyCountryCodes";

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
export type ProductVariantMetafieldEdge = Edge<ProductVariantMetafield>;
export type ProductMetafieldEdge = Edge<ProductMetafield>;

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

export interface ProductVariantNode {
  id: string;
  title: string;
  quantityAvailable?: number;
  price: Price | string;
  selectedOptions: Array<{ name: ProductVariantOptionType; value: string }>;
  image?: Image;
  metafields?: Edges<ProductVariantMetafieldEdge>;
  media?: Edges<MediaEdge>;
  sku?: string;
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
  metafields?: Edges<ProductMetafieldEdge>;
}

export type ProductStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Metafield Types                              ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * The possible types for a metafield or metafield definition.
 */
type MetafieldType =
  | "boolean"
  | "color"
  | "date"
  | "date_time"
  | "dimension"
  | "json"
  | "money"
  | "multi_line_text_field"
  | "number_decimal"
  | "number_integer"
  | "rating"
  | "rich_text_field"
  | "single_line_text_field"
  | "url"
  | "volume"
  | "weight"
  // Reference types
  | "collection_reference"
  | "file_reference"
  | "metaobject_reference"
  | "mixed_reference"
  | "page_reference"
  | "product_reference"
  | "variant_reference"
  // List types
  | "list.collection_reference"
  | "list.color"
  | "list.date"
  | "list.date_time"
  | "list.dimension"
  | "list.file_reference"
  | "list.metaobject_reference"
  | "list.mixed_reference"
  | "list.number_integer"
  | "list.number_decimal"
  | "list.page_reference"
  | "list.product_reference"
  | "list.rating"
  | "list.single_line_text_field"
  | "list.url"
  | "list.variant_reference"
  | "list.volume"
  | "list.weight";

export const MetafieldTypes = [
  "boolean",
  "color",
  "date",
  "date_time",
  "dimension",
  "json",
  "money",
  "multi_line_text_field",
  "number_decimal",
  "number_integer",
  "rating",
  "rich_text_field",
  "single_line_text_field",
  "url",
  "volume",
  "weight",
  // Reference types
  "collection_reference",
  "file_reference",
  "metaobject_reference",
  "mixed_reference",
  "page_reference",
  "product_reference",
  "variant_reference",
  // List types
  "list.collection_reference",
  "list.color",
  "list.date",
  "list.date_time",
  "list.dimension",
  "list.file_reference",
  "list.metaobject_reference",
  "list.mixed_reference",
  "list.number_integer",
  "list.number_decimal",
  "list.page_reference",
  "list.product_reference",
  "list.rating",
  "list.single_line_text_field",
  "list.url",
  "list.variant_reference",
  "list.volume",
  "list.weight",
] as const;

/**
 * Metafield definitions enable you to define additional validation constraints for metafields,
 * and enable the merchant to edit metafield values in context.
 */
export interface MetafieldDefinition {
  /**
   * The access settings associated with the metafield definition.
   */
  access: MetafieldAccess;

  /**
   * The description of the metafield definition.
   */
  description?: string;

  /**
   * A globally-unique ID.
   */
  id: string;

  /**
   * The unique identifier for the metafield definition within its namespace.
   */
  key: string;

  /**
   * The count of the metafields that belong to the metafield definition.
   */
  metafieldsCount: number;

  /**
   * The human-readable name of the metafield definition.
   */
  name: string;

  /**
   * The container for a group of metafields that the metafield definition is associated with.
   */
  namespace: string;

  /**
   * The resource type that the metafield definition is attached to.
   */
  ownerType: MetafieldOwnerType;

  /**
   * The position of the metafield definition in the pinned list.
   */
  pinnedPosition?: number;

  /**
   * The standard metafield definition template associated with the metafield definition.
   */
  standardTemplate?: StandardMetafieldDefinitionTemplate;

  /**
   * The type of data that each of the metafields that belong to the metafield definition will store.
   * Refer to the list of supported types.
   */
  type: MetafieldDefinitionType;

  /**
   * Whether the metafield definition can be used as a collection condition.
   */
  useAsCollectionCondition: boolean;

  /**
   * The validation status for the metafields that belong to the metafield definition.
   */
  validationStatus: MetafieldDefinitionValidationStatus;

  /**
   * A list of validation options for the metafields that belong to the metafield definition.
   */
  validations: MetafieldDefinitionValidation[];
}

/**
 * The access settings associated with the metafield definition.
 */
export interface MetafieldAccess {
  /**
   * The default admin access setting used for the metafields under this definition.
   */
  admin?: MetafieldAdminAccess;

  /**
   * The explicit grants for this metafield definition, superseding the default admin access for the specified grantees.
   */
  grants: MetafieldAccessGrant[];

  /**
   * The storefront access setting used for the metafields under this definition.
   */
  storefront?: MetafieldStorefrontAccess;
}

/**
 * The default admin access setting used for the metafields under this definition.
 */
type MetafieldAdminAccess =
  | "MERCHANT_READ"
  | "MERCHANT_READ_WRITE"
  | "PRIVATE"
  | "PUBLIC_READ";

/**
 * The explicit grants for this metafield definition, superseding the default admin access for the specified grantees.
 */
export interface MetafieldAccessGrant {
  /**
   * The level of access the grantee has.
   */
  access: MetafieldGrantAccessLevel;

  /**
   * The grantee being granted access.
   */
  grantee: string;
}

/**
 * The level of access the grantee has.
 */
type MetafieldGrantAccessLevel = "FULL" | "READ" | "WRITE";

/**
 * The storefront access setting used for the metafields under this definition.
 */
type MetafieldStorefrontAccess = "NONE" | "PUBLIC_READ";

/**
 * The resource type that the metafield definition is attached to.
 */
type MetafieldOwnerType =
  | "API_PERMISSION"
  | "ARTICLE"
  | "BLOG"
  | "CARTTRANSFORM"
  | "COLLECTION"
  | "COMPANY"
  | "COMPANY_LOCATION"
  | "CUSTOMER"
  | "DELIVERY_CUSTOMIZATION"
  | "DISCOUNT"
  | "DRAFTORDER"
  | "FULFILLMENT_CONSTRAINT_RULE"
  | "LOCATION"
  | "MARKET"
  | "MEDIA_IMAGE"
  | "ORDER"
  | "ORDER_ROUTING_LOCATION_RULE"
  | "PAGE"
  | "PAYMENT_CUSTOMIZATION"
  | "PRODUCT"
  | "PRODUCTVARIANT"
  | "SHOP"
  | "VALIDATION"
  | "PRODUCTIMAGE";

/**
 * The standard metafield definition template associated with the metafield definition.
 */
export interface StandardMetafieldDefinitionTemplate {
  /**
   * The description of the standard metafield definition.
   */
  description?: string;

  /**
   * A globally-unique ID.
   */
  id: string;

  /**
   * The key owned by the definition after the definition has been activated.
   */
  key: string;

  /**
   * The human-readable name for the standard metafield definition.
   */
  name: string;

  /**
   * The namespace owned by the definition after the definition has been activated.
   */
  namespace: string;

  /**
   * The list of resource types that the standard metafield definition can be applied to.
   */
  ownerTypes: MetafieldOwnerType[];

  /**
   * The associated metafield definition type that the metafield stores.
   */
  type: MetafieldDefinitionType;

  /**
   * The configured validations for the standard metafield definition.
   */
  validations: MetafieldDefinitionValidation[];

  /**
   * Whether metafields for the definition are by default visible using the Storefront API.
   */
  visibleToStorefrontApi: boolean;
}

/**
 * The associated metafield definition type that the metafield stores.
 */
export interface MetafieldDefinitionType {
  /**
   * The category associated with the metafield definition type.
   */
  category: string;

  /**
   * The name of the type for the metafield definition. See the list of supported types.
   */
  name: string;

  /**
   * The supported validations for a metafield definition type.
   */
  supportedValidations: MetafieldDefinitionSupportedValidation[];

  /**
   * Whether metafields without a definition can be migrated to a definition of this type.
   */
  supportsDefinitionMigrations: boolean;

  /**
   * @deprecated
   * The value type for a metafield created with this definition type. valueType is deprecated and name should be used for type information.
   */
  valueType: MetafieldValueType;
}

/**
 * The supported validations for a metafield definition type.
 */
export interface MetafieldDefinitionSupportedValidation {
  /**
   * The name of the metafield definition validation.
   */
  name: string;

  /**
   * The type of input for the validation.
   */
  type: string;
}

/**
 * The value type for a metafield created with this definition type.
 */
type MetafieldValueType = "BOOLEAN" | "INTEGER" | "JSON_STRING" | "STRING";

/**
 * The validation status for the metafields that belong to the metafield definition.
 */
type MetafieldDefinitionValidationStatus =
  | "ALL_VALID"
  | "IN_PROGRESS"
  | "SOME_INVALID";

/**
 * A list of validation options for the metafields that belong to the metafield definition.
 */
export interface MetafieldDefinitionValidation {
  /**
   * The validation name.
   */
  name: string;

  /**
   * The name for the metafield type of this validation.
   */
  type: string;

  /**
   * The validation value.
   */
  value?: string;
}

export interface ProductVariantMetafield {
  key: string;
  id: string;
  value: string;
  namespace: string;
  reference?: {
    /**
     * The unique ID of the reference.
     */
    id: string;
    /**
     * The image associated with the reference if the reference is an image.
     */
    image?: Image;
    /**
     * The title of the product variant if the reference is a product variant.
     */
    title?: string;
    /**
     * The handle of the product if the reference is a product.
     */
    handle?: string;
  };
}

export interface ProductMetafield {
  key: string;
  id: string;
  value: string;
  namespace: string;
  reference?: {
    /**
     * The unique ID of the reference.
     */
    id: string;
    /**
     * The handle of the product if the reference is a product.
     */
    handle?: string;
  };
}

/**
 * Metafields enable you to attach additional information to a Shopify resource, such as a Product or a Collection. For more information about where you can attach metafields refer to HasMetafields. Some examples of the data that metafields enable you to store are specifications, size charts, downloadable documents, release dates, images, or part numbers. Metafields are identified by an owner resource, namespace, and key. and store a value along with type information for that value.
 */
export interface Metafield {
  /**
   * The date and time when the metafield was created.
   */
  createdAt: string;
  /**
   * The description of the metafield.
   */
  description?: string;
  /**
   * A globally-unique ID.
   */
  id: string;
  /**
   * The unique identifier for the metafield within its namespace.
   */
  key: string;
  /**
   * The ID of the corresponding resource in the REST Admin API.
   */
  legacyResourceId: string;
  /**
   * The container for a group of metafields that the metafield is associated with.
   */
  namespace: string;
  /**
   * The type of resource that the metafield is attached to.
   */
  ownerType: MetafieldOwnerType;
  /**
   * The date and time when the metafield was updated.
   */
  updatedAt: string;
  value: string;
  /**
   * The type of data that is stored in the metafield. Refer to the list of supported types.
   */
  type: MetafieldType;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Collection Types                             ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface ProductTaxonomyNode {
  /**
   * The full name of the product taxonomy node.
   * For example, Animals & Pet Supplies > Pet Supplies > Dog Supplies > Dog Beds.
   */
  fullName: string;

  /**
   * The ID of the product taxonomy node.
   */
  id: string;

  /**
   * Whether the node is a leaf node.
   */
  isLeaf: boolean;

  /**
   * Whether the node is a root node.
   */
  isRoot: boolean;

  /**
   * The name of the product taxonomy node.
   * For example, Dog Beds.
   */
  name: string;
}

export interface SEO {
  description: string;
  title: string;
}

export type CollectionRuleColumn =
  | "IS_PRICE_REDUCED"
  | "PRODUCT_METAFIELD_DEFINITION"
  | "PRODUCT_TAXONOMY_NODE_ID"
  | "TAG"
  | "TITLE"
  | "TYPE"
  | "VARIANT_COMPARE_AT_PRICE"
  | "VARIANT_INVENTORY"
  | "VARIANT_METAFIELD_DEFINITION"
  | "VARIANT_PRICE"
  | "VARIANT_TITLE"
  | "VARIANT_WEIGHT"
  | "VENDOR";

export type CollectionRuleRelation =
  | "CONTAINS"
  | "ENDS_WITH"
  | "EQUALS"
  | "GREATER_THAN"
  | "IS_NOT_SET"
  | "IS_SET"
  | "LESS_THAN"
  | "NOT_CONTAINS"
  | "NOT_EQUALS"
  | "STARTS_WITH";

export type CollectionSortOrder =
  /**
   * Alphabetically, in ascending order (A - Z).
   */
  | "ALPHA_ASC"

  /**
   * Alphabetically, in descending order (Z - A).
   */
  | "ALPHA_DESC"

  /**
   * By best-selling products.
   */
  | "BEST_SELLING"

  /**
   * By date created, in ascending order (oldest - newest).
   */
  | "CREATED"

  /**
   * By date created, in descending order (newest - oldest).
   */
  | "CREATED_DESC"

  /**
   * In the order set manually by the merchant.
   */
  | "MANUAL"

  /**
   * By price, in ascending order (lowest - highest).
   */
  | "PRICE_ASC"

  /**
   * By price, in descending order (highest - lowest).
   */
  | "PRICE_DESC";

/**
 * Represents a group of products that can be displayed in online stores and other sales channels.
 */
export interface Collection {
  /**
   * A globally-unique ID.
   */
  id: string;

  /**
   * The name of the collection. It's displayed in the Shopify admin and is typically displayed in sales channels, such as an online store.
   */
  title: string;

  /**
   * A single-line, text-only description of the collection, stripped of any HTML tags and formatting that were included in the description.
   */
  description?: string;

  /**
   * The description of the collection, including any HTML tags and formatting. This content is typically displayed to customers, such as on an online store, depending on the theme.
   */
  descriptionHtml?: string;

  /**
   * A unique string that identifies the collection.
   */
  handle: string;

  /**
   * The image associated with the collection.
   */
  image?: Image;

  /**
   * The number of products in the collection.
   */
  productsCount?: number;

  /**
   * For a smart (automated) collection, specifies the rules that determine whether a product is included.
   */
  ruleSet?: CollectionRuleSet;

  /**
   * If the default SEO fields for page title and description have been modified, contains the modified information.
   */
  seo?: SEO;

  /**
   * The order in which the products in the collection are displayed by default in the Shopify admin and in sales channels, such as an online store.
   */
  sortOrder?: CollectionSortOrder;

  /**
   * The suffix of the Liquid template being used to show the collection in an online store.
   */
  templateSuffix?: string;

  /**
   * The date and time (ISO 8601 format) when the collection was last modified.
   */
  updatedAt: string;
}

/**
 * The set of rules that are used to determine which products are included in the collection.
 */
export interface CollectionRuleSet {
  /**
   * Whether products must match any or all of the rules to be included in the collection.
   * If true, then products must match at least one of the rules to be included in the collection.
   * If false, then products must match all of the rules to be included in the collection.
   */
  appliedDisjunctively: boolean;

  /**
   * The rules used to assign products to the collection.
   */
  rules: CollectionRule[];
}

/**
 * Represents a rule that's used to assign products to a collection.
 */
export interface CollectionRule {
  /**
   * The attribute that the rule focuses on. For example, title or product_type.
   */
  column: CollectionRuleColumn;

  /**
   * The value that the operator is applied to. For example, Hats.
   */
  condition: string;

  /**
   * The value that the operator is applied to.
   */
  conditionObject?: CollectionRuleConditionObject;

  /**
   * The type of operator that the rule is based on. For example, equals, contains, or not_equals.
   */
  relation: CollectionRuleRelation;
}

/**
 * Specifies the condition for the rule.
 */
type CollectionRuleConditionObject =
  | CollectionRuleMetafieldCondition
  | CollectionRuleProductCategoryCondition
  | CollectionRuleTextCondition;

/**
 * Identifies a metafield definition used as a rule for the smart collection.
 */
export interface CollectionRuleMetafieldCondition {
  /**
   * The metafield definition associated with the condition.
   */
  metafieldDefinition: MetafieldDefinition;
}

/**
 * Specifies the condition for a Product Category field.
 */
export interface CollectionRuleProductCategoryCondition {
  /**
   * The value of the condition.
   */
  value: ProductTaxonomyNode;
}

/**
 * Specifies the condition for a text field.
 */
export interface CollectionRuleTextCondition {
  /**
   * The value of the condition.
   */
  value: string;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Input Types                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type FileCreateInputDuplicateResolutionMode =
  | "APPEND_UUID"
  | "RAISE_ERROR"
  | "REPLACE";

export interface FileCreateInput {
  alt?: string;
  contentType?: FileContentType;
  duplicateResolutionMode?: FileCreateInputDuplicateResolutionMode;
  filename?: string;
  originalSource: string;
}

export interface ImageInput {
  altText?: string;
  id?: string;
  src?: string;
}

export interface CreateMediaInput {
  /**
   * The alt text associated with the media.
   */
  alt?: string;
  /**
   * The media content type.
   */
  mediaContentType: MediaContentType;
  /**
   * The original source of the media object. This might be an external URL or a staged upload URL.
   */
  originalSource: string;
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

export interface ProductVariantInput {
  id?: string;
  mediaId?: string;
  mediaSrc?: string[];
  metafields?: MetafieldInput[];
  options?: string[];
  position?: number;
  productId?: string;
}

export interface ProductVariantsBulkInput {
  barcode?: string;
  compareAtPrice?: string;
  id: string;
  inventoryPolicy?: "CONTINUE" | "DENY";
  metafields?: MetafieldInput[];
  mediaSrc?: string[];
  mediaId?: string;
  price?: Money;
  taxCode?: string;
  taxable?: boolean;
}

export interface ProductUpdateInput {
  /**
   * The IDs of the collections that this product will be added to.
   */
  collectionsToJoin?: string[];

  /**
   * The IDs of collections that will no longer include the existing product.
   */
  collectionsToLeave?: string[];

  /**
   * The custom product type specified by the merchant.
   */
  customProductType?: string;

  /**
   * The description of the product, complete with HTML formatting.
   */
  descriptionHtml?: string;

  /**
   * Whether the product is a gift card.
   */
  giftCard?: boolean;

  /**
   * The theme template used when viewing the gift card in a store.
   */
  giftCardTemplateSuffix?: string;

  /**
   * A unique, human-friendly string for the product. Automatically generated from the product's title unless otherwise specified.
   */
  handle?: string;

  /**
   * Specifies the product to update in productUpdate or creates a new product if absent in productCreate.
   */
  id?: string;

  /**
   * The metafields to associate with this product.
   */
  metafields?: MetafieldInput[];

  /**
   * The product type specified by the merchant.
   */
  productType?: string;

  /**
   * Whether a redirect is required after a new handle has been provided. If true, then the old handle is redirected to the new one automatically.
   */
  redirectNewHandle?: boolean;

  /**
   * Whether the product can only be purchased with a selling plan (subscription).
   * Products that are sold exclusively on subscription can only be created on online stores.
   * If set to true on an already existing product, then the product will be marked unavailable on channels that don't support subscriptions.
   */
  requiresSellingPlan?: boolean;

  /**
   * The SEO information associated with the product.
   */
  seo?: SEOInput;

  /**
   * The status of the product.
   */
  status?: ProductStatus;

  /**
   * A comma separated list of tags that have been added to the product.
   */
  tags?: string[];

  /**
   * The theme template used when viewing the product in a store.
   */
  templateSuffix?: string;

  /**
   * The title of the product.
   */
  title?: string;

  /**
   * The name of the product's vendor.
   */
  vendor?: string;

  /**
   * List of new media to be added to the product.
   */
  media?: CreateMediaInput[];
}

export interface ProductVariantAppendMediaInput {
  /**
   * Specifies the media to append to the variant.
   */
  mediaIds: string[];
  /**
   * Specifies the variant to which media will be appended.
   */
  variantId: string;
}

export interface CollectionInput {
  /**
   * The description of the collection, in HTML format.
   */
  descriptionHtml?: string;

  /**
   * A unique human-friendly string for the collection. Automatically generated from the collection's title.
   */
  handle?: string;

  /**
   * Specifies the collection to update or create a new collection if absent. Required for updating a collection.
   */
  id?: string;

  /**
   * The image associated with the collection.
   */
  image?: ImageInput;

  /**
   * The metafields to associate with the collection.
   */
  metafields?: MetafieldInput[];

  /**
   * Initial list of collection products. Only valid with collectionCreate and without rules.
   */
  products?: string[];

  /**
   * Indicates whether a redirect is required after a new handle has been provided.
   * If true, then the old handle is redirected to the new one automatically.
   * @default false
   */
  redirectNewHandle?: boolean;

  /**
   * The rules used to assign products to the collection.
   */
  ruleSet?: CollectionRuleSetInput;

  /**
   * SEO information for the collection.
   */
  seo?: SEOInput;

  /**
   * The order in which the collection's products are sorted.
   */
  sortOrder?: CollectionSortOrder;

  /**
   * The theme template used when viewing the collection in a store.
   */
  templateSuffix?: string;

  /**
   * The title of the collection. Required for creating a new collection.
   */
  title?: string;
}

/**
 * The input fields for a rule set of the collection.
 */
export interface CollectionRuleSetInput {
  /**
   * Whether products must match any or all of the rules to be included in the collection.
   * If true, then products must match at least one of the rules to be included in the collection.
   * If false, then products must match all of the rules to be included in the collection.
   */
  appliedDisjunctively: boolean;

  /**
   * The rules used to assign products to the collection.
   */
  rules?: CollectionRuleInput[];
}

export interface CollectionRuleInput {
  /**
   * The attribute that the rule focuses on. For example, `title` or `product_type`.
   */
  column: CollectionRuleColumn;

  /**
   * The value that the operator is applied to. For example, `Hats`.
   */
  condition: string;

  /**
   * The object ID that points to additional attributes for the collection rule.
   * This is only required when using metafield definition rules.
   */
  conditionObjectId?: string;

  /**
   * The type of operator that the rule is based on. For example, `equals`, `contains`, or `not_equals`.
   */
  relation: CollectionRuleRelation;
}

export interface SEOInput {
  /**
   * SEO description of the product.
   */
  description?: string;

  /**
   * SEO title of the product.
   */
  title?: string;
}

export interface BaseMetafieldInput {
  /**
   * The unique ID of the metafield. Required when updating.
   */
  id?: string;
  /**
   * The unique identifier for a metafield within its namespace. Required when creating.
   */
  key?: VariantMetadataKey;
  /**
   * The container for a group of metafields that the metafield is or will be associated with. Required when creating.
   */
  namespace?: VariantMetadataNamespace;
  /**
   * The type of data that is stored in the metafield. Required when creating.
   */
  type?: MetafieldType;
  /**
   * The data stored in the metafield. Always stored as a string.
   */
  value: string;
}

export type UpdateMetafieldInput = RequireFields<BaseMetafieldInput, "id">;
export type CreateMetafieldInput = RequireFields<
  BaseMetafieldInput,
  "key" | "namespace" | "type"
>;
export type MetafieldInput = UpdateMetafieldInput | CreateMetafieldInput;

export interface CartInputMetafieldInput {
  key: string;
  value: string;
  type: MetafieldType;
}

interface AttributeInput {
  key: string;
  value: string;
}

interface CartLineInput {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   * The input must not contain more than 250 values.
   */
  attributes?: AttributeInput[];
  /**
   * The ID of the merchandise that the buyer intends to purchase.
   */
  merchandiseId: string;
  /**
   * The quantity of the merchandise.
   * @default 1
   */
  quantity?: number;
  sellingPlanId?: string;
}

export interface CartInput {
  attributes?: AttributeInput[];
  buyerIdentity?: CartBuyerIdentityInput;
  discountCodes?: string[];
  lines?: CartLineInput[];
  metafields?: CartInputMetafieldInput[];
  note?: string;
}

interface CartBuyerIdentityInput {
  countryCode?: CountryCode;
  customerAccessToken?: string;
  deliveryAddressPreferences?: DeliveryAddressInput[];
  email?: string;
  phone?: string;
}

interface DeliveryAddressInput {
  customerAddressId?: string;
  deliveryAddress?: MailingAddressInput;
}

interface MailingAddressInput {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  zip?: string;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Cart Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Represents a cart in Shopify, containing merchandise that a buyer intends to purchase.
 */
export interface Cart {
  /**
   * A globally-unique ID for the cart.
   */
  id: string;

  /**
   * The URL for the cart's checkout.
   */
  checkoutUrl: string;

  /**
   * The date and time when the cart was created.
   */
  createdAt: string;

  /**
   * The date and time when the cart was last updated.
   */
  updatedAt: string;

  /**
   * The total number of items in the cart.
   */
  totalQuantity: number;

  /**
   * A note associated with the cart, such as special instructions from the buyer.
   */
  note?: string;

  /**
   * An attribute associated with the cart.
   */
  attribute?: Attribute;

  /**
   * Attributes associated with the cart, represented as key-value pairs.
   */
  attributes: Attribute[];

  /**
   * Information about the buyer interacting with the cart.
   */
  buyerIdentity: CartBuyerIdentity;

  /**
   * The estimated costs the buyer will pay at checkout.
   */
  cost: CartCost;

  /**
   * Discount codes applied to the cart.
   */
  discountCodes: CartDiscountCode[];

  /**
   * Discounts applied to the entire cart.
   */
  discountAllocations: CartDiscountAllocation[];
  /**
   * A list of lines containing information about the items the customer intends to purchase.
   */
  lines: Edges<Edge<BaseCartLine>>;
}

/**
 * The costs that the buyer will pay at checkout. The cart cost uses CartBuyerIdentity to determine international pricing.
 */
export type CartCost = Partial<{
  /**
   * The estimated amount, before taxes and discounts, for the customer to pay at checkout. The checkout charge amount doesn't include any deferred payments that'll be paid at a later date. If the cart has no deferred payments, then the checkout charge amount is equivalent to subtotalAmount.
   */
  checkoutChargeAmount: Money;
  /**
   * The amount, before taxes and cart-level discounts, for the customer to pay.
   */
  subtotalAmount: Money;
  /**
   * Whether the subtotal amount is estimated.
   */
  subtotalAmountEstimated: boolean;
  /**
   * The total amount for the customer to pay.
   */
  totalAmount: Money;
  /**
   * Whether the total amount is estimated.
   */
  totalAmountEstimated: boolean;
  /**
   * The duty amount for the customer to pay at checkout.
   */
  totalDutyAmount: Money;
  /**
   * Whether the total duty amount is estimated.
   */
  totalDutyAmountEstimated: boolean;
  /**
   * The tax amount for the customer to pay at checkout.
   */
  totalTaxAmount: Money;
  /**
   * Whether the total tax amount is estimated.
   */
  totalTaxAmountEstimated: boolean;
}>;

/**
 * The cost of the merchandise line that the buyer will pay at checkout.
 */
export interface CartLineCost {
  /**
   * The amount of the merchandise line.
   */
  amountPerQuantity: Money;
  /**
   * The compare at amount of the merchandise line.
   */
  compareAtAmountPerQuantity?: Money;
  /**
   * The cost of the merchandise line before line-level discounts.
   */
  subtotalAmount: Money;
  /**
   * The total cost of the merchandise line.
   */
  totalAmount: Money;
}

/** The discount codes applied to the cart. */
export interface CartDiscountCode {
  /**
   * Whether the discount code is applicable to the cart's current contents.
   */
  applicable: boolean;
  /**
   * The code for the discount
   */
  code: string;
}

export interface CartDiscountAllocation {
  discountedAmount: Money;
}

export interface CartBuyerIdentity {
  countryCode?: CountryCode;
  customer?: Customer;
  deliveryAddressPreferences: MailingAddress[];
  email?: string;
  phone?: string;
}

/**
 * Represents a cart line common fields.
 */
export interface BaseCartLine {
  /**
   * An attribute associated with the cart line.
   */
  attribute?: Attribute;
  /**
   * The attributes associated with the cart line. Attributes are represented as key-value pairs.
   */
  attributes: Attribute[];
  /**
   * The cost of the merchandise that the buyer will pay for at checkout. The costs are subject to change and changes will be reflected at checkout.
   */
  cost: CartLineCost;
  /** A globally-unique ID. */
  id: string;
  /**
   * The merchandise that the buyer intends to purchase.
   */
  merchandise: ProductVariantNode;
  /**
   * The quantity of the merchandise that the customer intends to purchase.
   */
  quantity: number;
}

export interface CartTransform {
  /**
   * Whether a run failure will block cart and checkout operations.
   */
  blockOnFailure: boolean;
  /**
   * The ID for the Cart Transform function.
   */
  functionId: string;
  /**
   * A globally-unique ID.
   */
  id: string;
  /**
   * Returns a metafield by namespace and key that belongs to the resource.
   */
  metafield?: Metafield;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                               Customer Types                                 ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * Represents a customer account with the shop.
 */
export interface Customer {
  /**
   * A globally-unique ID for the customer.
   */
  id: string;

  /**
   * The customer's email address.
   */
  email?: string;

  /**
   * The customer's first name.
   */
  firstName?: string;

  /**
   * The customer's last name.
   */
  lastName?: string;

  /**
   * The customer's phone number.
   */
  phone?: string;

  /**
   * The date and time when the customer was created.
   */
  createdAt: string;

  /**
   * The date and time when the customer information was last updated.
   */
  updatedAt: string;

  /**
   * Indicates whether the customer has consented to receive marketing material via email.
   */
  acceptsMarketing: boolean;

  /**
   * The number of orders that the customer has made at the store in their lifetime.
   */
  numberOfOrders: number;

  /**
   * The customer's default address.
   */
  defaultAddress?: MailingAddress;

  /**
   * The customer's name, email or phone number.
   */
  displayName: string;

  /**
   * Tags that have been added to the customer.
   */
  tags: string[];
}

/**
 * Represents a mailing address for customers and shipping.
 */
export interface MailingAddress {
  /** The first line of the address. Typically the street address or PO Box number. */
  address1: string;

  /** The second line of the address. Typically the number of the apartment, suite, or unit. */
  address2?: string;

  /** The name of the city, district, village, or town. */
  city: string;

  /** The name of the customer's company or organization. */
  company?: string;

  /** The name of the country. */
  country: string;

  /**
   * The two-letter code for the country of the address.
   * For example, US.
   */
  countryCodeV2: CountryCode;

  /** The first name of the customer. */
  firstName?: string;

  /**
   * A formatted version of the address, customized by the provided arguments.
   * @param withName Whether to include the customer's name in the formatted address.
   * @param withCompany Whether to include the customer's company in the formatted address.
   */
  formatted(withName?: boolean, withCompany?: boolean): string[];

  /** A comma-separated list of the values for city, province, and country. */
  formattedArea: string;

  /** A globally-unique ID. */
  id: string;

  /** The last name of the customer. */
  lastName?: string;

  /** The latitude coordinate of the customer address. */
  latitude?: number;

  /** The longitude coordinate of the customer address. */
  longitude?: number;

  /** The full name of the customer, based on firstName and lastName. */
  name?: string;

  /**
   * A unique phone number for the customer.
   * Formatted using E.164 standard. For example, +16135551111.
   */
  phone?: string;

  /** The region of the address, such as the province, state, or district. */
  province?: string;

  /**
   * The alphanumeric code for the region.
   * For example, ON.
   */
  provinceCode?: string;

  /** The zip or postal code of the address. */
  zip?: string;
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

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 General Types                                ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export interface Attribute {
  /**
   * Key or name of the attribute.
   */
  key: string;
  /**
   * Value of the attribute.
   */
  value: string;
}
