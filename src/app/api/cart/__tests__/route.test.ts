/**
 * Tests for Cart API Route
 *
 * Tests the Next.js API route that handles cart operations
 * and proxies requests to shop-api
 */

import { NextRequest } from 'next/server';
import { GET, POST, PATCH } from '../route';
import * as commerce from '@/lib/commerce';
import * as cookieHelpers from '@/utils/cookies/cartId';

// Mock dependencies
jest.mock('@/lib/commerce');
jest.mock('@/utils/cookies/cartId');
jest.mock('@/utils/cookies/visitorId', () => ({
  getOrCreateVisitorId: jest.fn(() => 'visitor_123'),
}));

const mockGetDefaultProvider = commerce.getDefaultProvider as jest.MockedFunction<typeof commerce.getDefaultProvider>;
const mockGetCartId = cookieHelpers.getCartId as jest.MockedFunction<typeof cookieHelpers.getCartId>;
const mockCreateCartId = cookieHelpers.createCartId as jest.MockedFunction<typeof cookieHelpers.createCartId>;

describe('Cart API Route', () => {
  const mockCart = {
    id: 'cart_123',
    customerId: 'customer_456',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        variantId: 'var_1',
        quantity: 2,
        price: 29.99,
        product: { title: 'Test Product', image: 'https://example.com/img.jpg' },
        variant: { title: 'Large' },
      },
    ],
    subtotal: 59.98,
    estimatedTax: 6.0,
    estimatedShipping: 10.0,
    totalPrice: 75.98,
    createdAt: '2025-10-12T00:00:00Z',
    updatedAt: '2025-10-12T00:00:00Z',
  };

  const mockCommerceProvider = {
    getCart: jest.fn(),
    createCart: jest.fn(),
    addToCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeCartItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDefaultProvider.mockReturnValue(mockCommerceProvider as any);
  });

  describe('GET /api/cart', () => {
    it('should return cart when cartId exists', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.getCart.mockResolvedValue(mockCart);

      const response = await GET();
      const json = await response.json();

      expect(mockCommerceProvider.getCart).toHaveBeenCalledWith('cart_123');
      expect(response.status).toBe(200);
      expect(json.data).toEqual(mockCart);
      expect(json.errors).toBeUndefined();
    });

    it('should return 404 when no cartId cookie exists', async () => {
      mockGetCartId.mockReturnValue(undefined);

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(404);
      expect(json.errors).toBe('No cart found');
      expect(json.data).toBeUndefined();
    });

    it('should return 500 when commerce provider throws error', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.getCart.mockRejectedValue(new Error('Network error'));

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error fetching cart');
    });

    it('should handle cart not found error', async () => {
      mockGetCartId.mockReturnValue('invalid_cart');
      mockCommerceProvider.getCart.mockRejectedValue(new Error('Cart not found'));

      const response = await GET();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error fetching cart');
    });
  });

  describe('POST /api/cart', () => {
    it('should create new cart and set cookie', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCommerceProvider.createCart.mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(mockCommerceProvider.createCart).toHaveBeenCalledWith(undefined);
      expect(mockCreateCartId).toHaveBeenCalledWith('cart_123');
      expect(response.status).toBe(200);
      expect(json.data).toEqual(mockCart);
    });

    it('should create cart with customerId when provided', async () => {
      mockGetCartId.mockReturnValue(undefined);
      const cartWithCustomer = { ...mockCart, customerId: 'customer_789' };
      mockCommerceProvider.createCart.mockResolvedValue(cartWithCustomer);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({ customerId: 'customer_789' }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(mockCommerceProvider.createCart).toHaveBeenCalledWith('customer_789');
      expect(json.data.customerId).toBe('customer_789');
    });

    it('should return 500 when cart creation fails', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCommerceProvider.createCart.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error creating cart');
    });
  });

  describe('PATCH /api/cart', () => {
    const validCartItemInput = {
      merchandiseId: 'var_1',
      quantity: 2,
    };

    it('should add items to existing cart', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.addToCart.mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([validCartItemInput]),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(mockCommerceProvider.addToCart).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(json.data).toEqual(mockCart);
    });

    it('should create cart if none exists before adding items', async () => {
      mockGetCartId.mockReturnValue(undefined);
      mockCommerceProvider.createCart.mockResolvedValue(mockCart);
      mockCommerceProvider.addToCart.mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([validCartItemInput]),
      });

      const response = await PATCH(request);

      expect(mockCommerceProvider.createCart).toHaveBeenCalledWith(undefined);
      expect(mockCreateCartId).toHaveBeenCalledWith('cart_123');
      expect(mockCommerceProvider.addToCart).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should validate items array is required', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate items array is not empty', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify({ items: [] }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate item has required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([{ quantity: 1 }]), // missing merchandiseId
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate quantity is positive', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([{ ...validCartItemInput, quantity: -1 }]),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should handle commerce provider errors', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.addToCart.mockRejectedValue(new Error('Product not found'));

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([validCartItemInput]),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error adding items to cart');
    });

    it('should handle attributes in items', async () => {
      const itemWithAttributes = {
        ...validCartItemInput,
        attributes: [
          { key: 'customization', value: 'Custom Text' },
        ],
      };

      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.addToCart.mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: JSON.stringify([itemWithAttributes]),
      });

      const response = await PATCH(request);

      expect(mockCommerceProvider.addToCart).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in POST', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should handle malformed JSON in PATCH', async () => {
      const request = new NextRequest('http://localhost:3000/api/cart', {
        method: 'PATCH',
        body: 'invalid json',
      });

      const response = await PATCH(request);

      expect(response.status).toBe(400);
    });
  });
});
