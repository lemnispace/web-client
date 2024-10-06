import { Price } from "@/lib/shopify/types/pricing";
import { CurrencyCode } from "@/lib/shopify/types/shopifyCurrencyCodes";
import DOMPurify from "isomorphic-dompurify";
import { getCurrencyCode, getProductPrice } from "./getters";

/**
 * Formats the price with the currency sign.
 *
 * @param price - The price to format, either as a number/string or a Price object.
 * @param currencyCode - The currency code (optional if price is a Price object).
 * @returns The formatted price.
 */
export function formatPrice(
  price: string | number | Price,
  currencyCode?: CurrencyCode
): string {
  const amount = typeof price === "number" ? price : getProductPrice(price);
  let currency = getCurrencyCode(price, currencyCode);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(Number(amount));
}

/**
 * Sanitizes the given HTML string using DOMPurify.
 *
 * @param html - The HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};

/**
 * Converts a string to kebab-case.
 *
 * @param str - The string to convert.
 * @returns The kebab-case string.
 */
export const toKebabCase = (str: string): string => {
  // Convert camelCase to kebab-case
  const kebabCase = str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

  // Replace spaces with hyphens
  const finalString = kebabCase.trim().replace(/\s+/g, "-");

  return finalString;
};
