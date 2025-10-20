import adminClient from "./adminClient";
import storefrontClient from "./storefrontClient";

/**
 * Deprecated: Shopify integration is being replaced by shop-api
 *
 * These helper functions ensure Shopify clients are initialized before use.
 * They will throw descriptive errors if the required environment variables are missing.
 */

export function ensureStorefrontClient() {
  if (!storefrontClient) {
    throw new Error(
      'Shopify storefront client not initialized. This feature is deprecated and requires ' +
      'LEMNISPACE_PRODUCTS_API_TOKEN and LEMNISPACE_STORE_DOMAIN environment variables.'
    );
  }
  return storefrontClient;
}

export function ensureAdminClient() {
  if (!adminClient) {
    throw new Error(
      'Shopify admin client not initialized. This feature is deprecated and requires ' +
      'LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN environment variable.'
    );
  }
  return adminClient;
}
