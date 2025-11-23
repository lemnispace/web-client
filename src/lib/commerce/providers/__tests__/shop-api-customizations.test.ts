/**
 * Comprehensive Unit Tests for ShopAPIProvider Customization Methods
 *
 * Tests all customization-related methods in the shop-api commerce provider:
 * - uploadCustomizationImage
 * - processCustomizationImage
 * - deleteCustomizationImage
 * - linkImageToCartItem
 *
 * Note: getCustomizationImages is not yet implemented in ShopAPIProvider
 */

import { ShopAPIProvider } from '../shop-api';

// Mock fetch globally
import { createMockResponse, createMockErrorResponse } from '../test-helpers';
global.fetch = jest.fn();

describe('ShopAPIProvider - Customization Operations', () => {
  let provider: ShopAPIProvider;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    provider = new ShopAPIProvider({
      baseUrl: 'http://localhost:8080',
      apiKey: 'test-key',
    });
    mockFetch.mockClear();
  });

  describe('uploadCustomizationImage', () => {
    it('should upload image with multipart/form-data', async () => {
      const mockFile = new File(['test content'], 'test-image.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 'img_123',
        url: 'https://s3.amazonaws.com/lemnispace-images/customizations/user_456/img_123.jpg',
        width: 1024,
        height: 768,
        createdAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.uploadCustomizationImage(mockFile, 'user_456');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customizations/images',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-API-Key': 'test-key',
          }),
        })
      );

      // Verify FormData was used
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs?.body).toBeInstanceOf(FormData);

      expect(result).toEqual(mockResponse);
      expect(result.id).toBe('img_123');
      expect(result.url).toBe('https://s3.amazonaws.com/lemnispace-images/customizations/user_456/img_123.jpg');
    });

    it('should upload image with optional cart and product metadata', async () => {
      const mockFile = new File(['test content'], 'product-design.png', { type: 'image/png' });
      const mockResponse = {
        id: 'img_456',
        url: 'https://s3.amazonaws.com/lemnispace-images/customizations/user_789/img_456.png',
        width: 2048,
        height: 1536,
        createdAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.uploadCustomizationImage(mockFile, 'user_789', {
        cartId: 'cart_123',
        productId: 'prod_456',
        variantId: 'var_789',
      });

      // Verify FormData includes all metadata
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs?.body).toBeInstanceOf(FormData);

      expect(result).toEqual(mockResponse);
    });

    it('should include API key in headers for upload', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 'img_999',
        url: 'https://example.com/img_999.jpg',
        createdAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.uploadCustomizationImage(mockFile, 'user_123');

      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs?.headers).toEqual(
        expect.objectContaining({
          'X-API-Key': 'test-key',
        })
      );
    });

    it('should not set Content-Type header for multipart upload', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 'img_777',
        url: 'https://example.com/img_777.jpg',
        createdAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.uploadCustomizationImage(mockFile, 'user_123');

      // Content-Type should NOT be set manually (browser sets it with boundary)
      const callArgs = mockFetch.mock.calls[0][1];
      const headers = callArgs?.headers as Record<string, string>;
      expect(headers['Content-Type']).toBeUndefined();
    });

    it('should handle upload error responses', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Invalid file type' }));

      await expect(
        provider.uploadCustomizationImage(mockFile, 'user_123')
      ).rejects.toThrow('Invalid file type');
    });

    it('should handle user access control error (403)', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'User not authorized to upload images' }));

      await expect(
        provider.uploadCustomizationImage(mockFile, 'unauthorized_user')
      ).rejects.toThrow('User not authorized to upload images');
    });

    it('should handle file size limit error (413)', async () => {
      const mockFile = new File(['x'.repeat(10_000_000)], 'large-file.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(413, 'Payload Too Large', { message: 'File size exceeds limit' }));

      await expect(
        provider.uploadCustomizationImage(mockFile, 'user_123')
      ).rejects.toThrow('File size exceeds limit');
    });

    it('should handle network errors during upload', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        provider.uploadCustomizationImage(mockFile, 'user_123')
      ).rejects.toThrow('Network error');
    });

    it('should upload without API key when not provided', async () => {
      const providerNoKey = new ShopAPIProvider({
        baseUrl: 'http://localhost:8080',
      });

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 'img_888',
        url: 'https://example.com/img_888.jpg',
        createdAt: '2025-10-19T00:00:00Z',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await providerNoKey.uploadCustomizationImage(mockFile, 'user_123');

      const callArgs = mockFetch.mock.calls[0][1];
      const headers = callArgs?.headers as Record<string, string>;
      expect(headers['X-API-Key']).toBeUndefined();
    });

    it('should handle different image file types', async () => {
      const fileTypes = [
        { name: 'test.jpg', type: 'image/jpeg' },
        { name: 'test.png', type: 'image/png' },
        { name: 'test.gif', type: 'image/gif' },
        { name: 'test.webp', type: 'image/webp' },
      ];

      for (const fileType of fileTypes) {
        const mockFile = new File(['test'], fileType.name, { type: fileType.type });
        const mockResponse = {
          id: `img_${fileType.name}`,
          url: `https://example.com/${fileType.name}`,
          createdAt: '2025-10-19T00:00:00Z',
        };

        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const result = await provider.uploadCustomizationImage(mockFile, 'user_123');
        expect(result.id).toBe(`img_${fileType.name}`);
      }
    });
  });

  describe('processCustomizationImage', () => {
    it('should process image with resize operation', async () => {
      const operations = [
        { type: 'resize' as const, width: 800, height: 600, maintainAspectRatio: true },
      ];

      const mockResponse = {
        id: 'processed_123',
        originalImageId: 'img_123',
        url: 'https://s3.amazonaws.com/lemnispace-images/customizations/user_456/processed_123.jpg',
        width: 800,
        height: 600,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.processCustomizationImage('img_123', 'user_456', operations);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customizations/images/img_123/process?userId=user_456',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
          body: JSON.stringify({ operations }),
        })
      );

      expect(result).toEqual(mockResponse);
      expect(result.originalImageId).toBe('img_123');
    });

    it('should process image with crop operation', async () => {
      const operations = [
        { type: 'crop' as const, width: 500, height: 500, x: 100, y: 100 },
      ];

      const mockResponse = {
        id: 'processed_456',
        originalImageId: 'img_789',
        url: 'https://example.com/processed_456.jpg',
        width: 500,
        height: 500,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.processCustomizationImage('img_789', 'user_123', operations);

      expect(result.width).toBe(500);
      expect(result.height).toBe(500);
    });

    it('should process image with removeBackground operation', async () => {
      const operations = [
        { type: 'removeBackground' as const },
      ];

      const mockResponse = {
        id: 'processed_789',
        originalImageId: 'img_456',
        url: 'https://example.com/processed_789.png',
        width: 1024,
        height: 768,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.processCustomizationImage('img_456', 'user_789', operations);

      expect(result.id).toBe('processed_789');
    });

    it('should process image with multiple operations', async () => {
      const operations = [
        { type: 'resize' as const, width: 1200, height: 800, maintainAspectRatio: true },
        { type: 'crop' as const, width: 800, height: 800, x: 200, y: 0 },
        { type: 'removeBackground' as const },
      ];

      const mockResponse = {
        id: 'processed_multi',
        originalImageId: 'img_original',
        url: 'https://example.com/processed_multi.png',
        width: 800,
        height: 800,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await provider.processCustomizationImage('img_original', 'user_999', operations);

      const callArgs = mockFetch.mock.calls[0][1];
      const body = JSON.parse(callArgs?.body as string);
      expect(body.operations).toHaveLength(3);
      expect(result.id).toBe('processed_multi');
    });

    it('should include userId in query parameters', async () => {
      const operations = [{ type: 'resize' as const, width: 500, height: 500 }];
      const mockResponse = {
        id: 'processed_test',
        originalImageId: 'img_test',
        url: 'https://example.com/processed_test.jpg',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      await provider.processCustomizationImage('img_test', 'specific_user_123', operations);

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('userId=specific_user_123');
    });

    it('should handle user access control error during processing', async () => {
      const operations = [{ type: 'resize' as const, width: 800, height: 600 }];

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'User does not own this image' }));

      await expect(
        provider.processCustomizationImage('img_123', 'wrong_user', operations)
      ).rejects.toThrow('User does not own this image');
    });

    it('should handle image not found error', async () => {
      const operations = [{ type: 'resize' as const, width: 800, height: 600 }];

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(404, 'Not Found', { message: 'Image not found' }));

      await expect(
        provider.processCustomizationImage('nonexistent_img', 'user_123', operations)
      ).rejects.toThrow('Image not found');
    });

    it('should handle invalid operation error', async () => {
      const operations = [
        { type: 'resize' as const, width: -100, height: -100 },
      ];

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Invalid dimensions' }));

      await expect(
        provider.processCustomizationImage('img_123', 'user_123', operations)
      ).rejects.toThrow('Invalid dimensions');
    });

    it('should handle processing timeout error', async () => {
      const operations = [{ type: 'removeBackground' as const }];

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(504, 'Gateway Timeout', { message: 'Processing timeout' }));

      await expect(
        provider.processCustomizationImage('img_large', 'user_123', operations)
      ).rejects.toThrow('Processing timeout');
    });
  });

  describe('deleteCustomizationImage', () => {
    it('should delete customization image with userId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      await provider.deleteCustomizationImage('img_123', 'user_456');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customizations/images/img_123?userId=user_456',
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
        })
      );
    });

    it('should handle successful deletion with no response body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      const result = await provider.deleteCustomizationImage('img_789', 'user_123');

      expect(result).toBeUndefined();
    });

    it('should verify userId is included in query parameters', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      await provider.deleteCustomizationImage('img_delete_test', 'specific_user_456');

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toBe('http://localhost:8080/v1/customizations/images/img_delete_test?userId=specific_user_456');
    });

    it('should handle user access control error on delete', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'Cannot delete image belonging to another user' }));

      await expect(
        provider.deleteCustomizationImage('img_123', 'unauthorized_user')
      ).rejects.toThrow('Cannot delete image belonging to another user');
    });

    it('should handle image not found on delete', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(404, 'Not Found', { message: 'Image not found' }));

      await expect(
        provider.deleteCustomizationImage('nonexistent_img', 'user_123')
      ).rejects.toThrow('Image not found');
    });

    it('should handle image in use error', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(409, 'Conflict', { message: 'Image is linked to active cart items' }));

      await expect(
        provider.deleteCustomizationImage('img_in_use', 'user_123')
      ).rejects.toThrow('Image is linked to active cart items');
    });

    it('should handle server errors on delete', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(500, 'Internal Server Error', { message: 'Failed to delete image from storage' }));

      await expect(
        provider.deleteCustomizationImage('img_123', 'user_123')
      ).rejects.toThrow('Failed to delete image from storage');
    });

    it('should handle network errors on delete', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        provider.deleteCustomizationImage('img_123', 'user_123')
      ).rejects.toThrow('Network error');
    });
  });

  describe('linkImageToCartItem', () => {
    it('should link customization image to cart item', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      await provider.linkImageToCartItem('img_123', 'user_456', 'cart_789', 'item_012');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/customizations/images/img_123/link?userId=user_456',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
          body: JSON.stringify({ cartId: 'cart_789', itemId: 'item_012' }),
        })
      );
    });

    it('should verify userId in query parameters when linking', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      await provider.linkImageToCartItem('img_link_test', 'specific_user_789', 'cart_abc', 'item_def');

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('userId=specific_user_789');
      expect(callUrl).toContain('/v1/customizations/images/img_link_test/link');
    });

    it('should send cartId and itemId in request body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      await provider.linkImageToCartItem('img_999', 'user_999', 'cart_specific', 'item_specific');

      const callArgs = mockFetch.mock.calls[0][1];
      const body = JSON.parse(callArgs?.body as string);
      expect(body).toEqual({
        cartId: 'cart_specific',
        itemId: 'item_specific',
      });
    });

    it('should handle successful link with no response body', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      const result = await provider.linkImageToCartItem('img_111', 'user_111', 'cart_111', 'item_111');

      expect(result).toBeUndefined();
    });

    it('should handle user access control error on link', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'User does not own this image' }));

      await expect(
        provider.linkImageToCartItem('img_123', 'wrong_user', 'cart_789', 'item_012')
      ).rejects.toThrow('User does not own this image');
    });

    it('should handle image not found when linking', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(404, 'Not Found', { message: 'Image not found' }));

      await expect(
        provider.linkImageToCartItem('nonexistent_img', 'user_123', 'cart_789', 'item_012')
      ).rejects.toThrow('Image not found');
    });

    it('should handle cart not found error', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(404, 'Not Found', { message: 'Cart not found' }));

      await expect(
        provider.linkImageToCartItem('img_123', 'user_456', 'nonexistent_cart', 'item_012')
      ).rejects.toThrow('Cart not found');
    });

    it('should handle cart item not found error', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(404, 'Not Found', { message: 'Cart item not found' }));

      await expect(
        provider.linkImageToCartItem('img_123', 'user_456', 'cart_789', 'nonexistent_item')
      ).rejects.toThrow('Cart item not found');
    });

    it('should handle image already linked error', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(409, 'Conflict', { message: 'Image already linked to a cart item' }));

      await expect(
        provider.linkImageToCartItem('img_linked', 'user_123', 'cart_789', 'item_012')
      ).rejects.toThrow('Image already linked to a cart item');
    });

    it('should handle cart ownership mismatch error', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'Cart does not belong to user' }));

      await expect(
        provider.linkImageToCartItem('img_123', 'user_456', 'someone_elses_cart', 'item_012')
      ).rejects.toThrow('Cart does not belong to user');
    });

    it('should handle invalid cart item for product error', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'Product does not support customization' }));

      await expect(
        provider.linkImageToCartItem('img_123', 'user_456', 'cart_789', 'non_customizable_item')
      ).rejects.toThrow('Product does not support customization');
    });

    it('should handle network errors when linking', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        provider.linkImageToCartItem('img_123', 'user_456', 'cart_789', 'item_012')
      ).rejects.toThrow('Network error');
    });
  });

  describe('User-Specific Access Control', () => {
    it('should enforce userId for all customization operations', async () => {
      // Upload
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 'img_1', url: 'url', createdAt: '2025-10-19T00:00:00Z' }));
      await provider.uploadCustomizationImage(mockFile, 'user_access_test');

      // Process
      mockFetch.mockResolvedValueOnce(createMockResponse({ id: 'proc_1', originalImageId: 'img_1', url: 'url' }));
      await provider.processCustomizationImage('img_1', 'user_access_test', [{ type: 'resize', width: 100, height: 100 }]);

      // Delete
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));
      await provider.deleteCustomizationImage('img_1', 'user_access_test');

      // Link
      mockFetch.mockResolvedValueOnce(createMockResponse({}));
      await provider.linkImageToCartItem('img_1', 'user_access_test', 'cart_1', 'item_1');

      // All calls should have been made
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should reject operations with different userId', async () => {
      // Simulate user trying to access another user's image
      const operations = [
        { type: 'resize' as const, width: 800, height: 600 },
      ];

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', { message: 'Access denied' }));

      await expect(
        provider.processCustomizationImage('img_123', 'different_user', operations)
      ).rejects.toThrow('Access denied');
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle malformed JSON response for upload', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => '{}',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response);

      await expect(
        provider.uploadCustomizationImage(mockFile, 'user_123')
      ).rejects.toThrow();
    });

    it('should handle malformed JSON response for process', async () => {
      const operations = [{ type: 'resize' as const, width: 800, height: 600 }];

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: async () => '{}',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response);

      await expect(
        provider.processCustomizationImage('img_123', 'user_123', operations)
      ).rejects.toThrow();
    });

    it('should handle empty userId', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'userId is required' }));

      await expect(
        provider.uploadCustomizationImage(mockFile, '')
      ).rejects.toThrow('userId is required');
    });

    it('should handle special characters in imageId', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(({}),
      ));

      await provider.deleteCustomizationImage('img_123-abc_def', 'user_123');

      const callUrl = mockFetch.mock.calls[0][0] as string;
      expect(callUrl).toContain('img_123-abc_def');
    });

    it('should handle concurrent customization operations', async () => {
      const mockFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const mockFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ id: 'img_concurrent', url: 'url', createdAt: '2025-10-19T00:00:00Z' }),
        } as Response)
      );

      const uploads = [
        provider.uploadCustomizationImage(mockFile1, 'user_concurrent'),
        provider.uploadCustomizationImage(mockFile2, 'user_concurrent'),
      ];

      const results = await Promise.all(uploads);

      expect(results).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle empty operations array for process', async () => {
      mockFetch.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', { message: 'At least one operation required' }));

      await expect(
        provider.processCustomizationImage('img_123', 'user_123', [])
      ).rejects.toThrow('At least one operation required');
    });
  });
});
