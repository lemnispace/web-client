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
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "cancelled";

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
