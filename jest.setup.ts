/**
 * Jest Setup File
 *
 * This file runs before all tests to set up the test environment.
 * It provides mock environment variables required by the application.
 */

// Set up environment variables for tests
process.env.TEXT_MOSAIC_API_URL = 'http://localhost:3001';
process.env.LEMNISPACE_MOCKUP_GEN_API_URL = 'https://api.printful.com';
process.env.LEMNISPACE_MOCKUP_GEN_KEY = 'test_printful_key';
process.env.LEMNISPACE_PRODUCTS_API_TOKEN = 'test_storefront_token';
process.env.LEMNISPACE_STORE_DOMAIN = 'http://test-store.myshopify.com';
process.env.LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN = 'test_admin_token';
process.env.LEMNISPACE_PRODUCTS_API_KEY = 'test_api_key';
process.env.LEMNISPACE_PRODUCTS_API_SECRET_KEY = 'test_secret_key';
process.env.LEMNISPACE_HOST_NAME = 'http://localhost:3000';
process.env.LEMNISPACE_SHOP_NAME = 'test-shop.myshopify.com';
process.env.SHOP_API_URL = 'http://localhost:8080';
process.env.SHOP_API_KEY = 'test_shop_api_key';
process.env.NODE_ENV = 'test';

// Mock jose package to avoid ESM issues
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  compactDecrypt: jest.fn(),
  compactEncrypt: jest.fn(),
}));

// Mock Shopify admin client to avoid "should not be used in browser" error
jest.mock('@/lib/shopify/adminClient', () => ({
  adminClient: {
    request: jest.fn(),
  },
}));

// Mock Shopify services to avoid client initialization issues
jest.mock('@/lib/shopify/services/ShopifyProductService', () => ({
  ShopifyProductService: {
    getProductPrice: jest.fn((price) => {
      if (typeof price === 'number' || typeof price === 'string') {
        return price;
      }
      return price?.amount || 0;
    }),
    getVariantByValues: jest.fn((product, options) => {
      // Find variant matching the options
      return product?.variants?.find((variant) => {
        return Object.entries(options).every(([key, value]) => {
          return variant.selectedOptions?.some(
            (opt) => opt.name === key && opt.value === value
          ) || variant[key] === value;
        });
      });
    }),
    getVariantById: jest.fn((product, variantId) => {
      return product?.variants?.find((v) => v.id === variantId);
    }),
    getProductVariantByCustomVariantId: jest.fn((product, customVariantId) => {
      return product?.variants?.find((v) => v.id === customVariantId);
    }),
    getPrice: jest.fn((variant, product) => {
      if (variant?.price) return variant.price;
      if (product?.priceRange?.minVariantPrice) return product.priceRange.minVariantPrice;
      return { amount: '0', currencyCode: 'USD' };
    }),
    getDimensionsFromVariant: jest.fn((variant) => {
      const size = variant?.Size;
      if (!size || typeof size !== 'string') return undefined;

      // Parse dimensions from size string (e.g., "18x24", "10"x18"", etc.)
      const cleaned = size.replace(/[^0-9.x×X]/gi, '').toLowerCase();
      const match = cleaned.match(/^(\d+\.?\d*)x(\d+\.?\d*)$/);

      if (!match) return undefined;

      const width = parseFloat(match[1]);
      const height = parseFloat(match[2]);

      if (isNaN(width) || isNaN(height)) return undefined;

      return { width, height };
    }),
  },
}));
