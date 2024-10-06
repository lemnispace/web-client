import { ProductMetadataKey } from "../constants";
import { Edge } from "./edge";
import { Image } from "./media";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Metafield Types                              ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * The possible types for a metafield or metafield definition.
 */
export type MetafieldType =
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

export type ProductMetafieldsByKey = {
  [K in ProductMetadataKey]?: Omit<ProductMetafield, "key">;
};

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Edge Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type ProductVariantMetafieldEdge = Edge<ProductVariantMetafield>;
export type ProductMetafieldEdge = Edge<ProductMetafield>;
