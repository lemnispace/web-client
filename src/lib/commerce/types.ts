/**
 * Commerce Abstraction Layer - Common Types
 *
 * This module defines platform-agnostic types for e-commerce operations.
 * Implementations (shop-api, Shopify, etc.) map to these common types.
 */

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  price: number;
  sku?: string;
  inventory?: number;
  image?: ProductImage;
  options: VariantOption[];
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface VariantSearchParams {
  productId?: string;
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit?: number;
}

// ============================================================================
// Cart Types
// ============================================================================

export interface Cart {
  id: string;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  estimatedTax: number;
  estimatedShipping: number;
  totalPrice: number;
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  product?: {
    title: string;
    image?: string;
  };
  variant?: {
    title: string;
  };
  customizationData?: Record<string, any>;
}

export interface CartItemInput {
  productId: string;
  variantId: string;
  quantity: number;
  customizationData?: Record<string, any>;
}

// ============================================================================
// Collection Types
// ============================================================================

export interface Collection {
  id: string;
  title: string;
  description?: string;
  handle: string;
  image?: string;
  products?: Product[];
}

// ============================================================================
// Order Types
// ============================================================================

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  notes?: string;
}

export interface CancelOrderInput {
  reason?: string;
  refund?: boolean;
}

export interface OrderInput {
  cartId: string;
  customerId: string;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  paymentMethod: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  country: string;
  zip: string;
  phone?: string;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
  defaultAddress?: Address;
}

export interface LoginResponse {
  customer: Customer;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// ============================================================================
// Customization Types
// ============================================================================

export interface CustomizationUpload {
  imageId: string;
  uploadUrl: string;
  expiresIn?: number;
}

export interface CustomizationImage {
  id: string;
  userId: string;
  originalUrl: string;
  processedUrl?: string;
  status: "uploaded" | "processing" | "processed" | "failed";
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginationInfo {
  cursor?: string;
  hasMore: boolean;
}

export interface ListResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentIntentInput {
  orderId: string;
  amount: number;
  currency?: string; // defaults to USD
}

export interface CartCheckout {
  cartId: string;
  subtotal: number;
  estimatedTax: number;
  estimatedShipping: number;
  totalPrice: number;
  itemCount: number;
}

// ============================================================================
// Printful Types
// ============================================================================

export interface PrintfulOrder {
  id: string;
  externalId: string;
  status: string;
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
  };
  items: Array<{
    sync_variant_id: number;
    quantity: number;
    files?: Array<{ url: string }>;
  }>;
  costs?: {
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
  };
}

export interface PrintfulOrderStatus {
  id: string;
  status: string;
  tracking_number?: string;
  tracking_url?: string;
  shipments?: Array<{
    id: string;
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    created: number;
  }>;
}
