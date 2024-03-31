import DOMPurify from "isomorphic-dompurify";

const CURRENCY_CODE_SIGN_MAP = {
  USD: "$",
};

const getCurrencySign = (currencyCode: string) => {
  if (currencyCode in CURRENCY_CODE_SIGN_MAP) {
    return CURRENCY_CODE_SIGN_MAP[
      currencyCode as keyof typeof CURRENCY_CODE_SIGN_MAP
    ];
  }
};

export const formatPrice = (price: string | number, currencyCode: string) => {
  const currencySign = getCurrencySign(currencyCode);
  if (!currencySign) {
    console.error("unexpected currencyCode", currencyCode);
    return `${price} ${currencyCode}`;
  }
  return `${currencySign}${price}`;
};

const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};

export default sanitizeHtml;
