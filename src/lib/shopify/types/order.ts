import {
  Customer,
  CustomerJourneySummary,
  FulfillmentOriginAddress,
  MailingAddress,
} from "./customer";
import { Attribute } from "./general";
import { Image } from "./media";
import { Metafield, MetafieldDefinition } from "./metafields";
import { MoneyBag, TaxLine } from "./pricing";
import { CurrencyCode } from "./shopifyCurrencyCodes";

/**
 * Represents an order in the Shopify system.
 * An order is a customer's request to purchase one or more products from a shop.
 */
export interface Order {
  /** A list of additional fees applied to the order. */
  additionalFees: AdditionalFee[];

  /** A list of messages that appear on the order page in the Shopify admin. */
  alerts: ResourceAlert[];

  /** The application that created the order. */
  app?: OrderApp;

  /** The billing address of the customer. */
  billingAddress?: MailingAddress;

  /** Whether the billing address matches the shipping address. */
  billingAddressMatchesShippingAddress: boolean;

  /** Whether the order can be manually marked as paid. */
  canMarkAsPaid: boolean;

  /** Whether a customer email exists for the order. */
  canNotifyCustomer: boolean;

  /** The reason provided when the order was canceled. Returns null if the order wasn't canceled. */
  cancelReason?: OrderCancelReason;

  /** Cancellation details for the order. */
  cancellation?: OrderCancellation;

  /** The date and time when the order was canceled. Returns null if the order wasn't canceled. */
  cancelledAt?: Date;

  /** Whether payment for the order can be captured. */
  capturable: boolean;

  /** The total order-level discount amount, before returns, in shop and presentment currencies. */
  cartDiscountAmountSet?: MoneyBag;

  /** Details about the channel that created the order. */
  channelInformation?: ChannelInformation;

  /** The IP address of the API client that created the order. */
  clientIp?: string;

  /** Whether the order is closed. */
  closed: boolean;

  /** The date and time when the order was closed. Returns null if the order isn't closed. */
  closedAt?: Date;

  /** A randomly generated alpha-numeric identifier for the order that may be shown to the customer instead of the sequential order name. */
  confirmationNumber?: string;

  /** Whether inventory has been reserved for the order. */
  confirmed: boolean;

  /** Date and time when the order was created in Shopify. */
  createdAt: Date;

  /** The shop currency when the order was placed. */
  currencyCode: CurrencyCode;

  /** The current order-level discount amount after all order updates, in shop and presentment currencies. */
  currentCartDiscountAmountSet: MoneyBag;

  /** The sum of the quantities for all line items that contribute to the order's current subtotal price. */
  currentSubtotalLineItemsQuantity: number;

  /** The sum of the prices for all line items after discounts and returns, in shop and presentment currencies. */
  currentSubtotalPriceSet: MoneyBag;

  /** A list of all tax lines applied to line items on the order, after returns. */
  currentTaxLines: TaxLine[];

  /** The total amount of additional fees after returns, in shop and presentment currencies. */
  currentTotalAdditionalFeesSet?: MoneyBag;

  /** The total amount discounted on the order after returns, in shop and presentment currencies. */
  currentTotalDiscountsSet: MoneyBag;

  /** The total amount of duties after returns, in shop and presentment currencies. */
  currentTotalDutiesSet?: MoneyBag;

  /** The total price of the order, after returns, in shop and presentment currencies. */
  currentTotalPriceSet: MoneyBag;

  /** The sum of the prices of all tax lines applied to line items on the order, after returns, in shop and presentment currencies. */
  currentTotalTaxSet: MoneyBag;

  /** The total weight of the order after returns, in grams. */
  currentTotalWeight: number;

  /** A list of additional merchant-facing details that have been added to the order. */
  customAttributes: Attribute[];

  /** The customer that placed the order. */
  customer?: Customer;

  /** Whether the customer agreed to receive marketing materials. */
  customerAcceptsMarketing: boolean;

  /** The customer's visits and interactions with the online store before placing the order. */
  customerJourneySummary?: CustomerJourneySummary;

  /** A two-letter or three-letter language code, optionally followed by a region modifier. */
  customerLocale?: string;

  /** The discount code used for the order. */
  discountCode?: string;

  /** The discount codes used for the order. */
  discountCodes: string[];

  /** The primary address of the customer. Returns null if neither the shipping address nor the billing address was provided. */
  displayAddress?: MailingAddress;

  /** The financial status of the order that can be shown to the merchant. */
  displayFinancialStatus?: OrderDisplayFinancialStatus;

  /** The fulfillment status for the order that can be shown to the merchant. */
  displayFulfillmentStatus: OrderDisplayFulfillmentStatus;

  /** A list of the disputes associated with the order. */
  disputes: OrderDisputeSummary[];

  /** Whether the order has had any edits applied. */
  edited: boolean;

  /** The email address associated with the customer. */
  email?: string;

  /** Whether taxes on the order are estimated. */
  estimatedTaxes: boolean;

  /** Whether there are line items that can be fulfilled. */
  fulfillable: boolean;

  /** List of shipments for the order. */
  fulfillments: Fulfillment[];

  /** Whether the order has been paid in full. */
  fullyPaid: boolean;

  /** Whether the merchant added a timeline comment to the order. */
  hasTimelineComment: boolean;

  /** A globally-unique ID. */
  id: string;

  /** The ID of the corresponding resource in the REST Admin API. */
  legacyResourceId: number;

  /** Whether the order can be edited by the merchant. */
  merchantEditable: boolean;

  /** A list of reasons why the order can't be edited. */
  merchantEditableErrors: string[];

  /** The application acting as the Merchant of Record for the order. */
  merchantOfRecordApp?: OrderApp;

  /** Returns a metafield by namespace and key that belongs to the resource. */
  metafield?: Metafield;

  /** The unique identifier for the order that appears on the order page in the Shopify admin and the Order status page. */
  name: string;

  /** The net payment for the order, based on the total amount received minus the total amount refunded, in shop and presentment currencies. */
  netPaymentSet: MoneyBag;

  /** The contents of the note associated with the order. */
  note?: string;

  /** The total amount of additional fees after returns, in shop and presentment currencies. */
  originalTotalAdditionalFeesSet?: MoneyBag;

  /** The total amount of duties before returns, in shop and presentment currencies. */
  originalTotalDutiesSet?: MoneyBag;

  /** The total price of the order at the time of order creation, in shop and presentment currencies. */
  originalTotalPriceSet: MoneyBag;

  /** The payment collection details for the order. */
  paymentCollectionDetails: unknown;

  /** A list of the names of all payment gateways used for the order. */
  paymentGatewayNames: string[];

  /** The payment terms associated with the order. */
  paymentTerms?: unknown;

  /** The phone number associated with the customer. */
  phone?: string;

  /** The PO number associated with the order. */
  poNumber?: string;

  /** The payment CurrencyCode of the customer for the order. */
  presentmentCurrencyCode: CurrencyCode;

  /** The date and time when the order was processed. */
  processedAt: Date;

  /** The publication that the order was created from. */
  publication?: unknown;

  /** The purchasing entity for the order. */
  purchasingEntity?: unknown;

  /** The difference between the suggested and actual refund amount of all refunds that have been applied to the order. */
  refundDiscrepancySet: MoneyBag;

  /** Whether the order can be refunded. */
  refundable: boolean;

  /** A list of refunds that have been applied to the order. */
  refunds: unknown[];

  /** The URL of the source that the order originated from, if found in the domain registry. */
  registeredSourceUrl?: string;

  /** Whether the order has shipping lines or at least one line item on the order that requires shipping. */
  requiresShipping: boolean;

  /** Whether any line item on the order can be restocked. */
  restockable: boolean;

  /** The order's aggregated return status for display purposes. */
  returnStatus: unknown;

  /** The mailing address of the customer. */
  shippingAddress?: MailingAddress;

  /** A summary of all shipping costs on the order. */
  shippingLine?: unknown;

  /** The Shopify Protect details for the order. If Shopify Protect is disabled for the shop, then this will be null. */
  shopifyProtect?: unknown;

  /** A unique POS or third party order identifier. */
  sourceIdentifier?: string;

  /** The sum of the quantities for all line items that contribute to the order's subtotal price. */
  subtotalLineItemsQuantity: number;

  /** The sum of the prices for all line items after discounts and before returns, in shop and presentment currencies. */
  subtotalPriceSet?: MoneyBag;

  /** A suggested refund for the order. */
  suggestedRefund?: unknown;

  /** A comma separated list of tags associated with the order. */
  tags: string[];

  /** Whether taxes are exempt on the order. */
  taxExempt: boolean;

  /** A list of all tax lines applied to line items on the order, before returns. */
  taxLines: TaxLine[];

  /** Whether taxes are included in the subtotal price of the order. */
  taxesIncluded: boolean;

  /** Whether the order is a test. */
  test: boolean;

  /** The authorized amount that's uncaptured or undercaptured, in shop and presentment currencies. */
  totalCapturableSet: MoneyBag;

  /** The total amount discounted on the order before returns, in shop and presentment currencies. */
  totalDiscountsSet?: MoneyBag;

  /** The total amount not yet transacted for the order, in shop and presentment currencies. */
  totalOutstandingSet: MoneyBag;

  /** The total price of the order, before returns, in shop and presentment currencies. */
  totalPriceSet: MoneyBag;

  /** The total amount received from the customer before returns, in shop and presentment currencies. */
  totalReceivedSet: MoneyBag;

  /** The total amount that was refunded, in shop and presentment currencies. */
  totalRefundedSet: MoneyBag;

  /** The total amount of shipping that was refunded, in shop and presentment currencies. */
  totalRefundedShippingSet: MoneyBag;

  /** The total shipping amount before discounts and returns, in shop and presentment currencies. */
  totalShippingPriceSet: MoneyBag;

  /** The total tax amount before returns, in shop and presentment currencies. */
  totalTaxSet?: MoneyBag;

  /** The sum of all tip amounts for the order, in shop and presentment currencies. */
  totalTipReceivedSet: MoneyBag;

  /** The total weight of the order before returns, in grams. */
  totalWeight?: number;

  /** A list of transactions associated with the order. */
  transactions: unknown[];

  /** Whether no payments have been made for the order. */
  unpaid: boolean;

  /** The date and time when the order was modified last. */
  updatedAt: Date;

  // Connections
  /** A list of sales agreements associated with the order. */
  agreements: unknown[];

  /** A list of discounts that are applied to the order, not including order edits and refunds. */
  discountApplications: unknown[];

  /** A list of events associated with the order. */
  events: Event[];

  /** A list of fulfillment orders for a specific order. */
  fulfillmentOrders: unknown[];

  /** A list of the order's line items. */
  lineItems: unknown[];

  /** List of localization extensions for the resource. */
  localizationExtensions: unknown[];

  /** List of metafield definitions. */
  metafieldDefinitions: MetafieldDefinition[];

  /** List of metafields that belong to the resource. */
  metafields: Metafield[];

  /** A list of line items that can't be fulfilled. */
  nonFulfillableLineItems: unknown[];

  /** A list of returns for the order. */
  returns: unknown[];

  /** A list of the order's shipping lines. */
  shippingLines: unknown[];
}

/**
 * The application that created the order.
 */
interface OrderApp {
  /**
   * The application icon.
   */
  icon: Image;

  /**
   * The application ID.
   */
  id: string;

  /**
   * The name of the application.
   */
  name: string;
}

/**
 * Details about the order cancellation.
 */
interface OrderCancellation {
  /**
   * Staff provided note for the order cancellation.
   */
  staffNote?: string;
}

/**
 * The additional fees that have been applied to the order.
 */
interface AdditionalFee {
  /**
   * A globally-unique identifier
   */
  id: string;

  /**
   * The name of the additional fee.
   */
  name: string;

  /**
   * The price of the additional fee.
   */
  price: MoneyBag;

  /**
   * A list of taxes charged on the additional fee.
   */
  taxLines: TaxLine[];
}

/**
 * An alert message that appears in the Shopify admin about a problem with a store resource, with 1
 * or more actions to take. For example, you could use an alert to indicate that you're not charging
 * taxes on some product variants. They can optionally have a specific icon and be dismissed by merchants.
 */
interface ResourceAlert {
  /**
   * Buttons in the alert that link to related information. For example, 'Edit variants'.
   */
  actions: ResourceAlertAction[];

  /**
   * The secondary text in the alert that includes further information or instructions about how to
   * solve a problem.
   */
  content: string;

  /**
   * Unique identifier that appears when an alert is manually closed by the merchant. Most alerts
   * can't be manually closed.
   */
  dismissibleHandle?: string;

  /**
   * An icon that's optionally displayed with the alert.
   */
  icon?: "CHECKMARK_CIRCLE" | "INFORMATION_CIRCLE";

  /**
   * Indication of how important the alert is.
   */
  severity: ResourceAlertSeverity;

  /**
   * The primary text in the alert that includes information or describes the problem.
   */
  title: string;
}

/**
 * An action associated with a resource alert, such as editing variants
 */
interface ResourceAlertAction {
  /**
   * Whether the action appears as a button or as a link
   */
  primary: boolean;

  /**
   * Resource for the action to show.
   */
  show?: string;

  /**
   * The text for the button in the alert. For example, 'Edit variants'.
   */
  title: string;

  /**
   * The target URL that the button links to
   */
  url: string;
}

/**
 * The possible severity levels for a resource alert.
 */
type ResourceAlertSeverity =
  | "CRITICAL"
  | "DEFAULT"
  | "INFO"
  | "SUCCESS"
  | "WARNING";

/**
 * Represents the reason for the order's cancellation
 */
type OrderCancelReason =
  | "CUSTOMER"
  | "DECLINED"
  | "FRAUD"
  | "INVENTORY"
  | "OTHER"
  | "STAFF";

/**
 * Represents the order's aggregated fulfillment status for display purposes.
 * This field doesn't capture all the details of an order's fulfillment state.
 */
type OrderDisplayFulfillmentStatus =
  /**
   * Displayed as "Fulfilled".
   * All the items in the order have been fulfilled.
   */
  | "FULFILLED"
  /**
   * Displayed as "In progress".
   * Some of the items in the order have been fulfilled, or a request for fulfillment has been
   * sent to the fulfillment service.
   * Replaces the "PENDING_FULFILLMENT" status
   */
  | "IN_PROGRESS"
  /**
   * Displayed as "On hold".
   * All of the unfulfilled items in this order are on hold.
   */
  | "ON_HOLD"
  /**
   * Displayed as "Partially fulfilled".
   * Some of the items in the order have been fulfilled
   */
  | "PARTIALLY_FULFILLED"
  /**
   * Displayed as "Scheduled".
   * All of the unfulfilled items in this order are scheduled for fulfillment at a later time.
   */
  | "SCHEDULED"
  /**
   * Displayed as "Unfulfilled".
   * None of the items in the order have been fulfilled.
   * Replaces the "OPEN" and "RESTOCKED" statuses
   */
  | "UNFULFILLED";

/**
 * Represents the order's current financial status for display purposes.
 * This field doesn't capture all the details of an order's financial state.
 */
type OrderDisplayFinancialStatus =
  /** Displayed as "Authorized". */
  | "AUTHORIZED"
  /** Displayed as "Expired". */
  | "EXPIRED"
  /** Displayed as "Paid". */
  | "PAID"
  /** Displayed as "Partially paid". */
  | "PARTIALLY_PAID"
  /** Displayed as "Partially refunded". */
  | "PARTIALLY_REFUNDED"
  /** Displayed as "Pending". */
  | "PENDING"
  /** Displayed as "Refunded". */
  | "REFUNDED"
  /** Displayed as "Voided". */
  | "VOIDED";

type ChannelInformation = unknown; // TODO: Add type

/**
 * A summary of the important details for a dispute on an order
 */
interface OrderDisputeSummary {
  /**
   * A globally-unique identifier
   */
  id: string;

  /**
   * The type that the dispute was initiated as
   */
  initiatedAs: DisputeType;

  /**
   * The current status of the dispute
   */
  status: DisputeStatus;
}

/**
 * The type that the dispute was initiated as
 */
type DisputeType = "CHARGEBACK" | "INQUIRY";

/**
 * The current status of the dispute
 */
type DisputeStatus =
  | "ACCEPTED"
  | "LOST"
  | "NEEDS_RESPONSE"
  | "UNDER_REVIEW"
  | "WON"
  /** Status previously used by Stripe to indicate that a dispute led to a refund */
  | "CHARGE_REFUNDED";

/**
 * Represents a fulfillment. In Shopify, a fulfillment represents a shipment of one or more items
 * in an order. When an order has been completely fulfilled, it means that all the items that are
 * included in the order have been sent to the customer. There can be more than one fulfillment
 * for an order.
 */
interface Fulfillment {
  /**
   * The date and time when the fulfillment was created.
   */
  createdAt: string;

  /**
   * The date that this fulfillment was delivered.
   */
  deliveredAt?: string;

  /**
   * Human readable display status for this fulfillment.
   */
  displayStatus?: FulfillmentDisplayStatus;

  /**
   * The estimated date that this fulfillment will arrive.
   */
  estimatedDeliveryAt?: string;

  /**
   * A globally-unique identifier.
   */
  id: string;

  /**
   * The date and time when the fulfillment went into transit.
   */
  inTransitAt?: string;

  /**
   * The ID of the corresponding resource in the REST Admin API.
   */
  legacyResourceId: number;

  /**
   * The location that the fulfillment was processed at.
   */
  location?: unknown;

  /**
   * Human readable reference identifier for this fulfillment.
   */
  name: string;

  /**
   * The order for which the fulfillment was created.
   */
  order: Order;

  /**
   * The address at which the fulfillment occurred. This field is intended for tax purposes, as a full
   * address is required for tax providers to accurately calculate taxes. Typically this is the
   * address of the warehouse or fulfillment center. To retrieve a fulfillment location's address,
   * use the assignedLocation field on the FulfillmentOrder object instead.
   */
  originAddress?: FulfillmentOriginAddress;

  /**
   * Whether any of the line items in the fulfillment require shipping.
   */
  requiresShipping: boolean;

  /**
   * Fulfillment service associated with the fulfillment.
   */
  service?: FulfillmentService;
}

/**
 * Human readable display status for this fulfillment.
 */
type FulfillmentDisplayStatus =
  | "ATTEMPTED_DELIVERY"
  | "CANCELED"
  | "CONFIRMED"
  | "DELIVERED"
  | "FAILURE"
  | "FULFILLED"
  | "IN_TRANSIT"
  | "LABEL_PRINTED"
  | "LABEL_PURCHASED"
  | "LABEL_VOIDED"
  | "MARKED_AS_FULFILLED"
  | "NOT_DELIVERED"
  | "OUT_FOR_DELIVERY"
  | "PICKED_UP"
  | "READY_FOR_PICKUP"
  | "SUBMITTED";

/**
 * Fulfillment service associated with the fulfillment
 */
interface FulfillmentService {
  /**
   * The callback URL that the fulfillment service has registered for requests
   */
  callbackUrl?: string;

  /**
   * Human-readable unique identifier for this fulfillment service.
   */
  handle: string;

  /**
   * The ID of the fulfillment service.
   */
  id: string;

  /**
   * Whether the fulfillment service tracks product inventory and provides updates to Shopify
   */
  inventoryManagement: boolean;

  /**
   * Location associated with the fulfillment service.
   */
  location?: Location;

  /**
   * Whether the fulfillment service can stock inventory alongside other locations.
   */
  permitsSkuSharing: boolean;

  /**
   * The name of the fulfillment service as seen by merchants.
   */
  serviceName: string;

  /**
   * Type associated with the fulfillment service.
   */
  type: FulfillmentServiceType;
}

/**
 * Type associated with the fulfillment service
 */
type FulfillmentServiceType = "GIFT_CARD" | "MANUAL" | "THIRD_PARTY";
