/**
 * Seed Test Data Script
 *
 * Seeds the shop-api with test products and collections for integration testing.
 */

import { SHOP_API_BASE_URL } from './setup';

const fetch = require('node-fetch');

interface Product {
  title: string;
  description: string;
  price: number;
  images: { url: string; altText: string }[];
  tags: string[];
  status: 'active' | 'draft' | 'archived';
}

interface Variant {
  title: string;
  price: number;
  sku?: string;
  inventory?: number;
  options: { name: string; value: string }[];
}

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${SHOP_API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`HTTP ${response.status}: ${error.message}`);
  }

  return response.json();
}

async function seedProducts() {
  console.log('🌱 Seeding test products...');

  const testProducts: Product[] = [
    {
      title: 'Test T-Shirt',
      description: 'A comfortable test t-shirt for integration testing',
      price: 19.99,
      images: [
        {
          url: 'https://via.placeholder.com/600x600/FF0000/FFFFFF?text=Test+T-Shirt',
          altText: 'Test T-Shirt',
        },
      ],
      tags: ['test', 'apparel', 't-shirt'],
      status: 'active',
    },
    {
      title: 'Test Mug',
      description: 'A ceramic test mug for integration testing',
      price: 12.99,
      images: [
        {
          url: 'https://via.placeholder.com/600x600/0000FF/FFFFFF?text=Test+Mug',
          altText: 'Test Mug',
        },
      ],
      tags: ['test', 'drinkware', 'mug'],
      status: 'active',
    },
    {
      title: 'Test Canvas Print',
      description: 'A canvas print for integration testing',
      price: 49.99,
      images: [
        {
          url: 'https://via.placeholder.com/600x600/00FF00/FFFFFF?text=Canvas+Print',
          altText: 'Test Canvas Print',
        },
      ],
      tags: ['test', 'wall-art', 'canvas'],
      status: 'active',
    },
  ];

  const createdProducts = [];

  for (const product of testProducts) {
    try {
      const created = await request('/v1/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });

      console.log(`✓ Created product: ${product.title} (${created.id})`);
      createdProducts.push(created);

      // Add variants to each product
      const variants: Variant[] = [
        {
          title: 'Small',
          price: product.price,
          sku: `${created.id}-S`,
          inventory: 100,
          options: [{ name: 'Size', value: 'Small' }],
        },
        {
          title: 'Medium',
          price: product.price,
          sku: `${created.id}-M`,
          inventory: 100,
          options: [{ name: 'Size', value: 'Medium' }],
        },
        {
          title: 'Large',
          price: product.price + 2,
          sku: `${created.id}-L`,
          inventory: 100,
          options: [{ name: 'Size', value: 'Large' }],
        },
      ];

      for (const variant of variants) {
        try {
          await request(`/v1/products/${created.id}/variants`, {
            method: 'POST',
            body: JSON.stringify(variant),
          });
          console.log(`  ✓ Added variant: ${variant.title}`);
        } catch (error: any) {
          console.warn(`  ⚠ Failed to add variant ${variant.title}: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.warn(`⚠ Failed to create product ${product.title}: ${error.message}`);
    }
  }

  return createdProducts;
}

async function seedCollections(products: any[]) {
  console.log('\n🌱 Seeding test collections...');

  const testCollections = [
    {
      title: 'Test Apparel',
      description: 'Test apparel collection',
      handle: 'test-apparel',
    },
    {
      title: 'Test Home & Living',
      description: 'Test home and living collection',
      handle: 'test-home-living',
    },
  ];

  for (const collection of testCollections) {
    try {
      const created = await request('/v1/collections', {
        method: 'POST',
        body: JSON.stringify(collection),
      });

      console.log(`✓ Created collection: ${collection.title} (${created.id})`);

      // Add products to collection
      const relevantProducts = products.filter(p =>
        p.tags.some((tag: string) =>
          collection.handle.includes('apparel') ? tag.includes('apparel') : tag.includes('drinkware') || tag.includes('wall-art')
        )
      );

      for (const product of relevantProducts) {
        try {
          await request(`/v1/collections/${created.id}/products`, {
            method: 'POST',
            body: JSON.stringify({ productId: product.id }),
          });
          console.log(`  ✓ Added product: ${product.title}`);
        } catch (error: any) {
          console.warn(`  ⚠ Failed to add product: ${error.message}`);
        }
      }
    } catch (error: any) {
      console.warn(`⚠ Failed to create collection ${collection.title}: ${error.message}`);
    }
  }
}

export async function seedTestData() {
  try {
    console.log('🌱 Starting test data seeding...\n');

    // Check if shop-api is running
    try {
      await fetch(`${SHOP_API_BASE_URL}/health`);
    } catch (error) {
      throw new Error('shop-api is not running. Please start it with docker-compose up -d');
    }

    const products = await seedProducts();
    await seedCollections(products);

    console.log('\n✅ Test data seeding complete!');
    console.log(`   - Created ${products.length} products`);
    console.log(`   - Created 2 collections`);
  } catch (error: any) {
    console.error('\n❌ Test data seeding failed:', error.message);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedTestData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
