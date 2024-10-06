import { Customer, MailingAddress } from "./customer";
import { Attribute } from "./general";
import { Metafield } from "./metafields";
import { Order } from "./order";
import { MoneyBag, TaxLine } from "./pricing";
import { CountryCode } from "./shopifyCountryCodes";
import { CurrencyCode } from "./shopifyCurrencyCodes";

/**
 * An order that a merchant creates on behalf of a customer. Draft orders are useful for merchants that
 * need to do the following tasks:
 * - Create new orders for sales made by phone, in person, by chat, or elsewhere. When a merchant
 *   accepts payment for a draft order, an order is created
 * - Send invoices to customers to pay with a secure checkout link.
 * - Use custom items to represent additional costs or products that aren't displayed in a shop's
 *   inventory.
 * - Re-create orders manually from active sales channels.
 * - Sell products at discount or wholesale rates.
 * - Take pre-orders.
 * - Save an order as a draft and resume working on it later.
 *
 * For draft orders in multiple currencies `presentment_money` is the source of truth for what a
 * customer is going to be charged and `shop_money` is an estimate of what the merchant might
 * receive in their shop currency.
 *
 * Caution: Only use this data if it's required for your app's functionality. Shopify will restrict
 * access to scopes for apps that don't have a legitimate use for the associated data.
 */
export interface DraftOrder {
  /**
   * The custom order-level discount applied.
   */
  appliedDiscount?: DraftOrderAppliedDiscount;

  /**
   * The billing address of the customer.
   */
  billingAddress?: MailingAddress;

  /**
   * Whether the billing address matches the shipping address.
   */
  billingAddressMatchesShippingAddress: boolean;

  /**
   * The date and time when the draft order was converted to a new order, and had its status changed
   * to `Completed`.
   */
  completedAt?: string;

  /**
   * The date and time when the draft order was created in Shopify
   */
  createdAt: string;

  /**
   * The shop currency used for calculation
   */
  currencyCode: CurrencyCode;

  /**
   * The custom information added to the draft order on behalf of the customer
   */
  customAttributes: Attribute[];

  /**
   * The customer who will be sent an invoice
   */
  customer?: Customer;

  /**
   * A default cursor that returns the single next record, sorted ascending by ID.
   */
  defaultCursor: string;

  /**
   * The email address of the customer, which is used to send notifications.
   */
  email?: string;

  /**
   * Whether the merchant has added timeline comments to the draft order.
   */
  hasTimelineComment: boolean;

  /**
   * A globally-unique identifier
   */
  id: string;

  /**
   * The subject defined for the draft invoice email template.
   */
  invoiceEmailTemplateSubject: string;

  /**
   * The date and time when the invoice was last emailed to the customer
   */
  invoiceSentAt?: string;

  /**
   * The link to the checkout, which is sent to the customer in the invoice email
   */
  invoiceUrl?: string;

  /**
   * The ID of the corresponding resource in the REST Admin API
   */
  legacyResourceId: number;

  /**
   * A subtotal of the line items and corresponding discounts, excluding include shipping charges,
   * shipping discounts, taxes, or order discounts
   */
  lineItemsSubtotalPrice: MoneyBag;

  /**
   * The name of the selected market
   */
  marketName: string;

  /**
   * The selected country code that determines the pricing
   */
  marketRegionCountryCode: CountryCode;

  /**
   * Returns a metafield by namespace and key that belongs to the resource.
   */
  metafield?: Metafield;

  /**
   * The identifier for the draft order, which is unique within the store. For example, #D1223
   */
  name: string;

  /**
   * The text from an optional note attached to the draft order
   */
  note2?: string;

  /**
   * The order that was created from the draft order
   */
  order?: Order;

  /**
   * The associated payment terms for this draft order
   */
  paymentTerms?: unknown;

  /**
   * The assigned phone number.
   */
  phone?: string;

  /**
   * The purchase order number
   */
  poNumber?: string;

  /**
   * The payment currency used for calculation
   */
  presentmentCurrencyCode: CurrencyCode;

  /**
   * The purchasing entity
   */
  purchasingEntity?: unknown;

  /**
   * Whether the draft order is ready and can be completed. Draft orders might have asynchronous
   * operations that can take time to finish
   */
  ready: boolean;

  /**
   * The time after which inventory will automatically be restocked
   */
  reserveInventoryUntil?: string;

  /**
   * The shipping address of the customer
   */
  shippingAddress?: MailingAddress;

  /**
   * The line item containing the shipping information and costs
   */
  shippingLine?: unknown;

  /**
   * The status of the draft order
   */
  status: DraftOrderStatus;

  /**
   * The subtotal, of the line items and their discounts, excluding shipping charges, shipping
   * discounts, and taxes
   */
  subtotalPriceSet: MoneyBag;

  /**
   * The comma separated list of tags associated with the draft order. Updating `tags` overwrites any
   * existing tags that were previously added to the draft order. To add new tags without overwriting
   * existing tags, use the `tagsAdd` mutation
   */
  tags: string[];

  /**
   * Whether the draft order is tax exempt
   */
  taxExempt: boolean;

  /**
   * The list of taxes lines charged for each line item and shipping line
   */
  taxLines: TaxLine[];

  /**
   * Whether the line item prices include taxes
   */
  taxesIncluded: boolean;

  /**
   * Total discounts
   */
  totalDiscountsSet: MoneyBag;

  /**
   * Total price of line items
   */
  totalLineItemsPriceSet: MoneyBag;

  /**
   * The total price, includes taxes, shipping charges, and discounts
   */
  totalPriceSet: MoneyBag;

  /**
   * The total shipping price
   */
  totalShippingPriceSet: MoneyBag;

  /**
   * The total tax
   */
  totalTaxSet: MoneyBag;

  /**
   * The total weight in grams of the draft order
   */
  totalWeight: number;

  /**
   * The date and time when the draft order was last changed. The format is YYYY-MM-DD HH:mm:ss.
   * For example, 2016-02-05 17:04:01
   */
  updatedAt: string;

  /**
   * Whether the draft order will be visible to the customer on the self-serve portal
   */
  visibleToCustomer: boolean;
}

/**
 * The order-level discount applied to a draft order.
 */
interface DraftOrderAppliedDiscount {
  /**
   * The amount of money discounted, with values shown in both shop currency and presentment currency
   */
  amountSet: MoneyBag;

  /**
   * Description of the order-level discount.
   */
  description: string;

  /**
   * Name of the order-level discount
   */
  title?: string;

  /**
   * The order level discount amount. If `valueType` is "percentage", then `value` is the percentage
   * discount
   */
  value: number;

  /**
   * Type of the order-level discount
   */
  valueType: "FIXED_AMOUNT" | "PERCENTAGE";
}

/**
 * The valid statuses for a draft order.
 */
type DraftOrderStatus = "COMPLETED" | "INVOICE_SENT" | "OPEN";
