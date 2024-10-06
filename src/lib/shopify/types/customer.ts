import { UTMParameters } from "./general";
import { MarketingEvent, MarketingTactic } from "./marketing";
import { CountryCode } from "./shopifyCountryCodes";

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

/**
 * Represents a customer's session visiting a shop's online store, including information about the
 * marketing activity attributed to starting the session.
 */
export interface CustomerVisit {
  /**
   * A globally-unique identifier.
   */
  id: string;

  /**
   * URL of the first page the customer landed on for the session.
   *
   */
  landingPage?: string;

  /**
   * Landing page information with URL linked in HTML. For example, the first page the customer visited
   * was store.myshopify.com/products/1
   *
   */
  landingPageHtml?: string;

  /**
   * Represents actions taken by an app, on behalf of a merchant, to market Shopify resources such as
   * products, collections, and discounts.
   */
  marketingEvent?: MarketingEvent;

  /**
   * The date and time when the customer's session occurred.
   */
  occurredAt: string;

  /**
   * Marketing referral code from the link that the customer clicked to visit the store. Supports the
   * following URL attributes: ref, source, or r. For example, if the URL is
   * myshopifystore.com/products/slide?ref=j2tj1tn2, then this value is j2tj1tn2.
   */
  referralCode?: string;

  /**
   * Referral information with URLs linked in HTML.
   *
   */
  referralInfoHtml: string;

  /**
   * Webpage where the customer clicked a link that sent them to the online store. For example,
   * https://randomblog.com/page1 or android-app://com.google.android.gm
   *
   */
  referrerUrl?: string;

  /**
   * Source from which the customer visited the store, such as a platform (Facebook, Google), email,
   * direct, a website domain, QR code, or unknown.
   */
  source: string;

  /**
   * Describes the source explicitly for the first or last session.
   */
  sourceDescription?: string;

  /**
   * Type of marketing tactic
   */
  sourceType?: MarketingTactic;

  /**
   * A set of UTM parameters gathered from the URL parameters of the referrer
   *
   */
  utmParameters?: UTMParameters;
}

/**
 * Represents a customer's visiting activities on a shop's online store.
 */
export interface CustomerJourneySummary {
  /**
   * The position of the current order within the customer's order history. Test orders aren't included.
   */
  customerOrderIndex?: number;

  /**
   * The number of days between the first session and the order creation date. The first session
   * represents the first session since the last order, or the first session within the 30 day
   * attribution window, if more than 30 days have passed since the last order.
   */
  daysToConversion?: number;

  /**
   * The customer's first session going into the shop.
   */
  firstVisit?: CustomerVisit;

  /**
   * The last session before an order is made.
   */
  lastVisit?: CustomerVisit;

  /**
   * The total number of customer moments associated with this order. Returns null if the order is still
   * in the process of being attributed.
   */
  momentsCount?: number | null;

  /**
   * Whether the attributed sessions for the order have been created yet.
   */
  ready: boolean;
}

/**
 * Represents a session preceding an order, often used for building a timeline of events leading to an order.
 */
export interface CustomerMoment {
  /**
   * The date and time when the customer's session occurred.
   */
  occurredAt: string;
}

/**
 * The address at which the fulfillment occurred. This object is intended for tax purposes, as a full
 * address is required for tax providers to accurately calculate taxes. Typically this is the address
 * of the warehouse or fulfillment center. To retrieve a fulfillment location's address, use the
 * `assignedLocation` field on the `FulfillmentOrder` object instead.
 */
export interface FulfillmentOriginAddress {
  /**
   * The street address of the fulfillment location.
   */
  address1?: string;

  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   */
  address2?: string;

  /**
   * The city in which the fulfillment location is located.
   */
  city?: string;

  /**
   * The country code of the fulfillment location
   */
  countryCode: string;

  /**
   * The province code of the fulfillment location.
   */
  provinceCode?: string;

  /**
   * The zip code of the fulfillment location.
   */
  zip?: string;
}
