/**
 * Integration Tests for Cart API Routes
 *
 * These tests verify the cart-related Next.js API routes including:
 * - GET /api/cart - Retrieve cart by ID from cookie
 * - POST /api/cart - Create new cart or return existing cart
 * - PATCH /api/cart - Add items to existing or new cart
 * - PATCH /api/cart/line - Update cart item quantity or remove item
 */

import { GET, POST, PATCH } from '../route';
import { PATCH as PATCH_LINE } from '../line/route';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Cart, CartItem } from '@/lib/commerce/types';
import * as cartIdCookies from '@/utils/cookies/cartId';

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => {
      const headers = new Map([['content-type', 'application/json']]);
      const response = {
        status: init?.status || 200,
        headers: {
          get: (key: string) => headers.get(key.toLowerCase()),
        },
        json: async () => body,
      };
      return response;
    }),
  },
}));

// Mock dependencies
jest.mock('@/lib/commerce/providers/shop-api');
jest.mock('@/utils/cookies/cartId');

// Mock environment variables
jest.mock('@/utils/env', () => ({
  env: {
    SHOP_API_URL: 'http://localhost:8080',
    SHOP_API_KEY: 'test-api-key',
  },
}));

describe('Cart API Routes Integration Tests', () => {
  const mockShopAPIProvider = ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>;
  const mockGetCartId = cartIdCookies.getCartId as jest.MockedFunction<typeof cartIdCookies.getCartId>;
  const mockCreateCartId = cartIdCookies.createCartId as jest.MockedFunction<typeof cartIdCookies.createCartId>;

  // Sample test data
  const mockCartId = 'cart_test123';
  const mockCustomerId = 'customer_test456';

  const mockCartItem: CartItem = {
    id: 'item_001',
    productId: 'prod_123',
    variantId: 'var_456',
    quantity: 2,
    price: 29.99,
    title: 'Test Product',
    variant: {
      id: 'var_456',
      title: 'Medium / Blue',
      price: 29.99,
      available: true,
    },
  };

  const mockCart: Cart = {
    id: mockCartId,
    customerId: mockCustomerId,
    items: [mockCartItem],
    subtotal: 59.98,
    estimatedTax: 6.00,
    estimatedShipping: 10.00,
    totalPrice: 75.98,
    createdAt: '2025-10-19T00:00:00Z',
    updatedAt: '2025-10-19T00:00:00Z',
  };

  const mockEmptyCart: Cart = {
    id: mockCartId,
    items: [],
    subtotal: 0,
    estimatedTax: 0,
    estimatedShipping: 0,
    totalPrice: 0,
    createdAt: '2025-10-19T00:00:00Z',
    updatedAt: '2025-10-19T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset ShopAPIProvider mock implementation
    mockShopAPIProvider.mockClear();
  });

  describe('GET /api/cart', () => {
    it('should return cart when valid cartId exists in cookie', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockGetCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.getCart = mockGetCart;

      const response = await GET();

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: mockCart });
      expect(mockGetCart).toHaveBeenCalledWith(mockCartId);
    });

    it('should return 404 when no cartId in cookie', async () => {
      mockGetCartId.mockReturnValue(undefined);

      const response = await GET();

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({
        errors: 'No cart found',
        data: undefined,
      });
    });

    it('should return 500 when ShopAPIProvider throws error', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockGetCart = jest.fn().mockRejectedValue(new Error('Database error'));
      mockShopAPIProvider.prototype.getCart = mockGetCart;

      const response = await GET();

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        errors: 'Error fetching cart',
        data: undefined,
      });
    });

    it('should handle cart not found error', async () => {
      mockGetCartId.mockReturnValue('cart_nonexistent');

      const mockGetCart = jest.fn().mockRejectedValue(new Error('Cart not found'));
      mockShopAPIProvider.prototype.getCart = mockGetCart;

      const response = await GET();

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.errors).toBe('Error fetching cart');
    });
  });

  describe('POST /api/cart', () => {
    it('should create new cart without items', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCreateCartId.mockReturnValue(mockCartId);

      const mockCreateCart = jest.fn().mockResolvedValue(mockEmptyCart);
      mockShopAPIProvider.prototype.createCart = mockCreateCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      }) as any;

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: mockEmptyCart, errors: undefined });
      expect(mockCreateCart).toHaveBeenCalledWith(undefined);
      expect(mockCreateCartId).toHaveBeenCalledWith(mockCartId);
    });

    it('should create new cart with customerId', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCreateCartId.mockReturnValue(mockCartId);

      const mockCreateCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.createCart = mockCreateCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ customerId: mockCustomerId }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockCart);
      expect(mockCreateCart).toHaveBeenCalledWith(mockCustomerId);
    });

    it('should create cart with items when provided', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCreateCartId.mockReturnValue(mockCartId);

      const items = [
        { productId: 'prod_123', variantId: 'var_456', quantity: 2 },
      ];

      const mockCreateCart = jest.fn().mockResolvedValue(mockEmptyCart);
      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.createCart = mockCreateCart;
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockCart);
      expect(mockCreateCart).toHaveBeenCalled();
      expect(mockAddToCart).toHaveBeenCalledWith(mockCartId, items);
      expect(mockCreateCartId).toHaveBeenCalledWith(mockCartId);
    });

    it('should return existing cart if cartId already exists in cookie', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockGetCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.getCart = mockGetCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      }) as any;

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: mockCart, errors: undefined });
      expect(mockGetCart).toHaveBeenCalledWith(mockCartId);
    });

    it('should create new cart if existing cart is not found', async () => {
      mockGetCartId.mockReturnValue('cart_old');
      mockCreateCartId.mockReturnValue(mockCartId);

      const mockGetCart = jest.fn().mockRejectedValue(new Error('Cart not found'));
      const mockCreateCart = jest.fn().mockResolvedValue(mockEmptyCart);
      mockShopAPIProvider.prototype.getCart = mockGetCart;
      mockShopAPIProvider.prototype.createCart = mockCreateCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      }) as any;

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockEmptyCart);
      expect(mockCreateCart).toHaveBeenCalled();
    });

    it('should return 500 when cart creation fails', async () => {
      mockGetCartId.mockReturnValue(undefined);

      const mockCreateCart = jest.fn().mockRejectedValue(new Error('Service unavailable'));
      mockShopAPIProvider.prototype.createCart = mockCreateCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      }) as any;

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        errors: 'Error creating cart',
        data: undefined,
      });
    });

    it('should return 405 for non-POST methods', async () => {
      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PUT',
      });

      const response = await POST(request);

      expect(response.status).toBe(405);
      const data = await response.json();
      expect(data.errors).toBe('Method not allowed');
    });

    it('should handle invalid JSON body gracefully', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCreateCartId.mockReturnValue(mockCartId);

      const mockCreateCart = jest.fn().mockResolvedValue(mockEmptyCart);
      mockShopAPIProvider.prototype.createCart = mockCreateCart;

      // Create request with invalid JSON
      const request = new Request('http://localhost:3000/api/cart', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);

      // Should still create cart with empty body
      expect(response.status).toBe(200);
      expect(mockCreateCart).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/cart', () => {
    it('should add items to existing cart', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const cartLines = [
        {
          merchandiseId: 'var_456',
          quantity: 2,
        },
      ];

      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(cartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: mockCart, errors: undefined });
      expect(mockAddToCart).toHaveBeenCalledWith(mockCartId, [
        {
          productId: 'var_456',
          variantId: 'var_456',
          quantity: 2,
          customizationData: undefined,
        },
      ]);
    });

    it('should add items with attributes to cart', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const cartLines = [
        {
          merchandiseId: 'var_456',
          quantity: 1,
          attributes: [
            { key: 'customText', value: 'Hello World' },
            { key: 'color', value: 'blue' },
          ],
        },
      ];

      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(cartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(mockAddToCart).toHaveBeenCalledWith(mockCartId, [
        {
          productId: 'var_456',
          variantId: 'var_456',
          quantity: 1,
          customizationData: {
            customText: 'Hello World',
            color: 'blue',
          },
        },
      ]);
    });

    it('should create new cart if no existing cart', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCreateCartId.mockReturnValue(mockCartId);

      const cartLines = [
        {
          merchandiseId: 'var_456',
          quantity: 2,
        },
      ];

      const mockCreateCart = jest.fn().mockResolvedValue(mockEmptyCart);
      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.createCart = mockCreateCart;
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(cartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(mockCreateCart).toHaveBeenCalled();
      expect(mockAddToCart).toHaveBeenCalled();
      expect(mockCreateCartId).toHaveBeenCalledWith(mockCartId);
    });

    it('should create new cart if existing cart not found', async () => {
      mockGetCartId.mockReturnValue('cart_old');
      mockCreateCartId.mockReturnValue(mockCartId);

      const cartLines = [
        {
          merchandiseId: 'var_456',
          quantity: 1,
        },
      ];

      const mockAddToCartFail = jest.fn().mockRejectedValue(new Error('Cart not found'));
      const mockCreateCart = jest.fn().mockResolvedValue(mockEmptyCart);
      const mockAddToCartSuccess = jest.fn().mockResolvedValue(mockCart);

      const mockAddToCart = jest.fn()
        .mockRejectedValueOnce(new Error('Cart not found')) // First call fails
        .mockResolvedValueOnce(mockCart); // Second call succeeds

      mockShopAPIProvider.prototype.addToCart = mockAddToCart;
      mockShopAPIProvider.prototype.createCart = mockCreateCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(cartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(mockCreateCart).toHaveBeenCalled();
      expect(mockAddToCart).toHaveBeenCalledTimes(2); // Once fail, once success
    });

    it('should return 400 for invalid cart line data', async () => {
      const invalidCartLines = [
        {
          // Missing merchandiseId
          quantity: 2,
        },
      ];

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(invalidCartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
    });

    it('should return 400 for invalid quantity', async () => {
      const invalidCartLines = [
        {
          merchandiseId: 'var_456',
          quantity: -1, // Invalid negative quantity
        },
      ];

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(invalidCartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.errors).toBeDefined();
    });

    it('should return 400 for too many attributes', async () => {
      const tooManyAttributes = Array.from({ length: 251 }, (_, i) => ({
        key: `attr${i}`,
        value: `value${i}`,
      }));

      const cartLines = [
        {
          merchandiseId: 'var_456',
          quantity: 1,
          attributes: tooManyAttributes,
        },
      ];

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(cartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.errors).toBeDefined();
    });

    it('should return 500 when adding items fails', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockAddToCart = jest.fn().mockRejectedValue(new Error('Service error'));
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([
          { merchandiseId: 'var_456', quantity: 1 },
        ]),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.errors).toBe('Error adding items to cart');
    });

    it('should return 405 for non-PATCH methods', async () => {
      const request = new Request('http://localhost:3000/api/cart', {
        method: 'DELETE',
      });

      const response = await PATCH(request);

      expect(response.status).toBe(405);
    });

    it('should handle multiple items in single request', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const cartLines = [
        { merchandiseId: 'var_1', quantity: 1 },
        { merchandiseId: 'var_2', quantity: 3 },
        { merchandiseId: 'var_3', quantity: 2 },
      ];

      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify(cartLines),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(mockAddToCart).toHaveBeenCalledWith(
        mockCartId,
        expect.arrayContaining([
          expect.objectContaining({ variantId: 'var_1', quantity: 1 }),
          expect.objectContaining({ variantId: 'var_2', quantity: 3 }),
          expect.objectContaining({ variantId: 'var_3', quantity: 2 }),
        ])
      );
    });
  });

  describe('PATCH /api/cart/line', () => {
    it('should update cart item quantity', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const updateData = [
        {
          id: 'item_001',
          quantity: 5,
        },
      ];

      const mockUpdateCartItem = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ data: mockCart, errors: undefined });
      expect(mockUpdateCartItem).toHaveBeenCalledWith(mockCartId, 'item_001', 5);
    });

    it('should update multiple items sequentially', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const updateData = [
        { id: 'item_001', quantity: 3 },
        { id: 'item_002', quantity: 5 },
      ];

      const mockUpdateCartItem = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(200);
      expect(mockUpdateCartItem).toHaveBeenCalledTimes(2);
      expect(mockUpdateCartItem).toHaveBeenNthCalledWith(1, mockCartId, 'item_001', 3);
      expect(mockUpdateCartItem).toHaveBeenNthCalledWith(2, mockCartId, 'item_002', 5);
    });

    it('should update multiple items with different quantities', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const updateData = [
        { id: 'item_001', quantity: 3 },
        { id: 'item_002', quantity: 5 },
        { id: 'item_003', quantity: 1 },
      ];

      const mockUpdateCartItem = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(200);
      expect(mockUpdateCartItem).toHaveBeenCalledTimes(3);
      expect(mockUpdateCartItem).toHaveBeenNthCalledWith(1, mockCartId, 'item_001', 3);
      expect(mockUpdateCartItem).toHaveBeenNthCalledWith(2, mockCartId, 'item_002', 5);
      expect(mockUpdateCartItem).toHaveBeenNthCalledWith(3, mockCartId, 'item_003', 1);
    });

    it('should return 404 when no cart found', async () => {
      mockGetCartId.mockReturnValue(undefined);

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify([{ id: 'item_001', quantity: 2 }]),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({
        errors: 'No cart found',
        data: undefined,
      });
    });

    it('should return 400 for invalid update data', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const invalidData = [
        {
          // Missing id field
          quantity: 2,
        },
      ];

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify(invalidData),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.errors).toBeDefined();
    });

    it('should return 500 when update operation fails', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockUpdateCartItem = jest.fn().mockRejectedValue(new Error('Update failed'));
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify([{ id: 'item_001', quantity: 2 }]),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.errors).toBe('Error updating cart');
    });

    it('should return 405 for non-PATCH methods', async () => {
      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'POST',
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(405);
    });

    it('should use default quantity of 1 when not provided', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const updateData = [
        {
          id: 'item_001',
          // quantity not provided
        },
      ];

      const mockUpdateCartItem = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(200);
      expect(mockUpdateCartItem).toHaveBeenCalledWith(mockCartId, 'item_001', 1);
    });

    it('should handle item not found error gracefully', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockUpdateCartItem = jest.fn().mockRejectedValue(new Error('Item not found'));
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify([{ id: 'item_nonexistent', quantity: 2 }]),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.errors).toBe('Error updating cart');
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle concurrent cart operations', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const requests = [
        PATCH(new Request('http://localhost:3000/api/cart', {
          method: 'PATCH',
          body: JSON.stringify([{ merchandiseId: 'var_1', quantity: 1 }]),
        })),
        PATCH(new Request('http://localhost:3000/api/cart', {
          method: 'PATCH',
          body: JSON.stringify([{ merchandiseId: 'var_2', quantity: 2 }]),
        })),
      ];

      const responses = await Promise.all(requests);

      expect(responses[0].status).toBe(200);
      expect(responses[1].status).toBe(200);
      expect(mockAddToCart).toHaveBeenCalledTimes(2);
    });

    it('should handle empty cart lines array', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([]),
      });

      const response = await PATCH(request);

      // Empty array passes validation but should not call addToCart
      expect(response.status).toBe(200);
    });

    it('should handle special characters in item IDs', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const specialId = 'item_123-abc_test%20';
      const mockUpdateCartItem = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify([{ id: specialId, quantity: 2 }]),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(200);
      expect(mockUpdateCartItem).toHaveBeenCalledWith(mockCartId, specialId, 2);
    });

    it('should handle cart with very large quantity', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const largeQuantity = 999;
      const mockAddToCart = jest.fn().mockResolvedValue(mockCart);
      mockShopAPIProvider.prototype.addToCart = mockAddToCart;

      const request = new Request('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([{ merchandiseId: 'var_456', quantity: largeQuantity }]),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(200);
      expect(mockAddToCart).toHaveBeenCalledWith(
        mockCartId,
        expect.arrayContaining([
          expect.objectContaining({ quantity: largeQuantity }),
        ])
      );
    });

    it('should handle network timeout gracefully', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const mockGetCart = jest.fn().mockImplementation(() =>
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );
      mockShopAPIProvider.prototype.getCart = mockGetCart;

      const response = await GET();

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.errors).toBe('Error fetching cart');
    });

    it('should preserve cart data integrity during updates', async () => {
      mockGetCartId.mockReturnValue(mockCartId);

      const updatedCart = {
        ...mockCart,
        items: [
          { ...mockCartItem, quantity: 5 },
        ],
        subtotal: 149.95,
        totalPrice: 165.95,
      };

      const mockUpdateCartItem = jest.fn().mockResolvedValue(updatedCart);
      mockShopAPIProvider.prototype.updateCartItem = mockUpdateCartItem;

      const request = new Request('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify([{ id: 'item_001', quantity: 5 }]),
      });

      const response = await PATCH_LINE(request);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.items[0].quantity).toBe(5);
      expect(data.data.subtotal).toBe(149.95);
    });
  });
});
