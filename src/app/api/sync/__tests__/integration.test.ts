/**
 * Integration tests for Sync API route
 *
 * Tests the POST /api/sync endpoint that triggers Printful catalog sync
 */

import { POST } from '../route';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

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

// Mock ShopAPIProvider
jest.mock('@/lib/commerce/providers/shop-api');

// Mock environment variables
jest.mock('@/utils/env', () => ({
  env: {
    SHOP_API_URL: 'http://localhost:8080',
    SHOP_API_KEY: 'test_api_key',
  },
}));

describe('POST /api/sync', () => {
  let mockSyncPrintfulCatalog: jest.Mock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create mock function
    mockSyncPrintfulCatalog = jest.fn();

    // Mock ShopAPIProvider implementation
    (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).mockImplementation(() => ({
      syncPrintfulCatalog: mockSyncPrintfulCatalog,
    } as any));

    // Spy on console.error to test error logging
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('Successful Sync', () => {
    it('should return 202 Accepted when sync is triggered successfully', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      const response = await POST();

      expect(response.status).toBe(202);

      const body = await response.json();
      expect(body).toEqual(mockResponse);
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('status');
    });

    it('should call ShopAPIProvider.syncPrintfulCatalog', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      await POST();

      expect(mockSyncPrintfulCatalog).toHaveBeenCalledTimes(1);
      expect(mockSyncPrintfulCatalog).toHaveBeenCalledWith();
    });

    it('should instantiate ShopAPIProvider with correct config', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      await POST();

      expect(ShopAPIProvider).toHaveBeenCalledWith({
        baseUrl: 'http://localhost:8080',
        apiKey: 'test_api_key',
      });
    });

    it('should return different sync response structures', async () => {
      const mockResponse = {
        message: 'Sync completed',
        status: 'completed',
        itemsSynced: 42,
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      const response = await POST();

      expect(response.status).toBe(202);

      const body = await response.json();
      expect(body).toEqual(mockResponse);
      expect(body.itemsSynced).toBe(42);
    });
  });

  describe('Error Handling', () => {
    it('should return 500 error when ShopAPIProvider.syncPrintfulCatalog fails', async () => {
      const error = new Error('Failed to connect to shop-api');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body).toEqual({ error: 'Error syncing Printful catalog' });
    });

    it('should log error to console when sync fails', async () => {
      const error = new Error('Database connection error');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      await POST();

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error syncing Printful catalog:',
        error
      );
    });

    it('should not leak sensitive error details in response', async () => {
      const error = new Error('API_KEY=secret123 failed authentication');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();
      const body = await response.json();

      // Should not contain the actual error message
      expect(body.error).toBe('Error syncing Printful catalog');
      expect(body.error).not.toContain('API_KEY');
      expect(body.error).not.toContain('secret123');
      expect(body.error).not.toContain('authentication');
    });

    it('should not leak stack traces in response', async () => {
      const error = new Error('Internal error');
      error.stack = 'Error: Internal error\n    at /Users/sensitive/path/file.ts:123:45';
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();
      const body = await response.json();

      // Should not contain stack trace
      expect(JSON.stringify(body)).not.toContain('/Users/sensitive/path');
      expect(JSON.stringify(body)).not.toContain('file.ts');
    });

    it('should handle network errors', async () => {
      const error = new Error('Network request failed');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body).toEqual({ error: 'Error syncing Printful catalog' });
    });

    it('should handle timeout errors', async () => {
      const error = new Error('Request timeout');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body).toEqual({ error: 'Error syncing Printful catalog' });
    });

    it('should handle ShopAPIProvider instantiation errors', async () => {
      // Mock ShopAPIProvider to throw during construction
      (ShopAPIProvider as jest.MockedClass<typeof ShopAPIProvider>).mockImplementation(() => {
        throw new Error('Invalid configuration');
      });

      const response = await POST();

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body).toEqual({ error: 'Error syncing Printful catalog' });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle non-Error objects being thrown', async () => {
      mockSyncPrintfulCatalog.mockRejectedValueOnce('String error message');

      const response = await POST();

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body).toEqual({ error: 'Error syncing Printful catalog' });
    });

    it('should handle null/undefined errors gracefully', async () => {
      mockSyncPrintfulCatalog.mockRejectedValueOnce(null);

      const response = await POST();

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body).toEqual({ error: 'Error syncing Printful catalog' });
    });
  });

  describe('Response Format', () => {
    it('should return JSON response with correct content-type', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      const response = await POST();

      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return parseable JSON on success', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      const response = await POST();
      const body = await response.json();

      expect(body).toBeDefined();
      expect(typeof body).toBe('object');
    });

    it('should return parseable JSON on error', async () => {
      mockSyncPrintfulCatalog.mockRejectedValueOnce(new Error('Test error'));

      const response = await POST();
      const body = await response.json();

      expect(body).toBeDefined();
      expect(typeof body).toBe('object');
      expect(body).toHaveProperty('error');
    });
  });

  describe('Security', () => {
    it('should not expose API keys in error responses', async () => {
      const error = new Error('Authentication failed with key: test_api_key');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();
      const body = await response.json();

      expect(JSON.stringify(body)).not.toContain('test_api_key');
    });

    it('should not expose internal URLs in error responses', async () => {
      const error = new Error('Failed to connect to http://localhost:8080');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();
      const body = await response.json();

      expect(body.error).toBe('Error syncing Printful catalog');
      expect(JSON.stringify(body)).not.toContain('localhost:8080');
    });

    it('should not expose database connection strings', async () => {
      const error = new Error('DB connection failed: postgres://user:pass@localhost:5432/db');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();
      const body = await response.json();

      expect(JSON.stringify(body)).not.toContain('postgres://');
      expect(JSON.stringify(body)).not.toContain('user:pass');
    });

    it('should not expose file system paths', async () => {
      const error = new Error('Failed to read /etc/secrets/api-keys.json');
      mockSyncPrintfulCatalog.mockRejectedValueOnce(error);

      const response = await POST();
      const body = await response.json();

      expect(JSON.stringify(body)).not.toContain('/etc/secrets');
      expect(JSON.stringify(body)).not.toContain('api-keys.json');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty response from syncPrintfulCatalog', async () => {
      mockSyncPrintfulCatalog.mockResolvedValueOnce({});

      const response = await POST();

      expect(response.status).toBe(202);

      const body = await response.json();
      expect(body).toEqual({});
    });

    it('should handle null response from syncPrintfulCatalog', async () => {
      mockSyncPrintfulCatalog.mockResolvedValueOnce(null);

      const response = await POST();

      expect(response.status).toBe(202);

      const body = await response.json();
      expect(body).toBeNull();
    });

    it('should handle response with additional metadata', async () => {
      const mockResponse = {
        message: 'Catalog sync started',
        status: 'processing',
        metadata: {
          timestamp: '2025-10-19T12:00:00Z',
          triggeredBy: 'admin',
          syncId: 'sync_123',
        },
      };

      mockSyncPrintfulCatalog.mockResolvedValueOnce(mockResponse);

      const response = await POST();

      expect(response.status).toBe(202);

      const body = await response.json();
      expect(body).toEqual(mockResponse);
      expect(body.metadata).toBeDefined();
    });
  });
});
