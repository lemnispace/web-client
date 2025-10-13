/**
 * Tests for Sync API Route
 *
 * Tests the Printful catalog sync endpoint
 */

import { POST } from '../route';
import * as commerce from '@/lib/commerce';

jest.mock('@/lib/commerce');

const mockGetDefaultProvider = commerce.getDefaultProvider as jest.MockedFunction<typeof commerce.getDefaultProvider>;

describe('Sync API Route', () => {
  const mockCommerceProvider = {
    syncPrintfulCatalog: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDefaultProvider.mockReturnValue(mockCommerceProvider as any);
  });

  describe('POST /api/sync', () => {
    it('should trigger Printful catalog sync', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockResolvedValue({
        message: 'Catalog sync started',
        status: 'processing',
      });

      const response = await POST();
      const json = await response.json();

      expect(mockCommerceProvider.syncPrintfulCatalog).toHaveBeenCalled();
      expect(response.status).toBe(202); // Accepted - async operation
      expect(json.data).toEqual({
        message: 'Catalog sync started',
        status: 'processing',
      });
    });

    it('should return async status indicating background processing', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockResolvedValue({
        message: 'Catalog sync initiated',
        status: 'pending',
      });

      const response = await POST();
      const json = await response.json();

      expect(response.status).toBe(202);
      expect(json.data.status).toBeDefined();
      expect(json.data.message).toBeDefined();
    });

    it('should handle sync errors from commerce provider', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockRejectedValue(
        new Error('Printful API unavailable')
      );

      const response = await POST();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error syncing Printful catalog');
      expect(json.data).toBeUndefined();
    });

    it('should handle authentication errors', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockRejectedValue(
        new Error('Invalid API key')
      );

      const response = await POST();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error syncing Printful catalog');
    });

    it('should handle timeout errors', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockRejectedValue(
        new Error('Request timeout')
      );

      const response = await POST();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error syncing Printful catalog');
    });

    it('should handle network errors', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockRejectedValue(
        new Error('Network error')
      );

      const response = await POST();
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error syncing Printful catalog');
    });

    it('should not expose internal error details', async () => {
      mockCommerceProvider.syncPrintfulCatalog.mockRejectedValue(
        new Error('Database connection failed: credentials invalid')
      );

      const response = await POST();
      const json = await response.json();

      expect(json.errors).toBe('Error syncing Printful catalog');
      expect(json.errors).not.toContain('Database');
      expect(json.errors).not.toContain('credentials');
    });
  });
});
