import { env } from "@/utils/env";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";

const shopifyConfig = (() => {
  const apiAccessToken = env.LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN || '';
  const storefrontApiAccessToken = env.LEMNISPACE_PRODUCTS_API_TOKEN || '';
  const apiKey = env.LEMNISPACE_PRODUCTS_API_KEY || '';
  const apiSecretKey = env.LEMNISPACE_PRODUCTS_API_SECRET_KEY || '';
  const storeDomain = env.LEMNISPACE_STORE_DOMAIN || '';
  const hostName = env.LEMNISPACE_HOST_NAME || '';
  const hostScheme = env.LEMNISPACE_HOST_SCHEME;
  const shopName = env.LEMNISPACE_SHOP_NAME || '';

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

// Only initialize client if Shopify config is available (deprecated, for backward compatibility)
const shopify = shopifyConfig.apiAccessToken && shopifyConfig.hostName
  ? shopifyApi({
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
    })
  : null;

const shopifyAdminSession = shopify && shopifyConfig.shopName
  ? shopify.session.customAppSession(shopifyConfig.shopName)
  : null;

const adminClient = shopify && shopifyAdminSession
  ? new shopify.clients.Graphql({
      session: shopifyAdminSession,
    })
  : null;

export default adminClient;
