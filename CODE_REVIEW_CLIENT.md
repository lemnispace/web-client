# Code Review for LemniSpace Web Client

## Review Scope
- Repository: `LemniSpace/web-client`
- Snapshot: current head after cart reroute + mosaic fixes
- Focused areas: client cart workflow (`useCart`, components, API routes), product navigation, commerce types, and supporting utilities.

## Critical Findings

1. **Cart additions still send the wrong product identifier (High)**  
   - `useCart.addItem` posts a Shopify-style payload to `/api/cart`, ignoring the `productId` supplied by callers (`src/app/hooks/useCart.ts:48-83`). Only `merchandiseId` (variant id) is sent.  
   - The API route converts that `merchandiseId` into both `productId` and `variantId` (`src/app/api/cart/route.ts:86-113`), as flagged by the in-code TODO. Shop-api expects a real product id alongside the variant; duplicating the variant id means the backend can’t look up catalog data reliably.  
   - Result: cart creation will either fail (400/422) or store incorrect data, breaking pricing, fulfillment, or order creation.  
   - Fix: include the real `productId` in the client request and update the API route to forward both fields to `shopAPI.addToCart`. Remove the stopgap assignment once the contract is corrected; add tests covering add-to-cart with distinct product/variant ids.

2. **Cart item links still 404 whenever `handle` is absent (High)**  
   - `CartItem` builds detail URLs from `item.product?.handle`, falling back to `productId` (`src/app/components/cart/CartItem.tsx:14-33`).  
   - Shop routes accept slugs/handles (`src/app/shop/products/[slug]/page.tsx`), not internal ids. If shop-api omits `handle` on cart items—common when the cart endpoint only returns ids—the link drills into `/shop/products/prod_123`, which 404s.  
   - Fix: ensure the backend cart response includes a handle (or some routable slug) and treat missing handles as a signal to hide/disable the link. At minimum, guard against the fallback to productId so we don’t provide a broken navigation path.

## Additional Observations

- The new commerce `Product`/`CartItem` types assume `handle`/`product.handle` are always present (`src/lib/commerce/types.ts:12-44`). Validate that the shop-api responses actually include these fields; otherwise the type contract and the UI expectations diverge.  
- `useCart` now powers both the cart page and product detail flow; consider centralising the hook via context or Zustand to avoid redundant API calls on every component mount.  
- `QuantitySelector` still caps options at 20 via `MAX_QUANTITY`, even though `CartItem` passes `max={99}`—something to revisit if larger quantities should be supported.

## Suggested Next Steps

1. Update the `/api/cart` request/handler to transmit true product ids alongside variant ids; add integration coverage to keep it correct.  
2. Guarantee cart items expose a valid storefront handle (or remove the link when absent) to prevent 404 navigation.  
3. Once the above ship, run the end-to-end cart flow (product page add → cart page → product link) to confirm state and routing behave correctly.

Addressing these items will stabilise the shop-api cart integration and remove the last functional gaps from the refactor.
