import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { LoginResponse, Customer, CustomerInput } from '@/lib/commerce/types';

// Mock the ShopAPIProvider
jest.mock('@/lib/commerce/providers/shop-api');

describe('useAuth', () => {
  const mockCustomer: Customer = {
    id: 'cus_123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockLoginResponse: LoginResponse = {
    customer: mockCustomer,
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token',
    expiresAt: '2024-12-31T23:59:59Z',
  };

  const mockRegisterInput: CustomerInput = {
    email: 'newuser@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+0987654321',
    acceptsMarketing: true,
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Reset the mock implementation
    (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).mockClear();
  });

  describe('initialization', () => {
    it('should initialize with default unauthenticated state', async () => {
      const { result } = renderHook(() => useAuth());

      // After useEffect runs, should be in unauthenticated state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load auth state from localStorage on mount', async () => {
      // Pre-populate localStorage
      localStorage.setItem('accessToken', 'stored_access_token');
      localStorage.setItem('refreshToken', 'stored_refresh_token');
      localStorage.setItem('customer', JSON.stringify(mockCustomer));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.customer).toEqual(mockCustomer);
      expect(result.current.accessToken).toBe('stored_access_token');
      expect(result.current.refreshToken).toBe('stored_refresh_token');
    });

    it('should handle missing localStorage data on mount', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
    });

    it('should handle partial localStorage data (missing customer)', async () => {
      localStorage.setItem('accessToken', 'stored_access_token');
      localStorage.setItem('refreshToken', 'stored_refresh_token');
      // No customer data

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
    });

    it('should handle invalid JSON in localStorage', async () => {
      localStorage.setItem('accessToken', 'stored_access_token');
      localStorage.setItem('refreshToken', 'stored_refresh_token');
      localStorage.setItem('customer', 'invalid-json');

      const { result } = renderHook(() => useAuth());

      // Should not throw and should handle gracefully
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockLoginCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let response: LoginResponse | undefined;

      await act(async () => {
        response = await result.current.login('test@example.com', 'password123');
      });

      // Verify API was called
      expect(mockLoginCustomer).toHaveBeenCalledWith('test@example.com', 'password123');

      // Verify response
      expect(response).toEqual(mockLoginResponse);

      // Verify state updated
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.customer).toEqual(mockCustomer);
      expect(result.current.accessToken).toBe('mock_access_token');
      expect(result.current.refreshToken).toBe('mock_refresh_token');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      // Verify localStorage updated
      expect(localStorage.getItem('accessToken')).toBe('mock_access_token');
      expect(localStorage.getItem('refreshToken')).toBe('mock_refresh_token');
      expect(localStorage.getItem('customer')).toBe(JSON.stringify(mockCustomer));
    });

    it('should set loading state during login', async () => {
      const mockLoginCustomer = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 100);
        });
      });
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login('test@example.com', 'password123');
      });

      // Should be loading immediately
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle login failure with error message', async () => {
      const errorMessage = 'Invalid credentials';
      const mockLoginCustomer = jest.fn().mockRejectedValue(new Error(errorMessage));
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);

      // Verify localStorage not updated
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('customer')).toBeNull();
    });

    it('should handle login failure with non-Error object', async () => {
      const mockLoginCustomer = jest.fn().mockRejectedValue('String error');
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Login failed');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should clear previous errors on new login attempt', async () => {
      const mockLoginCustomer = jest.fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First login fails
      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrongpassword');
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe('First error');

      // Second login succeeds
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockRegisterCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.registerCustomer = mockRegisterCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let response: LoginResponse | undefined;

      await act(async () => {
        response = await result.current.register(mockRegisterInput);
      });

      // Verify API was called
      expect(mockRegisterCustomer).toHaveBeenCalledWith(mockRegisterInput);

      // Verify response
      expect(response).toEqual(mockLoginResponse);

      // Verify state updated
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.customer).toEqual(mockCustomer);
      expect(result.current.accessToken).toBe('mock_access_token');
      expect(result.current.refreshToken).toBe('mock_refresh_token');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      // Verify localStorage updated
      expect(localStorage.getItem('accessToken')).toBe('mock_access_token');
      expect(localStorage.getItem('refreshToken')).toBe('mock_refresh_token');
      expect(localStorage.getItem('customer')).toBe(JSON.stringify(mockCustomer));
    });

    it('should set loading state during registration', async () => {
      const mockRegisterCustomer = jest.fn().mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockLoginResponse), 100);
        });
      });
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.registerCustomer = mockRegisterCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.register(mockRegisterInput);
      });

      // Should be loading immediately
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should handle registration failure with error message', async () => {
      const errorMessage = 'Email already exists';
      const mockRegisterCustomer = jest.fn().mockRejectedValue(new Error(errorMessage));
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.registerCustomer = mockRegisterCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.register(mockRegisterInput);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);

      // Verify localStorage not updated
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('customer')).toBeNull();
    });

    it('should handle registration failure with non-Error object', async () => {
      const mockRegisterCustomer = jest.fn().mockRejectedValue('String error');
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.registerCustomer = mockRegisterCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.register(mockRegisterInput);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Registration failed');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should clear previous errors on new registration attempt', async () => {
      const mockRegisterCustomer = jest.fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.registerCustomer = mockRegisterCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First registration fails
      await act(async () => {
        try {
          await result.current.register(mockRegisterInput);
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe('First error');

      // Second registration succeeds
      await act(async () => {
        await result.current.register(mockRegisterInput);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Pre-populate localStorage and state
      localStorage.setItem('accessToken', 'stored_access_token');
      localStorage.setItem('refreshToken', 'stored_refresh_token');
      localStorage.setItem('customer', JSON.stringify(mockCustomer));

      const { result } = renderHook(() => useAuth());

      // Wait for auth to load
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        result.current.logout();
      });

      // Verify state cleared
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      // Verify localStorage cleared
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('customer')).toBeNull();
    });

    it('should logout when not authenticated', () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      // Should still result in logged out state
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.customer).toBeNull();
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
    });

    it('should clear error state on logout', async () => {
      const mockLoginCustomer = jest.fn().mockRejectedValue(new Error('Login failed'));
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Trigger login error
      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong');
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.error).toBe('Login failed');

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('ShopAPIProvider integration', () => {
    it('should create ShopAPIProvider with correct config', () => {
      renderHook(() => useAuth());

      expect(ShopAPIProvider).toHaveBeenCalledWith({
        baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
      });
    });

    it('should use NEXT_PUBLIC_SHOP_API_URL from environment', () => {
      const originalEnv = process.env.NEXT_PUBLIC_SHOP_API_URL;
      process.env.NEXT_PUBLIC_SHOP_API_URL = 'https://api.lemnispace.com';

      renderHook(() => useAuth());

      expect(ShopAPIProvider).toHaveBeenCalledWith({
        baseUrl: 'https://api.lemnispace.com',
      });

      // Restore
      process.env.NEXT_PUBLIC_SHOP_API_URL = originalEnv;
    });

    it('should reuse the same ShopAPIProvider instance', () => {
      const { rerender } = renderHook(() => useAuth());

      const firstCallCount = (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).mock.calls.length;

      rerender();

      const secondCallCount = (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).mock.calls.length;

      // Should not create a new instance on rerender (useMemo)
      expect(firstCallCount).toBe(secondCallCount);
    });
  });

  describe('state transitions', () => {
    it('should handle complete login/logout flow', async () => {
      const mockLoginCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Initial state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.isAuthenticated).toBe(false);

      // Login
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('should handle complete registration/logout flow', async () => {
      const mockRegisterCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.registerCustomer = mockRegisterCustomer;

      const { result } = renderHook(() => useAuth());

      // Initial state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      expect(result.current.isAuthenticated).toBe(false);

      // Register
      await act(async () => {
        await result.current.register(mockRegisterInput);
      });
      expect(result.current.isAuthenticated).toBe(true);
      expect(localStorage.getItem('accessToken')).toBeTruthy();

      // Logout
      act(() => {
        result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('should maintain authentication across hook remounts', async () => {
      const mockLoginCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result, unmount } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login
      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Unmount hook
      unmount();

      // Remount hook - should restore from localStorage
      const { result: newResult } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(newResult.current.isLoading).toBe(false);
      });

      expect(newResult.current.isAuthenticated).toBe(true);
      expect(newResult.current.customer).toEqual(mockCustomer);
      expect(newResult.current.accessToken).toBe('mock_access_token');
    });
  });

  describe('edge cases', () => {
    it('should handle concurrent login attempts gracefully', async () => {
      const mockLoginCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Start two login attempts concurrently
      await act(async () => {
        await Promise.all([
          result.current.login('test@example.com', 'password123'),
          result.current.login('test@example.com', 'password123'),
        ]);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(mockLoginCustomer).toHaveBeenCalledTimes(2);
    });

    it('should handle empty email and password in login', async () => {
      const mockLoginCustomer = jest.fn().mockRejectedValue(new Error('Invalid input'));
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        try {
          await result.current.login('', '');
        } catch (error) {
          // Expected
        }
      });

      expect(mockLoginCustomer).toHaveBeenCalledWith('', '');
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle localStorage quota exceeded gracefully', async () => {
      const mockLoginCustomer = jest.fn().mockResolvedValue(mockLoginResponse);
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).prototype.loginCustomer = mockLoginCustomer;

      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useAuth());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login should throw due to localStorage error
      await act(async () => {
        try {
          await result.current.login('test@example.com', 'password123');
        } catch (error) {
          // Expected
        }
      });

      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
  });
});
