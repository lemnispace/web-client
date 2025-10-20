'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Cart, CartItemInput } from '@/lib/commerce/types';
import { getCookie, setCookie } from '@/lib/utils/cookies';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shopAPI = useMemo(
    () =>
      new ShopAPIProvider({
        baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
      }),
    []
  );

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      const cartId = getCookie('cartId');
      if (cartId) {
        try {
          const cartData = await shopAPI.getCart(cartId);
          setCart(cartData);
        } catch (err) {
          // Cart not found, create new
          const newCart = await shopAPI.createCart();
          setCart(newCart);
          setCookie('cartId', newCart.id);
        }
      } else {
        // Create new cart
        const newCart = await shopAPI.createCart();
        setCart(newCart);
        setCookie('cartId', newCart.id);
      }
      setIsLoading(false);
    };

    loadCart();
  }, [shopAPI]);

  const addItem = useCallback(async (item: CartItemInput) => {
    if (!cart) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await shopAPI.addToCart(cart.id, [item]);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart, shopAPI]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    if (!cart) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await shopAPI.updateCartItem(cart.id, itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart, shopAPI]);

  const removeItem = useCallback(async (itemId: string) => {
    if (!cart) return;

    setIsLoading(true);
    setError(null);
    try {
      const updatedCart = await shopAPI.removeCartItem(cart.id, itemId);
      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart, shopAPI]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newCart = await shopAPI.createCart();
      setCart(newCart);
      setCookie('cartId', newCart.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [shopAPI]);

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
