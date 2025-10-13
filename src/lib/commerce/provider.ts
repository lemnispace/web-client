/**
 * Commerce Provider Interface
 *
 * This interface defines the contract that all commerce backend implementations
 * must follow. This allows switching between shop-api, Shopify, or any other
 * e-commerce backend without changing the application code.
 */

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
} from "./types";

export interface CommerceProvider {
  // ============================================================================
  // Product Operations
  // ============================================================================

  /**
   * List all products with optional filtering
   */
  getProducts(filters?: {
    collectionId?: string;
    tags?: string[];
    status?: "active" | "draft" | "archived";
    limit?: number;
    cursor?: string;
  }): Promise<ListResponse<Product>>;

  /**
   * Get a single product by ID
   */
  getProduct(productId: string): Promise<Product>;

  // ============================================================================
  // Collection Operations
  // ============================================================================

  /**
   * List all collections
   */
  getCollections(params?: {
    limit?: number;
    cursor?: string;
  }): Promise<ListResponse<Collection>>;

  /**
   * Get a single collection by ID
   */
  getCollection(collectionId: string): Promise<Collection>;

  // ============================================================================
  // Cart Operations
  // ============================================================================

  /**
   * Create a new cart
   */
  createCart(customerId?: string): Promise<Cart>;

  /**
   * Get cart by ID
   */
  getCart(cartId: string): Promise<Cart>;

  /**
   * Add items to cart
   */
  addToCart(cartId: string, items: CartItemInput[]): Promise<Cart>;

  /**
   * Update cart item quantity
   */
  updateCartItem(
    cartId: string,
    itemId: string,
    quantity: number
  ): Promise<Cart>;

  /**
   * Remove item from cart
   */
  removeCartItem(cartId: string, itemId: string): Promise<Cart>;

  // ============================================================================
  // Order Operations
  // ============================================================================

  /**
   * Create an order from a cart
   */
  createOrder(input: OrderInput): Promise<Order>;

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Promise<Order>;

  /**
   * List orders for a customer
   */
  getCustomerOrders(
    customerId: string,
    params?: { limit?: number; cursor?: string }
  ): Promise<ListResponse<Order>>;

  // ============================================================================
  // Customer Operations
  // ============================================================================

  /**
   * Register a new customer
   */
  registerCustomer(input: CustomerInput): Promise<LoginResponse>;

  /**
   * Login customer
   */
  loginCustomer(email: string, password: string): Promise<LoginResponse>;

  /**
   * Get customer by ID
   */
  getCustomer(customerId: string): Promise<Customer>;

  // ============================================================================
  // Customization Operations
  // ============================================================================

  /**
   * Upload a customization image (multipart/form-data)
   */
  uploadCustomizationImage(
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
  }>;

  /**
   * Process a customization image (resize, crop, remove background)
   */
  processCustomizationImage(
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
  }>;

  // ============================================================================
  // Integration Operations
  // ============================================================================

  /**
   * Sync Printful catalog (async operation)
   * Returns immediately with status
   */
  syncPrintfulCatalog(): Promise<{
    message: string;
    status: string;
  }>;
}
