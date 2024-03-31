import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const shopifyConfig = (() => {
  const productApiToken = process.env.LEMNISPACE_PRODUCTS_API_TOKEN;
  const productDomain = process.env.LEMNISPACE_STORE_DOMAIN;
  if (!productApiToken) {
    throw new Error("no product access token found");
  }
  if (!productDomain) {
    throw new Error("no product store domain found");
  }
  return {
    product: {
      storeDomain: productDomain,
      publicAccessToken: productApiToken,
    },
  };
})();

export const productClient = createStorefrontApiClient({
  storeDomain: shopifyConfig.product.storeDomain,
  apiVersion: "2024-04",
  publicAccessToken: shopifyConfig.product.publicAccessToken,
});
