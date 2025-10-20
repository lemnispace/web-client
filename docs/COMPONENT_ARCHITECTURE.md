# Component Architecture - LemniSpace Web Client

## Overview

The LemniSpace web-client uses Next.js 14 App Router with React Server Components and Client Components following a clear separation of concerns. The architecture leverages the latest Next.js features including server-side rendering, file-based routing, and a commerce abstraction layer for backend flexibility.

## Directory Structure

```
src/app/
├── (auth)/              # Auth-specific route group
│   ├── login/
│   │   └── page.tsx     # Login page (CSC)
│   └── register/
│       └── page.tsx     # Register page (CSC)
├── account/
│   ├── __tests__/
│   │   └── page.test.tsx
│   └── page.tsx         # Account page (CSC - protected route)
├── shop/
│   ├── cart/
│   │   └── page.tsx     # Shopping cart page
│   ├── products/
│   │   ├── [slug]/
│   │   │   ├── customize/
│   │   │   │   └── page.tsx  # Product customization page
│   │   │   └── page.tsx      # Product detail page
│   │   └── page.tsx          # Redirects to /shop
│   ├── layout.tsx       # Shop layout wrapper
│   └── page.tsx         # Product listing (RSC)
├── api/                 # API routes (BFF pattern)
│   ├── cart/
│   │   ├── line/
│   │   │   └── route.ts # PATCH /api/cart/line
│   │   └── route.ts     # GET/POST/PATCH /api/cart
│   ├── products/
│   │   └── route.ts     # POST /api/products
│   ├── mosaic/
│   │   └── route.ts     # POST /api/mosaic
│   └── sync/
│       └── route.ts     # POST /api/sync
├── components/          # Shared components
│   ├── auth/
│   │   ├── LoginForm.tsx       # Client component
│   │   ├── RegisterForm.tsx    # Client component
│   │   └── __tests__/
│   ├── cart/
│   │   ├── CartView.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartItemList.tsx
│   │   ├── CartSummary.tsx
│   │   └── QuantitySelector.tsx
│   ├── editor/
│   │   ├── Canvas.tsx          # Fabric.js canvas editor
│   │   ├── Crop.tsx
│   │   ├── EditorMenu.tsx
│   │   ├── FileDropZone.tsx
│   │   ├── ImgEditor.tsx
│   │   ├── PanZoom.tsx
│   │   └── __tests__/
│   ├── product/
│   │   ├── ImageGallery.tsx
│   │   ├── ProductColorPicker.tsx
│   │   ├── ProductDescription.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductRating.tsx
│   │   ├── ProductSelectionForm.tsx
│   │   ├── ProductSizePicker.tsx
│   │   ├── ProductTitle.tsx
│   │   ├── ProductView.tsx
│   │   └── __tests__/
│   ├── shop/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGridItem.tsx
│   │   └── __tests__/
│   ├── landing_page/
│   │   ├── CallToAction.tsx
│   │   ├── ComingSoon.tsx
│   │   ├── Hero.tsx
│   │   └── __tests__/
│   ├── collection/
│   │   ├── SingleCollection.tsx
│   │   └── __tests__/
│   ├── mosaic/
│   │   ├── MosaicCollection.tsx
│   │   └── __tests__/
│   ├── ErrorBoundary.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Logo.tsx
│   ├── MobileNavigation.tsx
│   ├── NavLink.tsx
│   ├── ShoppingCart.tsx
│   └── SlimLayout.tsx
└── hooks/               # Custom React hooks
    ├── useAuth.ts
    ├── useCart.ts
    └── __tests__/

src/lib/
├── commerce/            # Commerce layer abstraction
│   ├── provider.ts      # CommerceProvider interface
│   ├── providers/
│   │   ├── shop-api.ts  # ShopAPIProvider implementation
│   │   └── __tests__/
│   ├── types.ts         # Shared commerce types
│   └── index.ts
├── shopify/             # Legacy Shopify integration (being phased out)
│   ├── services/
│   │   ├── ShopifyProductService.ts
│   │   ├── ShopifyCartService.ts
│   │   └── ShopifyCollectionService.ts
│   ├── queries/
│   ├── mutations/
│   └── types/
├── printful/            # Printful integration
│   ├── PrintfulClient.ts
│   └── types/
├── custom/
│   └── types/
└── utils/
    └── cookies.ts       # Cookie utilities

src/utils/
├── cookies/
│   └── cartId.ts        # Cart ID cookie management
├── validators/
│   └── cartInputValidator.ts
├── env.ts
├── parsers.ts
├── types.ts
└── text.ts
```

## Architecture Patterns

### 1. Server Components (RSC) by Default

Pages are React Server Components by default, enabling server-side data fetching and rendering.

**Benefits**:
- Faster initial page load
- Better SEO
- Reduced JavaScript bundle size
- Direct backend API access (no client-side exposure)
- Automatic code splitting

**Example**: Product listing page
```typescript
// src/app/shop/page.tsx
import ProductsMainMessageSection from "@/app/components/product/ProductsMainMessageSection";
import { ProductGridSection } from "@/app/components/shop/ProductGrid";
import { ShopifyProductService } from "@/lib/shopify/services/ShopifyProductService";

export default async function Shop() {
  // Fetch data directly in server component
  const productService = new ShopifyProductService({
    parseClientResponse,
    getNavigationLink,
  });
  const products = await productService.fetchProductList(20);

  return (
    <main>
      <Container>
        <ProductsMainMessageSection
          title={PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.title}
          description={PRODUCTS_MAIN_MESSAGE_SECTION_TEXT.description}
        />
        <ProductGridSection products={products} />
      </Container>
    </main>
  );
}
```

### 2. Client Components for Interactivity

Use `'use client'` directive for components that need browser APIs or state management.

**When to use Client Components**:
- Forms with validation and submission
- Interactive UI elements (modals, dropdowns)
- Browser APIs (localStorage, document, window)
- React hooks (useState, useEffect, useContext, custom hooks)
- Event handlers and user interactions
- Third-party libraries that require browser APIs

**Example**: Login form
```typescript
// src/app/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/account'); // Redirect after login
    } catch (err) {
      // Error displayed via useAuth error state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
    </form>
  );
}
```

### 3. Route Groups for Layout Organization

Route groups `(group-name)` organize routes without affecting URL structure.

**Example**: Auth route group
```
(auth)/
├── login/page.tsx    → /login
└── register/page.tsx → /register
```

Benefits:
- Shared layouts for related routes via `layout.tsx`
- Clear code organization
- No impact on URLs (parentheses are not included in URL path)
- Easier to apply middleware or layout wrappers

### 4. Custom Hooks Pattern

Reusable stateful logic extracted into custom hooks for separation of concerns.

**useAuth Hook**:
```typescript
// src/app/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Customer, CustomerInput, LoginResponse } from '@/lib/commerce/types';

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    customer: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const shopAPI = useMemo(() => new ShopAPIProvider({
    baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
  }), []);

  // Load tokens from localStorage on mount
  useEffect(() => {
    const loadAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      const customerData = localStorage.getItem('customer');
      // ... load and set state
    };
    loadAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await shopAPI.loginCustomer(email, password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('customer', JSON.stringify(response.customer));
      setState({
        customer: response.customer,
        accessToken: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  }, [shopAPI]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('customer');
    setState({ /* reset state */ });
  }, []);

  return { ...state, login, logout };
}
```

**useCart Hook**:
```typescript
// src/app/hooks/useCart.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Cart, CartItemInput } from '@/lib/commerce/types';
import { getCookie, setCookie } from '@/lib/utils/cookies';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shopAPI = useMemo(() => new ShopAPIProvider({
    baseUrl: process.env.NEXT_PUBLIC_SHOP_API_URL || 'http://localhost:8080',
  }), []);

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      const cartId = getCookie('cartId');
      if (cartId) {
        try {
          const cartData = await shopAPI.getCart(cartId);
          setCart(cartData);
        } catch (err) {
          // Cart not found, create new
          const newCart = await shopAPI.createCart();
          setCart(newCart);
          setCookie('cartId', newCart.id);
        }
      } else {
        const newCart = await shopAPI.createCart();
        setCart(newCart);
        setCookie('cartId', newCart.id);
      }
      setIsLoading(false);
    };
    loadCart();
  }, [shopAPI]);

  const addItem = useCallback(async (item: CartItemInput) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const updatedCart = await shopAPI.addToCart(cart.id, [item]);
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cart, shopAPI]);

  return { cart, isLoading, error, addItem, updateItem, removeItem, clearCart };
}
```

**Usage in components**:
```typescript
function AccountPage() {
  const { customer, isAuthenticated, logout } = useAuth();
  const { cart, addItem } = useCart();
  // Use auth state and methods
}
```

### 5. API Routes as BFF (Backend for Frontend)

Next.js API routes act as a proxy layer to shop-api, hiding implementation details from the client.

**Benefits**:
- Hide backend URL and API keys from client
- Add server-side request validation
- Transform responses if needed
- Handle errors consistently
- Server-side environment variables (not exposed to client)
- Add authentication/authorization layer

**Example**: Cart API route
```typescript
// src/app/api/cart/route.ts
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import type { Cart } from "@/lib/commerce/types";
import { getCartId, createCartId } from "@/utils/cookies/cartId";
import { env } from "@/utils/env";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (): Promise<ServerApiResponse<Cart>> => {
  const cartId = getCartId();
  if (!cartId) {
    return NextResponse.json(
      { errors: "No cart found", data: undefined },
      { status: 404 }
    );
  }

  try {
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,       // Server-side only
      apiKey: env.SHOP_API_KEY,        // Server-side only
    });
    const cart = await shopAPI.getCart(cartId);
    return NextResponse.json({ data: cart }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { errors: "Error fetching cart", data: undefined },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest): Promise<ServerApiResponse<Cart>> => {
  try {
    const shopAPI = new ShopAPIProvider({
      baseUrl: env.SHOP_API_URL,
      apiKey: env.SHOP_API_KEY,
    });
    const body = await request.json().catch(() => ({}));
    const { items, customerId } = body;

    // Create new cart
    let cart = await shopAPI.createCart(customerId);

    // Add items if provided
    if (items && items.length > 0) {
      cart = await shopAPI.addToCart(cart.id, items);
    }

    // Set cart ID in cookie
    createCartId(cart.id);

    return NextResponse.json({ data: cart, errors: undefined }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { errors: "Error creating cart", data: undefined },
      { status: 500 }
    );
  }
};
```

### 6. Commerce Provider Abstraction

The CommerceProvider interface abstracts the backend, making it easy to swap implementations (shop-api, Shopify, mock, etc.).

**Interface**:
```typescript
// src/lib/commerce/provider.ts
export interface CommerceProvider {
  // Product Operations
  getProducts(filters?: { collectionId?: string; tags?: string[]; limit?: number; cursor?: string }): Promise<ListResponse<Product>>;
  getProduct(productId: string): Promise<Product>;
  searchVariants(params: VariantSearchParams): Promise<ProductVariant[]>;

  // Collection Operations
  getCollections(params?: { limit?: number; cursor?: string }): Promise<ListResponse<Collection>>;
  getCollection(collectionId: string): Promise<Collection>;

  // Cart Operations
  createCart(customerId?: string): Promise<Cart>;
  getCart(cartId: string): Promise<Cart>;
  addToCart(cartId: string, items: CartItemInput[]): Promise<Cart>;
  updateCartItem(cartId: string, itemId: string, quantity: number): Promise<Cart>;
  removeCartItem(cartId: string, itemId: string): Promise<Cart>;

  // Order Operations
  createOrder(input: OrderInput): Promise<Order>;
  getOrder(orderId: string): Promise<Order>;
  getCustomerOrders(customerId: string, params?: { limit?: number; cursor?: string }): Promise<ListResponse<Order>>;

  // Customer Operations
  registerCustomer(input: CustomerInput): Promise<LoginResponse>;
  loginCustomer(email: string, password: string): Promise<LoginResponse>;
  getCustomer(customerId: string): Promise<Customer>;

  // Customization Operations
  uploadCustomizationImage(file: File, userId: string, options?: { cartId?: string }): Promise<{ id: string; url: string }>;
  processCustomizationImage(imageId: string, userId: string, operations: Array<{ type: string; width?: number }>): Promise<{ id: string; url: string }>;

  // Integration Operations
  syncPrintfulCatalog(): Promise<{ message: string; status: string }>;
  createPrintfulOrder(orderId: string): Promise<PrintfulOrder>;
}
```

**Implementation**:
```typescript
// src/lib/commerce/providers/shop-api.ts
export class ShopAPIProvider implements CommerceProvider {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: { baseUrl: string; apiKey?: string }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.collectionId) params.set('collectionId', filters.collectionId);
    if (filters.limit) params.set('limit', filters.limit.toString());

    const response = await fetch(`${this.baseUrl}/v1/products?${params}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createCart(customerId?: string) {
    const response = await fetch(`${this.baseUrl}/v1/carts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ customerId }),
    });
    return response.json();
  }

  private getHeaders() {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['X-API-Key'] = this.apiKey;
    return headers;
  }
}
```

**Usage**:
```typescript
// Can swap implementations easily
const shopAPI = new ShopAPIProvider({ baseUrl: '...' });
// Could swap with: new ShopifyProvider() or new MockProvider()

const products = await shopAPI.getProducts({ limit: 20 });
```

### 7. Type Safety with TypeScript

All types defined in centralized location with strict type checking throughout the application.

**Type definitions**:
```typescript
// src/lib/commerce/types.ts
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
  product?: { title: string; image?: string };
  variant?: { title: string };
  customizationData?: Record<string, any>;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  customer: Customer;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

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
  createdAt: string;
  updatedAt: string;
}
```

**Benefits**:
- Compile-time error checking
- IntelliSense/autocomplete support
- Refactoring safety
- Self-documenting code
- Easier onboarding for new developers

## Component Patterns

### Form Components

**Pattern**: Controlled components with client-side validation

```typescript
'use client';

import { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Submit logic
      await submitForm(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        disabled={isLoading}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Error Boundary

**Pattern**: Class component for error catching (React limitation - must use class component)

```typescript
// src/app/components/ErrorBoundary.tsx
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    // Could send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage**:
```typescript
import { ErrorBoundary } from '@/app/components/ErrorBoundary';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
```

### Protected Routes

**Pattern**: Check auth in Client Component with redirect

```typescript
// src/app/account/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function AccountPage() {
  const { customer, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!customer) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="md:flex md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">Account Dashboard</h2>
        <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-md">
          Sign Out
        </button>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg">
        <h3 className="text-lg font-medium p-6">Profile Information</h3>
        <dl className="divide-y">
          <div className="px-6 py-4 grid grid-cols-3 gap-4">
            <dt className="font-medium text-gray-500">Name</dt>
            <dd className="col-span-2">{customer.firstName} {customer.lastName}</dd>
          </div>
          <div className="px-6 py-4 grid grid-cols-3 gap-4">
            <dt className="font-medium text-gray-500">Email</dt>
            <dd className="col-span-2">{customer.email}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
```

### Canvas Editor Pattern (Fabric.js Integration)

**Pattern**: Client component with imperative canvas API

```typescript
// src/app/components/editor/Canvas.tsx
'use client';

import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export default function Canvas({ width, height, onCanvasReady }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = canvas;
    onCanvasReady?.(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height, onCanvasReady]);

  return <canvas ref={canvasRef} />;
}
```

## State Management

### 1. Local State (useState)

For component-specific state that doesn't need to be shared:
```typescript
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [selectedColor, setSelectedColor] = useState('black');
```

### 2. Custom Hooks

For reusable stateful logic across components:
```typescript
const { customer, login, logout, isAuthenticated } = useAuth();
const { cart, addItem, updateItem, removeItem } = useCart();
```

### 3. URL State (searchParams)

For shareable and bookmarkable state:
```typescript
import { useSearchParams } from 'next/navigation';

const searchParams = useSearchParams();
const page = searchParams.get('page') || '1';
const sortBy = searchParams.get('sortBy') || 'createdAt';
```

### 4. Cookie State

For persistent client-side state that survives page reloads:
```typescript
import { getCookie, setCookie } from '@/lib/utils/cookies';

const cartId = getCookie('cartId');
setCookie('cartId', newCart.id, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
```

### 5. localStorage State

For user-specific persistent data:
```typescript
// Store authentication tokens
const accessToken = localStorage.getItem('accessToken');
localStorage.setItem('accessToken', token);

// Store user preferences
const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
localStorage.setItem('preferences', JSON.stringify(newPreferences));
```

### 6. Server State (Future: React Query / SWR)

For server data caching and synchronization (recommended for future enhancement):
```typescript
// Future pattern with React Query
const { data: products, isLoading, error } = useQuery(['products'], fetchProducts);
```

## Data Fetching Patterns

### Server Component (Recommended for initial data)

```typescript
// src/app/shop/page.tsx
export default async function ShopPage() {
  const productService = new ShopifyProductService();
  const products = await productService.fetchProductList(20);

  return (
    <div>
      <ProductGrid products={products} />
    </div>
  );
}
```

### Client Component (When interactivity needed)

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
}
```

### API Route (Proxy layer)

```typescript
// src/app/api/products/route.ts
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '20';

  const shopAPI = new ShopAPIProvider({
    baseUrl: process.env.SHOP_API_URL, // Server-side only
    apiKey: process.env.SHOP_API_KEY,  // Server-side only
  });

  try {
    const products = await shopAPI.getProducts({ limit: parseInt(limit) });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

## Testing Strategy

### Unit Tests (Jest)

Test individual functions and hooks in isolation:
```typescript
// src/app/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useAuth', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.customer).toBe(null);
  });

  test('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('user@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.customer?.email).toBe('user@example.com');
  });

  test('should logout and clear storage', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('accessToken')).toBe(null);
  });
});
```

### Component Tests (React Testing Library)

Test component rendering and user interactions:
```typescript
// src/app/components/auth/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

// Mock hooks
jest.mock('@/app/hooks/useAuth');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test('should render form fields', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  test('should submit form with valid credentials', async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
  });

  test('should display error message', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
    });

    render(<LoginForm />);
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

### Integration Tests

Test API routes and data flow:
```typescript
// src/app/api/cart/__tests__/route.test.ts
import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { ShopAPIProvider } from '@/lib/commerce/providers/shop-api';

jest.mock('@/lib/commerce/providers/shop-api');

describe('/api/cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    test('should return cart when cartId exists', async () => {
      const mockCart = { id: 'cart_123', items: [], totalPrice: 0 };
      (ShopAPIProvider.prototype.getCart as jest.Mock).mockResolvedValue(mockCart);

      // Mock cookie
      const request = new NextRequest('http://localhost/api/cart');
      Object.defineProperty(request, 'cookies', {
        value: { get: () => ({ value: 'cart_123' }) },
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockCart);
    });

    test('should return 404 when no cart exists', async () => {
      const response = await GET();
      expect(response.status).toBe(404);
    });
  });

  describe('POST', () => {
    test('should create new cart', async () => {
      const mockCart = { id: 'cart_456', items: [], totalPrice: 0 };
      (ShopAPIProvider.prototype.createCart as jest.Mock).mockResolvedValue(mockCart);

      const request = new NextRequest('http://localhost/api/cart', {
        method: 'POST',
        body: JSON.stringify({ customerId: 'cust_123' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data.id).toBe('cart_456');
    });
  });
});
```

### E2E Tests (Playwright - see E2E_TEST_PLAN.md)

Full user journey testing from browser perspective.

## Best Practices

### 1. Component Design
- **Server Components First**: Default to Server Components, use Client Components only when needed
- **Small, Focused Components**: Each component should have a single responsibility
- **Prop Drilling Limit**: Use context or composition for deeply nested prop passing
- **Composition over Inheritance**: Prefer composition patterns

### 2. Testing
- **Colocate Tests**: Keep tests in `__tests__` directories next to components
- **Test User Behavior**: Focus on what users see and do, not implementation details
- **Mock External Dependencies**: Mock API calls, third-party libraries
- **Accessibility Testing**: Include aria labels and roles in tests

### 3. Type Safety
- **Type Everything**: Use TypeScript for all files (`.tsx`, `.ts`)
- **Avoid `any`**: Use specific types or `unknown` instead
- **Interface over Type**: Prefer interfaces for object shapes (extensible)
- **Shared Types**: Define types in centralized locations (`types.ts`)

### 4. Error Handling
- **Try/Catch Blocks**: Wrap async operations in try/catch
- **Error Boundaries**: Use ErrorBoundary for component errors
- **User-Friendly Messages**: Show helpful error messages to users
- **Error Logging**: Log errors for debugging (console.error, error tracking service)

### 5. Loading States
- **Show Feedback**: Always show loading indicators for async operations
- **Skeleton Screens**: Use skeleton loaders for better UX
- **Disable Interactions**: Disable buttons/inputs during loading
- **Optimistic Updates**: Update UI optimistically where appropriate

### 6. Accessibility
- **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`)
- **ARIA Attributes**: Add aria-label, aria-describedby when needed
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Color Contrast**: Follow WCAG guidelines for color contrast

### 7. Performance
- **Next.js Image**: Use `next/image` component for optimized images
- **Dynamic Imports**: Code split with `next/dynamic` for large components
- **Memoization**: Use `useMemo` and `useCallback` for expensive computations
- **Server Components**: Leverage RSC for reduced client-side JavaScript

### 8. Security
- **Never Expose Secrets**: Use server-side environment variables (not `NEXT_PUBLIC_`)
- **Validate Input**: Validate all user input on server-side
- **Sanitize Output**: Escape user-generated content
- **CSRF Protection**: Use Next.js built-in CSRF protection

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Pages | `page.tsx` | `src/app/shop/page.tsx` |
| Layouts | `layout.tsx` | `src/app/shop/layout.tsx` |
| API Routes | `route.ts` | `src/app/api/cart/route.ts` |
| Components | `ComponentName.tsx` (PascalCase) | `ProductCard.tsx` |
| Hooks | `useHookName.ts` (camelCase with `use` prefix) | `useAuth.ts`, `useCart.ts` |
| Tests | `*.test.tsx` or `*.test.ts` | `useAuth.test.ts` |
| Types | `types.ts` | `src/lib/commerce/types.ts` |
| Utils | `utilName.ts` (camelCase) | `cookies.ts`, `parsers.ts` |
| Constants | `CONSTANT_NAME` (SCREAMING_SNAKE_CASE) | `API_BASE_URL` |

## Migration Notes

The architecture evolved from Shopify-based to shop-api-based:

### Old Pattern (Shopify)
- GraphQL queries in components
- Shopify-specific data structures
- Limited customization options
- Direct Shopify API calls
- Tightly coupled to Shopify

### New Pattern (shop-api)
- REST API via ShopAPIProvider
- Standardized data structures (CommerceProvider interface)
- Full control over data model
- Custom authentication (JWT tokens)
- Customization image handling
- Backend-agnostic design
- Easier to test and mock

### Coexistence
Currently, both patterns exist in the codebase:
- **New pages/features**: Use ShopAPIProvider (shop-api)
- **Legacy pages**: Still use ShopifyProductService (being migrated)
- **API routes**: Act as proxy to shop-api

See `/Users/santiagogomez/Projects/LemniSpace/web-client/docs/API_CLIENT_USAGE.md` for detailed migration guide.

## Common Patterns Reference

### Fetching Data on Page Load
```typescript
// Server Component (preferred)
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// Client Component (when interactivity needed)
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return data ? <Component data={data} /> : <Loading />;
}
```

### Form Submission
```typescript
'use client';
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await submitForm(formData);
    router.push('/success');
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Protected Routes
```typescript
'use client';
const { isAuthenticated, isLoading } = useAuth();
const router = useRouter();

useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isLoading, isAuthenticated]);
```

### API Error Handling
```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error('Request failed');
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Fabric.js Documentation](http://fabricjs.com/docs/)

## Related Documentation

- [API Client Usage Guide](/Users/santiagogomez/Projects/LemniSpace/web-client/docs/API_CLIENT_USAGE.md) - Detailed guide on using ShopAPIProvider
- [E2E Test Plan](/Users/santiagogomez/Projects/LemniSpace/web-client/docs/E2E_TEST_PLAN.md) - End-to-end testing strategy
- [Project CLAUDE.md](/Users/santiagogomez/Projects/LemniSpace/CLAUDE.md) - Overall project architecture
