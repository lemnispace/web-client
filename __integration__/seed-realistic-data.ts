/**
 * Seed Realistic Product Data
 *
 * Seeds the shop-api with realistic, production-like product data including
 * proper variants with sensible options (sizes, colors, materials).
 */

import { SHOP_API_BASE_URL } from './setup';

const fetch = require('node-fetch');

// Admin credentials for local development
const ADMIN_EMAIL = 'admin@lemnispace.local';
const ADMIN_PASSWORD = 'admin123!@#';

async function request(endpoint: string, options: RequestInit = {}, token?: string) {
  const url = `${SHOP_API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`HTTP ${response.status}: ${error.message || JSON.stringify(error)}`);
  }

  return response.json();
}

async function registerAdmin(): Promise<void> {
  console.log('📝 Registering admin user...');
  try {
    await request('/v1/customers/register', {
      method: 'POST',
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        firstName: 'Admin',
        lastName: 'User',
      }),
    });
    console.log('✓ Admin user registered\n');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('✓ Admin user already exists\n');
    } else {
      throw error;
    }
  }
}

async function loginAdmin(): Promise<string> {
  console.log('🔐 Logging in as admin...');
  const response = await request('/v1/customers/login', {
    method: 'POST',
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.accessToken) {
    throw new Error('No access token in login response');
  }

  console.log('✓ Logged in successfully\n');
  return response.accessToken;
}

/**
 * Helper function to convert price from dollars to cents
 */
function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Realistic product catalog with proper variants
 */
const REALISTIC_PRODUCTS = [
  // T-Shirts with Size and Color variants
  {
    product: {
      title: 'AI Art Classic T-Shirt',
      description: 'Premium cotton t-shirt with custom AI-generated artwork. Soft, comfortable, and durable.',
      price: toCents(24.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt',
          altText: 'AI Art Classic T-Shirt - Black',
        },
        {
          url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+T-Shirt',
          altText: 'AI Art Classic T-Shirt - White',
        },
        {
          url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Navy+T-Shirt',
          altText: 'AI Art Classic T-Shirt - Navy',
        },
      ],
      tags: ['apparel', 't-shirt', 'ai-art', 'cotton'],
      status: 'active' as const,
    },
    variants: [
      // Black variants
      { title: 'Small / Black', price: toCents(24.99), sku: 'AI-TSHIRT-S-BLK', inventory: 50, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt', altText: 'Small Black' } },
      { title: 'Medium / Black', price: toCents(24.99), sku: 'AI-TSHIRT-M-BLK', inventory: 100, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt', altText: 'Medium Black' } },
      { title: 'Large / Black', price: toCents(26.99), sku: 'AI-TSHIRT-L-BLK', inventory: 80, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt', altText: 'Large Black' } },
      { title: 'XL / Black', price: toCents(28.99), sku: 'AI-TSHIRT-XL-BLK', inventory: 60, options: [{ name: 'Size', value: 'XL' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt', altText: 'XL Black' } },
      { title: '2XL / Black', price: toCents(30.99), sku: 'AI-TSHIRT-2XL-BLK', inventory: 40, options: [{ name: 'Size', value: '2XL' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+T-Shirt', altText: '2XL Black' } },

      // White variants
      { title: 'Small / White', price: toCents(24.99), sku: 'AI-TSHIRT-S-WHT', inventory: 50, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+T-Shirt', altText: 'Small White' } },
      { title: 'Medium / White', price: toCents(24.99), sku: 'AI-TSHIRT-M-WHT', inventory: 100, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+T-Shirt', altText: 'Medium White' } },
      { title: 'Large / White', price: toCents(26.99), sku: 'AI-TSHIRT-L-WHT', inventory: 80, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+T-Shirt', altText: 'Large White' } },
      { title: 'XL / White', price: toCents(28.99), sku: 'AI-TSHIRT-XL-WHT', inventory: 60, options: [{ name: 'Size', value: 'XL' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=White+T-Shirt', altText: 'XL White' } },

      // Navy variants
      { title: 'Small / Navy', price: toCents(24.99), sku: 'AI-TSHIRT-S-NVY', inventory: 40, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Navy' }], image: { url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Navy+T-Shirt', altText: 'Small Navy' } },
      { title: 'Medium / Navy', price: toCents(24.99), sku: 'AI-TSHIRT-M-NVY', inventory: 80, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'Navy' }], image: { url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Navy+T-Shirt', altText: 'Medium Navy' } },
      { title: 'Large / Navy', price: toCents(26.99), sku: 'AI-TSHIRT-L-NVY', inventory: 60, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Navy' }], image: { url: 'https://via.placeholder.com/800x800/1E3A8A/FFFFFF?text=Navy+T-Shirt', altText: 'Large Navy' } },
    ],
  },

  // Canvas Prints with Size variants
  {
    product: {
      title: 'AI Generated Canvas Print',
      description: 'Museum-quality canvas print featuring stunning AI-generated artwork. Ready to hang with premium wooden frame.',
      price: toCents(49.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/10B981/FFFFFF?text=Canvas+Print',
          altText: 'AI Generated Canvas Print',
        },
      ],
      tags: ['wall-art', 'canvas', 'ai-art', 'framed'],
      status: 'active' as const,
    },
    variants: [
      { title: '12" x 12"', price: toCents(49.99), sku: 'AI-CANVAS-12X12', inventory: 30, options: [{ name: 'Size', value: '12" x 12"' }], image: { url: 'https://via.placeholder.com/800x800/10B981/FFFFFF?text=Canvas+12x12', altText: '12" x 12" Canvas' } },
      { title: '16" x 16"', price: toCents(69.99), sku: 'AI-CANVAS-16X16', inventory: 25, options: [{ name: 'Size', value: '16" x 16"' }], image: { url: 'https://via.placeholder.com/800x800/10B981/FFFFFF?text=Canvas+16x16', altText: '16" x 16" Canvas' } },
      { title: '18" x 24"', price: toCents(89.99), sku: 'AI-CANVAS-18X24', inventory: 20, options: [{ name: 'Size', value: '18" x 24"' }], image: { url: 'https://via.placeholder.com/800x800/10B981/FFFFFF?text=Canvas+18x24', altText: '18" x 24" Canvas' } },
      { title: '24" x 36"', price: toCents(129.99), sku: 'AI-CANVAS-24X36', inventory: 15, options: [{ name: 'Size', value: '24" x 36"' }], image: { url: 'https://via.placeholder.com/800x800/10B981/FFFFFF?text=Canvas+24x36', altText: '24" x 36" Canvas' } },
      { title: '30" x 40"', price: toCents(179.99), sku: 'AI-CANVAS-30X40', inventory: 10, options: [{ name: 'Size', value: '30" x 40"' }], image: { url: 'https://via.placeholder.com/800x800/10B981/FFFFFF?text=Canvas+30x40', altText: '30" x 40" Canvas' } },
    ],
  },

  // Ceramic Mugs with Size variants
  {
    product: {
      title: 'Custom AI Art Ceramic Mug',
      description: 'High-quality ceramic mug with your custom AI-generated design. Microwave and dishwasher safe.',
      price: toCents(14.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/EF4444/FFFFFF?text=Ceramic+Mug',
          altText: 'Custom AI Art Ceramic Mug',
        },
      ],
      tags: ['drinkware', 'mug', 'ceramic', 'ai-art'],
      status: 'active' as const,
    },
    variants: [
      { title: '11 oz', price: toCents(14.99), sku: 'AI-MUG-11OZ', inventory: 100, options: [{ name: 'Size', value: '11 oz' }], image: { url: 'https://via.placeholder.com/800x800/EF4444/FFFFFF?text=Mug+11oz', altText: '11 oz Mug' } },
      { title: '15 oz', price: toCents(17.99), sku: 'AI-MUG-15OZ', inventory: 80, options: [{ name: 'Size', value: '15 oz' }], image: { url: 'https://via.placeholder.com/800x800/EF4444/FFFFFF?text=Mug+15oz', altText: '15 oz Mug' } },
    ],
  },

  // Text Mosaic T-Shirt
  {
    product: {
      title: 'Text Mosaic Portrait T-Shirt',
      description: 'Unique t-shirt featuring a portrait created from your custom text mosaic. Turn words into art!',
      price: toCents(27.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Mosaic+Black',
          altText: 'Text Mosaic Portrait T-Shirt - Black',
        },
        {
          url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=Mosaic+White',
          altText: 'Text Mosaic Portrait T-Shirt - White',
        },
      ],
      tags: ['apparel', 't-shirt', 'text-mosaic', 'custom'],
      status: 'active' as const,
    },
    variants: [
      { title: 'Small / Black', price: toCents(27.99), sku: 'TXT-TSHIRT-S-BLK', inventory: 40, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Mosaic+Black', altText: 'Small Black' } },
      { title: 'Medium / Black', price: toCents(27.99), sku: 'TXT-TSHIRT-M-BLK', inventory: 75, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Mosaic+Black', altText: 'Medium Black' } },
      { title: 'Large / Black', price: toCents(29.99), sku: 'TXT-TSHIRT-L-BLK', inventory: 60, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Mosaic+Black', altText: 'Large Black' } },
      { title: 'XL / Black', price: toCents(31.99), sku: 'TXT-TSHIRT-XL-BLK', inventory: 45, options: [{ name: 'Size', value: 'XL' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Mosaic+Black', altText: 'XL Black' } },

      { title: 'Small / White', price: toCents(27.99), sku: 'TXT-TSHIRT-S-WHT', inventory: 40, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=Mosaic+White', altText: 'Small White' } },
      { title: 'Medium / White', price: toCents(27.99), sku: 'TXT-TSHIRT-M-WHT', inventory: 75, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=Mosaic+White', altText: 'Medium White' } },
      { title: 'Large / White', price: toCents(29.99), sku: 'TXT-TSHIRT-L-WHT', inventory: 60, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'White' }], image: { url: 'https://via.placeholder.com/800x800/FFFFFF/000000?text=Mosaic+White', altText: 'Large White' } },
    ],
  },

  // Hoodie with Size and Color
  {
    product: {
      title: 'AI Art Premium Hoodie',
      description: 'Cozy premium hoodie with custom AI-generated artwork. Perfect for cooler weather.',
      price: toCents(44.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Hoodie',
          altText: 'AI Art Premium Hoodie - Black',
        },
        {
          url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Gray+Hoodie',
          altText: 'AI Art Premium Hoodie - Gray',
        },
      ],
      tags: ['apparel', 'hoodie', 'ai-art', 'premium'],
      status: 'active' as const,
    },
    variants: [
      { title: 'Small / Black', price: toCents(44.99), sku: 'AI-HOODIE-S-BLK', inventory: 30, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Hoodie', altText: 'Small Black' } },
      { title: 'Medium / Black', price: toCents(44.99), sku: 'AI-HOODIE-M-BLK', inventory: 50, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Hoodie', altText: 'Medium Black' } },
      { title: 'Large / Black', price: toCents(47.99), sku: 'AI-HOODIE-L-BLK', inventory: 40, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Hoodie', altText: 'Large Black' } },
      { title: 'XL / Black', price: toCents(49.99), sku: 'AI-HOODIE-XL-BLK', inventory: 30, options: [{ name: 'Size', value: 'XL' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Hoodie', altText: 'XL Black' } },

      { title: 'Small / Gray', price: toCents(44.99), sku: 'AI-HOODIE-S-GRY', inventory: 30, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Gray' }], image: { url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Gray+Hoodie', altText: 'Small Gray' } },
      { title: 'Medium / Gray', price: toCents(44.99), sku: 'AI-HOODIE-M-GRY', inventory: 50, options: [{ name: 'Size', value: 'Medium' }, { name: 'Color', value: 'Gray' }], image: { url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Gray+Hoodie', altText: 'Medium Gray' } },
      { title: 'Large / Gray', price: toCents(47.99), sku: 'AI-HOODIE-L-GRY', inventory: 40, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Gray' }], image: { url: 'https://via.placeholder.com/800x800/6B7280/FFFFFF?text=Gray+Hoodie', altText: 'Large Gray' } },
    ],
  },

  // Poster with Size
  {
    product: {
      title: 'AI Art Premium Poster',
      description: 'High-quality poster print with vivid colors and sharp details. Perfect for any room.',
      price: toCents(19.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/EC4899/FFFFFF?text=Premium+Poster',
          altText: 'AI Art Premium Poster',
        },
      ],
      tags: ['wall-art', 'poster', 'ai-art', 'print'],
      status: 'active' as const,
    },
    variants: [
      { title: '12" x 18"', price: toCents(19.99), sku: 'AI-POSTER-12X18', inventory: 50, options: [{ name: 'Size', value: '12" x 18"' }], image: { url: 'https://via.placeholder.com/800x800/EC4899/FFFFFF?text=Poster+12x18', altText: '12" x 18" Poster' } },
      { title: '18" x 24"', price: toCents(24.99), sku: 'AI-POSTER-18X24', inventory: 40, options: [{ name: 'Size', value: '18" x 24"' }], image: { url: 'https://via.placeholder.com/800x800/EC4899/FFFFFF?text=Poster+18x24', altText: '18" x 24" Poster' } },
      { title: '24" x 36"', price: toCents(34.99), sku: 'AI-POSTER-24X36', inventory: 30, options: [{ name: 'Size', value: '24" x 36"' }], image: { url: 'https://via.placeholder.com/800x800/EC4899/FFFFFF?text=Poster+24x36', altText: '24" x 36" Poster' } },
    ],
  },

  // Phone Cases with Model variants
  {
    product: {
      title: 'AI Art Phone Case',
      description: 'Protective phone case featuring your custom AI-generated design. Durable and stylish.',
      price: toCents(22.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/14B8A6/FFFFFF?text=Phone+Case',
          altText: 'AI Art Phone Case',
        },
      ],
      tags: ['accessories', 'phone-case', 'ai-art', 'protective'],
      status: 'active' as const,
    },
    variants: [
      { title: 'iPhone 13', price: toCents(22.99), sku: 'AI-CASE-IP13', inventory: 40, options: [{ name: 'Model', value: 'iPhone 13' }], image: { url: 'https://via.placeholder.com/800x800/14B8A6/FFFFFF?text=iPhone+13', altText: 'iPhone 13 Case' } },
      { title: 'iPhone 14', price: toCents(22.99), sku: 'AI-CASE-IP14', inventory: 50, options: [{ name: 'Model', value: 'iPhone 14' }], image: { url: 'https://via.placeholder.com/800x800/14B8A6/FFFFFF?text=iPhone+14', altText: 'iPhone 14 Case' } },
      { title: 'iPhone 15', price: toCents(24.99), sku: 'AI-CASE-IP15', inventory: 60, options: [{ name: 'Model', value: 'iPhone 15' }], image: { url: 'https://via.placeholder.com/800x800/14B8A6/FFFFFF?text=iPhone+15', altText: 'iPhone 15 Case' } },
      { title: 'Samsung Galaxy S23', price: toCents(22.99), sku: 'AI-CASE-S23', inventory: 30, options: [{ name: 'Model', value: 'Samsung Galaxy S23' }], image: { url: 'https://via.placeholder.com/800x800/14B8A6/FFFFFF?text=Galaxy+S23', altText: 'Samsung Galaxy S23 Case' } },
      { title: 'Samsung Galaxy S24', price: toCents(24.99), sku: 'AI-CASE-S24', inventory: 35, options: [{ name: 'Model', value: 'Samsung Galaxy S24' }], image: { url: 'https://via.placeholder.com/800x800/14B8A6/FFFFFF?text=Galaxy+S24', altText: 'Samsung Galaxy S24 Case' } },
    ],
  },

  // Tote Bag with Size and Color
  {
    product: {
      title: 'AI Art Canvas Tote Bag',
      description: 'Eco-friendly canvas tote bag with custom AI artwork. Spacious and reusable.',
      price: toCents(18.99),
      images: [
        {
          url: 'https://via.placeholder.com/800x800/F5F5DC/000000?text=Natural+Tote',
          altText: 'AI Art Canvas Tote Bag - Natural',
        },
        {
          url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Tote',
          altText: 'AI Art Canvas Tote Bag - Black',
        },
      ],
      tags: ['accessories', 'tote-bag', 'canvas', 'eco-friendly'],
      status: 'active' as const,
    },
    variants: [
      { title: 'Small / Natural', price: toCents(18.99), sku: 'AI-TOTE-S-NAT', inventory: 50, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Natural' }], image: { url: 'https://via.placeholder.com/800x800/F5F5DC/000000?text=Natural+Tote', altText: 'Small Natural Tote' } },
      { title: 'Large / Natural', price: toCents(21.99), sku: 'AI-TOTE-L-NAT', inventory: 40, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Natural' }], image: { url: 'https://via.placeholder.com/800x800/F5F5DC/000000?text=Natural+Tote', altText: 'Large Natural Tote' } },
      { title: 'Small / Black', price: toCents(18.99), sku: 'AI-TOTE-S-BLK', inventory: 45, options: [{ name: 'Size', value: 'Small' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Tote', altText: 'Small Black Tote' } },
      { title: 'Large / Black', price: toCents(21.99), sku: 'AI-TOTE-L-BLK', inventory: 35, options: [{ name: 'Size', value: 'Large' }, { name: 'Color', value: 'Black' }], image: { url: 'https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Tote', altText: 'Large Black Tote' } },
    ],
  },
];

async function seedProducts(token: string) {
  console.log('🌱 Seeding realistic products with proper variants...\n');

  const createdProducts = [];

  for (const item of REALISTIC_PRODUCTS) {
    try {
      const created = await request('/v1/products', {
        method: 'POST',
        body: JSON.stringify(item.product),
      }, token);

      console.log(`✓ Created product: ${item.product.title} (${created.id})`);
      createdProducts.push(created);

      // Add variants
      let variantCount = 0;
      for (const variant of item.variants) {
        try {
          await request(`/v1/products/${created.id}/variants`, {
            method: 'POST',
            body: JSON.stringify(variant),
          }, token);
          variantCount++;
        } catch (error: any) {
          console.warn(`  ⚠ Failed to add variant ${variant.title}: ${error.message}`);
        }
      }
      console.log(`  ✓ Added ${variantCount} variants\n`);
    } catch (error: any) {
      console.warn(`⚠ Failed to create product ${item.product.title}: ${error.message}\n`);
    }
  }

  return createdProducts;
}

async function seedCollections(products: any[], token: string) {
  console.log('🌱 Seeding realistic collections...\n');

  const collections = [
    {
      title: 'Apparel',
      description: 'Custom AI-generated artwork on premium apparel',
      handle: 'apparel',
      tags: ['apparel', 't-shirt', 'hoodie'],
    },
    {
      title: 'Wall Art',
      description: 'Transform your space with AI-generated canvas prints and posters',
      handle: 'wall-art',
      tags: ['wall-art', 'canvas', 'poster'],
    },
    {
      title: 'Drinkware',
      description: 'Custom mugs and drinkware with AI-generated designs',
      handle: 'drinkware',
      tags: ['drinkware', 'mug'],
    },
    {
      title: 'Accessories',
      description: 'Unique accessories featuring AI-generated art',
      handle: 'accessories',
      tags: ['accessories', 'phone-case', 'tote-bag'],
    },
    {
      title: 'Text Mosaic Collection',
      description: 'Transform your words into stunning visual art',
      handle: 'text-mosaic',
      tags: ['text-mosaic'],
    },
  ];

  for (const collection of collections) {
    try {
      const created = await request('/v1/collections', {
        method: 'POST',
        body: JSON.stringify(collection),
      }, token);

      console.log(`✓ Created collection: ${collection.title} (${created.id})`);

      // Add products that match the collection's tags
      const relevantProducts = products.filter(p =>
        p.tags.some((tag: string) => collection.tags.includes(tag))
      );

      // Add all relevant products at once
      if (relevantProducts.length > 0) {
        try {
          const productIds = relevantProducts.map(p => p.id);
          await request(`/v1/collections/${created.id}/products`, {
            method: 'POST',
            body: JSON.stringify({ productIds }),
          }, token);
          console.log(`  ✓ Added ${productIds.length} products\n`);
        } catch (error: any) {
          console.warn(`  ⚠ Failed to add products: ${error.message}\n`);
        }
      } else {
        console.log(`  ⓘ No matching products for this collection\n`);
      }
    } catch (error: any) {
      console.warn(`⚠ Failed to create collection ${collection.title}: ${error.message}\n`);
    }
  }
}

export async function seedRealisticData() {
  try {
    console.log('🌱 Starting realistic data seeding...\n');
    console.log('================================================\n');

    // Check if shop-api is running
    try {
      await fetch(`${SHOP_API_BASE_URL}/health`);
    } catch (error) {
      throw new Error('shop-api is not running. Please start it with: cd shop-api && make dev-up');
    }

    // Register and login as admin to get JWT token
    await registerAdmin();
    const token = await loginAdmin();

    const products = await seedProducts(token);
    await seedCollections(products, token);

    console.log('================================================');
    console.log('✅ Realistic data seeding complete!\n');
    console.log(`   📦 Created ${products.length} products with realistic variants`);
    console.log(`   📁 Created 5 collections`);
    console.log(`   🎨 Total variants: ${REALISTIC_PRODUCTS.reduce((sum, p) => sum + p.variants.length, 0)}\n`);
    console.log('Your local database now has production-like data! 🎉');
  } catch (error: any) {
    console.error('\n❌ Realistic data seeding failed:', error.message);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedRealisticData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
