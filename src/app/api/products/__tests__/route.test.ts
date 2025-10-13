/**
 * Tests for Products API Route (Customization Upload)
 *
 * Tests the customization image upload endpoint
 */

import { NextRequest } from 'next/server';
import { POST } from '../route';
import * as commerce from '@/lib/commerce';
import * as visitorId from '@/utils/cookies/visitorId';

jest.mock('@/lib/commerce');
jest.mock('@/utils/cookies/visitorId');

const mockGetDefaultProvider = commerce.getDefaultProvider as jest.MockedFunction<typeof commerce.getDefaultProvider>;
const mockGetOrCreateVisitorId = visitorId.getOrCreateVisitorId as jest.MockedFunction<typeof visitorId.getOrCreateVisitorId>;

describe('Products API Route (Customization Upload)', () => {
  const mockUploadResponse = {
    id: 'img_123',
    url: 'https://example.com/customizations/img_123.jpg',
    width: 800,
    height: 600,
    createdAt: '2025-10-12T00:00:00Z',
  };

  const mockCommerceProvider = {
    uploadCustomizationImage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDefaultProvider.mockReturnValue(mockCommerceProvider as any);
    mockGetOrCreateVisitorId.mockReturnValue('visitor_123');
  });

  describe('POST /api/products', () => {
    it('should upload customization image successfully', async () => {
      mockCommerceProvider.uploadCustomizationImage.mockResolvedValue(mockUploadResponse);

      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(mockGetOrCreateVisitorId).toHaveBeenCalled();
      expect(mockCommerceProvider.uploadCustomizationImage).toHaveBeenCalledWith(
        expect.any(File),
        'visitor_123',
        {
          productId: 'prod_123',
          variantId: 'var_456',
        }
      );
      expect(response.status).toBe(201);
      expect(json.data).toEqual({
        imageId: 'img_123',
        imageUrl: 'https://example.com/customizations/img_123.jpg',
        productId: 'prod_123',
        variantId: 'var_456',
        width: 800,
        height: 600,
      });
    });

    it('should validate file is required', async () => {
      const formData = new FormData();
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate productId is required', async () => {
      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate variantId is required', async () => {
      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('productId', 'prod_123');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should validate file is an image', async () => {
      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.txt', { type: 'text/plain' }));
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.errors).toBeDefined();
    });

    it('should handle upload errors from commerce provider', async () => {
      mockCommerceProvider.uploadCustomizationImage.mockRejectedValue(
        new Error('File too large')
      );

      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error uploading customization image');
    });

    it('should accept different image formats', async () => {
      mockCommerceProvider.uploadCustomizationImage.mockResolvedValue(mockUploadResponse);

      const imageFormats = [
        { name: 'test.jpg', type: 'image/jpeg' },
        { name: 'test.png', type: 'image/png' },
        { name: 'test.webp', type: 'image/webp' },
      ];

      for (const format of imageFormats) {
        const formData = new FormData();
        formData.append('file', new File(['test'], format.name, { type: format.type }));
        formData.append('productId', 'prod_123');
        formData.append('variantId', 'var_456');

        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: formData,
        });

        const response = await POST(request);
        expect(response.status).toBe(201);
      }
    });

    it('should use visitor ID when no customer is authenticated', async () => {
      mockGetOrCreateVisitorId.mockReturnValue('visitor_789');
      mockCommerceProvider.uploadCustomizationImage.mockResolvedValue(mockUploadResponse);

      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      await POST(request);

      expect(mockCommerceProvider.uploadCustomizationImage).toHaveBeenCalledWith(
        expect.any(File),
        'visitor_789',
        expect.any(Object)
      );
    });

    it('should handle network errors gracefully', async () => {
      mockCommerceProvider.uploadCustomizationImage.mockRejectedValue(
        new Error('Network timeout')
      );

      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('productId', 'prod_123');
      formData.append('variantId', 'var_456');

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.errors).toBe('Error uploading customization image');
      expect(json.data).toBeUndefined();
    });
  });
});
