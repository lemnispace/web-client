/**
 * Shop-API Commerce Provider
 *
 * Implementation of CommerceProvider for the shop-api backend (Go service).
 * This is the primary e-commerce backend for LemniSpace.
 */

import type { CommerceProvider } from "../provider";
import type {
  Cart,
  CartItemInput,
  Collection,
  Customer,
  CustomerInput,
  ListResponse,
  LoginResponse,
  Order,
  OrderInput,
  Product,
} from "../types";

interface ShopAPIConfig {
  baseUrl: string;
  apiKey?: string;
}

export class ShopAPIProvider implements CommerceProvider {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: ShopAPIConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = config.apiKey;
  }

  /**
   * Make HTTP request to shop-api
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============================================================================
  // Product Operations
  // ============================================================================

  async getProducts(filters?: {
    collectionId?: string;
    tags?: string[];
    status?: "active" | "draft" | "archived";
    limit?: number;
    cursor?: string;
  }): Promise<ListResponse<Product>> {
    const params = new URLSearchParams();

    if (filters?.collectionId) params.append("collectionId", filters.collectionId);
    if (filters?.tags) params.append("tags", filters.tags.join(","));
    if (filters?.status) params.append("status", filters.status);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.cursor) params.append("cursor", filters.cursor);

    const response = await this.request<{
      products: Product[];
      pagination?: { cursor?: string; hasMore: boolean };
    }>(`/v1/products?${params}`);

    return {
      data: response.products,
      pagination: response.pagination,
    };
  }

  async getProduct(productId: string): Promise<Product> {
    return this.request<Product>(`/v1/products/${productId}`);
  }

  // ============================================================================
  // Collection Operations
  // ============================================================================

  async getCollections(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<ListResponse<Collection>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.cursor) queryParams.append("cursor", params.cursor);

    const response = await this.request<{
      collections: Collection[];
      pagination?: { cursor?: string; hasMore: boolean };
    }>(`/v1/collections?${queryParams}`);

    return {
      data: response.collections,
      pagination: response.pagination,
    };
  }

  async getCollection(collectionId: string): Promise<Collection> {
    return this.request<Collection>(`/v1/collections/${collectionId}`);
  }

  // ============================================================================
  // Cart Operations
  // ============================================================================

  async createCart(customerId?: string): Promise<Cart> {
    return this.request<Cart>("/v1/cart", {
      method: "POST",
      body: JSON.stringify({ customerId }),
    });
  }

  async getCart(cartId: string): Promise<Cart> {
    return this.request<Cart>(`/v1/cart/${cartId}`);
  }

  async addToCart(cartId: string, items: CartItemInput[]): Promise<Cart> {
    // Shop-API expects a single CartItemInput, not an array
    // Shop-API returns just the CartItem, not the full Cart
    // We'll add items one by one, then fetch the full cart state

    if (items.length === 0) {
      throw new Error("No items to add to cart");
    }

    for (const item of items) {
      await this.request(`/v1/cart/${cartId}/items`, {
        method: "POST",
        body: JSON.stringify(item),
      });
    }

    // Fetch and return the updated cart
    return this.getCart(cartId);
  }

  async updateCartItem(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart> {
    // Shop-API returns just the CartItem, not the full Cart
    // Update the item, then fetch the full cart
    await this.request(`/v1/cart/${cartId}/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });

    return this.getCart(cartId);
  }

  async removeCartItem(cartId: string, itemId: string): Promise<Cart> {
    // Shop-API returns 204 No Content
    // Remove the item, then fetch the full cart
    await this.request(`/v1/cart/${cartId}/items/${itemId}`, {
      method: "DELETE",
    });

    return this.getCart(cartId);
  }

  // ============================================================================
  // Order Operations
  // ============================================================================

  async createOrder(input: OrderInput): Promise<Order> {
    return this.request<Order>("/v1/orders", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.request<Order>(`/v1/orders/${orderId}`);
  }

  async getCustomerOrders(
    customerId: string,
    params?: { limit?: number; cursor?: string }
  ): Promise<ListResponse<Order>> {
    const queryParams = new URLSearchParams({ customerId });
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.cursor) queryParams.append("cursor", params.cursor);

    const response = await this.request<{
      orders: Order[];
      pagination?: { cursor?: string; hasMore: boolean };
    }>(`/v1/orders?${queryParams}`);

    return {
      data: response.orders,
      pagination: response.pagination,
    };
  }

  // ============================================================================
  // Customer Operations
  // ============================================================================

  async registerCustomer(input: CustomerInput): Promise<LoginResponse> {
    return this.request<LoginResponse>("/v1/customers/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async loginCustomer(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>("/v1/customers/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getCustomer(customerId: string): Promise<Customer> {
    return this.request<Customer>(`/v1/customers/${customerId}`);
  }

  // ============================================================================
  // Customization Operations
  // ============================================================================

  /**
   * Upload a customization image using multipart/form-data
   */
  async uploadCustomizationImage(
    file: File,
    userId: string,
    options?: {
      cartId?: string;
      productId?: string;
      variantId?: string;
    }
  ): Promise<{
    id: string;
    url: string;
    width?: number;
    height?: number;
    createdAt: string;
  }> {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userId);

    if (options?.cartId) formData.append("cartId", options.cartId);
    if (options?.productId) formData.append("productId", options.productId);
    if (options?.variantId) formData.append("variantId", options.variantId);

    const url = `${this.baseUrl}/v1/customizations/images`;
    const headers: Record<string, string> = {};

    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData, // Don't set Content-Type, let browser set it with boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Process an uploaded customization image
   */
  async processCustomizationImage(
    imageId: string,
    userId: string,
    operations: Array<{
      type: "resize" | "crop" | "removeBackground";
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      maintainAspectRatio?: boolean;
    }>
  ): Promise<{
    id: string;
    originalImageId: string;
    url: string;
    width?: number;
    height?: number;
  }> {
    return this.request<{
      id: string;
      originalImageId: string;
      url: string;
      width?: number;
      height?: number;
    }>(`/v1/customizations/images/${imageId}/process?userId=${userId}`, {
      method: "POST",
      body: JSON.stringify({ operations }),
    });
  }

  // ============================================================================
  // Integration Operations
  // ============================================================================

  async syncPrintfulCatalog(): Promise<{
    message: string;
    status: string;
  }> {
    // Shop-API now performs sync asynchronously
    // Returns 202 Accepted with { message, status }
    return this.request<{
      message: string;
      status: string;
    }>("/v1/integrations/printful/sync", {
      method: "POST",
    });
  }
}
