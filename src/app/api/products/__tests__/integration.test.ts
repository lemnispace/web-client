/**
 * Integration tests for Products API route
 *
 * Tests the customization image upload endpoint which stores
 * user-uploaded images for product customizations in shop-api.
 */

import { POST } from '../route';
import type { CustomizationUploadResponse } from '../route';
import * as commerceModule from '@/lib/commerce';
import * as visitorIdModule from '@/utils/cookies/visitorId';
import { MAX_IMG_FILE_SIZE } from '@/utils/constants';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/commerce');
jest.mock('@/utils/cookies/visitorId');

// Mock Next.js server
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: (data: any, init?: ResponseInit) => {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...init?.headers,
        },
      });
    },
  },
}));

describe('Products API - POST /api/products', () => {
  const mockUploadCustomizationImage = jest.fn();
  const mockGetOrCreateVisitorId = jest.fn();

  /**
   * Helper function to create a NextRequest with FormData
   */
  const createFormDataRequest = (formData: FormData): any => {
    return {
      formData: async () => formData,
      headers: new Headers(),
      url: 'http://localhost:3000/api/products',
      method: 'POST',
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock commerce provider
    (commerceModule.getDefaultProvider as jest.Mock).mockReturnValue({
      uploadCustomizationImage: mockUploadCustomizationImage,
    });

    // Mock visitor ID
    mockGetOrCreateVisitorId.mockReturnValue('visitor_123');
    (visitorIdModule.getOrCreateVisitorId as jest.Mock) = mockGetOrCreateVisitorId;
  });

  describe('Successful Upload', () => {
    it('should upload customization image and return image data', async () => {
      const mockUploadResult = {
        id: 'img_123',
        url: 'https://example.com/images/img_123.jpg',
        width: 800,
        height: 600,
      };
      mockUploadCustomizationImage.mockResolvedValueOnce(mockUploadResult);

      const file = new File(['test image content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.errors).toBeUndefined();
      expect(data.data).toEqual({
        imageId: 'img_123',
        imageUrl: 'https://example.com/images/img_123.jpg',
        productId: 'prod_123',
        variantId: 'var_456',
        width: 800,
        height: 600,
      });

      expect(mockUploadCustomizationImage).toHaveBeenCalledWith(
        expect.any(File),
        'visitor_123',
        {
          productId: 'prod_123',
          variantId: 'var_456',
        }
      );
      expect(mockGetOrCreateVisitorId).toHaveBeenCalled();
    });

    it('should handle PNG image upload', async () => {
      const mockUploadResult = {
        id: 'img_456',
        url: 'https://example.com/images/img_456.png',
        width: 1024,
        height: 768,
      };
      mockUploadCustomizationImage.mockResolvedValueOnce(mockUploadResult);

      const file = new File(['png content'], 'design.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_789');
      formData.append('variantId', 'var_012');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.imageId).toBe('img_456');
      expect(data.data.productId).toBe('prod_789');
    });

    it('should handle upload without width/height in response', async () => {
      const mockUploadResult = {
        id: 'img_789',
        url: 'https://example.com/images/img_789.jpg',
      };
      mockUploadCustomizationImage.mockResolvedValueOnce(mockUploadResult);

      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_111');
      formData.append('variantId', 'var_222');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.width).toBeUndefined();
      expect(data.data.height).toBeUndefined();
      expect(data.data.imageId).toBe('img_789');
    });
  });

  describe('File Validation', () => {
    it('should reject missing file', async () => {
      const formData = new FormData();
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should reject non-image file types', async () => {
      const file = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should reject files exceeding size limit', async () => {
      const largeContent = new Array(MAX_IMG_FILE_SIZE + 1024).fill('x').join('');
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should accept various image MIME types', async () => {
      const imageTypes = [
        { type: 'image/jpeg', name: 'photo.jpg' },
        { type: 'image/png', name: 'design.png' },
        { type: 'image/gif', name: 'animation.gif' },
        { type: 'image/webp', name: 'modern.webp' },
      ];

      for (const imageType of imageTypes) {
        mockUploadCustomizationImage.mockResolvedValueOnce({
          id: 'img_test',
          url: 'https://example.com/test.jpg',
        });

        const file = new File(['content'], imageType.name, { type: imageType.type });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('productId', 'prod_123');
        formData.append('variantId', 'var_456');

        const request = createFormDataRequest(formData);
        const response = await POST(request);
        expect(response.status).toBe(201);
      }
    });
  });

  describe('Parameter Validation', () => {
    it('should reject missing productId', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should reject missing variantId', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(data.data).toBeUndefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should reject empty productId', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', '   ');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should reject empty variantId', async () => {
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', '');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.errors).toBeDefined();
      expect(mockUploadCustomizationImage).not.toHaveBeenCalled();
    });

    it('should trim and accept valid string parameters', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_123',
        url: 'https://example.com/img_123.jpg',
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', '  prod_123  ');
      formData.append('variantId', '  var_456  ');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.productId).toBe('prod_123');
      expect(data.data.variantId).toBe('var_456');
    });
  });

  describe('Error Handling', () => {
    it('should handle commerce provider upload failure', async () => {
      mockUploadCustomizationImage.mockRejectedValueOnce(
        new Error('Upload failed: S3 error')
      );

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.errors).toBe('Error uploading customization image');
      expect(data.data).toBeUndefined();
    });

    it('should handle network errors', async () => {
      mockUploadCustomizationImage.mockRejectedValueOnce(
        new Error('Network timeout')
      );

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.errors).toBe('Error uploading customization image');
    });

    it('should handle unexpected errors gracefully', async () => {
      mockUploadCustomizationImage.mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.errors).toBe('Error uploading customization image');
    });
  });

  describe('Visitor ID Handling', () => {
    it('should use visitor ID from cookie utility', async () => {
      mockGetOrCreateVisitorId.mockReturnValueOnce('visitor_custom_456');
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_123',
        url: 'https://example.com/img_123.jpg',
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      await POST(request);

      expect(mockGetOrCreateVisitorId).toHaveBeenCalled();
      expect(mockUploadCustomizationImage).toHaveBeenCalledWith(
        expect.any(File),
        'visitor_custom_456',
        expect.any(Object)
      );
    });

    it('should create new visitor ID if none exists', async () => {
      mockGetOrCreateVisitorId.mockReturnValueOnce('new_visitor_789');
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_123',
        url: 'https://example.com/img_123.jpg',
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      await POST(request);

      expect(mockUploadCustomizationImage).toHaveBeenCalledWith(
        expect.any(File),
        'new_visitor_789',
        expect.any(Object)
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle file with special characters in name', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_special',
        url: 'https://example.com/img_special.jpg',
      });

      const file = new File(['content'], 'my design (v2) [final].jpg', {
        type: 'image/jpeg'
      });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle very long product and variant IDs', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_123',
        url: 'https://example.com/img_123.jpg',
      });

      const longId = 'prod_' + 'x'.repeat(100);
      const longVariantId = 'var_' + 'y'.repeat(100);

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', longId);
      formData.append('variantId', longVariantId);

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data.productId).toBe(longId);
      expect(data.data.variantId).toBe(longVariantId);
    });

    it('should handle exactly max file size', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_max',
        url: 'https://example.com/img_max.jpg',
      });

      const content = new Array(MAX_IMG_FILE_SIZE).fill('x').join('');
      const file = new File([content], 'maxsize.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should handle minimum valid file size', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_min',
        url: 'https://example.com/img_min.jpg',
      });

      const file = new File(['x'], 'tiny.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      expect(response.status).toBe(201);
    });
  });

  describe('Response Format', () => {
    it('should return correct response structure for successful upload', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_response',
        url: 'https://example.com/img_response.jpg',
        width: 1920,
        height: 1080,
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data: { data?: CustomizationUploadResponse; errors?: any } = await response.json();

      expect(data).toHaveProperty('data');
      expect(data.errors).toBeUndefined();

      expect(data.data).toHaveProperty('imageId');
      expect(data.data).toHaveProperty('imageUrl');
      expect(data.data).toHaveProperty('productId');
      expect(data.data).toHaveProperty('variantId');
      expect(data.data).toHaveProperty('width');
      expect(data.data).toHaveProperty('height');

      expect(typeof data.data!.imageId).toBe('string');
      expect(typeof data.data!.imageUrl).toBe('string');
      expect(typeof data.data!.productId).toBe('string');
      expect(typeof data.data!.variantId).toBe('string');
      expect(typeof data.data!.width).toBe('number');
      expect(typeof data.data!.height).toBe('number');
    });

    it('should return correct response structure for validation errors', async () => {
      const formData = new FormData();

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('errors');
      expect(data.errors).toBeDefined();
      expect(Array.isArray(data.errors)).toBe(true);
    });

    it('should return correct response structure for server errors', async () => {
      mockUploadCustomizationImage.mockRejectedValueOnce(new Error('Server error'));

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('errors');
      expect(data.errors).toBe('Error uploading customization image');
    });
  });

  describe('HTTP Status Codes', () => {
    it('should return 201 Created for successful upload', async () => {
      mockUploadCustomizationImage.mockResolvedValueOnce({
        id: 'img_123',
        url: 'https://example.com/img_123.jpg',
      });

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('should return 400 Bad Request for validation errors', async () => {
      const formData = new FormData();
      formData.append('productId', 'prod_123');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should return 500 Internal Server Error for upload failures', async () => {
      mockUploadCustomizationImage.mockRejectedValueOnce(new Error('Upload failed'));

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = createFormDataRequest(formData);
      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
