import DOMPurify from "isomorphic-dompurify";

/**
 * Formats the price with the currency sign.
 *
 * @param price - The price to format.
 * @param currencyCode - The currency code.
 * @returns The formatted price.
 */
export const formatPrice = (price: string | number, currencyCode: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(price));
};

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
