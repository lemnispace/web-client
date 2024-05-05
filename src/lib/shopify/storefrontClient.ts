import { ApiVersion } from "@shopify/shopify-api";
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

const storefrontClient = createStorefrontApiClient({
  storeDomain: shopifyConfig.product.storeDomain,
  apiVersion: ApiVersion.April24,
  publicAccessToken: shopifyConfig.product.publicAccessToken,
});

export default storefrontClient;
