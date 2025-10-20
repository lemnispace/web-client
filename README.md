# LemniSpace Web client

Web client for LemniSpace

## Environment Variables

Create a `.env.local` file in the web-client directory with:

### Shop API (Required)
- `SHOP_API_URL`: Backend API URL for server-side calls
  - Development: `http://localhost:8080`
  - Production: `https://api.lemnispace.com`

- `NEXT_PUBLIC_SHOP_API_URL`: Backend API URL for client-side calls
  - Development: `http://localhost:8080`
  - Production: `https://api.lemnispace.com`

### Text Mosaic Service (Required)
- `NEXT_PUBLIC_TXT_MOSAIC_URL`: Text mosaic generation service
  - Development: `http://localhost:8000`
  - Production: `https://txt-mosaic.lemnispace.com`

### Deprecated (Shopify)
The following variables are no longer used:
- ~~SHOPIFY_STORE_DOMAIN~~
- ~~SHOPIFY_STOREFRONT_ACCESS_TOKEN~~
- ~~SHOPIFY_ADMIN_ACCESS_TOKEN~~
