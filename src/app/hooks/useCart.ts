'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Cart, CartItemInput } from '@/lib/commerce/types';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart on mount from Next.js API route
  // The API route manages the httpOnly cart_id cookie
  useEffect(() => {
    const loadCart = async () => {
      try {
        // GET /api/cart reads cart_id from httpOnly cookie
        const response = await fetch('/api/cart', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setCart(data.data);
          } else {
            // No cart exists, create one
            await createNewCart();
          }
        } else {
          // Cart not found or error, create new
          await createNewCart();
        }
      } catch (err) {
        console.error('Error loading cart:', err);
        // Try to create new cart on error
        await createNewCart();
      } finally {
        setIsLoading(false);
      }
    };

    const createNewCart = async () => {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setCart(data.data);
          }
        }
      } catch (err) {
        console.error('Error creating cart:', err);
      }
    };

    loadCart();
  }, []);

  const addItem = useCallback(async (item: CartItemInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // PATCH /api/cart adds items
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            productId: item.productId,
            merchandiseId: item.variantId,
            quantity: item.quantity,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      if (data.data) {
        setCart(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // PATCH /api/cart/line updates quantity
      const response = await fetch('/api/cart/line', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            id: itemId,
            quantity,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const data = await response.json();
      if (data.data) {
        setCart(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // PATCH /api/cart/line with quantity: 0 removes item
      const response = await fetch('/api/cart/line', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            id: itemId,
            quantity: 0,
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const data = await response.json();
      if (data.data) {
        setCart(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a new cart, which replaces the old one
      const response = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      const data = await response.json();
      if (data.data) {
        setCart(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cart,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
}
