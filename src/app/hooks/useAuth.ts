'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Customer, CustomerInput, LoginResponse } from '@/lib/commerce/types';

interface AuthState {
  customer: Customer | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    customer: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const shopAPI = useMemo(() => new ShopAPIProvider({
    baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
  }), []);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const loadAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const customerData = localStorage.getItem('customer');

      if (accessToken && customerData) {
        setState({
          customer: JSON.parse(customerData),
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await shopAPI.loginCustomer(email, password);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('customer', JSON.stringify(response.customer));

      setState({
        customer: response.customer,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [shopAPI]);

  const register = useCallback(async (input: CustomerInput): Promise<LoginResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await shopAPI.registerCustomer(input);

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('customer', JSON.stringify(response.customer));

      setState({
        customer: response.customer,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, [shopAPI]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('customer');

    setState({
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
  };
}
