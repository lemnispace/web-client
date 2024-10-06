/*
 *  ╔══════════════════════════════════════════════════════════════════════════════╗
 *  ║                                 Cart Types                                   ║
 *  ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { Customer, MailingAddress } from "./customer";
import { Edge, Edges } from "./edge";
import { Attribute } from "./general";
import { Metafield } from "./metafields";
import { Money } from "./pricing";
import { ProductVariantNode } from "./product";
import { CountryCode } from "./shopifyCountryCodes";

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
