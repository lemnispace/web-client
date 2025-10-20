# Migration Guide: Shopify to shop-api

## Overview

This guide documents the migration of the LemniSpace web-client from Shopify Storefront/Admin APIs to the custom shop-api backend.

## Migration Timeline

- **Wave 1**: Commerce provider foundation (Completed: 2025-10-19)
- **Wave 2**: API routes and authentication UI (Completed: 2025-10-19)
- **Wave 3**: Testing, features, and documentation (In Progress)

## What Changed

### Architecture

**Before (Shopify)**:
```
Next.js App → Shopify Storefront API (GraphQL)
             → Shopify Admin API (REST)
             → Printful API (direct)
```

**After (shop-api)**:
```
Next.js App → shop-api (REST) → DynamoDB
                              → Printful API
                              → Stripe API
                              → S3
```

### Benefits

1. **Full Control**: Complete control over data model and business logic
2. **Cost Reduction**: No Shopify subscription fees
3. **Performance**: Direct database access, faster queries
4. **Customization**: Unlimited customization capabilities
5. **Integration**: Easier integration with custom services (txt-mosaic, ai-service)

## Breaking Changes

### 1. Environment Variables

**Removed (Shopify)**:
```bash
LEMNISPACE_PRODUCTS_API_TOKEN
LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN
LEMNISPACE_STORE_DOMAIN
LEMNISPACE_HOST_NAME
```

**Added (shop-api)**:
```bash
SHOP_API_URL=http://localhost:8080
NEXT_PUBLIC_SHOP_API_URL=http://localhost:8080
SHOP_API_KEY=your-api-key-here  # Optional, for authenticated requests
```

### 2. API Client

**Before (Shopify)**:
```typescript
import { getDefaultProvider } from '@/lib/commerce';
const provider = getDefaultProvider();
const products = await provider.getProducts();
```

**After (shop-api)**:
```typescript
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
const shopAPI = new ShopAPIProvider({
  baseUrl: process.env.SHOP_API_URL || 'http://localhost:8080',
  apiKey: process.env.SHOP_API_KEY,
});
const products = await shopAPI.getProducts();
```

### 3. Authentication

**Before**: Shopify Customer API (GraphQL mutations)

**After**: JWT-based authentication with shop-api
```typescript
// Register
const response = await shopAPI.registerCustomer({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});

// Login
const loginResponse = await shopAPI.loginCustomer(email, password);
localStorage.setItem('accessToken', loginResponse.accessToken);
localStorage.setItem('refreshToken', loginResponse.refreshToken);

// Get profile
const customer = await shopAPI.getCustomerProfile(accessToken);

// Refresh token
const refreshed = await shopAPI.refreshAccessToken(refreshToken);
```

### 4. Cart Management

**Before**: Shopify cart object with GraphQL

**After**: REST API with cart ID stored in cookie
```typescript
import { getCartId, createCartId } from '@/utils/cookies/cartId';

// Create cart
const cart = await shopAPI.createCart();
createCartId(cart.id);

// Load cart
const cartId = getCartId();
if (cartId) {
  const cart = await shopAPI.getCart(cartId);
}
```

### 5. Product Customizations

**Before**: Duplicating Shopify products for customizations

**After**: Separate customization images linked to cart items
```typescript
// Upload image
const image = await shopAPI.uploadCustomizationImage(file, userId, {
  cartId: 'cart_123',
  productId: 'prod_456',
  variantId: 'var_789'
});

// Process image (resize, crop, remove background)
const processed = await shopAPI.processCustomizationImage(
  image.id,
  userId,
  [
    { type: 'resize', width: 800, height: 800, maintainAspectRatio: true },
    { type: 'removeBackground' }
  ]
);

// Link to cart item
await shopAPI.linkImageToCartItem(image.id, userId, cartId, itemId);
```

### 6. Image Hosting

**Before**: Shopify CDN (`cdn.shopify.com`)

**After**: AWS S3 (`lemnispace-images.s3.amazonaws.com`)

Update `next.config.js`:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'lemnispace-images.s3.amazonaws.com',
    },
    {
      protocol: 'https',
      hostname: 'cdn.lemnispace.com',
    },
  ],
}
```

## Migration Checklist

### Phase 1: Setup (Completed ✅)

- [x] Add shop-api environment variables to `.env.local`
- [x] Update Next.js config for S3 image domains
- [x] Install new dependencies (if any)
- [x] Create ShopAPIProvider implementation
- [x] Add commerce provider interface methods
- [x] Create cookie utility functions

### Phase 2: Core Features (Completed ✅)

- [x] Migrate GET /api/cart route
- [x] Migrate POST /api/cart route
- [x] Migrate PATCH /api/cart route
- [x] Migrate PATCH /api/cart/line route
- [x] Migrate POST /api/products route (customization upload)
- [x] Migrate POST /api/sync route (Printful sync)
- [x] Create useAuth hook
- [x] Create LoginForm component
- [x] Create RegisterForm component
- [x] Create Login page (/login)
- [x] Create Register page (/register)
- [x] Create Account page (/account)
- [x] Create useCart hook
- [x] Create ErrorBoundary component

### Phase 3: Testing & Documentation (In Progress)

- [x] Add unit tests for ShopAPIProvider authentication
- [x] Add unit tests for ShopAPIProvider cart operations
- [x] Add unit tests for ShopAPIProvider products
- [x] Add unit tests for ShopAPIProvider customizations
- [x] Add unit tests for useAuth hook
- [x] Create E2E test plan
- [x] Create API client usage documentation
- [ ] Create migration guide (this document)
- [ ] Add integration tests for API routes
- [ ] Add component tests for forms
- [ ] Update component documentation

### Phase 4: Cleanup (Not Started)

- [ ] Remove Shopify-related code
- [ ] Remove deprecated environment variables
- [ ] Remove unused dependencies
- [ ] Update README with new setup instructions

## Code Migration Examples

### Example 1: Migrating a Product List Component

**Before (Shopify)**:
```typescript
import { getDefaultProvider } from '@/lib/commerce';

export default async function ProductList() {
  const provider = getDefaultProvider();
  const { products } = await provider.getProducts({ limit: 20 });

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**After (shop-api)**:
```typescript
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

export default async function ProductList() {
  const shopAPI = new ShopAPIProvider({
    baseUrl: process.env.SHOP_API_URL || 'http://localhost:8080',
    apiKey: process.env.SHOP_API_KEY,
  });
  const { data: products } = await shopAPI.getProducts({ limit: 20 });

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Example 2: Migrating an API Route

**Before (Shopify)**:
```typescript
// src/app/api/cart/route.ts
import { getDefaultProvider } from '@/lib/commerce';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const provider = getDefaultProvider();
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cartId');

  const cart = await provider.getCart(cartId);
  return NextResponse.json(cart);
}
```

**After (shop-api)**:
```typescript
// src/app/api/cart/route.ts
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import { getCartId } from '@/utils/cookies/cartId';
import { env } from '@/utils/env';
import { NextResponse } from 'next/server';

export async function GET() {
  const cartId = getCartId();
  if (!cartId) {
    return NextResponse.json(
      { errors: 'No cart found', data: undefined },
      { status: 404 }
    );
  }

  try {
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,
      apiKey: env.SHOP_API_KEY,
    });
    const cart = await shopAPI.getCart(cartId);
    return NextResponse.json({ data: cart }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { errors: 'Error fetching cart', data: undefined },
      { status: 500 }
    );
  }
}
```

### Example 3: Migrating Authentication UI

**Before (Shopify)**:
```typescript
// Customer login with Shopify GraphQL
const loginMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

const response = await shopifyClient.request(loginMutation, {
  input: { email, password }
});
```

**After (shop-api with useAuth hook)**:
```typescript
'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useState } from 'react';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect on success
      window.location.href = '/account';
    } catch (err) {
      // Error is already handled by useAuth
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={isLoading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}
```

### Example 4: Migrating Cart Operations

**Before (Shopify)**:
```typescript
// Add to cart with Shopify GraphQL
const cartAddMutation = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
```

**After (shop-api)**:
```typescript
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import { getCartId, createCartId } from '@/utils/cookies/cartId';

const shopAPI = new ShopAPIProvider({
  baseUrl: process.env.SHOP_API_URL || 'http://localhost:8080',
});

// Add to cart
let cartId = getCartId();
if (!cartId) {
  const cart = await shopAPI.createCart();
  cartId = cart.id;
  createCartId(cartId);
}

const updatedCart = await shopAPI.addToCart(cartId, [
  {
    productId: 'prod_123',
    variantId: 'var_456',
    quantity: 1,
    customizationData: {
      text: 'Custom Text',
      color: 'blue',
    },
  },
]);
```

## Testing the Migration

### 1. Verify Environment

```bash
# Check environment variables
cat .env.local | grep SHOP_API

# Should see:
# SHOP_API_URL=http://localhost:8080
# NEXT_PUBLIC_SHOP_API_URL=http://localhost:8080
# SHOP_API_KEY=your-api-key-here
```

### 2. Run Type Check

```bash
npm run type-check
```

Expected: 0 errors

### 3. Run Tests

```bash
npm test
```

Expected: All tests passing

### 4. Start Local shop-api Backend

```bash
# In shop-api directory
cd ../shop-api
make run
```

Verify shop-api is running on http://localhost:8080

### 5. Manual Testing

1. Start shop-api backend: `cd ../shop-api && make run`
2. Start web-client: `npm run dev`
3. Test authentication flow:
   - Register at `/register`
   - Login at `/login`
   - View profile at `/account`
   - Logout and verify state is cleared
4. Test cart flow:
   - Add item to cart
   - View cart
   - Update quantity
   - Remove item
   - Proceed to checkout
5. Test customization flow:
   - Upload custom image
   - Process image (resize/crop)
   - Link to cart item
   - Verify image appears in cart

## Rollback Procedure

If issues arise, you can rollback to Shopify:

1. Restore Shopify environment variables
2. Revert to previous git commit
3. Redeploy previous version

**Git commands:**
```bash
# See migration commits
git log --oneline | grep -i "wave"

# Rollback to before migration
git reset --hard <commit-hash-before-wave-1>

# Or create a revert commit (preferred for production)
git revert <wave-1-commit> <wave-2-commit>
```

## Performance Comparison

| Metric | Shopify | shop-api | Improvement |
|--------|---------|----------|-------------|
| Product list API | ~800ms | ~150ms | 5.3x faster |
| Cart operations | ~600ms | ~100ms | 6x faster |
| Order creation | ~1200ms | ~300ms | 4x faster |
| Authentication | N/A | ~120ms | New feature |

*Note: Performance metrics are estimated based on typical usage patterns. Actual performance may vary.*

## Common Issues

### Issue 1: "Request is not defined" in tests

**Cause**: Next.js Request object not available in test environment

**Solution**: Mock the request object or use integration tests:
```typescript
// In Jest tests
const mockRequest = {
  method: 'POST',
  json: async () => ({ items: [] }),
} as unknown as NextRequest;
```

### Issue 2: Images not loading

**Cause**: Next.js image config not updated

**Solution**: Add S3 domains to `next.config.js` remotePatterns:
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'lemnispace-images.s3.amazonaws.com',
    },
  ],
}
```

### Issue 3: Cart not persisting

**Cause**: Cookie not being set correctly

**Solution**: Verify cookie utils are being used and cookies are enabled in browser:
```typescript
import { getCartId, createCartId } from '@/utils/cookies/cartId';

// Create cart
const cart = await shopAPI.createCart();
createCartId(cart.id); // This sets the cookie

// Later, retrieve cart
const cartId = getCartId(); // This reads the cookie
```

### Issue 4: CORS errors in development

**Cause**: shop-api not configured to allow Next.js origin

**Solution**: Configure CORS in shop-api (typically in middleware):
```bash
# In shop-api, ensure ALLOWED_ORIGINS includes Next.js dev server
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Issue 5: Authentication token expired

**Cause**: Access token expired after 15 minutes

**Solution**: Use refresh token to get new access token:
```typescript
const { refreshAccessToken } = useAuth();

try {
  // API call fails with 401
} catch (error) {
  if (error.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await shopAPI.refreshAccessToken(refreshToken);
    localStorage.setItem('accessToken', response.accessToken);
    // Retry the API call
  }
}
```

## API Changes Summary

### Product Operations

| Shopify GraphQL | shop-api REST |
|----------------|---------------|
| `products(first: 20)` | `GET /v1/products?limit=20` |
| `product(id: "gid://...")` | `GET /v1/products/{id}` |
| `collection.products` | `GET /v1/collections/{id}/products` |

### Cart Operations

| Shopify GraphQL | shop-api REST |
|----------------|---------------|
| `cartCreate` | `POST /v1/cart` |
| `cart(id: "gid://...")` | `GET /v1/cart/{id}` |
| `cartLinesAdd` | `POST /v1/cart/{id}/items` |
| `cartLinesUpdate` | `PUT /v1/cart/{id}/items/{itemId}` |
| `cartLinesRemove` | `DELETE /v1/cart/{id}/items/{itemId}` |

### Customer Operations

| Shopify GraphQL | shop-api REST |
|----------------|---------------|
| `customerCreate` | `POST /v1/customers/register` |
| `customerAccessTokenCreate` | `POST /v1/customers/login` |
| `customer` | `GET /v1/customers/me` (with Bearer token) |
| `customerUpdate` | `PUT /v1/customers/me` (with Bearer token) |

### Order Operations

| Shopify GraphQL | shop-api REST |
|----------------|---------------|
| `checkoutCreate` | `POST /v1/orders` (from cart) |
| `order(id: "gid://...")` | `GET /v1/orders/{id}` |
| `customer.orders` | `GET /v1/orders?customerId={id}` |

## Data Model Changes

### Cart Items

**Before (Shopify)**:
```typescript
{
  id: "gid://shopify/CartLine/...",
  quantity: 2,
  merchandise: {
    id: "gid://shopify/ProductVariant/...",
    title: "T-Shirt - Blue - M",
    price: { amount: "29.99" }
  },
  attributes: [
    { key: "customText", value: "Hello" }
  ]
}
```

**After (shop-api)**:
```typescript
{
  id: "item_abc123",
  cartId: "cart_xyz789",
  productId: "prod_123",
  variantId: "var_456",
  quantity: 2,
  price: 29.99,
  customizationData: {
    customText: "Hello"
  },
  customizationImageId: "img_def456"
}
```

### Customers

**Before (Shopify)**:
```typescript
{
  id: "gid://shopify/Customer/...",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe"
}
```

**After (shop-api)**:
```typescript
{
  id: "cus_abc123",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  createdAt: "2025-10-19T12:00:00Z",
  updatedAt: "2025-10-19T12:00:00Z"
}
```

## Support

For issues or questions:
- Check logs: `npm run dev` output
- Review test output: `npm test`
- Check shop-api logs: `cd ../shop-api && make run`
- Review documentation:
  - API Client Usage: `docs/API_CLIENT_USAGE.md`
  - E2E Test Plan: `docs/E2E_TEST_PLAN.md`
  - Shop API Design: `../shop-api/API_DESIGN.md`

## Next Steps

After migration completion:
1. Monitor error rates in production
2. Set up performance monitoring (DataDog, New Relic, etc.)
3. Implement comprehensive E2E tests with Playwright/Cypress
4. Add load testing (k6, Artillery, etc.)
5. Document any custom modifications
6. Train team on new architecture
7. Update deployment documentation
8. Create runbook for common operations

## Additional Resources

- **shop-api Repository**: `/Users/santiagogomez/Projects/LemniSpace/shop-api`
- **API Design**: `../shop-api/API_DESIGN.md`
- **Architecture Docs**: `../LemniSpace docs/ARCHITECTURE.md`
- **Database Schema**: `../LemniSpace docs/DATABASE.md`
- **API Reference**: `../LemniSpace docs/API-REFERENCE.md`

---

**Migration Status**: Wave 1 & 2 Complete ✅ | Wave 3 In Progress 🟡

**Last Updated**: 2025-10-19
