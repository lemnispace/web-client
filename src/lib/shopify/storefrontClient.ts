import { env } from "@/utils/env";
import { ApiVersion } from "@shopify/shopify-api";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const shopifyConfig = (() => {
  const productApiToken = env.LEMNISPACE_PRODUCTS_API_TOKEN;
  const productDomain = env.LEMNISPACE_STORE_DOMAIN;
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
