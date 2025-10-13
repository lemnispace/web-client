/**
 * Tests for Cart Line API Route
 *
 * Tests updating and removing cart items
 */

import { NextRequest } from 'next/server';
import { PATCH } from '../route';
import * as commerce from '@/lib/commerce';
import * as cookieHelpers from '@/utils/cookies/cartId';

jest.mock('@/lib/commerce');
jest.mock('@/utils/cookies/cartId');

const mockGetDefaultProvider = commerce.getDefaultProvider as jest.MockedFunction<typeof commerce.getDefaultProvider>;
const mockGetCartId = cookieHelpers.getCartId as jest.MockedFunction<typeof cookieHelpers.getCartId>;

describe('Cart Line API Route', () => {
  const mockCart = {
    id: 'cart_123',
    items: [
      {
        id: 'item_1',
        productId: 'prod_1',
        variantId: 'var_1',
        quantity: 2,
        price: 29.99,
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
    updateCartItem: jest.fn(),
    removeCartItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDefaultProvider.mockReturnValue(mockCommerceProvider as any);
  });

  describe('PATCH /api/cart/line', () => {
    it('should update item quantity', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.updateCartItem.mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [{ id: 'item_1', quantity: 5 }],
        }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(mockCommerceProvider.updateCartItem).toHaveBeenCalledWith('cart_123', 'item_1', 5);
      expect(response.status).toBe(200);
      expect(json.data).toEqual(mockCart);
    });

    it('should remove item when quantity is 0', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.removeCartItem.mockResolvedValue({
        ...mockCart,
        items: [],
        subtotal: 0,
        totalPrice: 10.0,
      });

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [{ id: 'item_1', quantity: 0 }],
        }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(mockCommerceProvider.removeCartItem).toHaveBeenCalledWith('cart_123', 'item_1');
      expect(response.status).toBe(200);
      expect(json.data.items).toHaveLength(0);
    });

    it('should handle multiple line updates', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.updateCartItem.mockResolvedValue(mockCart);
      mockCommerceProvider.removeCartItem.mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [
            { id: 'item_1', quantity: 3 },
            { id: 'item_2', quantity: 0 },
          ],
        }),
      });

      const response = await PATCH(request);

      expect(mockCommerceProvider.updateCartItem).toHaveBeenCalledWith('cart_123', 'item_1', 3);
      expect(mockCommerceProvider.removeCartItem).toHaveBeenCalledWith('cart_123', 'item_2');
      expect(response.status).toBe(200);
    });

    it('should return 404 when no cart exists', async () => {
      mockGetCartId.mockReturnValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [{ id: 'item_1', quantity: 5 }],
        }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(404);
      expect(json.errors).toBe('No cart found');
    });

    it('should validate lines array is required', async () => {
      mockGetCartId.mockReturnValue('cart_123');

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({}),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate line has id and quantity', async () => {
      mockGetCartId.mockReturnValue('cart_123');

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [{ id: 'item_1' }], // missing quantity
        }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate quantity is non-negative', async () => {
      mockGetCartId.mockReturnValue('cart_123');

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [{ id: 'item_1', quantity: -5 }],
        }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should handle commerce provider errors', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.updateCartItem.mockRejectedValue(new Error('Item not found'));

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [{ id: 'invalid_item', quantity: 5 }],
        }),
      });

      const response = await PATCH(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error updating cart');
    });

    it('should handle partial success in batch updates', async () => {
      mockGetCartId.mockReturnValue('cart_123');
      mockCommerceProvider.updateCartItem
        .mockResolvedValueOnce(mockCart)
        .mockRejectedValueOnce(new Error('Item not found'));

      const request = new NextRequest('http://localhost:3000/api/cart/line', {
        method: 'PATCH',
        body: JSON.stringify({
          lines: [
            { id: 'item_1', quantity: 3 },
            { id: 'invalid_item', quantity: 5 },
          ],
        }),
      });

      const response = await PATCH(request);

      expect(response.status).toBe(500);
    });
  });
});
