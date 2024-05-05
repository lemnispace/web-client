import { ApiVersion, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";

const shopifyConfig = (() => {
  const apiAccessToken = process.env.LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN;
  const storefrontApiAccessToken = process.env.LEMNISPACE_PRODUCTS_API_TOKEN;
  const apiKey = process.env.LEMNISPACE_PRODUCTS_API_KEY;
  const apiSecretKey = process.env.LEMNISPACE_PRODUCTS_API_SECRET_KEY;
  const storeDomain = process.env.LEMNISPACE_STORE_DOMAIN;
  const hostName = process.env.LEMNISPACE_HOST_NAME;
  const hostScheme = process.env.NODE_ENV === "development" ? "http" : "https";
  const shopName = process.env.LEMNISPACE_SHOP_NAME;
  if (!apiAccessToken) {
    throw new Error("no product access token found");
  }
  if (!storeDomain) {
    throw new Error("no product store domain found");
  }
  if (!apiKey) {
    throw new Error("no product api key found");
  }
  if (!apiSecretKey) {
    throw new Error("no product api secret key found");
  }
  if (!hostName) {
    throw new Error("no host name found");
  }
  if (!hostScheme) {
    throw new Error("no host scheme found");
  }
  if (!shopName) {
    throw new Error("no shop name found");
  }
  return {
    storeDomain,
    apiAccessToken,
    storefrontApiAccessToken,
    apiKey,
    apiSecretKey,
    hostName,
    hostScheme,
    shopName,
  } as const;
})();

const shopify = shopifyApi({
  apiKey: "APIKeyFromPartnersDashboard",
  apiSecretKey: "APISecretFromPartnersDashboard",
  scopes: [
    "write_product_listings",
    "read_product_listings",
    "write_products",
    "read_products",
  ],
  hostName: shopifyConfig.hostName,
  hostScheme: shopifyConfig.hostScheme,
  apiVersion: ApiVersion.April24,
  isEmbeddedApp: false,
  isCustomStoreApp: true,
  privateAppStorefrontAccessToken: shopifyConfig.storefrontApiAccessToken,
  // Mount the REST resources
  restResources,
  adminApiAccessToken: shopifyConfig.apiAccessToken,
});

const shopifyAdminSession = shopify.session.customAppSession(
  shopifyConfig.shopName
);

const adminClient = new shopify.clients.Graphql({
  session: shopifyAdminSession,
});

export default adminClient;
