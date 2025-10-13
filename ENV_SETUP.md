# Environment Variables Setup

This document describes the environment variables required for the web-client to work with shop-api.

## Required Variables

### Shop-API Configuration

```bash
# Shop-API Base URL
# Development: http://localhost:8080
# Production: https://api.lemnispace.com
SHOP_API_URL=http://localhost:8080
```

### Shop-API Authentication (Optional)

```bash
# API Key for admin operations (optional)
# Only required if you need to perform admin operations from web-client
SHOP_API_KEY=your_api_key_here
```

### Text Mosaic Service

```bash
# Text Mosaic API URL (Python service)
TEXT_MOSAIC_API_URL=http://localhost:3001
```

### Legacy Shopify Variables (Can be removed after full migration)

```bash
# These can be removed once migration is complete
LEMNISPACE_PRODUCTS_API_TOKEN=
LEMNISPACE_STORE_DOMAIN=
LEMNISPACE_PRODUCTS_ADMIN_API_TOKEN=
LEMNISPACE_PRODUCTS_API_KEY=
LEMNISPACE_PRODUCTS_API_SECRET_KEY=
LEMNISPACE_HOST_NAME=
LEMNISPACE_SHOP_NAME=
```

## Setup Instructions

### Development

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update `SHOP_API_URL` to point to your local shop-api:
   ```bash
   SHOP_API_URL=http://localhost:8080
   ```

3. Start the shop-api backend:
   ```bash
   cd ../shop-api
   make dev-up
   ```

4. Start the web-client:
   ```bash
   npm run dev
   ```

### Production

1. Set `SHOP_API_URL` to your production API:
   ```bash
   SHOP_API_URL=https://api.lemnispace.com
   ```

2. If using API key authentication, set:
   ```bash
   SHOP_API_KEY=your_production_api_key
   ```

## Testing the Connection

To verify the web-client can connect to shop-api:

1. Start both services (shop-api and web-client)
2. Navigate to http://localhost:3000/api/cart (should return 404 or cart data)
3. Check the browser network tab for requests to shop-api

## Architecture Notes

The web-client now uses a commerce abstraction layer (`/src/lib/commerce/`) that:
- Provides a unified interface for e-commerce operations
- Allows switching between different backends (shop-api, Shopify, etc.)
- Defaults to shop-api as the primary backend

All API routes (`/src/app/api/`) now use this abstraction layer instead of directly calling Shopify APIs.

## Migration Status

- ✅ Cart API (GET, POST, PATCH)
- ✅ Cart Line API (PATCH)
- ✅ Sync API (POST - Printful catalog sync)
- ⏳ Custom Products API (pending rewrite for customization flow)
- ⏳ Full end-to-end order flow testing

## Troubleshooting

### Cannot connect to shop-api

**Error**: `fetch failed` or connection refused

**Solution**:
1. Ensure shop-api is running: `cd ../shop-api && make dev-up`
2. Check `SHOP_API_URL` points to correct address
3. Verify shop-api is accessible: `curl http://localhost:8080/v1/products`

### Environment variable not found

**Error**: `Missing environment variable: SHOP_API_URL`

**Solution**:
1. Ensure `.env.local` exists in web-client root
2. Add required variable to `.env.local`
3. Restart Next.js dev server

### CORS errors

**Error**: CORS policy blocking requests

**Solution**:
1. Shop-API should have CORS configured for web-client origin
2. Check shop-API configuration allows requests from your domain
3. In development, ensure localhost:3000 is in allowed origins
