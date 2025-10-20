/**
 * Integration Test Setup
 *
 * Sets up and tears down the shop-api services for integration testing.
 * Requires docker-compose to be available.
 */

import { execSync } from 'child_process';
import { ShopAPIProvider } from '../src/lib/commerce/providers/shop-api';

export const SHOP_API_BASE_URL = process.env.SHOP_API_URL || 'http://localhost:8080';
export const TEST_TIMEOUT = 120000; // 2 minutes for integration tests

/**
 * Check if shop-api is running and healthy
 */
export async function waitForShopAPI(maxRetries = 30, intervalMs = 2000): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${SHOP_API_BASE_URL}/health`);
      if (response.ok) {
        console.log('✓ shop-api is ready');
        return true;
      }
    } catch (error) {
      // Service not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return false;
}

/**
 * Start shop-api services via docker-compose
 */
export async function startShopAPI(): Promise<void> {
  console.log('Starting shop-api services...');

  try {
    // Navigate to shop-api directory and start services
    execSync('cd ../../shop-api && docker compose up -d', {
      stdio: 'inherit',
      cwd: __dirname,
    });

    console.log('Waiting for shop-api to be ready...');
    const ready = await waitForShopAPI();

    if (!ready) {
      throw new Error('shop-api failed to start within timeout period');
    }
  } catch (error) {
    console.error('Failed to start shop-api:', error);
    throw error;
  }
}

/**
 * Stop shop-api services
 */
export async function stopShopAPI(): Promise<void> {
  console.log('Stopping shop-api services...');

  try {
    execSync('cd ../../shop-api && docker compose down', {
      stdio: 'inherit',
      cwd: __dirname,
    });
    console.log('✓ shop-api services stopped');
  } catch (error) {
    console.error('Failed to stop shop-api:', error);
  }
}

/**
 * Create a test provider instance
 */
export function createTestProvider(): ShopAPIProvider {
  return new ShopAPIProvider({
    baseUrl: SHOP_API_BASE_URL,
  });
}

/**
 * Clean up test data from DynamoDB
 */
export async function cleanupTestData(_provider: ShopAPIProvider): Promise<void> {
  // For now, we'll rely on docker-compose down/up to reset data
  // In the future, we could add specific cleanup endpoints
  console.log('Test data cleanup (handled by docker-compose down)');
}

/**
 * Seed test data into shop-api
 */
export async function seedTestData(_provider: ShopAPIProvider): Promise<void> {
  console.log('Seeding test data...');

  // TODO: Add test products, collections, etc.
  // For now, we'll test with whatever is already in the database
  // or we can call the Printful sync endpoint

  console.log('✓ Test data seeded');
}
