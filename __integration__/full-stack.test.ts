/**
 * Full Stack Integration Tests
 *
 * Tests the complete flow from web-client → shop-api → DynamoDB → Printful
 * These tests require shop-api to be running (via docker-compose)
 *
 * Run with: npm run test:integration
 */

import { ShopAPIProvider } from '../src/lib/commerce/providers/shop-api';
import {
  SHOP_API_BASE_URL,
  TEST_TIMEOUT,
  createTestProvider,
} from './setup';

describe('Full Stack Integration Tests', () => {
  let provider: ShopAPIProvider;

  beforeAll(() => {
    provider = createTestProvider();
  }, TEST_TIMEOUT);

  describe('Health Check', () => {
    it('should verify shop-api is running', async () => {
      const response = await fetch(`${SHOP_API_BASE_URL}/health`);
      expect(response.ok).toBe(true);
    }, TEST_TIMEOUT);
  });

  describe('Product Browsing Flow', () => {
    it('should list products from shop-api', async () => {
      const result = await provider.getProducts({ limit: 10 });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      console.log(`✓ Retrieved ${result.data.length} products`);

      if (result.data.length > 0) {
        const product = result.data[0];
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('title');
        expect(product).toHaveProperty('price');
        console.log(`  Sample product: ${product.title} - $${product.price}`);
      }
    }, TEST_TIMEOUT);

    it('should get a single product by ID', async () => {
      // First get a list of products
      const listResult = await provider.getProducts({ limit: 1 });

      if (listResult.data.length === 0) {
        console.log('⚠ No products available, skipping single product test');
        return;
      }

      const productId = listResult.data[0].id;
      const product = await provider.getProduct(productId);

      expect(product).toBeDefined();
      expect(product.id).toBe(productId);
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('variants');
      console.log(`✓ Retrieved product: ${product.title}`);
      console.log(`  Variants: ${product.variants.length}`);
    }, TEST_TIMEOUT);

    it('should list collections', async () => {
      const result = await provider.getCollections({ limit: 10 });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      console.log(`✓ Retrieved ${result.data.length} collections`);

      if (result.data.length > 0) {
        const collection = result.data[0];
        expect(collection).toHaveProperty('id');
        expect(collection).toHaveProperty('title');
        console.log(`  Sample collection: ${collection.title}`);
      }
    }, TEST_TIMEOUT);
  });

  describe('Cart Operations Flow', () => {
    let cartId: string;
    let productId: string;
    let variantId: string;

    it('should create a new cart', async () => {
      const cart = await provider.createCart();

      expect(cart).toBeDefined();
      expect(cart).toHaveProperty('id');
      expect(cart.items).toEqual([]);
      expect(cart.subtotal).toBe(0);
      expect(cart.totalPrice).toBe(0);

      cartId = cart.id;
      console.log(`✓ Created cart: ${cartId}`);
    }, TEST_TIMEOUT);

    it('should add item to cart', async () => {
      // Get a product to add to cart
      const products = await provider.getProducts({ limit: 1 });

      if (products.data.length === 0) {
        console.log('⚠ No products available, skipping cart item test');
        return;
      }

      const product = products.data[0];
      productId = product.id;

      // Get product details with variants
      const fullProduct = await provider.getProduct(productId);

      if (fullProduct.variants.length === 0) {
        console.log('⚠ Product has no variants, skipping cart item test');
        return;
      }

      variantId = fullProduct.variants[0].id;

      const cart = await provider.addToCart(cartId, [
        {
          productId,
          variantId,
          quantity: 2,
        },
      ]);

      expect(cart).toBeDefined();
      expect(cart.items.length).toBeGreaterThan(0);
      expect(cart.subtotal).toBeGreaterThan(0);
      console.log(`✓ Added item to cart`);
      console.log(`  Cart subtotal: $${cart.subtotal}`);
      console.log(`  Total items: ${cart.items.length}`);
    }, TEST_TIMEOUT);

    it('should retrieve cart with items', async () => {
      if (!cartId) {
        console.log('⚠ No cart ID available, skipping');
        return;
      }

      const cart = await provider.getCart(cartId);

      expect(cart).toBeDefined();
      expect(cart.id).toBe(cartId);
      console.log(`✓ Retrieved cart: ${cart.items.length} items, $${cart.totalPrice} total`);
    }, TEST_TIMEOUT);

    it('should update cart item quantity', async () => {
      if (!cartId || !productId) {
        console.log('⚠ No cart or item available, skipping');
        return;
      }

      const cartBefore = await provider.getCart(cartId);
      if (cartBefore.items.length === 0) {
        console.log('⚠ Cart is empty, skipping update test');
        return;
      }

      const itemId = cartBefore.items[0].id;
      const cart = await provider.updateCartItem(cartId, itemId, 5);

      expect(cart).toBeDefined();
      const updatedItem = cart.items.find(item => item.id === itemId);
      expect(updatedItem?.quantity).toBe(5);
      console.log(`✓ Updated item quantity to 5`);
      console.log(`  New subtotal: $${cart.subtotal}`);
    }, TEST_TIMEOUT);

    it('should remove item from cart', async () => {
      if (!cartId) {
        console.log('⚠ No cart available, skipping');
        return;
      }

      const cartBefore = await provider.getCart(cartId);
      if (cartBefore.items.length === 0) {
        console.log('⚠ Cart is empty, skipping remove test');
        return;
      }

      const itemId = cartBefore.items[0].id;
      const itemsCountBefore = cartBefore.items.length;

      const cart = await provider.removeCartItem(cartId, itemId);

      expect(cart).toBeDefined();
      expect(cart.items.length).toBe(itemsCountBefore - 1);
      console.log(`✓ Removed item from cart`);
      console.log(`  Items remaining: ${cart.items.length}`);
    }, TEST_TIMEOUT);
  });

  describe('Order Creation Flow', () => {
    let cartId: string;
    let orderId: string;

    beforeAll(async () => {
      // Create a cart with an item for order testing
      const cart = await provider.createCart();
      cartId = cart.id;

      // Add a product to the cart
      const products = await provider.getProducts({ limit: 1 });

      if (products.data.length > 0) {
        const product = await provider.getProduct(products.data[0].id);

        if (product.variants.length > 0) {
          await provider.addToCart(cartId, [
            {
              productId: product.id,
              variantId: product.variants[0].id,
              quantity: 1,
            },
          ]);
          console.log(`✓ Created test cart with item for order tests`);
        }
      }
    }, TEST_TIMEOUT);

    it('should create an order from cart', async () => {
      if (!cartId) {
        console.log('⚠ No cart available, skipping order creation');
        return;
      }

      const cart = await provider.getCart(cartId);
      if (cart.items.length === 0) {
        console.log('⚠ Cart is empty, skipping order creation');
        return;
      }

      const orderInput = {
        cartId,
        customerId: 'test_customer_' + Date.now(),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'San Francisco',
          province: 'CA',
          country: 'US',
          zip: '94102',
          phone: '415-555-0123',
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'San Francisco',
          province: 'CA',
          country: 'US',
          zip: '94102',
        },
        shippingMethod: 'standard',
        paymentMethod: 'stripe',
      };

      const order = await provider.createOrder(orderInput);

      expect(order).toBeDefined();
      expect(order).toHaveProperty('id');
      expect(order.status).toBe('pending');
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.totalPrice).toBeGreaterThan(0);

      orderId = order.id;
      console.log(`✓ Created order: ${orderId}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Total: $${order.totalPrice}`);
      console.log(`  Items: ${order.items.length}`);
    }, TEST_TIMEOUT);

    it('should retrieve order by ID', async () => {
      if (!orderId) {
        console.log('⚠ No order ID available, skipping');
        return;
      }

      const order = await provider.getOrder(orderId);

      expect(order).toBeDefined();
      expect(order.id).toBe(orderId);
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('shippingAddress');
      console.log(`✓ Retrieved order: ${orderId}`);
      console.log(`  Status: ${order.status}`);
    }, TEST_TIMEOUT);

    it('should list customer orders', async () => {
      if (!orderId) {
        console.log('⚠ No order available, skipping customer orders test');
        return;
      }

      // Get the order to get customer ID
      const order = await provider.getOrder(orderId);
      const customerId = order.customerId;

      const result = await provider.getCustomerOrders(customerId, { limit: 10 });

      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);

      // Should include our test order
      const foundOrder = result.data.find(o => o.id === orderId);
      expect(foundOrder).toBeDefined();

      console.log(`✓ Retrieved ${result.data.length} orders for customer ${customerId}`);
    }, TEST_TIMEOUT);
  });

  describe('Printful Integration', () => {
    it('should sync Printful catalog', async () => {
      // This endpoint requires PRINTFUL_API_KEY to be set
      try {
        const result = await provider.syncPrintfulCatalog();

        expect(result).toBeDefined();
        expect(result).toHaveProperty('message');
        expect(result).toHaveProperty('status');
        console.log(`✓ Printful sync initiated: ${result.message}`);
        console.log(`  Status: ${result.status}`);
      } catch (error: any) {
        if (error.message.includes('PRINTFUL_API_KEY')) {
          console.log('⚠ PRINTFUL_API_KEY not set, skipping Printful sync test');
          console.log('  Set PRINTFUL_API_KEY environment variable to test Printful integration');
        } else {
          throw error;
        }
      }
    }, TEST_TIMEOUT);
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent product', async () => {
      await expect(provider.getProduct('non_existent_id')).rejects.toThrow();
    }, TEST_TIMEOUT);

    it('should handle 404 for non-existent cart', async () => {
      await expect(provider.getCart('non_existent_cart')).rejects.toThrow();
    }, TEST_TIMEOUT);

    it('should handle 404 for non-existent order', async () => {
      await expect(provider.getOrder('non_existent_order')).rejects.toThrow();
    }, TEST_TIMEOUT);

    it('should handle invalid cart item (missing required fields)', async () => {
      const cart = await provider.createCart();

      await expect(
        provider.addToCart(cart.id, [
          { productId: '', variantId: '', quantity: 0 } as any,
        ])
      ).rejects.toThrow();
    }, TEST_TIMEOUT);
  });
});
