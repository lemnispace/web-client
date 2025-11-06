// Test the mapper function
const testProduct = {
  id: 'test-1',
  title: 'Test Product',
  description: 'A test product',
  price: 29.99,
  sku: 'TEST-001',
  status: 'active',
  tags: ['test'],
  images: null, // No images
  variants: [{
    id: 'var-1',
    title: 'Test Variant',
    price: 29.99,
    sku: 'TEST-001-VAR',
    inventory: 10,
    options: []
  }]
};

// Simulate the mapper logic
const img = testProduct.images && testProduct.images.length > 0
  ? {
      src: testProduct.images[0].url,
      alt: testProduct.images[0].altText || testProduct.title,
      width: testProduct.images[0].width || 800,
      height: testProduct.images[0].height || 800,
      id: testProduct.images[0].id || testProduct.id,
    }
  : {
      src: `https://placehold.co/800x800/e5e7eb/6b7280?text=${encodeURIComponent(testProduct.title)}`,
      alt: testProduct.title,
      width: 800,
      height: 800,
      id: testProduct.id,
    };

console.log('Product with no images:');
console.log('Expected placeholder image:', img);
console.log('Image src:', img.src);
console.log('Contains placehold.co:', img.src.includes('placehold.co'));
