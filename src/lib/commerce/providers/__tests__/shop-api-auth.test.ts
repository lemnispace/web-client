/**
 * Unit Tests for ShopAPIProvider Authentication Methods
 *
 * Tests cover:
 * - loginCustomer
 * - registerCustomer
 * - refreshAccessToken
 * - getCustomerProfile
 * - updateCustomerProfile
 *
 * Focus on token handling, Authorization headers, error cases, and API contract compliance.
 */

import { ShopAPIProvider } from '../shop-api';
import type { CustomerInput, LoginResponse, Customer } from '../../types';

import { createMockResponse, createMockErrorResponse } from '../test-helpers';
// Mock fetch globally
global.fetch = jest.fn();

describe('ShopAPIProvider - Authentication Methods', () => {
  let provider: ShopAPIProvider;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    provider = new ShopAPIProvider({
      baseUrl: 'http://localhost:8080',
      apiKey: 'test-api-key',
    });
    mockFetch.mockClear();
  });

  describe('loginCustomer', () => {
    const email = 'test@example.com';
    const password = 'SecurePass123!';

    const mockLoginResponse: LoginResponse = {
      customer: {
        id: 'cus_123abc',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        createdAt: '2025-10-15T10:00:00Z',
        updatedAt: '2025-10-15T10:00:00Z',
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh',
      expiresAt: '2025-10-15T11:00:00Z',
    };

    it('should successfully login with valid credentials', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockLoginResponse));

      const result = await provider.loginCustomer(email, password);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/login',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          }),
          body: JSON.stringify({ email, password }),
        })
      );

      expect(result).toEqual(mockLoginResponse);
      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
      expect(result.customer.id).toBe('cus_123abc');
    });

    it('should throw error for invalid credentials (401)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized', { message: 'Invalid email or password' }));

      await expect(provider.loginCustomer(email, password)).rejects.toThrow(
        'Invalid email or password'
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw error for account not found (404)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(404, 'Not Found', { message: 'Account not found' }));

      await expect(provider.loginCustomer(email, password)).rejects.toThrow(
        'Account not found'
      );
    });

    it('should throw error for server error (500)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(500, 'Internal Server Error', { message: 'Server error occurred' }));

      await expect(provider.loginCustomer(email, password)).rejects.toThrow(
        'Server error occurred'
      );
    });

    it('should throw error for rate limiting (429)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(429, 'Too Many Requests', { message: 'Too many login attempts' }));

      await expect(provider.loginCustomer(email, password)).rejects.toThrow(
        'Too many login attempts'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(provider.loginCustomer(email, password)).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        text: async () => '{}',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response);

      await expect(provider.loginCustomer(email, password)).rejects.toThrow();
    });

    it('should properly encode special characters in email', async () => {
      const specialEmail = 'test+tag@example.com';

      mockFetch.mockResolvedValueOnce(createMockResponse(mockLoginResponse));

      await provider.loginCustomer(specialEmail, password);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody.email).toBe(specialEmail);
    });
  });

  describe('registerCustomer', () => {
    const mockCustomerInput: CustomerInput = {
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1987654321',
      acceptsMarketing: true,
    };

    const mockRegisterResponse: LoginResponse = {
      customer: {
        id: 'cus_newuser456',
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1987654321',
        createdAt: '2025-10-15T10:00:00Z',
        updatedAt: '2025-10-15T10:00:00Z',
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_access',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_refresh',
      expiresAt: '2025-10-15T11:00:00Z',
    };

    it('should successfully register new customer with full details', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockRegisterResponse));

      const result = await provider.registerCustomer(mockCustomerInput);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/register',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          }),
          body: JSON.stringify(mockCustomerInput),
        })
      );

      expect(result).toEqual(mockRegisterResponse);
      expect(result.customer.email).toBe('newuser@example.com');
      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
    });

    it('should successfully register with minimal required fields', async () => {
      const minimalInput: CustomerInput = {
        email: 'minimal@example.com',
        password: 'MinimalPass123!',
      };

      const responseData = {
        ...mockRegisterResponse,
        customer: {
          ...mockRegisterResponse.customer,
          email: 'minimal@example.com',
          firstName: undefined,
          lastName: undefined,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(responseData),
        json: async () => responseData,
      } as Response);

      const result = await provider.registerCustomer(minimalInput);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/register',
        expect.objectContaining({
          body: JSON.stringify(minimalInput),
        })
      );

      expect(result.customer.email).toBe('minimal@example.com');
    });

    it('should throw error for duplicate email (409)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(409, 'Conflict', { message: 'Email already registered' }));

      await expect(provider.registerCustomer(mockCustomerInput)).rejects.toThrow(
        'Email already registered'
      );
    });

    it('should throw error for invalid email format (400)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Invalid email format' }));

      await expect(provider.registerCustomer(mockCustomerInput)).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should throw error for weak password (400)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', {
          message: 'Password must be at least 8 characters',
        }));

      await expect(provider.registerCustomer(mockCustomerInput)).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });

    it('should handle network errors during registration', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(provider.registerCustomer(mockCustomerInput)).rejects.toThrow(
        'Network failure'
      );
    });

    it('should register with default address', async () => {
      const inputWithAddress: CustomerInput = {
        ...mockCustomerInput,
        defaultAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          address1: '123 Main St',
          city: 'New York',
          country: 'US',
          zip: '10001',
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockRegisterResponse));

      await provider.registerCustomer(inputWithAddress);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody.defaultAddress).toBeDefined();
      expect(callBody.defaultAddress.city).toBe('New York');
    });
  });

  describe('refreshAccessToken', () => {
    const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_old';

    const mockRefreshResponse: LoginResponse = {
      customer: {
        id: 'cus_123abc',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2025-10-15T10:00:00Z',
        updatedAt: '2025-10-15T10:00:00Z',
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access_new',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh_new',
      expiresAt: '2025-10-15T12:00:00Z',
    };

    it('should successfully refresh access token', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockRefreshResponse));

      const result = await provider.refreshAccessToken(refreshToken);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/refresh',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
          }),
          body: JSON.stringify({ refreshToken }),
        })
      );

      expect(result).toEqual(mockRefreshResponse);
      expect(result.accessToken).not.toBe(refreshToken);
      expect(result.refreshToken).toBeTruthy();
    });

    it('should throw error for invalid refresh token (401)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized', { message: 'Invalid or expired refresh token' }));

      await expect(provider.refreshAccessToken(refreshToken)).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });

    it('should throw error for revoked refresh token (403)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'Refresh token has been revoked' }));

      await expect(provider.refreshAccessToken(refreshToken)).rejects.toThrow(
        'Refresh token has been revoked'
      );
    });

    it('should handle malformed refresh token', async () => {
      const malformedToken = 'not-a-valid-jwt-token';

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Malformed token' }));

      await expect(provider.refreshAccessToken(malformedToken)).rejects.toThrow(
        'Malformed token'
      );
    });

    it('should handle network errors during refresh', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection timeout'));

      await expect(provider.refreshAccessToken(refreshToken)).rejects.toThrow(
        'Connection timeout'
      );
    });
  });

  describe('getCustomerProfile', () => {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid_access';

    const mockCustomer: Customer = {
      id: 'cus_123abc',
      email: 'profile@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      createdAt: '2025-10-15T10:00:00Z',
      updatedAt: '2025-10-15T10:30:00Z',
    };

    it('should successfully get customer profile with valid token', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCustomer));

      const result = await provider.getCustomerProfile(accessToken);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/me',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
            Authorization: `Bearer ${accessToken}`,
          }),
        })
      );

      expect(result).toEqual(mockCustomer);
      expect(result.id).toBe('cus_123abc');
      expect(result.email).toBe('profile@example.com');
    });

    it('should verify Authorization header is set correctly', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockCustomer));

      await provider.getCustomerProfile(accessToken);

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)
        ?.headers as Record<string, string>;

      expect(callHeaders['Authorization']).toBe(`Bearer ${accessToken}`);
      expect(callHeaders['Authorization']).toContain('Bearer ');
    });

    it('should throw error for invalid token (401)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized', { message: 'Invalid or expired access token' }));

      await expect(provider.getCustomerProfile(accessToken)).rejects.toThrow(
        'Invalid or expired access token'
      );
    });

    it('should throw error for expired token (401)', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired';

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized', { message: 'Access token expired' }));

      await expect(provider.getCustomerProfile(expiredToken)).rejects.toThrow(
        'Access token expired'
      );
    });

    it('should throw error for malformed token (400)', async () => {
      const malformedToken = 'not-a-valid-token';

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Malformed authorization header' }));

      await expect(provider.getCustomerProfile(malformedToken)).rejects.toThrow(
        'Malformed authorization header'
      );
    });

    it('should handle network errors during profile fetch', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network unavailable'));

      await expect(provider.getCustomerProfile(accessToken)).rejects.toThrow(
        'Network unavailable'
      );
    });

    it('should handle server errors (500)', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(500, 'Internal Server Error', { message: 'Database connection failed' }));

      await expect(provider.getCustomerProfile(accessToken)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('updateCustomerProfile', () => {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.valid_access';

    const mockUpdatedCustomer: Customer = {
      id: 'cus_123abc',
      email: 'updated@example.com',
      firstName: 'Jane',
      lastName: 'Updated',
      phone: '+1999888777',
      createdAt: '2025-10-15T10:00:00Z',
      updatedAt: '2025-10-15T11:00:00Z',
    };

    it('should successfully update customer profile with valid token', async () => {
      const updates: Partial<CustomerInput> = {
        firstName: 'Jane',
        lastName: 'Updated',
        phone: '+1999888777',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUpdatedCustomer));

      const result = await provider.updateCustomerProfile(accessToken, updates);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customers/me',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-api-key',
            Authorization: `Bearer ${accessToken}`,
          }),
          body: JSON.stringify(updates),
        })
      );

      expect(result).toEqual(mockUpdatedCustomer);
      expect(result.firstName).toBe('Jane');
      expect(result.lastName).toBe('Updated');
    });

    it('should verify Authorization header is set correctly', async () => {
      const updates: Partial<CustomerInput> = { firstName: 'NewName' };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUpdatedCustomer));

      await provider.updateCustomerProfile(accessToken, updates);

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)
        ?.headers as Record<string, string>;

      expect(callHeaders['Authorization']).toBe(`Bearer ${accessToken}`);
      expect(callHeaders['Authorization']).toContain('Bearer ');
    });

    it('should update only specific fields', async () => {
      const updates: Partial<CustomerInput> = {
        phone: '+1111111111',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse({
          ...mockUpdatedCustomer,
          phone: '+1111111111',
        }));

      const result = await provider.updateCustomerProfile(accessToken, updates);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody).toEqual({ phone: '+1111111111' });
      expect(result.phone).toBe('+1111111111');
    });

    it('should update email', async () => {
      const updates: Partial<CustomerInput> = {
        email: 'newemail@example.com',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse({
          ...mockUpdatedCustomer,
          email: 'newemail@example.com',
        }));

      await provider.updateCustomerProfile(accessToken, updates);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody.email).toBe('newemail@example.com');
    });

    it('should update password', async () => {
      const updates: Partial<CustomerInput> = {
        password: 'NewSecurePass456!',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUpdatedCustomer));

      await provider.updateCustomerProfile(accessToken, updates);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody.password).toBe('NewSecurePass456!');
    });

    it('should throw error for invalid token (401)', async () => {
      const updates: Partial<CustomerInput> = { firstName: 'Test' };

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized', { message: 'Invalid access token' }));

      await expect(
        provider.updateCustomerProfile(accessToken, updates)
      ).rejects.toThrow('Invalid access token');
    });

    it('should throw error for duplicate email (409)', async () => {
      const updates: Partial<CustomerInput> = {
        email: 'existing@example.com',
      };

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(409, 'Conflict', { message: 'Email already in use' }));

      await expect(
        provider.updateCustomerProfile(accessToken, updates)
      ).rejects.toThrow('Email already in use');
    });

    it('should throw error for invalid data (400)', async () => {
      const updates: Partial<CustomerInput> = {
        email: 'invalid-email',
      };

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Invalid email format' }));

      await expect(
        provider.updateCustomerProfile(accessToken, updates)
      ).rejects.toThrow('Invalid email format');
    });

    it('should handle network errors during update', async () => {
      const updates: Partial<CustomerInput> = { firstName: 'Test' };

      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(
        provider.updateCustomerProfile(accessToken, updates)
      ).rejects.toThrow('Request timeout');
    });

    it('should handle server errors (500)', async () => {
      const updates: Partial<CustomerInput> = { firstName: 'Test' };

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(500, 'Internal Server Error', { message: 'Database update failed' }));

      await expect(
        provider.updateCustomerProfile(accessToken, updates)
      ).rejects.toThrow('Database update failed');
    });

    it('should handle empty updates object', async () => {
      const updates: Partial<CustomerInput> = {};

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUpdatedCustomer));

      await provider.updateCustomerProfile(accessToken, updates);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody).toEqual({});
    });

    it('should update multiple fields at once', async () => {
      const updates: Partial<CustomerInput> = {
        firstName: 'Multi',
        lastName: 'Update',
        phone: '+1222333444',
        acceptsMarketing: false,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse({
          ...mockUpdatedCustomer,
          firstName: 'Multi',
          lastName: 'Update',
          phone: '+1222333444',
        }));

      const result = await provider.updateCustomerProfile(accessToken, updates);

      const callBody = JSON.parse(
        (mockFetch.mock.calls[0][1] as RequestInit).body as string
      );
      expect(callBody).toEqual(updates);
      expect(result.firstName).toBe('Multi');
      expect(result.lastName).toBe('Update');
    });
  });

  describe('Authorization Header Edge Cases', () => {
    it('should handle Bearer token with special characters', async () => {
      const specialToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      mockFetch.mockResolvedValueOnce(createMockResponse({
          id: 'cus_123',
          email: 'test@example.com',
          createdAt: '2025-10-15T10:00:00Z',
          updatedAt: '2025-10-15T10:00:00Z',
        }));

      await provider.getCustomerProfile(specialToken);

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)
        ?.headers as Record<string, string>;

      expect(callHeaders['Authorization']).toBe(`Bearer ${specialToken}`);
    });

    it('should not double-prefix Bearer token', async () => {
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

      mockFetch.mockResolvedValueOnce(createMockResponse({
          id: 'cus_123',
          email: 'test@example.com',
          createdAt: '2025-10-15T10:00:00Z',
          updatedAt: '2025-10-15T10:00:00Z',
        }));

      await provider.getCustomerProfile(accessToken);

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)
        ?.headers as Record<string, string>;

      expect(callHeaders['Authorization']).toBe(`Bearer ${accessToken}`);
      expect(callHeaders['Authorization']).not.toContain('Bearer Bearer');
    });

    it('should handle empty string token gracefully', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized', { message: 'Missing authorization token' }));

      await expect(provider.getCustomerProfile('')).rejects.toThrow(
        'Missing authorization token'
      );
    });
  });

  describe('Provider Without API Key', () => {
    let providerNoKey: ShopAPIProvider;

    beforeEach(() => {
      providerNoKey = new ShopAPIProvider({
        baseUrl: 'http://localhost:8080',
      });
    });

    it('should not include X-API-Key header when API key is not provided', async () => {
      const responseData = {
        customer: { id: 'cus_123', email: 'test@example.com', createdAt: '2025-10-15T10:00:00Z', updatedAt: '2025-10-15T10:00:00Z' },
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: '2025-10-15T11:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(responseData),
        json: async () => responseData,
      } as Response);

      await providerNoKey.loginCustomer('test@example.com', 'password');

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)
        ?.headers as Record<string, string>;

      expect(callHeaders).not.toHaveProperty('X-API-Key');
      expect(callHeaders['Content-Type']).toBe('application/json');
    });

    it('should work with getCustomerProfile without API key', async () => {
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

      mockFetch.mockResolvedValueOnce(createMockResponse({
          id: 'cus_123',
          email: 'test@example.com',
          createdAt: '2025-10-15T10:00:00Z',
          updatedAt: '2025-10-15T10:00:00Z',
        }));

      await providerNoKey.getCustomerProfile(accessToken);

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)
        ?.headers as Record<string, string>;

      expect(callHeaders).not.toHaveProperty('X-API-Key');
      expect(callHeaders['Authorization']).toBe(`Bearer ${accessToken}`);
    });
  });

  describe('Concurrent Authentication Requests', () => {
    it('should handle concurrent login requests', async () => {
      const responseData = {
        customer: { id: 'cus_123', email: 'test@example.com', createdAt: '2025-10-15T10:00:00Z', updatedAt: '2025-10-15T10:00:00Z' },
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: '2025-10-15T11:00:00Z',
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: async () => JSON.stringify(responseData),
          json: async () => responseData,
        } as Response)
      );

      const requests = [
        provider.loginCustomer('user1@example.com', 'pass1'),
        provider.loginCustomer('user2@example.com', 'pass2'),
        provider.loginCustomer('user3@example.com', 'pass3'),
      ];

      const results = await Promise.all(requests);

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle concurrent profile updates', async () => {
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';

      const responseData = {
        id: 'cus_123',
        email: 'test@example.com',
        firstName: 'Updated',
        createdAt: '2025-10-15T10:00:00Z',
        updatedAt: '2025-10-15T11:00:00Z',
      };

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          text: async () => JSON.stringify(responseData),
          json: async () => responseData,
        } as Response)
      );

      const requests = [
        provider.updateCustomerProfile(accessToken, { firstName: 'Name1' }),
        provider.updateCustomerProfile(accessToken, { lastName: 'Name2' }),
        provider.updateCustomerProfile(accessToken, { phone: '+1234567890' }),
      ];

      const results = await Promise.all(requests);

      expect(results).toHaveLength(3);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });
});
