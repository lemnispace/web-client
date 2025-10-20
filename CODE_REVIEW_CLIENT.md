# Code Review for LemniSpace Web Client

## Review Scope
- Repository: `LemniSpace/web-client`
- Focus: Cart workflows, customization/editor flows, mosaic generation, commerce provider usage, API integration, SSR data hydration.

## Critical Findings

1. **Cart removal crashes client (High)**  
   - `src/app/components/cart/cartUtils.ts:59`  
     `handleRemoveCartItem` still throws `Error("Not implemented")`, yet the UI wires this helper to the “Remove” buttons. A user clicking the button triggers an unhandled exception, halting cart interactions.  
   - `src/app/components/cart/CartItemList.tsx:31`  
     The list attaches `handleRemoveCartItem` directly to the click handler, so the throw surfaces immediately.  
   - Recommendation: Implement the removal path to call the API route (see Finding 2) and return the updated cart; ensure the hook/state updates mirror add/update flows.

2. **API rejects cart deletions (High)**  
   - `src/utils/validators/cartInputValidator.ts:37`  
     `CartLineUpdateInputSchema` sets `min: 1` which means `quantity: 0` is invalid.  
   - `src/app/api/cart/line/route.ts:54`  
     The route intends to treat `quantity === 0` as a removal, but validation fails first, so Ghost carts remain.  
   - Recommendation: Allow zero in the schema (or provide a dedicated DELETE endpoint) so the PATCH route can legitimately call `shopAPI.removeCartItem`.

3. **ShopAPIProvider mishandles 204 responses (High)**  
   - `src/lib/commerce/providers/shop-api.ts:74`  
     `request()` always invokes `response.json()`. The service comments note DELETE endpoints return 204 with no body; calling `json()` on 204 triggers a `SyntaxError`, bubbling up to the UI.  
   - Affected call sites: `removeCartItem` (`src/lib/commerce/providers/shop-api.ts:231`), `deleteCustomizationImage` (`src/lib/commerce/providers/shop-api.ts:472`), `linkImageToCartItem` (`src/lib/commerce/providers/shop-api.ts:481`).  
   - Recommendation: Detect empty-body responses (204 or `Content-Length: 0`) and return `undefined`. Alternatively provide a separate helper for no-content calls; whichever path is chosen, adjust all deletion callers accordingly.

4. **Missing API key in `/api/cart/line` route (High)**  
   - `src/app/api/cart/line/route.ts:21-23`  
     The route constructs `ShopAPIProvider` with only `baseUrl`, unlike `/api/cart` which uses `env.SHOP_API_KEY`. Any secured shop-api call will yield 401.  
   - Recommendation: Align the configuration with the other routes (`env.SHOP_API_URL`, `env.SHOP_API_KEY`).

5. **SSR cart page ignores httpOnly cart cookie (High)**  
   - `src/app/shop/cart/page.tsx:12`  
     `tryFetchCart()` is called without an id; the helper only fetches when an id is provided. The cookie is never read server-side, so SSR always reports an empty cart.  
   - `src/lib/shopify/services/ShopifyCartService.ts:42-55`  
     The service expects a supplied id but the page does not provide one.  
   - Recommendation: In the page route, read `cookies().get("cart_id")`, pass it to the service (or call the Next.js API route) so the SSR payload reflects the real cart state.

6. **Cart cookies diverge between server and client (High)**  
   - Server sets `cart_id` httpOnly: `src/utils/cookies/cartId.ts:6-15`.  
   - Client hook reads `cartId`: `src/app/hooks/useCart.ts:28,49`.  
   - Because httpOnly cookies are hidden from `document.cookie`, the client never sees the server cart, creating separate carts per environment.  
   - Recommendation: Route all client operations through the Next.js API (per your direction), drop direct document.cookie access, and rely on the httpOnly cookie managed by the API. Alternatively, standardize on a single cookie name/visibility, but the API routing path is safer.

7. **Cart hook still bypasses API (High)**  
   - `src/app/hooks/useCart.ts:28-82`  
     The hook instantiates `ShopAPIProvider` directly, calling shop-api from the browser with tokens pulled from `process.env`. This bypasses the Next.js API, duplicates cookie logic, and risks exposing backend secrets.  
   - Recommendation: Replace direct provider usage with fetches to `/api/cart` and `/api/cart/line`. Persist cart state locally from API responses.

8. **Mosaic preview ignores font size (Medium)**  
   - Client posts `baseFontSize`: `src/app/components/editor/useEditorActions.tsx:145-166`.  
   - API expects `base_font_size`: `src/app/api/mosaic/route.ts:53-85`.  
   - The mismatch results in the validated payload discarding the user-provided size.  
   - Recommendation: Either rename the form key to `base_font_size` before submission or adjust the API to accept both variants before validation.

## Additional Observations

- `/api/cart/route.ts` maps `merchandiseId` to both `productId` and `variantId` (`src/app/api/cart/route.ts:131`), marked with TODO. Once shop-api is the sole backend, revisit proper product/variant mapping to avoid data integrity issues.
- SSR utilities such as `ShopifyCartService.createCartWithManagedCookie` still rely on Shopify GraphQL. As shop-api becomes authoritative, consider pruning unused Shopify paths to reduce maintenance overhead.
- The editor stack (`useEditorActions`, `fetchMosaic`, API route) mixes client fetches to `/api/mosaic` and direct shop-api usage. After routing everything through Next.js, keep editor network calls behind server routes for consistent auth and telemetry.

## Suggested Next Steps

1. Fix the cart API contract (schema adjusts, API key injection, ShopAPIProvider 204 handling).  
2. Update `handleRemoveCartItem` and related client utilities to use the corrected API.  
3. Refactor `useCart` (and any other client commerce adapters) to communicate exclusively through the Next.js routes.  
4. Align SSR cart hydration with the server cookie and new API-backed hook.  
5. Patch the mosaic key mismatch and add regression tests for quantitative fields.  
6. Add integration/unit tests covering cart add/update/remove paths via the Next.js API to prevent regressions.

Each recommendation favors consolidating cart state and network calls behind Next.js so the httpOnly cookie acts as the single source of truth, matching the direction you confirmed.
