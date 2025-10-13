/**
 * Commerce Layer - Main Export
 *
 * This module provides the default commerce provider and utilities
 * for switching between different e-commerce backends.
 */

import { ShopAPIProvider } from "./providers/shop-api";
import type { CommerceProvider } from "./provider";

// Re-export types
export type { CommerceProvider } from "./provider";
export type * from "./types";

/**
 * Commerce provider type
 */
export type ProviderType = "shop-api" | "shopify";

/**
 * Configuration for commerce providers
 */
interface ProviderConfig {
  type: ProviderType;
  config: {
    baseUrl: string;
    apiKey?: string;
  };
}

/**
 * Create a commerce provider instance
 */
export function createCommerceProvider(
  config: ProviderConfig
): CommerceProvider {
  switch (config.type) {
    case "shop-api":
      return new ShopAPIProvider(config.config);
    case "shopify":
      // Future: Implement Shopify provider if needed
      throw new Error("Shopify provider not implemented. Use shop-api.");
    default:
      throw new Error(`Unknown provider type: ${config.type}`);
  }
}

/**
 * Get the default commerce provider (shop-api)
 *
 * This uses environment variables to configure the provider.
 * Call this from API routes to get a configured provider instance.
 */
export function getDefaultProvider(): CommerceProvider {
  const { SHOP_API_URL, SHOP_API_KEY } = require("@/utils/env").env;

  return new ShopAPIProvider({
    baseUrl: SHOP_API_URL,
    apiKey: SHOP_API_KEY
  });
}

// Export provider implementations
export { ShopAPIProvider } from "./providers/shop-api";
