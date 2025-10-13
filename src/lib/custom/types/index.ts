// Product Interfaces

interface Product {
  id: string;

  title: string;

  description: string;

  price: number;

  sku: string;

  status: "draft" | "active" | "archived";

  inventory: number;

  tags: string[];

  customFields: Record<string, any>;

  images: Image[];

  variants: ProductVariant[];

  dimensions: Dimensions;

  fulfillmentData: FulfillmentData;

  createdAt: string; // ISO date-time format

  updatedAt: string; // ISO date-time format
}

interface ProductInput {
  title: string;

  description: string;

  price: number;

  sku: string;

  status: "draft" | "active" | "archived";

  inventory: number;

  tags: string[];

  customFields: Record<string, any>;

  variants: ProductVariantInput[];

  dimensions: Dimensions;

  fulfillmentData: FulfillmentData;
}

interface ProductVariant {
  id: string;

  sku: string;

  title: string;

  price: number;

  inventory: number;

  options: VariantOption[];

  dimensions: Dimensions;

  fulfillmentData: FulfillmentData;
}

interface ProductVariantInput {
  sku: string;

  title: string;

  price: number;

  inventory: number;

  options: VariantOption[];

  dimensions: Dimensions;

  fulfillmentData: FulfillmentData;
}

interface VariantOption {
  name: string;

  value: string;
}

interface Dimensions {
  width: number;

  height: number;

  depth: number;

  weight: number;
}

interface FulfillmentData {
  partnerId: string;

  partnerProductId: string;

  partnerVariantId: string;

  additionalData: Record<string, any>;
}

interface Image {
  id: string;

  url: string;

  altText: string;
}

// Collection Interfaces

interface Collection {
  id: string;

  title: string;

  description: string;

  products: Product[];
}

interface CollectionInput {
  title: string;

  description: string;

  productIds: string[];
}

// Cart Interfaces

interface Cart {
  id: string;

  customerId: string;

  items: CartItem[];

  totalPrice: number;

  createdAt: string; // ISO date-time format

  updatedAt: string; // ISO date-time format
}

interface CartItem {
  id: string;

  productId: string;

  variantId: string;

  quantity: number;

  price: number;

  fulfillmentData: FulfillmentData;
}

interface CartItemInput {
  productId: string;

  variantId: string;

  quantity: number;
}

// Order Interfaces

interface Order {
  id: string;

  customerId: string;

  items: CartItem[];

  subtotal: number;

  tax: number;

  shipping: number;

  totalPrice: number;

  status:
    | "pending"
    | "paid"
    | "fulfilled"
    | "shipped"
    | "delivered"
    | "cancelled";

  shippingAddress: Address;

  billingAddress: Address;

  shippingMethod: string;

  paymentMethod: string;

  fulfillmentPartnerId: string;

  fulfillments: Fulfillment[];

  createdAt: string; // ISO date-time format

  updatedAt: string; // ISO date-time format
}

interface OrderInput {
  cartId: string;

  customerId: string;

  shippingAddress: Address;

  billingAddress: Address;

  shippingMethod: string;

  paymentMethod: string;
}

// Fulfillment Interfaces

interface Fulfillment {
  id: string;

  orderId: string;

  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  trackingNumber: string;

  trackingUrl: string;

  items: FulfillmentItem[];

  partnerId: string;

  partnerOrderId: string;

  createdAt: string; // ISO date-time format

  updatedAt: string; // ISO date-time format
}

interface FulfillmentInput {
  orderId: string;

  items: FulfillmentItemInput[];

  partnerId: string;
}

interface FulfillmentItem {
  id: string;

  orderItemId: string;

  quantity: number;
}

interface FulfillmentItemInput {
  orderItemId: string;

  quantity: number;
}

// Customer Interfaces

interface Customer {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  phone: string;

  acceptsMarketing: boolean;

  tags: string[];

  defaultAddress: Address;

  addresses: Address[];

  createdAt: string; // ISO date-time format

  updatedAt: string; // ISO date-time format
}

interface CustomerInput {
  email: string;

  password: string;

  firstName: string;

  lastName: string;

  phone: string;

  acceptsMarketing: boolean;

  defaultAddress: Address;
}

interface Address {
  firstName: string;

  lastName: string;

  company: string;

  address1: string;

  address2: string;

  city: string;

  province: string;

  country: string;

  zip: string;

  phone: string;
}

// Discount Interfaces

interface Discount {
  id: string;

  code: string;

  type: "percentage" | "fixed_amount" | "free_shipping";

  value: number;

  minimumPurchaseAmount: number;

  appliesTo: "all" | "specific_products" | "specific_collections";

  targetSelection: string[];

  startsAt: string; // ISO date-time format

  endsAt: string; // ISO date-time format

  createdAt: string; // ISO date-time format

  updatedAt: string; // ISO date-time format
}

interface DiscountInput {
  code: string;

  type: "percentage" | "fixed_amount" | "free_shipping";

  value: number;

  minimumPurchaseAmount: number;

  appliesTo: "all" | "specific_products" | "specific_collections";

  targetSelection: string[];

  startsAt: string; // ISO date-time format

  endsAt: string; // ISO date-time format
}
