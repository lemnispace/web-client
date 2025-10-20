/**
 * Comprehensive Unit Tests for ShopAPIProvider - Products Methods
 *
 * Tests all product-related methods in ShopAPIProvider including:
 * - getProducts(params?: ProductListParams)
 * - getProduct(id: string)
 *
 * Coverage includes:
 * - Successful responses
 * - Error handling (404, 500, network errors)
 * - Query parameter serialization
 * - Request headers verification
 * - Edge cases and boundary conditions
 */

import { ShopAPIProvider } from '../shop-api';
import type { Product, ListResponse, PaginationInfo } from '../../types';

// Mock fetch globally
global.fetch = jest.fn();

describe('ShopAPIProvider - Products', () => {
  let provider: ShopAPIProvider;
  let providerWithApiKey: ShopAPIProvider;
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  const mockProduct: Product = {
    id: 'prod_123',
    title: 'Test Product',
    description: 'A great product for testing',
    price: 29.99,
    images: [
      {
        id: 'img_1',
        url: 'https://example.com/product.jpg',
        altText: 'Product image',
        width: 800,
        height: 600,
      },
    ],
    variants: [
      {
        id: 'var_1',
        productId: 'prod_123',
        title: 'Small / Red',
        price: 29.99,
        sku: 'PROD-SM-RED',
        inventory: 100,
        options: [
          { name: 'Size', value: 'Small' },
          { name: 'Color', value: 'Red' },
        ],
      },
    ],
    tags: ['featured', 'new'],
    status: 'active',
    createdAt: '2025-10-12T00:00:00Z',
    updatedAt: '2025-10-12T00:00:00Z',
  };

  beforeEach(() => {
    provider = new ShopAPIProvider({ baseUrl: 'http://localhost:8080' });
    providerWithApiKey = new ShopAPIProvider({
      baseUrl: 'http://localhost:8080',
      apiKey: 'test-api-key',
    });
    mockFetch.mockClear();
  });

  describe('getProducts', () => {
    describe('Success Cases', () => {
      it('should fetch products successfully without filters', async () => {
        const mockResponse = {
          products: [mockProduct],
          pagination: { hasMore: false },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await provider.getProducts();

        expect(result).toEqual({
          data: mockResponse.products,
          pagination: mockResponse.pagination,
        });

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8080/v1/products?',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      });

      it('should fetch products with all filter parameters', async () => {
        const mockResponse = {
          products: [mockProduct],
          pagination: { cursor: 'next_cursor', hasMore: true },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await provider.getProducts({
          collectionId: 'col_123',
          tags: ['featured', 'new'],
          status: 'active',
          limit: 20,
          cursor: 'cursor_abc',
        });

        expect(result.data).toEqual(mockResponse.products);
        expect(result.pagination).toEqual(mockResponse.pagination);

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('/v1/products?');
        expect(callUrl).toContain('collectionId=col_123');
        expect(callUrl).toContain('tags=featured%2Cnew');
        expect(callUrl).toContain('status=active');
        expect(callUrl).toContain('limit=20');
        expect(callUrl).toContain('cursor=cursor_abc');
      });

      it('should fetch products with pagination', async () => {
        const mockResponse = {
          products: Array.from({ length: 10 }, (_, i) => ({
            ...mockProduct,
            id: `prod_${i}`,
          })),
          pagination: { cursor: 'next_cursor', hasMore: true },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await provider.getProducts({ limit: 10 });

        expect(result.data).toHaveLength(10);
        expect(result.pagination?.hasMore).toBe(true);
        expect(result.pagination?.cursor).toBe('next_cursor');
      });

      it('should include X-API-Key header when apiKey is provided', async () => {
        const mockResponse = {
          products: [mockProduct],
          pagination: { hasMore: false },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        await providerWithApiKey.getProducts();

        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-API-Key': 'test-api-key',
            }),
          })
        );
      });

      it('should handle empty products list', async () => {
        const mockResponse = {
          products: [],
          pagination: { hasMore: false },
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await provider.getProducts();

        expect(result.data).toEqual([]);
        expect(result.pagination?.hasMore).toBe(false);
      });

      it('should handle response without pagination', async () => {
        const mockResponse = {
          products: [mockProduct],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        const result = await provider.getProducts();

        expect(result.data).toEqual(mockResponse.products);
        expect(result.pagination).toBeUndefined();
      });
    });

    describe('Query Parameter Serialization', () => {
      it('should serialize collectionId filter', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ collectionId: 'col_123' });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('collectionId=col_123');
      });

      it('should serialize single tag', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ tags: ['featured'] });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('tags=featured');
      });

      it('should serialize multiple tags as comma-separated', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ tags: ['featured', 'new', 'sale'] });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('tags=featured%2Cnew%2Csale');
      });

      it('should serialize status filter', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ status: 'active' });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('status=active');
      });

      it('should serialize limit parameter', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ limit: 50 });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('limit=50');
      });

      it('should serialize cursor parameter', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ cursor: 'cursor_xyz' });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('cursor=cursor_xyz');
      });

      it('should handle empty filters object', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({});

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toBe('http://localhost:8080/v1/products?');
      });

      it('should handle empty tags array', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ tags: [] });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        // Empty tags array joins to empty string, which is still appended as tags=
        expect(callUrl).toBe('http://localhost:8080/v1/products?tags=');
      });

      it('should serialize different status values', async () => {
        const statuses: Array<'active' | 'draft' | 'archived'> = ['active', 'draft', 'archived'];

        for (const status of statuses) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ products: [], pagination: { hasMore: false } }),
          } as Response);

          await provider.getProducts({ status });

          const callUrl = mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0] as string;
          expect(callUrl).toContain(`status=${status}`);
        }
      });
    });

    describe('Error Handling', () => {
      it('should handle 404 Not Found error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({ message: 'Products not found' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('Products not found');
      });

      it('should handle 500 Internal Server Error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ message: 'Server error occurred' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('Server error occurred');
      });

      it('should handle 401 Unauthorized error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: async () => ({ message: 'Invalid API key' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('Invalid API key');
      });

      it('should handle 403 Forbidden error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          json: async () => ({ message: 'Access denied' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('Access denied');
      });

      it('should handle 429 Rate Limit error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: async () => ({ message: 'Rate limit exceeded' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('Rate limit exceeded');
      });

      it('should handle 503 Service Unavailable error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 503,
          statusText: 'Service Unavailable',
          json: async () => ({ message: 'Service temporarily unavailable' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('Service temporarily unavailable');
      });

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(provider.getProducts()).rejects.toThrow('Network error');
      });

      it('should handle timeout errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

        await expect(provider.getProducts()).rejects.toThrow('Request timeout');
      });

      it('should handle malformed JSON response in error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as Response);

        await expect(provider.getProducts()).rejects.toThrow('Server Error');
      });

      it('should fallback to statusText when error message is empty', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ message: '' }),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('HTTP 500');
      });

      it('should handle error without message field', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({}),
        } as Response);

        await expect(provider.getProducts()).rejects.toThrow('HTTP 500');
      });
    });

    describe('Edge Cases', () => {
      it('should handle very large limit value', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ limit: 1000 });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('limit=1000');
      });

      it('should handle special characters in collectionId', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ collectionId: 'col_123-abc_xyz' });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('collectionId=col_123-abc_xyz');
      });

      it('should handle special characters in cursor', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ cursor: 'cursor_abc+xyz=123' });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('cursor=');
      });

      it('should handle tags with special characters', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], pagination: { hasMore: false } }),
        } as Response);

        await provider.getProducts({ tags: ['tag-1', 'tag_2', 'tag 3'] });

        const callUrl = mockFetch.mock.calls[0][0] as string;
        expect(callUrl).toContain('tags=');
      });

      it('should handle concurrent getProducts requests', async () => {
        mockFetch.mockImplementation(() =>
          Promise.resolve({
            ok: true,
            json: async () => ({ products: [mockProduct], pagination: { hasMore: false } }),
          } as Response)
        );

        const requests = [
          provider.getProducts({ collectionId: 'col_1' }),
          provider.getProducts({ collectionId: 'col_2' }),
          provider.getProducts({ collectionId: 'col_3' }),
        ];

        const results = await Promise.all(requests);

        expect(results).toHaveLength(3);
        expect(mockFetch).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('getProduct', () => {
    describe('Success Cases', () => {
      it('should fetch product successfully', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result).toEqual(mockProduct);
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:8080/v1/products/prod_123',
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
          })
        );
      });

      it('should fetch product with variants', async () => {
        const productWithVariants = {
          ...mockProduct,
          variants: [
            {
              id: 'var_1',
              productId: 'prod_123',
              title: 'Small / Red',
              price: 29.99,
              options: [
                { name: 'Size', value: 'Small' },
                { name: 'Color', value: 'Red' },
              ],
            },
            {
              id: 'var_2',
              productId: 'prod_123',
              title: 'Large / Blue',
              price: 34.99,
              options: [
                { name: 'Size', value: 'Large' },
                { name: 'Color', value: 'Blue' },
              ],
            },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => productWithVariants,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.variants).toHaveLength(2);
        expect(result.variants[0].title).toBe('Small / Red');
        expect(result.variants[1].title).toBe('Large / Blue');
      });

      it('should fetch product with multiple images', async () => {
        const productWithImages = {
          ...mockProduct,
          images: [
            { id: 'img_1', url: 'https://example.com/img1.jpg', altText: 'Image 1' },
            { id: 'img_2', url: 'https://example.com/img2.jpg', altText: 'Image 2' },
            { id: 'img_3', url: 'https://example.com/img3.jpg', altText: 'Image 3' },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => productWithImages,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.images).toHaveLength(3);
      });

      it('should include X-API-Key header when apiKey is provided', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockProduct,
        } as Response);

        await providerWithApiKey.getProduct('prod_123');

        expect(mockFetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
              'X-API-Key': 'test-api-key',
            }),
          })
        );
      });

      it('should fetch draft product', async () => {
        const draftProduct = { ...mockProduct, status: 'draft' as const };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => draftProduct,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.status).toBe('draft');
      });

      it('should fetch archived product', async () => {
        const archivedProduct = { ...mockProduct, status: 'archived' as const };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => archivedProduct,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.status).toBe('archived');
      });
    });

    describe('Error Handling', () => {
      it('should handle 404 Not Found error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({ message: 'Product not found' }),
        } as Response);

        await expect(provider.getProduct('prod_999')).rejects.toThrow('Product not found');
      });

      it('should handle 500 Internal Server Error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ message: 'Server error occurred' }),
        } as Response);

        await expect(provider.getProduct('prod_123')).rejects.toThrow('Server error occurred');
      });

      it('should handle 401 Unauthorized error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: async () => ({ message: 'Invalid API key' }),
        } as Response);

        await expect(provider.getProduct('prod_123')).rejects.toThrow('Invalid API key');
      });

      it('should handle 403 Forbidden error', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          json: async () => ({ message: 'Access denied to this product' }),
        } as Response);

        await expect(provider.getProduct('prod_123')).rejects.toThrow('Access denied to this product');
      });

      it('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network connection failed'));

        await expect(provider.getProduct('prod_123')).rejects.toThrow('Network connection failed');
      });

      it('should handle timeout errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

        await expect(provider.getProduct('prod_123')).rejects.toThrow('Request timeout');
      });

      it('should handle malformed JSON response', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as Response);

        await expect(provider.getProduct('prod_123')).rejects.toThrow('Server Error');
      });

      it('should fallback to HTTP status when no error message', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          json: async () => ({}),
        } as Response);

        await expect(provider.getProduct('prod_123')).rejects.toThrow('HTTP 400');
      });
    });

    describe('Edge Cases', () => {
      it('should handle product IDs with special characters', async () => {
        const specialIds = [
          'prod_123-abc',
          'prod_123_abc',
          'prod-with-dashes',
          'prod_with_underscores',
        ];

        for (const id of specialIds) {
          mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ ...mockProduct, id }),
          } as Response);

          await provider.getProduct(id);

          expect(mockFetch).toHaveBeenCalledWith(
            `http://localhost:8080/v1/products/${id}`,
            expect.any(Object)
          );
        }
      });

      it('should handle product with no variants', async () => {
        const productNoVariants = { ...mockProduct, variants: [] };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => productNoVariants,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.variants).toEqual([]);
      });

      it('should handle product with no images', async () => {
        const productNoImages = { ...mockProduct, images: [] };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => productNoImages,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.images).toEqual([]);
      });

      it('should handle product with no tags', async () => {
        const productNoTags = { ...mockProduct, tags: [] };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => productNoTags,
        } as Response);

        const result = await provider.getProduct('prod_123');

        expect(result.tags).toEqual([]);
      });

      it('should handle concurrent getProduct requests', async () => {
        mockFetch.mockImplementation((url) => {
          const id = (url as string).split('/').pop();
          return Promise.resolve({
            ok: true,
            json: async () => ({ ...mockProduct, id }),
          } as Response);
        });

        const requests = [
          provider.getProduct('prod_1'),
          provider.getProduct('prod_2'),
          provider.getProduct('prod_3'),
        ];

        const results = await Promise.all(requests);

        expect(results).toHaveLength(3);
        expect(results[0].id).toBe('prod_1');
        expect(results[1].id).toBe('prod_2');
        expect(results[2].id).toBe('prod_3');
        expect(mockFetch).toHaveBeenCalledTimes(3);
      });

      it('should handle very long product IDs', async () => {
        const longId = 'prod_' + 'a'.repeat(100);

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockProduct, id: longId }),
        } as Response);

        await provider.getProduct(longId);

        expect(mockFetch).toHaveBeenCalledWith(
          `http://localhost:8080/v1/products/${longId}`,
          expect.any(Object)
        );
      });

      it('should handle numeric-only product IDs', async () => {
        const numericId = '12345';

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockProduct, id: numericId }),
        } as Response);

        await provider.getProduct(numericId);

        expect(mockFetch).toHaveBeenCalledWith(
          `http://localhost:8080/v1/products/${numericId}`,
          expect.any(Object)
        );
      });
    });
  });

  describe('Request Headers', () => {
    it('should always include Content-Type header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      await provider.getProduct('prod_123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should not include X-API-Key when apiKey is not provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      await provider.getProduct('prod_123');

      const callHeaders = (mockFetch.mock.calls[0][1] as RequestInit)?.headers as Record<
        string,
        string
      >;
      expect(callHeaders).not.toHaveProperty('X-API-Key');
    });

    it('should include X-API-Key when apiKey is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: [], pagination: { hasMore: false } }),
      } as Response);

      await providerWithApiKey.getProducts();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-API-Key': 'test-api-key',
          }),
        })
      );
    });
  });

  describe('BaseURL Handling', () => {
    it('should handle baseUrl with trailing slash', async () => {
      const providerWithSlash = new ShopAPIProvider({
        baseUrl: 'http://localhost:8080/',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      await providerWithSlash.getProduct('prod_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/products/prod_123',
        expect.any(Object)
      );
    });

    it('should handle baseUrl without trailing slash', async () => {
      const providerNoSlash = new ShopAPIProvider({
        baseUrl: 'http://localhost:8080',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      await providerNoSlash.getProduct('prod_123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/products/prod_123',
        expect.any(Object)
      );
    });
  });
});
