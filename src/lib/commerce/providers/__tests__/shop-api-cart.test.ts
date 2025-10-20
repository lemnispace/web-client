/**
 * Comprehensive unit tests for ShopAPIProvider Cart methods
 *
 * Tests all cart-related operations including:
 * - createCart
 * - getCart
 * - addToCart
 * - updateCartItem
 * - removeCartItem
 * - getCartCheckout
 * - getCustomerCarts
 *
 * Coverage target: 80%+
 */

import { ShopAPIProvider } from '../shop-api';
import type { Cart, CartItemInput, CartCheckout } from '../../types';

// Mock fetch globally
global.fetch = jest.fn();

describe('ShopAPIProvider - Cart Operations', () => {
  let provider: ShopAPIProvider;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
  const baseUrl = 'http://localhost:8080';
  const apiKey = 'test-api-key';

  beforeEach(() => {
    provider = new ShopAPIProvider({
      baseUrl,
      apiKey,
    });
    mockFetch.mockClear();
  });

  // ============================================================================
  // 1. createCart(customerId?: string)
  // ============================================================================
  describe('createCart', () => {
    it('should create a new cart without customerId', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.createCart();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/cart`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          }),
          body: JSON.stringify({ customerId: undefined }),
        })
      );
      expect(result).toEqual(mockCart);
      expect(result.id).toBe('cart_123');
      expect(result.items).toHaveLength(0);
    });

    it('should create a new cart with customerId', async () => {
      const customerId = 'customer_456';
      const mockCart: Cart = {
        id: 'cart_789',
        customerId,
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.createCart(customerId);

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/cart`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ customerId }),
        })
      );
      expect(result).toEqual(mockCart);
      expect(result.customerId).toBe(customerId);
    });

    it('should handle cart creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Failed to create cart' }),
      } as Response);

      await expect(provider.createCart()).rejects.toThrow('Failed to create cart');
    });

    it('should include expiresAt when provided by API', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
        expiresAt: '2025-10-20T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.createCart();
      expect(result.expiresAt).toBe('2025-10-20T00:00:00Z');
    });
  });

  // ============================================================================
  // 2. getCart(cartId: string)
  // ============================================================================
  describe('getCart', () => {
    it('should retrieve an empty cart', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.getCart('cart_123');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/cart/cart_123`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          }),
        })
      );
      expect(result).toEqual(mockCart);
    });

    it('should retrieve a cart with items', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        customerId: 'customer_456',
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            variantId: 'var_1',
            quantity: 2,
            price: 29.99,
            product: {
              title: 'Cool T-Shirt',
              image: 'https://example.com/tshirt.jpg',
            },
            variant: {
              title: 'Large / Blue',
            },
          },
          {
            id: 'item_2',
            productId: 'prod_2',
            variantId: 'var_2',
            quantity: 1,
            price: 49.99,
            product: {
              title: 'Coffee Mug',
              image: 'https://example.com/mug.jpg',
            },
          },
        ],
        subtotal: 109.97,
        estimatedTax: 10.99,
        estimatedShipping: 5.00,
        totalPrice: 125.96,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.getCart('cart_123');

      expect(result.items).toHaveLength(2);
      expect(result.subtotal).toBe(109.97);
      expect(result.totalPrice).toBe(125.96);
    });

    it('should handle cart not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Cart not found' }),
      } as Response);

      await expect(provider.getCart('invalid_cart')).rejects.toThrow('Cart not found');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(provider.getCart('cart_123')).rejects.toThrow('Network error');
    });

    it('should retrieve cart with customization data', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            variantId: 'var_1',
            quantity: 1,
            price: 29.99,
            customizationData: {
              imageId: 'img_123',
              text: 'Custom Text',
              color: '#FF0000',
            },
          },
        ],
        subtotal: 29.99,
        estimatedTax: 2.99,
        estimatedShipping: 5.00,
        totalPrice: 37.98,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.getCart('cart_123');
      expect(result.items[0].customizationData).toBeDefined();
      expect(result.items[0].customizationData?.imageId).toBe('img_123');
    });
  });

  // ============================================================================
  // 3. addToCart(cartId: string, items: CartItemInput[])
  // ============================================================================
  describe('addToCart', () => {
    it('should add a single item to cart', async () => {
      const items: CartItemInput[] = [
        {
          productId: 'prod_1',
          variantId: 'var_1',
          quantity: 1,
        },
      ];

      const mockCartItem = { id: 'item_1', productId: 'prod_1', quantity: 1 };
      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            variantId: 'var_1',
            quantity: 1,
            price: 29.99,
          },
        ],
        subtotal: 29.99,
        estimatedTax: 2.99,
        estimatedShipping: 5.00,
        totalPrice: 37.98,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      // Mock the POST to add item
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCartItem,
      } as Response);

      // Mock the GET to fetch updated cart
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.addToCart('cart_123', items);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/v1/cart/cart_123/items`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(items[0]),
        })
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        `${baseUrl}/v1/cart/cart_123`,
        expect.any(Object)
      );
      expect(result).toEqual(mockFinalCart);
    });

    it('should add multiple items to cart', async () => {
      const items: CartItemInput[] = [
        { productId: 'prod_1', variantId: 'var_1', quantity: 2 },
        { productId: 'prod_2', variantId: 'var_2', quantity: 1 },
        { productId: 'prod_3', variantId: 'var_3', quantity: 3 },
      ];

      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: items.map((item, i) => ({
          id: `item_${i + 1}`,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: 29.99,
        })),
        subtotal: 179.94,
        estimatedTax: 17.99,
        estimatedShipping: 10.00,
        totalPrice: 207.93,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      // Mock POST for each item
      items.forEach(() => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'item_123' }),
        } as Response);
      });

      // Mock final GET
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.addToCart('cart_123', items);

      // 3 POST calls + 1 GET call
      expect(mockFetch).toHaveBeenCalledTimes(4);
      expect(result.items).toHaveLength(3);
    });

    it('should throw error when items array is empty', async () => {
      await expect(provider.addToCart('cart_123', [])).rejects.toThrow(
        'No items to add to cart'
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should add item with customization data', async () => {
      const items: CartItemInput[] = [
        {
          productId: 'prod_1',
          variantId: 'var_1',
          quantity: 1,
          customizationData: {
            imageId: 'img_123',
            text: 'Custom Text',
          },
        },
      ];

      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            variantId: 'var_1',
            quantity: 1,
            price: 29.99,
            customizationData: {
              imageId: 'img_123',
              text: 'Custom Text',
            },
          },
        ],
        subtotal: 29.99,
        estimatedTax: 2.99,
        estimatedShipping: 5.00,
        totalPrice: 37.98,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'item_1' }),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.addToCart('cart_123', items);

      const callBody = JSON.parse((mockFetch.mock.calls[0][1] as RequestInit).body as string);
      expect(callBody.customizationData).toEqual({
        imageId: 'img_123',
        text: 'Custom Text',
      });
      expect(result.items[0].customizationData).toBeDefined();
    });

    it('should handle errors when adding items', async () => {
      const items: CartItemInput[] = [
        { productId: 'prod_1', variantId: 'invalid_variant', quantity: 1 },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid variant ID' }),
      } as Response);

      await expect(provider.addToCart('cart_123', items)).rejects.toThrow('Invalid variant ID');
    });

    it('should handle partial failure when adding multiple items', async () => {
      const items: CartItemInput[] = [
        { productId: 'prod_1', variantId: 'var_1', quantity: 1 },
        { productId: 'prod_2', variantId: 'invalid_variant', quantity: 1 },
      ];

      // First item succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'item_1' }),
      } as Response);

      // Second item fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid variant' }),
      } as Response);

      await expect(provider.addToCart('cart_123', items)).rejects.toThrow('Invalid variant');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  // ============================================================================
  // 4. updateCartItem(cartId: string, itemId: string, quantity: number)
  // ============================================================================
  describe('updateCartItem', () => {
    it('should update item quantity', async () => {
      const mockCartItem = { id: 'item_123', quantity: 5 };
      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [
          {
            id: 'item_123',
            productId: 'prod_1',
            variantId: 'var_1',
            quantity: 5,
            price: 29.99,
          },
        ],
        subtotal: 149.95,
        estimatedTax: 14.99,
        estimatedShipping: 10.00,
        totalPrice: 174.94,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      // Mock PUT to update item
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCartItem,
      } as Response);

      // Mock GET to fetch updated cart
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.updateCartItem('cart_123', 'item_123', 5);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/v1/cart/cart_123/items/item_123`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ quantity: 5 }),
        })
      );
      expect(result.items[0].quantity).toBe(5);
      expect(result.subtotal).toBe(149.95);
    });

    it('should update quantity to 1', async () => {
      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [
          { id: 'item_123', productId: 'prod_1', variantId: 'var_1', quantity: 1, price: 29.99 },
        ],
        subtotal: 29.99,
        estimatedTax: 2.99,
        estimatedShipping: 5.00,
        totalPrice: 37.98,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'item_123', quantity: 1 }),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.updateCartItem('cart_123', 'item_123', 1);
      expect(result.items[0].quantity).toBe(1);
    });

    it('should handle item not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Cart item not found' }),
      } as Response);

      await expect(provider.updateCartItem('cart_123', 'invalid_item', 5)).rejects.toThrow(
        'Cart item not found'
      );
    });

    it('should handle invalid quantity error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Quantity must be greater than 0' }),
      } as Response);

      await expect(provider.updateCartItem('cart_123', 'item_123', 0)).rejects.toThrow(
        'Quantity must be greater than 0'
      );
    });

    it('should update item in cart with multiple items', async () => {
      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [
          { id: 'item_1', productId: 'prod_1', variantId: 'var_1', quantity: 3, price: 29.99 },
          { id: 'item_2', productId: 'prod_2', variantId: 'var_2', quantity: 1, price: 49.99 },
        ],
        subtotal: 139.96,
        estimatedTax: 13.99,
        estimatedShipping: 10.00,
        totalPrice: 163.95,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'item_1', quantity: 3 }),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.updateCartItem('cart_123', 'item_1', 3);
      expect(result.items).toHaveLength(2);
      expect(result.items[0].quantity).toBe(3);
    });
  });

  // ============================================================================
  // 5. removeCartItem(cartId: string, itemId: string)
  // ============================================================================
  describe('removeCartItem', () => {
    it('should remove item from cart', async () => {
      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      // Mock DELETE (204 No Content)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({}),
      } as Response);

      // Mock GET to fetch updated cart
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.removeCartItem('cart_123', 'item_123');

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/v1/cart/cart_123/items/item_123`,
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result.items).toHaveLength(0);
      expect(result.totalPrice).toBe(0);
    });

    it('should remove one item from cart with multiple items', async () => {
      const mockFinalCart: Cart = {
        id: 'cart_123',
        items: [
          { id: 'item_2', productId: 'prod_2', variantId: 'var_2', quantity: 1, price: 49.99 },
        ],
        subtotal: 49.99,
        estimatedTax: 4.99,
        estimatedShipping: 5.00,
        totalPrice: 59.98,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({}),
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockFinalCart,
      } as Response);

      const result = await provider.removeCartItem('cart_123', 'item_1');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('item_2');
    });

    it('should handle item not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Cart item not found' }),
      } as Response);

      await expect(provider.removeCartItem('cart_123', 'invalid_item')).rejects.toThrow(
        'Cart item not found'
      );
    });

    it('should handle cart not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Cart not found' }),
      } as Response);

      await expect(provider.removeCartItem('invalid_cart', 'item_123')).rejects.toThrow(
        'Cart not found'
      );
    });

    it('should handle server error during item removal', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Failed to remove item' }),
      } as Response);

      await expect(provider.removeCartItem('cart_123', 'item_123')).rejects.toThrow(
        'Failed to remove item'
      );
    });
  });

  // ============================================================================
  // 6. getCartCheckout(cartId: string)
  // ============================================================================
  describe('getCartCheckout', () => {
    it('should retrieve cart checkout summary', async () => {
      const mockCheckout: CartCheckout = {
        cartId: 'cart_123',
        subtotal: 109.97,
        estimatedTax: 10.99,
        estimatedShipping: 10.00,
        totalPrice: 130.96,
        itemCount: 3,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCheckout,
      } as Response);

      const result = await provider.getCartCheckout('cart_123');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/cart/cart_123/checkout`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          }),
        })
      );
      expect(result).toEqual(mockCheckout);
      expect(result.cartId).toBe('cart_123');
      expect(result.itemCount).toBe(3);
    });

    it('should retrieve checkout for empty cart', async () => {
      const mockCheckout: CartCheckout = {
        cartId: 'cart_123',
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        itemCount: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCheckout,
      } as Response);

      const result = await provider.getCartCheckout('cart_123');
      expect(result.itemCount).toBe(0);
      expect(result.totalPrice).toBe(0);
    });

    it('should handle cart not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Cart not found' }),
      } as Response);

      await expect(provider.getCartCheckout('invalid_cart')).rejects.toThrow('Cart not found');
    });

    it('should retrieve checkout with calculated values', async () => {
      const mockCheckout: CartCheckout = {
        cartId: 'cart_456',
        subtotal: 299.95,
        estimatedTax: 29.99,
        estimatedShipping: 15.00,
        totalPrice: 344.94,
        itemCount: 10,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCheckout,
      } as Response);

      const result = await provider.getCartCheckout('cart_456');
      expect(result.subtotal).toBe(299.95);
      expect(result.estimatedTax).toBe(29.99);
      expect(result.estimatedShipping).toBe(15.00);
      expect(result.totalPrice).toBe(344.94);
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(provider.getCartCheckout('cart_123')).rejects.toThrow('Network timeout');
    });
  });

  // ============================================================================
  // 7. getCustomerCarts(customerId: string, includeExpired?: boolean)
  // ============================================================================
  describe('getCustomerCarts', () => {
    it('should retrieve active customer carts', async () => {
      const mockCarts: Cart[] = [
        {
          id: 'cart_1',
          customerId: 'customer_123',
          items: [
            { id: 'item_1', productId: 'prod_1', variantId: 'var_1', quantity: 1, price: 29.99 },
          ],
          subtotal: 29.99,
          estimatedTax: 2.99,
          estimatedShipping: 5.00,
          totalPrice: 37.98,
          createdAt: '2025-10-19T00:00:00Z',
          updatedAt: '2025-10-19T00:00:00Z',
        },
        {
          id: 'cart_2',
          customerId: 'customer_123',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-10-18T00:00:00Z',
          updatedAt: '2025-10-18T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carts: mockCarts }),
      } as Response);

      const result = await provider.getCustomerCarts('customer_123');

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/cart?customerId=customer_123`,
        expect.any(Object)
      );
      expect(result).toEqual(mockCarts);
      expect(result).toHaveLength(2);
    });

    it('should retrieve customer carts without includeExpired flag', async () => {
      const mockCarts: Cart[] = [
        {
          id: 'cart_1',
          customerId: 'customer_456',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-10-19T00:00:00Z',
          updatedAt: '2025-10-19T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carts: mockCarts }),
      } as Response);

      const result = await provider.getCustomerCarts('customer_456', false);

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toBe(`${baseUrl}/v1/cart?customerId=customer_456`);
      expect(callUrl).not.toContain('includeExpired');
      expect(result).toEqual(mockCarts);
    });

    it('should retrieve customer carts with includeExpired=true', async () => {
      const mockCarts: Cart[] = [
        {
          id: 'cart_1',
          customerId: 'customer_789',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-10-19T00:00:00Z',
          updatedAt: '2025-10-19T00:00:00Z',
        },
        {
          id: 'cart_2',
          customerId: 'customer_789',
          items: [],
          subtotal: 0,
          estimatedTax: 0,
          estimatedShipping: 0,
          totalPrice: 0,
          createdAt: '2025-09-01T00:00:00Z',
          updatedAt: '2025-09-01T00:00:00Z',
          expiresAt: '2025-09-15T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carts: mockCarts }),
      } as Response);

      const result = await provider.getCustomerCarts('customer_789', true);

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('includeExpired=true');
      expect(result).toHaveLength(2);
      expect(result[1].expiresAt).toBeDefined();
    });

    it('should return empty array when customer has no carts', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carts: [] }),
      } as Response);

      const result = await provider.getCustomerCarts('customer_new');
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle customer not found error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Customer not found' }),
      } as Response);

      await expect(provider.getCustomerCarts('invalid_customer')).rejects.toThrow(
        'Customer not found'
      );
    });

    it('should handle server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Database connection failed' }),
      } as Response);

      await expect(provider.getCustomerCarts('customer_123')).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should retrieve multiple customer carts with items', async () => {
      const mockCarts: Cart[] = [
        {
          id: 'cart_1',
          customerId: 'customer_999',
          items: [
            { id: 'item_1', productId: 'prod_1', variantId: 'var_1', quantity: 2, price: 29.99 },
            { id: 'item_2', productId: 'prod_2', variantId: 'var_2', quantity: 1, price: 49.99 },
          ],
          subtotal: 109.97,
          estimatedTax: 10.99,
          estimatedShipping: 10.00,
          totalPrice: 130.96,
          createdAt: '2025-10-19T00:00:00Z',
          updatedAt: '2025-10-19T00:00:00Z',
        },
        {
          id: 'cart_2',
          customerId: 'customer_999',
          items: [
            { id: 'item_3', productId: 'prod_3', variantId: 'var_3', quantity: 1, price: 19.99 },
          ],
          subtotal: 19.99,
          estimatedTax: 1.99,
          estimatedShipping: 5.00,
          totalPrice: 26.98,
          createdAt: '2025-10-17T00:00:00Z',
          updatedAt: '2025-10-17T00:00:00Z',
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ carts: mockCarts }),
      } as Response);

      const result = await provider.getCustomerCarts('customer_999');
      expect(result).toHaveLength(2);
      expect(result[0].items).toHaveLength(2);
      expect(result[1].items).toHaveLength(1);
    });
  });

  // ============================================================================
  // Additional Edge Cases
  // ============================================================================
  describe('Edge Cases and Error Handling', () => {
    it('should handle 401 Unauthorized error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Invalid API key' }),
      } as Response);

      await expect(provider.getCart('cart_123')).rejects.toThrow('Invalid API key');
    });

    it('should handle 403 Forbidden error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({ message: 'Access denied to this cart' }),
      } as Response);

      await expect(provider.getCart('cart_123')).rejects.toThrow('Access denied to this cart');
    });

    it('should handle 429 Rate Limit error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ message: 'Rate limit exceeded' }),
      } as Response);

      await expect(provider.createCart()).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response);

      await expect(provider.getCart('cart_123')).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(provider.getCart('cart_123')).rejects.toThrow('Request timeout');
    });

    it('should properly encode special characters in cart IDs', async () => {
      const specialCartId = 'cart_123-abc_def';
      const mockCart: Cart = {
        id: specialCartId,
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      await provider.getCart(specialCartId);

      expect(mockFetch).toHaveBeenCalledWith(
        `${baseUrl}/v1/cart/${specialCartId}`,
        expect.any(Object)
      );
    });

    it('should handle cart with checkoutUrl', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        checkoutUrl: 'https://example.com/checkout/cart_123',
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await provider.getCart('cart_123');
      expect(result.checkoutUrl).toBe('https://example.com/checkout/cart_123');
    });
  });

  // ============================================================================
  // API Key and Headers
  // ============================================================================
  describe('API Key and Headers', () => {
    it('should include API key in all cart requests', async () => {
      const mockCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      } as Response);

      await provider.getCart('cart_123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': apiKey,
          }),
        })
      );
    });

    it('should work without API key', async () => {
      const providerNoKey = new ShopAPIProvider({
        baseUrl,
      });

      const mockCart: Cart = {
        id: 'cart_123',
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedShipping: 0,
        totalPrice: 0,
        createdAt: '2025-10-19T00:00:00Z',
        updatedAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      await providerNoKey.getCart('cart_123');

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)?.headers as Record<
        string,
        string
      >;
      expect(callHeaders).not.toHaveProperty('X-API-Key');
      expect(callHeaders['Content-Type']).toBe('application/json');
    });
  });
});
