import { CurrencyCode } from "./shopifyCurrencyCodes";

export interface Price {
  amount: string;
  currencyCode: CurrencyCode;
}

export interface Money {
  amount: number;
  currencyCode: CurrencyCode;
}

export interface ProductPriceRange {
  maxVariantPrice: Money;
  minVariantPrice: Money;
}

/**
 * A collection of monetary values in their respective currencies. Typically used in the context of
 * multi-currency pricing and transactions, when an amount in the shop's currency is converted to the
 * customer's currency of choice (the presentment currency).
 */
export interface MoneyBag {
  /**
   * Amount in presentment currency.
   */
  presentmentMoney: Money;

  /**
   * Amount in shop currency.
   */
  shopMoney: Money;
}

/**
 * Represents a single tax applied to the associated line item.
 */
export interface TaxLine {
  /**
   * Whether the channel that submitted the tax line is liable for remitting. A value of null indicates
   * unknown liability for this tax line.
   */
  channelLiable?: boolean | null;

  /**
   * The amount of tax, in shop and presentment currencies, after discounts and before returns.
   */
  priceSet: MoneyBag;

  /**
   * The proportion of the line item price that the tax represents as a decimal
   */
  rate?: number | null;

  /**
   * The proportion of the line item price that the tax represents as a percentage
   */
  ratePercentage?: number | null;

  /**
   * The name of the tax
   */
  title: string;
}
