/**
 * Tests for ShopAPIProvider
 *
 * These tests verify the shop-api commerce provider implementation,
 * including all compatibility fixes applied during integration.
 */

import { ShopAPIProvider } from '../providers/shop-api';
import type { Cart, CartItemInput } from '../types';
import { createMockResponse } from '../providers/test-helpers';

// Mock fetch globally
global.fetch = jest.fn();

describe('ShopAPIProvider', () => {
  let provider: ShopAPIProvider;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    provider = new ShopAPIProvider({
      baseUrl: 'http://localhost:8080',
      apiKey: 'test-key',
    });
    mockFetch.mockClear();
  });

  describe('Cart Operations', () => {
    describe('createCart', () => {
      it('should call POST /v1/cart (singular) not /v1/carts', async () => {
        const mockCart: Cart = {
          id: 'cart_123',
          customerId: 'customer_456',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-10-12T00:00:00Z',
          updatedAt: '2025-10-12T00:00:00Z',
        };

        mockFetch.mockResolvedValueOnce(createMockResponse(mockCart));

        await provider.createCart('customer_456');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8080/v1/cart',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-API-Key': 'test-key',
            }),
            body: JSON.stringify({ customerId: 'customer_456' }),
          })
        );
      });
    });

    describe('getCart', () => {
      it('should call GET /v1/cart/:cartId (singular)', async () => {
        const mockCart: Cart = {
          id: 'cart_123',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-10-12T00:00:00Z',
          updatedAt: '2025-10-12T00:00:00Z',
        };

        mockFetch.mockResolvedValueOnce(createMockResponse(mockCart));

        await provider.getCart('cart_123');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8080/v1/cart/cart_123',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-API-Key': 'test-key',
            }),
          })
        );
      });
    });

    describe('addToCart', () => {
      it('should add items one by one and fetch final cart state', async () => {
        const items: CartItemInput[] = [
          { productId: 'prod_1', variantId: 'var_1', quantity: 1 },
          { productId: 'prod_2', variantId: 'var_2', quantity: 2 },
        ];

        const mockCartItem = { id: 'item_123', productId: 'prod_1', quantity: 1 };
        const mockFinalCart: Cart = {
          id: 'cart_123',
          items: [
            { id: 'item_123', productId: 'prod_1', variantId: 'var_1', quantity: 1, price: 10 },
            { id: 'item_456', productId: 'prod_2', variantId: 'var_2', quantity: 2, price: 20 },
          ],
          subtotal: 50,
          estimatedTax: 5,
          estimatedShipping: 10,
          totalPrice: 65,
          createdAt: '2025-10-12T00:00:00Z',
          updatedAt: '2025-10-12T00:00:00Z',
        };

        // Mock first item add
        mockFetch.mockResolvedValueOnce(createMockResponse(mockCartItem));

        // Mock second item add
        mockFetch.mockResolvedValueOnce(createMockResponse(mockCartItem));

        // Mock final cart fetch
        mockFetch.mockResolvedValueOnce(createMockResponse(mockFinalCart));

        const result = await provider.addToCart('cart_123', items);

        // Should have called POST twice (once per item)
        expect(mockFetch).toHaveBeenCalledTimes(3);

        // First item
        expect(mockFetch).toHaveBeenNthCalledWith(
          1,
          'http://localhost:8080/v1/cart/cart_123/items',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(items[0]),
          })
        );

        // Second item
        expect(mockFetch).toHaveBeenNthCalledWith(
          2,
          'http://localhost:8080/v1/cart/cart_123/items',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(items[1]),
          })
        );

        // Final GET to fetch cart
        expect(mockFetch).toHaveBeenNthCalledWith(
          3,
          'http://localhost:8080/v1/cart/cart_123',
          expect.any(Object)
        );

        expect(result).toEqual(mockFinalCart);
      });

      it('should throw error if items array is empty', async () => {
        await expect(provider.addToCart('cart_123', [])).rejects.toThrow(
          'No items to add to cart'
        );
      });
    });

    describe('updateCartItem', () => {
      it('should update item and fetch final cart state', async () => {
        const mockCartItem = { id: 'item_123', quantity: 5 };
        const mockFinalCart: Cart = {
          id: 'cart_123',
          items: [{ id: 'item_123', productId: 'prod_1', variantId: 'var_1', quantity: 5, price: 10 }],
          subtotal: 50,
          estimatedTax: 5,
          estimatedShipping: 10,
          totalPrice: 65,
          createdAt: '2025-10-12T00:00:00Z',
          updatedAt: '2025-10-12T00:00:00Z',
        };

        // Mock item update
        mockFetch.mockResolvedValueOnce(createMockResponse(mockCartItem));

        // Mock cart fetch
        mockFetch.mockResolvedValueOnce(createMockResponse(mockFinalCart));

        const result = await provider.updateCartItem('cart_123', 'item_123', 5);

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenNthCalledWith(
          1,
          'http://localhost:8080/v1/cart/cart_123/items/item_123',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ quantity: 5 }),
          })
        );

        expect(result).toEqual(mockFinalCart);
      });
    });

    describe('removeCartItem', () => {
      it('should remove item and fetch final cart state', async () => {
        const mockFinalCart: Cart = {
          id: 'cart_123',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-10-12T00:00:00Z',
          updatedAt: '2025-10-12T00:00:00Z',
        };

        // Mock item delete (204 No Content)
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 204,
          text: async () => '',
          json: async () => ({}),
        } as Response);

        // Mock cart fetch
        mockFetch.mockResolvedValueOnce(createMockResponse(mockFinalCart));

        const result = await provider.removeCartItem('cart_123', 'item_123');

        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenNthCalledWith(
          1,
          'http://localhost:8080/v1/cart/cart_123/items/item_123',
          expect.objectContaining({
            method: 'DELETE',
          })
        );

        expect(result).toEqual(mockFinalCart);
      });
    });
  });

  describe('Product Operations', () => {
    it('should call GET /v1/products with correct filters', async () => {
      const mockResponse = {
        products: [],
        pagination: { hasMore: false },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.getProducts({
        collectionId: 'col_123',
        tags: ['featured', 'new'],
        status: 'active',
        limit: 20,
        cursor: 'cursor_abc',
      });

      const callUrl = (mockFetch.mock.calls[0][0] as string);
      expect(callUrl).toContain('/v1/products?');
      expect(callUrl).toContain('collectionId=col_123');
      expect(callUrl).toContain('tags=featured%2Cnew');
      expect(callUrl).toContain('status=active');
      expect(callUrl).toContain('limit=20');
      expect(callUrl).toContain('cursor=cursor_abc');
    });

    it('should call GET /v1/products/:productId', async () => {
      const mockProduct = {
        id: 'prod_123',
        title: 'Test Product',
        price: 29.99,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockProduct));

      await provider.getProduct('prod_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/products/prod_123',
        expect.any(Object)
      );
    });
  });

  describe('Customization Operations', () => {
    it('should upload customization image using multipart/form-data', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 'img_123',
        url: 'https://example.com/img_123.jpg',
        width: 800,
        height: 600,
        createdAt: '2025-10-12T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.uploadCustomizationImage(
        mockFile,
        'user_456',
        { productId: 'prod_123', variantId: 'var_456' }
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customizations/images',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
          }),
        })
      );

      // Check FormData was created (can't easily check contents in Jest)
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs?.body).toBeInstanceOf(FormData);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Integration Operations', () => {
    it('should call POST /v1/integrations/printful/sync and return async status', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 202,
        text: async () => JSON.stringify(mockResponse),
        json: async () => mockResponse,
      } as Response);

      const result = await provider.syncPrintfulCatalog();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/integrations/printful/sync',
        expect.objectContaining({
          method: 'POST',
        })
      );

      expect(result).toEqual(mockResponse);
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('status');
    });
  });

  describe('Error Handling', () => {
    it('should throw error for non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ message: 'Cart not found' }),
      } as unknown as Response);

      await expect(provider.getCart('invalid_cart')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(provider.getCart('cart_123')).rejects.toThrow('Network error');
    });
  });

  describe('API Key Header', () => {
    it('should include X-API-Key header when apiKey is provided', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({})));

      await provider.getProduct('prod_123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
          }),
        })
      );
    });

    it('should not include X-API-Key header when apiKey is not provided', async () => {
      const providerNoKey = new ShopAPIProvider({
        baseUrl: 'http://localhost:8080',
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(({})));

      await providerNoKey.getProduct('prod_123');

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)?.headers as Record<string, string>;
      expect(callHeaders).not.toHaveProperty('X-API-Key');
    });
  });

  describe('Edge Cases and Advanced Scenarios', () => {
    it('should handle trailing slash in baseUrl', async () => {
      const providerWithSlash = new ShopAPIProvider({
        baseUrl: 'http://localhost:8080/',
        apiKey: 'test-key',
      });

      mockFetch.mockResolvedValueOnce(createMockResponse(({})));

      await providerWithSlash.getProduct('prod_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/products/prod_123',
        expect.any(Object)
      );
    });

    it('should handle special characters in product IDs', async () => {
      const specialIds = ['prod_123-abc', 'prod_123_abc', 'prod%20test'];

      for (const id of specialIds) {
        mockFetch.mockResolvedValueOnce(createMockResponse(({ id })));

        await provider.getProduct(id);
        expect(mockFetch).toHaveBeenCalledWith(
          `http://localhost:8080/v1/products/${id}`,
          expect.any(Object)
        );
      }
    });

    it('should handle empty filter parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ products: [], pagination: { hasMore: false } }),
        json: async () => ({ products: [], pagination: { hasMore: false } }),
      } as Response);

      await provider.getProducts({});

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toBe('http://localhost:8080/v1/products?');
    });

    it('should handle multiple tags in filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ products: [], pagination: { hasMore: false } }),
        json: async () => ({ products: [], pagination: { hasMore: false } }),
      } as Response);

      await provider.getProducts({
        tags: ['tag1', 'tag2', 'tag3'],
      });

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('tags=tag1%2Ctag2%2Ctag3');
    });

    it('should handle large cart with many items', async () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        productId: `prod_${i}`,
        variantId: `var_${i}`,
        quantity: 1,
      }));

      const finalCart = {
        id: 'cart_123',
        items: manyItems.map((item, i) => ({ ...item, id: `item_${i}`, price: 10 })),
        subtotal: 500,
        estimatedTax: 50,
        estimatedShipping: 10,
        totalPrice: 560,
        createdAt: '2025-10-12T00:00:00Z',
        updatedAt: '2025-10-12T00:00:00Z',
      };

      // Mock 50 POST responses for adding items
      for (let i = 0; i < 50; i++) {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: `item_${i}` }),
        json: async () => { id: `item_${i}` },
      } as Response);
      }

      // Mock final cart fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(finalCart),
        json: async () => finalCart,
      } as Response);

      const result = await provider.addToCart('cart_123', manyItems);

      // Should have called POST 50 times + 1 GET
      expect(mockFetch).toHaveBeenCalledTimes(51);
      expect(result.items).toHaveLength(50);
    });

    it('should handle 401 Unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({ message: 'Invalid API key' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({ message: 'Access denied' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 429 Rate Limit error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: jest.fn().mockResolvedValue({ message: 'Rate limit exceeded' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: jest.fn().mockResolvedValue({ message: 'Service unavailable' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        text: async () => '{}',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const result = await provider.getProduct('prod_123');
      expect(result).toBeNull();
    });

    it('should handle concurrent requests', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: async () => JSON.stringify({ id: 'prod_123' }),
          json: async () => ({ id: 'prod_123' }),
        } as Response)
      );

      await provider.getProducts({});

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toBe('http://localhost:8080/v1/products?');
    });

    it('should handle multiple tags in filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ products: [], pagination: { hasMore: false } }),
        json: async () => ({ products: [], pagination: { hasMore: false } }),
      } as Response);

      await provider.getProducts({
        tags: ['tag1', 'tag2', 'tag3'],
      });

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('tags=tag1%2Ctag2%2Ctag3');
    });

    it('should handle large cart with many items', async () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        productId: `prod_${i}`,
        variantId: `var_${i}`,
        quantity: 1,
      }));

      const finalCart = {
        id: 'cart_123',
        items: manyItems.map((item, i) => ({ ...item, id: `item_${i}`, price: 10 })),
        subtotal: 500,
        estimatedTax: 50,
        estimatedShipping: 10,
        totalPrice: 560,
        createdAt: '2025-10-12T00:00:00Z',
        updatedAt: '2025-10-12T00:00:00Z',
      };

      // Mock 50 POST responses for adding items
      for (let i = 0; i < 50; i++) {
        mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ id: `item_${i}` }),
        json: async () => { id: `item_${i}` },
      } as Response);
      }

      // Mock final cart fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(finalCart),
        json: async () => finalCart,
      } as Response);

      const result = await provider.addToCart('cart_123', manyItems);

      // Should have called POST 50 times + 1 GET
      expect(mockFetch).toHaveBeenCalledTimes(51);
      expect(result.items).toHaveLength(50);
    });

    it('should handle 401 Unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({ message: 'Invalid API key' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({ message: 'Access denied' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 429 Rate Limit error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: jest.fn().mockResolvedValue({ message: 'Rate limit exceeded' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 500 Internal Server Error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle 503 Service Unavailable', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: jest.fn().mockResolvedValue({ message: 'Service unavailable' }),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        text: async () => '{}',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response);

      await expect(provider.getProduct('prod_123')).rejects.toThrow();
    });

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const result = await provider.getProduct('prod_123');
      expect(result).toBeNull();
    });

    it('should handle concurrent requests', async () => {
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: async () => JSON.stringify({ id: 'prod_123' }),
          json: async () => ({ id: 'prod_123' }),
    } as Response)
      );

      const requests = [
        provider.getProduct('prod_1'),
        provider.getProduct('prod_2'),
        provider.getProduct('prod_3'),
      ];

      const results = await Promise.all(requests);

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('Collection Operations', () => {
    it('should list collections with pagination', async () => {
      const mockResponse = {
        collections: [{ id: 'col_1', title: 'Collection 1' }],
        pagination: { cursor: 'next_cursor', hasMore: true },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.getCollections({ limit: 10, cursor: 'cursor_123' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/collections?limit=10&cursor=cursor_123',
        expect.any(Object)
      );
      expect(result.data).toEqual(mockResponse.collections);
      expect(result.pagination).toEqual(mockResponse.pagination);
    });

    it('should get single collection', async () => {
      const mockCollection = { id: 'col_123', title: 'Test Collection' };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCollection));

      await provider.getCollection('col_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/collections/col_123',
        expect.any(Object)
      );
    });
  });

  describe('Order Operations', () => {
    const mockOrderInput = {
      cartId: 'cart_123',
      customerId: 'customer_456',
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'City',
        country: 'US',
        zip: '12345',
      },
      billingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'City',
        country: 'US',
        zip: '12345',
      },
      shippingMethod: 'standard',
      paymentMethod: 'stripe',
    };

    it('should create order from cart', async () => {
      const mockOrder = {
        id: 'order_123',
        ...mockOrderInput,
        status: 'pending',
        createdAt: '2025-10-12T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockOrder));

      await provider.createOrder(mockOrderInput);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/orders',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockOrderInput),
        })
      );
    });

    it('should get order by ID', async () => {
      const mockOrder = { id: 'order_123', status: 'paid' };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockOrder));

      await provider.getOrder('order_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/orders/order_123',
        expect.any(Object)
      );
    });

    it('should list customer orders', async () => {
      const mockResponse = {
        orders: [{ id: 'order_1' }, { id: 'order_2' }],
        pagination: { hasMore: false },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.getCustomerOrders('customer_456', { limit: 20 });

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('/v1/orders?');
      expect(callUrl).toContain('customerId=customer_456');
      expect(callUrl).toContain('limit=20');
    });
  });

  describe('Customer Operations', () => {
    it('should register new customer', async () => {
      const mockInput = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockResponse = {
        customer: { id: 'customer_123', email: 'test@example.com' },
        accessToken: 'token_abc',
        refreshToken: 'refresh_abc',
        expiresAt: '2025-10-13T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.registerCustomer(mockInput);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockInput),
        })
      );
    });

    it('should login customer', async () => {
      const mockResponse = {
        customer: { id: 'customer_123', email: 'test@example.com' },
        accessToken: 'token_abc',
        refreshToken: 'refresh_abc',
        expiresAt: '2025-10-13T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.loginCustomer('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
    });

    it('should get customer by ID', async () => {
      const mockCustomer = {
        id: 'customer_123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockCustomer));

      await provider.getCustomer('customer_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/customer_123',
        expect.any(Object)
      );
    });
  });

  describe('Image Processing Operations', () => {
    it('should process customization image with operations', async () => {
      const operations = [
        { type: 'resize' as const, width: 800, height: 600, maintainAspectRatio: true },
        { type: 'crop' as const, width: 500, height: 500, x: 100, y: 100 },
      ];

      const mockResponse = {
        id: 'processed_123',
        originalImageId: 'img_123',
        url: 'https://example.com/processed.jpg',
        width: 500,
        height: 500,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.processCustomizationImage('img_123', 'user_456', operations);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customizations/images/img_123/process?userId=user_456',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ operations }),
        })
      );
    });
  });
});
