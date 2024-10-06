import {
  VariantMetadataKey,
  VariantMetadataNamespace,
} from "@/utils/constants";
import { RequireFields } from "@/utils/genericTypes";
import {
  CollectionRuleColumn,
  CollectionRuleRelation,
  CollectionSortOrder,
} from "./collection";
import { FileContentType, MediaContentType } from "./media";
import { MetafieldType } from "./metafields";
import { Money } from "./pricing";
import { ProductStatus } from "./product";
import { CountryCode } from "./shopifyCountryCodes";
import { CurrencyCode } from "./shopifyCurrencyCodes";
import { StagedUploadTargetGenerateUploadResource } from "./stagedUpload";

/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Media Types                                  ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export type FileCreateInputDuplicateResolutionMode =
  | "APPEND_UUID"
  | "RAISE_ERROR"
  | "REPLACE";

export interface FileCreateInput {
  alt?: null | string;
  contentType?: null | FileContentType;
  duplicateResolutionMode?: null | FileCreateInputDuplicateResolutionMode;
  filename?: null | string;
  originalSource: string;
}

export interface ImageInput {
  altText?: null | string;
  id?: null | string;
  src?: null | string;
}

export interface CreateMediaInput {
  /**
   * The alt text associated with the media.
   */
  alt?: null | string;
  /**
   * The media content type.
   */
  mediaContentType: MediaContentType;
  /**
   * The original source of the media object. This might be an external URL or a staged upload URL.
   */
  originalSource: string;
}

/*
 *  ╔═══════════════════════════════════════════════════════════════════════╗
 *  ║                          Staged Upload Types                          ║
 *  ╚═══════════════════════════════════════════════════════════════════════╝
 */

export interface StagedUploadInput {
  /**
   * The size of the file to upload, in bytes.
   * This is required when the request's resource property is set to `VIDEO` or `MODEL_3D`
   */
  fileSize?: null | number;
  filename: string;
  /**
   * The HTTP method to be used when sending a request to upload the file using the returned staged upload target.
   * Possible values are POST and PUT.
   * @default POST
   * */
  httpMethod?: null | "POST" | "PUT";
  /**
   * The file's MIME type.
   * */
  mimeType: string;
  resource: StagedUploadTargetGenerateUploadResource;
}

/*
 *  ╔═════════════════════════════════════════════════════════════════════════════════╗
 *  ║                                  Product Types                                  ║
 *  ╚═════════════════════════════════════════════════════════════════════════════════╝
 */

export interface ProductVariantInput {
  id?: null | string;
  mediaId?: null | string;
  mediaSrc?: null | string[];
  metafields?: null | MetafieldInput[];
  options?: null | string[];
  position?: null | number;
  productId?: null | string;
}

export interface ProductVariantsBulkInput {
  barcode?: null | string;
  compareAtPrice?: null | string;
  id: string;
  inventoryPolicy?: null | "CONTINUE" | "DENY";
  metafields?: null | MetafieldInput[];
  mediaSrc?: null | string[];
  mediaId?: null | string;
  price?: null | Money;
  taxCode?: null | string;
  taxable?: null | boolean;
}

export interface ProductUpdateInput {
  /**
   * The IDs of the collections that this product will be added to.
   */
  collectionsToJoin?: null | string[];

  /**
   * The IDs of collections that will no longer include the existing product.
   */
  collectionsToLeave?: null | string[];

  /**
   * The custom product type specified by the merchant.
   */
  customProductType?: null | string;

  /**
   * The description of the product, complete with HTML formatting.
   */
  descriptionHtml?: null | string;

  /**
   * Whether the product is a gift card.
   */
  giftCard?: null | boolean;

  /**
   * The theme template used when viewing the gift card in a store.
   */
  giftCardTemplateSuffix?: null | string;

  /**
   * A unique, human-friendly string for the product. Automatically generated from the product's title unless otherwise specified.
   */
  handle?: null | string;

  /**
   * Specifies the product to update in productUpdate or creates a new product if absent in productCreate.
   */
  id?: null | string;

  /**
   * The metafields to associate with this product.
   */
  metafields?: null | MetafieldInput[];

  /**
   * The product type specified by the merchant.
   */
  productType?: null | string;

  /**
   * Whether a redirect is required after a new handle has been provided. If true, then the old handle is redirected to the new one automatically.
   */
  redirectNewHandle?: null | boolean;

  /**
   * Whether the product can only be purchased with a selling plan (subscription).
   * Products that are sold exclusively on subscription can only be created on online stores.
   * If set to true on an already existing product, then the product will be marked unavailable on channels that don't support subscriptions.
   */
  requiresSellingPlan?: null | boolean;

  /**
   * The SEO information associated with the product.
   */
  seo?: null | SEOInput;

  /**
   * The status of the product.
   */
  status?: null | ProductStatus;

  /**
   * A comma separated list of tags that have been added to the product.
   */
  tags?: null | string[];

  /**
   * The theme template used when viewing the product in a store.
   */
  templateSuffix?: null | string;

  /**
   * The title of the product.
   */
  title?: null | string;

  /**
   * The name of the product's vendor.
   */
  vendor?: null | string;

  /**
   * List of new media to be added to the product.
   */
  media?: null | CreateMediaInput[];
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

/*
 *  ╔════════════════════════════════════════════════════════════════════════════╗
 *  ║                              Collection Types                              ║
 *  ╚════════════════════════════════════════════════════════════════════════════╝
 */

export interface CollectionInput {
  /**
   * The description of the collection, in HTML format.
   */
  descriptionHtml?: null | string;

  /**
   * A unique human-friendly string for the collection. Automatically generated from the collection's title.
   */
  handle?: null | string;

  /**
   * Specifies the collection to update or create a new collection if absent. Required for updating a collection.
   */
  id?: null | string;

  /**
   * The image associated with the collection.
   */
  image?: null | ImageInput;

  /**
   * The metafields to associate with the collection.
   */
  metafields?: null | MetafieldInput[];

  /**
   * Initial list of collection products. Only valid with collectionCreate and without rules.
   */
  products?: null | string[];

  /**
   * Indicates whether a redirect is required after a new handle has been provided.
   * If true, then the old handle is redirected to the new one automatically.
   * @default false
   */
  redirectNewHandle?: null | boolean;

  /**
   * The rules used to assign products to the collection.
   */
  ruleSet?: null | CollectionRuleSetInput;

  /**
   * SEO information for the collection.
   */
  seo?: null | SEOInput;

  /**
   * The order in which the collection's products are sorted.
   */
  sortOrder?: null | CollectionSortOrder;

  /**
   * The theme template used when viewing the collection in a store.
   */
  templateSuffix?: null | string;

  /**
   * The title of the collection. Required for creating a new collection.
   */
  title?: null | string;
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
  rules?: null | CollectionRuleInput[];
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
  conditionObjectId?: null | string;

  /**
   * The type of operator that the rule is based on. For example, `equals`, `contains`, or `not_equals`.
   */
  relation: CollectionRuleRelation;
}

/*
 *  ╔═════════════════════════════════════════════════════════════════════╗
 *  ║                              SEO Types                              ║
 *  ╚═════════════════════════════════════════════════════════════════════╝
 */

export interface SEOInput {
  /**
   * SEO description of the product.
   */
  description?: null | string;

  /**
   * SEO title of the product.
   */
  title?: null | string;
}

/*
 *  ╔═══════════════════════════════════════════════════════════════════════════╗
 *  ║                              Metafield Types                              ║
 *  ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export interface BaseMetafieldInput {
  /**
   * The unique ID of the metafield. Required when updating.
   */
  id?: null | string;
  /**
   * The unique identifier for a metafield within its namespace. Required when creating.
   */
  key?: null | VariantMetadataKey;
  /**
   * The container for a group of metafields that the metafield is or will be associated with. Required when creating.
   */
  namespace?: null | VariantMetadataNamespace;
  /**
   * The type of data that is stored in the metafield. Required when creating.
   */
  type?: null | MetafieldType;
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

/*
 *  ╔══════════════════════════════════════════════════════════════════════╗
 *  ║                              Cart Types                              ║
 *  ╚══════════════════════════════════════════════════════════════════════╝
 */

export interface CartInputMetafieldInput {
  key: string;
  value: string;
  type: MetafieldType;
}

export interface AttributeInput {
  key: string;
  value: string;
}

export interface CartLineInput {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   * The input must not contain more than 250 values.
   */
  attributes?: null | AttributeInput[];
  /**
   * The ID of the merchandise that the buyer intends to purchase.
   */
  merchandiseId: string;
  /**
   * The quantity of the merchandise.
   * @default 1
   */
  quantity?: null | number;
  sellingPlanId?: null | string;
}

export interface CartLineUpdateInput {
  /**
   * An array of key-value pairs that contains additional information about the merchandise line.
   * The input must not contain more than 250 values.
   */
  attributes?: null | AttributeInput[];
  /**
   * The ID of the merchandise line.
   */
  id: string;
  /**
   * The ID of the merchandise for the line item.
   */
  merchandiseId?: null | string;
  /**
   * The quantity of the merchandise.
   */
  quantity?: null | number;

  /**
   * The ID of the selling plan that the merchandise is being purchased with.
   */
  sellingPlanId?: null | string;
}

export interface CartInput {
  attributes?: null | AttributeInput[];
  buyerIdentity?: null | CartBuyerIdentityInput;
  discountCodes?: null | string[];
  lines?: null | CartLineInput[];
  metafields?: null | CartInputMetafieldInput[];
  note?: null | string;
}

export interface CartBuyerIdentityInput {
  countryCode?: null | CountryCode;
  customerAccessToken?: null | string;
  deliveryAddressPreferences?: null | DeliveryAddressInput[];
  email?: null | string;
  phone?: null | string;
}

/*
 *  ╔══════════════════════════════════════════════════════════════════════════╗
 *  ║                              Customer Types                              ║
 *  ╚══════════════════════════════════════════════════════════════════════════╝
 */

export interface DeliveryAddressInput {
  customerAddressId?: null | string;
  deliveryAddress?: null | MailingAddressInput;
}

export interface MailingAddressInput {
  address1?: null | string;
  address2?: null | string;
  city?: null | string;
  company?: null | string;
  country?: null | string;
  firstName?: null | string;
  lastName?: null | string;
  phone?: null | string;
  province?: null | string;
  zip?: null | string;
}

/*
 *  ╔════════════════════════════════════════════════════════════════════════════╗
 *  ║                             Draft Order Types                              ║
 *  ╚════════════════════════════════════════════════════════════════════════════╝
 */

/**
 * The input fields used to create or update a draft order.
 */
export interface DraftOrderInput {
  /**
   * The discount that will be applied to the draft order. A draft order line item can have one discount.
   * A draft order can also have one order-level discount.
   */
  appliedDiscount?: null | DraftOrderAppliedDiscountInput;

  /**
   * The mailing address associated with the payment method.
   */
  billingAddress?: null | MailingAddressInput;

  /**
   * The extra information added to the customer.
   */
  customAttributes?: null | AttributeInput[];

  /**
   * The customer's email address.
   */
  email?: null | string;

  /**
   * The list of product variant or custom line item. Each draft order must include at least one line item.
   * NOTE: Draft orders don't currently support subscriptions.
   */
  lineItems?: null | DraftOrderLineItemInput[];

  /**
   * The localization extensions attached to the draft order. For example, Tax IDs.
   */
  localizationExtensions?: null | LocalizationExtensionInput[];

  /**
   * The selected country code that determines the pricing of the draft order.
   */
  marketRegionCountryCode?: null | CountryCode;

  /**
   * The list of metafields attached to the draft order. An existing metafield can not be used when
   * creating a draft order.
   */
  metafields?: null | MetafieldInput[];

  /**
   * The text of an optional note that a shop owner can attach to the draft order.
   */
  note?: null | string;

  /**
   * The fields used to create payment terms.
   */
  paymentTerms?: null | PaymentTermsInput;

  /**
   * The customer's phone number.
   */
  phone?: null | string;

  /**
   * The purchase order number.
   */
  poNumber?: null | string;

  /**
   * The payment currency of the customer for this draft order.
   */
  presentmentCurrencyCode?: null | CurrencyCode;

  /**
   * The purchasing entity for the draft order.
   */
  purchasingEntity?: null | PurchasingEntityInput;

  /**
   * The time after which inventory reservation will expire.
   */
  reserveInventoryUntil?: null | string;

  /**
   * The mailing address to where the order will be shipped.
   */
  shippingAddress?: null | MailingAddressInput;

  /**
   * The shipping line object, which details the shipping method used.
   */
  shippingLine?: null | ShippingLineInput;

  /**
   * The source of the checkout. To use this field for sales attribution, you must register the
   * channels that your app is managing.
   */
  sourceName?: null | string;

  /**
   * A comma separated list of tags that have been added to the draft order.
   */
  tags?: null | string[];

  /**
   * Whether or not taxes are exempt for the draft order. If false, then Shopify will refer to the
   * taxable field for each line item. If a customer is applied to the draft order, then Shopify
   * will use the customer's tax exempt field instead.
   */
  taxExempt?: null | boolean;

  /**
   * Whether to use the customer's default address.
   */
  useCustomerDefaultAddress?: null | boolean;

  /**
   * Whether the draft order will be visible to the customer on the self-serve portal.
   */
  visibleToCustomer?: null | boolean;

  // Deprecated fields: customerId, privateMetafields
}

/**
 * The input fields for a line item included in a draft order.
 */
export interface DraftOrderLineItemInput {
  /**
   * The custom discount to be applied.
   */
  appliedDiscount?: null | DraftOrderAppliedDiscountInput;

  /**
   * A generic custom attribute using a key value pair.
   */
  customAttributes?: null | AttributeInput[];

  /**
   * The line item quantity. (Required)
   */
  quantity: number;

  /**
   * Whether physical shipping is required for a custom line item. This field is ignored when `variantId`
   * is provided.
   */
  requiresShipping?: null | boolean;

  /**
   * The SKU number for custom line items only. This field is ignored when `variantId` is provided.
   */
  sku?: null | string;

  /**
   * Whether the custom line item is taxable. This field is ignored when `variantId` is provided.
   */
  taxable?: null | boolean;

  /**
   * Title of the line item. This field is ignored when `variantId` is provided.
   */
  title?: null | string;

  /**
   * The ID of the product variant corresponding to the line item. Must be null for custom line items,
   * otherwise required.
   */
  variantId?: null | string | null;

  /**
   * The weight unit and value inputs for custom line items only. This field is ignored when `variantId`
   * is provided.
   */
  weight?: null | WeightInput;
}

/**
 * The input fields for applying an order-level discount to a draft order.
 */
export interface DraftOrderAppliedDiscountInput {
  /**
   * Reason for the discount.
   */
  description?: null | string;

  /**
   * Title of the discount.
   */
  title?: null | string;

  /**
   * The value of the discount. If the type of the discount is fixed amount, then this is a fixed
   * amount in your shop currency. If the type is percentage, then this is the percentage. (Required)
   */
  value: number;

  /**
   * The type of discount. (Required)
   */
  valueType: "FIXED_AMOUNT" | "PERCENTAGE";
}

export interface WeightInput {
  /**
   * The unit of measurement for the weight.
   */
  unit: "GRAMS" | "KILOGRAMS" | "OUNCES" | "POUNDS";

  /**
   * The weight value.
   */
  value: number;
}

/**
 * The input fields for a purchasing entity. Can either be a customer or a purchasing company.
 */
export interface PurchasingEntityInput {
  /**
   * Represents a customer. Null if there's a purchasing company.
   */
  customerId?: null | string | null;

  /**
   * Represents a purchasing company. Null if there's a customer.
   */
  purchasingCompany?: null | PurchasingCompanyInput | null;
}

/**
 * Represents a purchasing company.
 */
export interface PurchasingCompanyInput {
  /**
   * ID of the company contact. (Required)
   */
  companyContactId: string;

  /**
   * ID of the company. (Required)
   */
  companyId: string;

  /**
   * ID of the company location. (Required)
   */
  companyLocationId: string;
}

/**
 * The input fields to create payment terms. Payment terms set the date that payment is due.
 */
export interface PaymentTermsInput {
  /**
   * Specifies the payment schedules for the payment terms.
   */
  paymentSchedules?: null | PaymentScheduleInput[];

  /**
   * Specifies the ID of the payment terms template. Payment terms templates provide preset
   * configurations to create common payment terms. Refer to the PaymentTermsTemplate object
   * for more details.
   */
  paymentTermsTemplateId?: null | string;
}

/**
 * Specifies the payment schedules for the payment terms.
 */
export interface PaymentScheduleInput {
  /**
   * Specifies the date and time when the payment schedule is due. This field must be provided for
   * fixed type payment terms.
   */
  dueAt?: null | string;

  /**
   * Specifies the date and time that the payment schedule was issued. This field must be provided
   * for net type payment terms.
   */
  issuedAt?: null | string;
}

/**
 * The input fields for a LocalizationExtensionInput.
 */
export interface LocalizationExtensionInput {
  /**
   * The key for the localization extension. (Required)
   */
  key: LocalizationExtensionKey;

  /**
   * The localization extension value. (Required)
   */
  value: string;
}

/**
 * The key for the localization extension.
 */
export enum LocalizationExtensionKey {
  SHIPPING_CREDENTIAL_BR = "SHIPPING_CREDENTIAL_BR",
  SHIPPING_CREDENTIAL_CN = "SHIPPING_CREDENTIAL_CN",
  SHIPPING_CREDENTIAL_KR = "SHIPPING_CREDENTIAL_KR",
  TAX_CREDENTIAL_BR = "TAX_CREDENTIAL_BR",
  TAX_CREDENTIAL_IT = "TAX_CREDENTIAL_IT",
  TAX_EMAIL_IT = "TAX_EMAIL_IT",
}

/**
 * The input fields for specifying the shipping details for the draft order.
 *
 * Note:
 * A custom shipping line includes a title and price with `shippingRateHandle` set to `null`.
 * A shipping line with a carrier-provided shipping rate (currently set via the Shopify admin)
 * includes the shipping rate handle.
 */
export interface ShippingLineInput {
  /**
   * A unique identifier for the shipping rate.
   */
  shippingRateHandle?: null | string | null;

  /**
   * Title of the shipping rate.
   */
  title?: null | string;
}
