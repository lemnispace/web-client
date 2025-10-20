# ShopAPIProvider Usage Guide

## Overview
The ShopAPIProvider is a TypeScript client for interacting with the shop-api backend. It provides a type-safe, promise-based API for all e-commerce operations.

## Installation

The ShopAPIProvider is part of the web-client codebase and doesn't require separate installation.

## Basic Setup

### Server-Side Usage (API Routes)
```typescript
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

const shopAPI = new ShopAPIProvider({
  baseUrl: process.env.SHOP_API_URL || 'http://localhost:8080',
  apiKey: process.env.SHOP_API_KEY, // Optional, for admin operations
});
```

### Client-Side Usage (React Components)
```typescript
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

const shopAPI = new ShopAPIProvider({
  baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
});
```

## Products

### List Products
```typescript
const response = await shopAPI.getProducts({
  limit: 20,
  cursor: 'next_page_cursor',
  collectionId: 'coll_123',
  tags: ['summer', 't-shirts'],
  status: 'active',
});

console.log(response.data); // Product[]
console.log(response.pagination?.nextCursor);
console.log(response.pagination?.hasMore);
```

**Available Filters:**
- `collectionId?: string` - Filter by collection
- `tags?: string[]` - Filter by tags
- `status?: "active" | "draft" | "archived"` - Filter by status
- `limit?: number` - Number of results to return
- `cursor?: string` - Pagination cursor

### Get Single Product
```typescript
const product = await shopAPI.getProduct('prod_123');
console.log(product.title);
console.log(product.description);
console.log(product.variants);
console.log(product.images);
```

### Search Product Variants
```typescript
const variants = await shopAPI.searchVariants({
  productId: 'prod_123',
  color: 'blue',
  size: 'M',
  minPrice: 10.00,
  maxPrice: 50.00,
  inStock: true,
  limit: 10,
});

console.log(variants); // ProductVariant[]
```

## Collections

### List Collections
```typescript
const response = await shopAPI.getCollections({
  limit: 10,
  cursor: 'next_page_cursor',
});

console.log(response.data); // Collection[]
console.log(response.pagination?.hasMore);
```

### Get Collection with Products
```typescript
const collection = await shopAPI.getCollection('coll_123');
console.log(collection.title);
console.log(collection.description);
console.log(collection.products); // Product[]
```

### Get Collection Products (with filtering)
```typescript
const response = await shopAPI.getCollectionProducts('coll_123', {
  limit: 20,
  cursor: 'next_page_cursor',
  sortBy: 'price',
  order: 'asc',
});

console.log(response.data); // Product[]
```

## Cart

### Create Cart
```typescript
// Empty cart
const cart = await shopAPI.createCart();

// Cart with customer
const cart = await shopAPI.createCart('customer_123');
```

### Get Cart
```typescript
const cart = await shopAPI.getCart('cart_123');
console.log(cart.items);
console.log(cart.subtotal);
console.log(cart.estimatedTax);
console.log(cart.estimatedShipping);
console.log(cart.totalPrice);
console.log(cart.expiresAt);
```

### Add Items to Cart
```typescript
const updatedCart = await shopAPI.addToCart('cart_123', [
  {
    productId: 'prod_123',
    variantId: 'var_789',
    quantity: 1,
    customizationData: { imageId: 'img_abc' }, // Optional
  },
  {
    productId: 'prod_456',
    variantId: 'var_012',
    quantity: 2,
  },
]);

console.log(updatedCart.items);
console.log(updatedCart.totalPrice);
```

### Update Cart Item
```typescript
const updatedCart = await shopAPI.updateCartItem('cart_123', 'item_456', 3);
console.log(updatedCart.items);
```

### Remove Cart Item
```typescript
const updatedCart = await shopAPI.removeCartItem('cart_123', 'item_456');
console.log(updatedCart.items);
```

### Get Customer's Carts
```typescript
// Get active carts only
const carts = await shopAPI.getCustomerCarts('customer_123');

// Include expired carts
const allCarts = await shopAPI.getCustomerCarts('customer_123', true);
```

### Get Cart Checkout Summary
```typescript
const checkout = await shopAPI.getCartCheckout('cart_123');
console.log(checkout.cartId);
console.log(checkout.subtotal);
console.log(checkout.estimatedTax);
console.log(checkout.estimatedShipping);
console.log(checkout.totalPrice);
console.log(checkout.itemCount);
```

## Authentication

### Register Customer
```typescript
const response = await shopAPI.registerCustomer({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  acceptsMarketing: true,
  defaultAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    city: 'San Francisco',
    province: 'CA',
    country: 'US',
    zip: '94102',
    phone: '+1234567890',
  },
});

console.log(response.customer);
console.log(response.accessToken);
console.log(response.refreshToken);
console.log(response.expiresAt);
```

### Login
```typescript
const response = await shopAPI.loginCustomer('user@example.com', 'password123');

// Store tokens securely
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('tokenExpiresAt', response.expiresAt);
```

### Refresh Access Token
```typescript
const refreshToken = localStorage.getItem('refreshToken');
if (!refreshToken) {
  throw new Error('No refresh token available');
}

const response = await shopAPI.refreshAccessToken(refreshToken);

// Update stored tokens
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('tokenExpiresAt', response.expiresAt);
```

### Get Customer Profile
```typescript
const accessToken = localStorage.getItem('accessToken');
if (!accessToken) {
  throw new Error('User not authenticated');
}

const customer = await shopAPI.getCustomerProfile(accessToken);

console.log(customer.id);
console.log(customer.email);
console.log(customer.firstName);
console.log(customer.lastName);
console.log(customer.phone);
```

### Get Customer by ID
```typescript
const customer = await shopAPI.getCustomer('customer_123');
console.log(customer);
```

### Update Customer Profile
```typescript
const accessToken = localStorage.getItem('accessToken');
const updatedCustomer = await shopAPI.updateCustomerProfile(accessToken, {
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+9876543210',
});

console.log(updatedCustomer);
```

## Orders

### Create Order from Cart
```typescript
const order = await shopAPI.createOrder({
  cartId: 'cart_123',
  customerId: 'customer_456',
  shippingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    address2: 'Apt 4B',
    city: 'San Francisco',
    province: 'CA',
    country: 'US',
    zip: '94102',
    phone: '+1234567890',
  },
  billingAddress: {
    firstName: 'John',
    lastName: 'Doe',
    address1: '123 Main St',
    city: 'San Francisco',
    province: 'CA',
    country: 'US',
    zip: '94102',
    phone: '+1234567890',
  },
  shippingMethod: 'standard',
  paymentMethod: 'stripe',
});

console.log(order.id);
console.log(order.status);
console.log(order.totalPrice);
console.log(order.items);
```

### Get Order
```typescript
const order = await shopAPI.getOrder('order_123');
console.log(order.status);
console.log(order.items);
console.log(order.shippingAddress);
console.log(order.billingAddress);
console.log(order.subtotal);
console.log(order.tax);
console.log(order.shipping);
console.log(order.totalPrice);
```

### List Customer Orders
```typescript
const response = await shopAPI.getCustomerOrders('customer_456', {
  limit: 10,
  cursor: 'next_page_cursor',
});

console.log(response.data); // Order[]
console.log(response.pagination?.hasMore);
```

### Update Order Status (Admin Only)
```typescript
const adminToken = process.env.ADMIN_TOKEN;
const updatedOrder = await shopAPI.updateOrderStatus(
  'order_123',
  {
    status: 'shipped',
    notes: 'Shipped via FedEx, tracking #123456',
  },
  adminToken
);

console.log(updatedOrder.status);
```

**Available Order Statuses:**
- `pending` - Order created but not paid
- `paid` - Payment confirmed
- `processing` - Order being prepared
- `fulfilled` - Order ready to ship
- `shipped` - Order shipped
- `delivered` - Order delivered
- `cancelled` - Order cancelled
- `refunded` - Order refunded

### Cancel Order
```typescript
const accessToken = localStorage.getItem('accessToken');
const cancelledOrder = await shopAPI.cancelOrder(
  'order_123',
  {
    reason: 'Changed mind',
    refund: true,
  },
  accessToken
);

console.log(cancelledOrder.status); // 'cancelled'
```

## Customizations

### Upload Customization Image
```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const userId = 'user_123';

const image = await shopAPI.uploadCustomizationImage(file, userId, {
  cartId: 'cart_456', // Optional
  productId: 'prod_789', // Optional
  variantId: 'var_012', // Optional
});

console.log(image.id);
console.log(image.url); // S3 URL
console.log(image.width);
console.log(image.height);
console.log(image.createdAt);
```

### Process Customization Image
```typescript
const processedImage = await shopAPI.processCustomizationImage(
  'img_abc',
  'user_123',
  [
    {
      type: 'resize',
      width: 800,
      height: 600,
      maintainAspectRatio: true,
    },
    {
      type: 'crop',
      x: 100,
      y: 50,
      width: 600,
      height: 400,
    },
    {
      type: 'removeBackground',
    },
  ]
);

console.log(processedImage.id);
console.log(processedImage.originalImageId);
console.log(processedImage.url);
console.log(processedImage.width);
console.log(processedImage.height);
```

**Available Operations:**
- `resize` - Resize image
  - `width?: number`
  - `height?: number`
  - `maintainAspectRatio?: boolean`
- `crop` - Crop image
  - `x: number` - X coordinate
  - `y: number` - Y coordinate
  - `width: number` - Crop width
  - `height: number` - Crop height
- `removeBackground` - Remove image background

### Delete Customization Image
```typescript
await shopAPI.deleteCustomizationImage('img_abc', 'user_123');
```

### Link Image to Cart Item
```typescript
await shopAPI.linkImageToCartItem('img_abc', 'user_123', 'cart_123', 'item_456');
```

## Payments

### Create Payment Intent
```typescript
const intent = await shopAPI.createPaymentIntent({
  orderId: 'order_123',
  amount: 5999, // cents (i.e., $59.99)
  currency: 'usd', // Optional, defaults to 'usd'
});

console.log(intent.id);
console.log(intent.clientSecret); // For Stripe.js
console.log(intent.amount);
console.log(intent.currency);
console.log(intent.status);
```

### Confirm Payment
```typescript
const order = await shopAPI.confirmPayment('order_123', 'pi_xyz');
console.log(order.status); // Should be 'paid'
console.log(order.paymentMethod);
```

## Printful Integration

### Sync Printful Catalog
```typescript
const result = await shopAPI.syncPrintfulCatalog();
console.log(result.message); // "Catalog sync started"
console.log(result.status); // "accepted"
// Returns 202 Accepted - sync happens asynchronously
```

### Create Printful Order
```typescript
const printfulOrder = await shopAPI.createPrintfulOrder('order_123');

console.log(printfulOrder.id);
console.log(printfulOrder.externalId); // Our order ID
console.log(printfulOrder.status);
console.log(printfulOrder.recipient);
console.log(printfulOrder.items);
console.log(printfulOrder.costs);
```

### Get Printful Order Status
```typescript
const status = await shopAPI.getPrintfulOrderStatus('pf_order_456');

console.log(status.id);
console.log(status.status);
console.log(status.tracking_number);
console.log(status.tracking_url);
console.log(status.shipments);
```

## Error Handling

All methods throw errors on failure. Use try/catch:

```typescript
try {
  const product = await shopAPI.getProduct('invalid_id');
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Product not found');
  } else if (error.message.includes('401')) {
    console.log('Unauthorized - invalid API key or token');
  } else if (error.message.includes('500')) {
    console.log('Server error - try again later');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Common Error Scenarios

```typescript
// Handle authentication errors
try {
  const customer = await shopAPI.getCustomerProfile(accessToken);
} catch (error) {
  if (error.message.includes('401')) {
    // Token expired, try refreshing
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await shopAPI.refreshAccessToken(refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      // Retry original request
      const customer = await shopAPI.getCustomerProfile(response.accessToken);
    } catch (refreshError) {
      // Refresh failed, redirect to login
      window.location.href = '/login';
    }
  }
}
```

```typescript
// Handle cart errors
try {
  const cart = await shopAPI.addToCart('cart_123', items);
} catch (error) {
  if (error.message.includes('out of stock')) {
    alert('Sorry, one or more items are out of stock');
  } else if (error.message.includes('404')) {
    // Cart not found, create new cart
    const newCart = await shopAPI.createCart();
    const cart = await shopAPI.addToCart(newCart.id, items);
  }
}
```

## TypeScript Types

All types are exported from `@/lib/commerce/types`:

```typescript
import type {
  Product,
  ProductVariant,
  ProductImage,
  VariantOption,
  VariantSearchParams,
  Cart,
  CartItem,
  CartItemInput,
  CartCheckout,
  Collection,
  Order,
  OrderStatus,
  OrderInput,
  OrderStatusUpdate,
  CancelOrderInput,
  Customer,
  CustomerInput,
  LoginResponse,
  Address,
  CustomizationUpload,
  CustomizationImage,
  PaymentIntent,
  PaymentIntentInput,
  PrintfulOrder,
  PrintfulOrderStatus,
  ListResponse,
  PaginationInfo,
  ApiError,
  ApiResponse,
} from '@/lib/commerce/types';
```

### Type Examples

```typescript
// Product with all fields typed
const product: Product = {
  id: 'prod_123',
  title: 'Custom T-Shirt',
  description: 'AI-generated design',
  price: 29.99,
  images: [
    {
      id: 'img_1',
      url: 'https://example.com/image.jpg',
      altText: 'Product image',
      width: 800,
      height: 600,
    },
  ],
  variants: [],
  tags: ['summer', 't-shirts'],
  status: 'active',
  createdAt: '2025-10-19T00:00:00Z',
  updatedAt: '2025-10-19T00:00:00Z',
};

// Order status is strictly typed
const status: OrderStatus = 'paid'; // Valid
// const invalidStatus: OrderStatus = 'invalid'; // TypeScript error
```

## Best Practices

### 1. Server-Side API Key
Only use API keys in server-side code (API routes, server components):

```typescript
// Good: Server-side API route
// app/api/admin/products/route.ts
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

export async function POST(request: Request) {
  const shopAPI = new ShopAPIProvider({
    baseUrl: process.env.SHOP_API_URL!,
    apiKey: process.env.SHOP_API_KEY, // Safe on server
  });

  const product = await shopAPI.createProduct({...});
  return Response.json(product);
}
```

```typescript
// Bad: Client-side component
// NEVER expose API keys in client code
const shopAPI = new ShopAPIProvider({
  baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL,
  apiKey: process.env.SHOP_API_KEY, // WRONG! Exposed to browser
});
```

### 2. Token Management
Store access/refresh tokens securely:

```typescript
// Option 1: httpOnly cookies (most secure)
// Set via server-side API route
export async function POST(request: Request) {
  const { email, password } = await request.json();
  const response = await shopAPI.loginCustomer(email, password);

  return new Response(JSON.stringify({ customer: response.customer }), {
    headers: {
      'Set-Cookie': `accessToken=${response.accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
    },
  });
}

// Option 2: Secure localStorage (less secure but simpler)
// Use only for client-side rendered apps
localStorage.setItem('accessToken', response.accessToken);
```

### 3. Error Handling
Always wrap API calls in try/catch blocks:

```typescript
async function loadProduct(productId: string) {
  try {
    const product = await shopAPI.getProduct(productId);
    setProduct(product);
  } catch (error) {
    console.error('Failed to load product:', error);
    setError('Product not found');
  }
}
```

### 4. Loading States
Use loading states in UI components during API calls:

```typescript
function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await shopAPI.getProducts({ limit: 20 });
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* render products */}</div>;
}
```

### 5. Cart Persistence
Store cart ID in a cookie for cross-session persistence:

```typescript
import Cookies from 'js-cookie';

// Get or create cart
async function getOrCreateCart(customerId?: string): Promise<Cart> {
  const cartId = Cookies.get('cartId');

  if (cartId) {
    try {
      return await shopAPI.getCart(cartId);
    } catch (error) {
      // Cart expired or not found, create new one
    }
  }

  const cart = await shopAPI.createCart(customerId);
  Cookies.set('cartId', cart.id, { expires: 7 }); // 7 days
  return cart;
}
```

### 6. Type Safety
Use TypeScript types for all API responses:

```typescript
import type { Product, ListResponse } from '@/lib/commerce/types';

// Good: Typed response
const response: ListResponse<Product> = await shopAPI.getProducts();
const products: Product[] = response.data;

// Good: Type inference
const product = await shopAPI.getProduct('prod_123'); // Inferred as Product
console.log(product.title); // TypeScript knows this exists

// Bad: Untyped (loses type safety)
const data: any = await shopAPI.getProducts();
console.log(data.unknown); // No TypeScript error, but may fail at runtime
```

### 7. Pagination
Handle pagination correctly for large datasets:

```typescript
async function loadAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await shopAPI.getProducts({
      limit: 100,
      cursor,
    });

    allProducts.push(...response.data);
    cursor = response.pagination?.cursor;
    hasMore = response.pagination?.hasMore ?? false;
  }

  return allProducts;
}
```

### 8. Authentication Flow
Implement complete authentication flow with token refresh:

```typescript
class AuthService {
  private shopAPI: ShopAPIProvider;

  constructor() {
    this.shopAPI = new ShopAPIProvider({
      baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL!,
    });
  }

  async login(email: string, password: string) {
    const response = await this.shopAPI.loginCustomer(email, password);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiresAt', response.expiresAt);
    return response.customer;
  }

  async getProfile(): Promise<Customer> {
    let accessToken = localStorage.getItem('accessToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    // Check if token is expired
    if (expiresAt && new Date(expiresAt) < new Date()) {
      accessToken = await this.refreshToken();
    }

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    return this.shopAPI.getCustomerProfile(accessToken);
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.shopAPI.refreshAccessToken(refreshToken);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiresAt', response.expiresAt);
    return response.accessToken;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }
}
```

## Environment Variables

Required environment variables:

```bash
# .env.local (for Next.js development)

# Server-side only
SHOP_API_URL=http://localhost:8080
SHOP_API_KEY=your_api_key_here

# Client-side (exposed to browser)
NEXT_PUBLIC_SHOP_API_URL=http://localhost:8080
```

Production environment:

```bash
# .env.production

# Server-side
SHOP_API_URL=https://api.lemnispace.com
SHOP_API_KEY=your_production_api_key

# Client-side
NEXT_PUBLIC_SHOP_API_URL=https://api.lemnispace.com
```

## Complete Example

Here's a complete example of a Next.js component using the ShopAPIProvider:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Product, Cart } from '@/lib/commerce/types';

const shopAPI = new ShopAPIProvider({
  baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
});

export default function ProductPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load product
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await shopAPI.getProduct(productId);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  // Add to cart handler
  async function handleAddToCart(variantId: string) {
    try {
      setAddingToCart(true);

      // Get or create cart
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        const newCart = await shopAPI.createCart();
        cartId = newCart.id;
        localStorage.setItem('cartId', cartId);
      }

      // Add item to cart
      const updatedCart = await shopAPI.addToCart(cartId, [
        {
          productId: product!.id,
          variantId,
          quantity: 1,
        },
      ]);

      setCart(updatedCart);
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>

      {product.images.length > 0 && (
        <img src={product.images[0].url} alt={product.title} />
      )}

      <div>
        <h2>Variants</h2>
        {product.variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => handleAddToCart(variant.id)}
            disabled={addingToCart || (variant.inventory ?? 0) === 0}
          >
            {variant.title} - ${variant.price}
            {(variant.inventory ?? 0) === 0 && ' (Out of Stock)'}
          </button>
        ))}
      </div>

      {cart && (
        <div>
          <p>Cart: {cart.items.length} items - ${cart.totalPrice}</p>
        </div>
      )}
    </div>
  );
}
```

## Testing

Example test using Jest and the ShopAPIProvider:

```typescript
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

describe('ShopAPIProvider', () => {
  const shopAPI = new ShopAPIProvider({
    baseUrl: 'http://localhost:8080',
  });

  test('should fetch products', async () => {
    const response = await shopAPI.getProducts({ limit: 10 });
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeLessThanOrEqual(10);
  });

  test('should create and update cart', async () => {
    // Create cart
    const cart = await shopAPI.createCart();
    expect(cart.id).toBeDefined();
    expect(cart.items).toEqual([]);

    // Add item
    const updatedCart = await shopAPI.addToCart(cart.id, [
      {
        productId: 'prod_123',
        variantId: 'var_456',
        quantity: 1,
      },
    ]);
    expect(updatedCart.items.length).toBe(1);
  });
});
```
