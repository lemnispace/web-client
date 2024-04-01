import DOMPurify from "isomorphic-dompurify";

/**
 * A map of currency codes to their respective signs.
 */
const CURRENCY_CODE_SIGN_MAP = {
  USD: "$",
};

/**
 * Retrieves the currency sign for the given currency code.
 * @param currencyCode - The currency code.
 * @returns The currency sign if found, otherwise undefined.
 */
const getCurrencySign = (currencyCode: string) => {
  if (currencyCode in CURRENCY_CODE_SIGN_MAP) {
    return CURRENCY_CODE_SIGN_MAP[
      currencyCode as keyof typeof CURRENCY_CODE_SIGN_MAP
    ];
  }
};

/**
 * Formats the price with the currency sign.
 * @param price - The price to format.
 * @param currencyCode - The currency code.
 * @returns The formatted price.
 */
export const formatPrice = (price: string | number, currencyCode: string) => {
  const currencySign = getCurrencySign(currencyCode);
  if (!currencySign) {
    console.error("unexpected currencyCode", currencyCode);
    return `${price} ${currencyCode}`;
  }
  return `${currencySign}${price}`;
};

/**
 * Sanitizes the given HTML string using DOMPurify.
 * @param html - The HTML string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};
