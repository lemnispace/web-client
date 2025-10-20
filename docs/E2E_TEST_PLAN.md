# E2E Test Plan - LemniSpace Web Client

## Overview

This document outlines the end-to-end testing strategy for the LemniSpace web-client migration from Shopify to the shop-api backend. The E2E tests ensure that all critical user journeys work correctly after the migration, validating the integration between the Next.js frontend and the Go-based shop-api.

**Migration Context:** The web-client is transitioning from Shopify's Storefront API to our custom shop-api backend. E2E tests verify that this migration maintains feature parity and user experience quality.

## Testing Framework

### Recommendation: Playwright

**Rationale:**
- **Modern Architecture:** Built for modern web apps and SPAs like Next.js
- **Auto-wait:** Automatically waits for elements to be actionable, reducing flaky tests
- **Multi-browser:** Native support for Chromium, Firefox, and WebKit (Safari)
- **Parallel Execution:** Fast test execution with built-in parallelization
- **API Testing:** Can test API endpoints directly alongside UI tests
- **TypeScript Support:** First-class TypeScript support matches our stack
- **Debugging:** Excellent debugging tools including trace viewer and inspector
- **CI/CD Ready:** Works seamlessly with GitHub Actions

**Alternative Considered:** Cypress
- Pros: Great developer experience, time-travel debugging
- Cons: Limited multi-tab support, runs in-browser only, slower multi-browser testing

### Environment Setup

**Test Environments:**
- **Local:** `http://localhost:3000` with local shop-api (`http://localhost:8080`)
- **Staging:** `https://staging.lemnispace.com` with staging shop-api (`https://staging-api.lemnispace.com`)
- **Production Smoke Tests:** `https://lemnispace.com` (limited critical path tests only)

**Backend Requirements:**
- shop-api running with test database
- Test data seeded (products, collections, test users)
- S3 test bucket for image uploads
- Printful sandbox mode enabled

**CI/CD Integration:**
- GitHub Actions workflow
- Run on every PR to main
- Run nightly against staging
- Run smoke tests post-deployment

## Test Scenarios

### 1. Authentication Flow

**Test: User Registration and Login**

**Steps:**
1. Navigate to `/register`
2. Fill registration form:
   - Email: `test-${timestamp}@example.com`
   - Password: `SecurePass123!`
   - Name: `Test User`
3. Submit form
4. Verify redirect to `/account`
5. Verify welcome message displays
6. Click logout button
7. Verify redirect to home page
8. Navigate to `/login`
9. Enter credentials from step 2
10. Submit form
11. Verify redirect to `/account`
12. Verify profile data displayed correctly

**Expected Results:**
- Complete auth flow works end-to-end
- JWT token stored in cookie/localStorage
- Protected routes accessible after login
- User data fetched from shop-api `/v1/customers` endpoint

**Error Cases:**
- Invalid email format
- Weak password
- Duplicate email registration
- Incorrect login credentials
- Expired session handling

---

### 2. Product Browsing

**Test: Browse and View Products**

**Steps:**
1. Navigate to `/products`
2. Verify product grid loads
3. Verify at least 10 products displayed
4. Verify product cards show:
   - Product image
   - Product title
   - Price
   - "View Details" button
5. Apply filter (e.g., category, price range)
6. Verify filtered results
7. Clear filters
8. Click on first product card
9. Verify redirect to `/products/[id]` page
10. Verify product details page shows:
    - Product images gallery
    - Product title and description
    - Available variants (sizes, colors)
    - Price
    - Add to cart button
11. Navigate back to `/products`
12. Verify scroll position maintained

**Expected Results:**
- Product data fetched from shop-api `/v1/products` endpoint (NOT Shopify)
- Images loaded from shop-api/S3
- Pagination works correctly
- Filtering and sorting work via shop-api query parameters
- Product details page loads variant data from shop-api

**Performance Benchmarks:**
- Product listing page load: < 2 seconds
- Product detail page load: < 1.5 seconds
- Image load time: < 1 second per image

---

### 3. Cart Management

**Test: Add to Cart and Checkout Flow**

**Steps:**
1. Navigate to `/products`
2. Click first product
3. Select variant (size: L, color: Blue)
4. Click "Add to Cart"
5. Verify cart badge updates (shows "1")
6. Verify success toast message
7. Click cart icon
8. Verify cart drawer/page opens
9. Verify item displayed with:
   - Product image
   - Title
   - Variant details
   - Price
   - Quantity selector
   - Remove button
10. Increase quantity to 3
11. Verify subtotal updates
12. Click "Remove" on item
13. Verify cart shows "empty cart" message
14. Add same product again (quantity 2)
15. Refresh page
16. Verify cart persists (2 items)
17. Click "Proceed to Checkout"
18. Verify redirect to `/checkout`
19. Verify checkout page shows correct totals

**Expected Results:**
- Cart state managed via shop-api `/v1/carts` endpoints
- Cart ID stored in cookie for anonymous users
- Cart persists across page reloads
- Cart updates reflected immediately in UI
- Quantity changes trigger cart update API calls
- Cart totals calculated correctly (subtotal, tax, shipping)

**Error Cases:**
- Add out-of-stock item
- Exceed maximum quantity
- Cart ID cookie expired/invalid

---

### 4. Customization Upload

**Test: Upload Custom Image and Link to Product**

**Steps:**
1. Login as test user
2. Navigate to `/customize` or customization page
3. Click "Upload Image" button
4. Select test image file (JPEG, < 5MB)
5. Verify upload progress indicator
6. Verify image appears in user's gallery
7. Verify image thumbnail displays
8. Click uploaded image
9. Verify image detail modal/page opens
10. Click "Edit" or "Process Image"
11. Apply transformation (e.g., crop, resize, remove background)
12. Save processed image
13. Navigate to `/products`
14. Select product that supports customization
15. Click "Add Customization"
16. Select uploaded image from gallery
17. Verify customization preview shows on product
18. Add to cart
19. Navigate to `/cart`
20. Verify cart item shows customization image
21. Verify customization data linked to cart item

**Expected Results:**
- Image upload uses shop-api presigned S3 URL (`POST /v1/customizations/images?userId={id}`)
- Image metadata stored in DynamoDB via shop-api
- User-specific access control enforced (can only see own images)
- Image processing triggers shop-api endpoint
- Customization linked to cart item via shop-api
- Customization data persists with order

**Security Validation:**
- User A cannot access User B's customization images
- Invalid userId parameter rejected
- Unauthorized requests return 401/403

---

### 5. Order Placement

**Test: Complete Order Flow**

**Steps:**
1. Add 2 different products to cart (1 with customization, 1 without)
2. Navigate to `/cart`
3. Verify cart totals correct
4. Click "Proceed to Checkout"
5. Fill shipping information:
   - Full name
   - Address
   - City, State, ZIP
   - Country
   - Phone number
6. Click "Continue to Payment"
7. Enter test payment information:
   - Card number: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
8. Review order summary
9. Click "Place Order"
10. Verify order processing indicator
11. Verify redirect to `/orders/[orderId]` confirmation page
12. Verify order confirmation displays:
    - Order number
    - Order date
    - Items ordered (with images)
    - Shipping address
    - Payment method (masked)
    - Order total
    - Estimated delivery date
13. Verify confirmation email sent (check test inbox)
14. Navigate to `/account`
15. Click "Order History"
16. Verify new order appears in list
17. Click on order
18. Verify order details match confirmation page

**Expected Results:**
- Order created via shop-api `POST /v1/orders` endpoint
- Order status: `pending` initially
- Printful fulfillment triggered (webhook sent)
- Order stored in DynamoDB with correct structure
- Customer record linked to order
- Customization images included in order data
- Cart cleared after successful order
- Order accessible via `/v1/orders?customerId={id}` endpoint

**Error Cases:**
- Payment declined
- Invalid shipping address
- Network timeout during order placement
- Duplicate order submission (double-click prevention)

---

### 6. Collection Browsing

**Test: View Collection and Filter Products**

**Steps:**
1. Navigate to `/collections`
2. Verify collections grid loads
3. Click on first collection (e.g., "Summer Collection")
4. Verify redirect to `/collections/[id]`
5. Verify collection page shows:
   - Collection title and description
   - Collection banner image
   - Products in collection
6. Verify products are filtered to collection
7. Apply additional filter (e.g., price range)
8. Verify filtered results within collection
9. Sort by price (low to high)
10. Verify products reordered

**Expected Results:**
- Collections fetched from shop-api `/v1/collections` endpoint
- Collection products loaded via `/v1/collections/{id}` endpoint
- Filtering and sorting work within collection context
- Collection metadata (title, description, image) displayed correctly

---

### 7. Search Functionality

**Test: Search Products**

**Steps:**
1. Navigate to home page
2. Click search icon/input
3. Enter search query: "mug"
4. Verify search results dropdown/page displays
5. Verify results contain "mug" in title or description
6. Click on search result
7. Verify redirect to product detail page
8. Go back to search
9. Enter query with no results: "xyzabc123"
10. Verify "No results found" message

**Expected Results:**
- Search queries sent to shop-api `/v1/products?search={query}` endpoint
- Results filtered by search term
- Debounced search input (300ms delay)
- Search history stored locally (optional)

---

### 8. Account Management

**Test: View and Update Profile**

**Steps:**
1. Login as test user
2. Navigate to `/account`
3. Verify account dashboard displays:
   - Profile information
   - Order history summary
   - Saved customizations
   - Account settings
4. Click "Edit Profile"
5. Update name and phone number
6. Click "Save Changes"
7. Verify success message
8. Refresh page
9. Verify changes persisted
10. Navigate to "Order History" tab
11. Verify orders listed with correct data
12. Navigate to "Customizations" tab
13. Verify uploaded images displayed
14. Click "Logout"
15. Verify redirect to home page

**Expected Results:**
- Profile data fetched from shop-api `/v1/customers/{id}` endpoint
- Profile updates sent to shop-api `PUT /v1/customers/{id}` endpoint
- Order history uses shop-api `/v1/orders?customerId={id}` endpoint
- Customizations use shop-api `/v1/customizations/images?userId={id}` endpoint

---

## Performance Benchmarks

### Page Load Times (Largest Contentful Paint)
- **Home Page:** < 1.5 seconds
- **Product Listing:** < 2 seconds
- **Product Detail:** < 1.5 seconds
- **Cart Page:** < 1 second
- **Checkout Page:** < 2 seconds
- **Account Dashboard:** < 1.5 seconds

### API Response Times (95th percentile)
- **GET /v1/products:** < 300ms
- **GET /v1/products/{id}:** < 200ms
- **POST /v1/carts/{id}/items:** < 200ms
- **POST /v1/orders:** < 500ms
- **GET /v1/customers/{id}:** < 200ms
- **POST /v1/customizations/images:** < 300ms (excluding upload time)

### Image Load Times
- **Product Thumbnails:** < 500ms
- **Product Detail Images:** < 1 second
- **Customization Images:** < 1 second

### Interaction Performance
- **Add to Cart:** < 300ms (UI feedback)
- **Cart Update:** < 300ms (UI feedback)
- **Search Results:** < 500ms (with debounce)
- **Filter/Sort:** < 300ms

### Performance Test Assertions
```javascript
// Example Playwright assertion
await expect(page).toHaveLoadState('load', { timeout: 2000 });
const performanceTiming = JSON.parse(
  await page.evaluate(() => JSON.stringify(window.performance.timing))
);
const pageLoadTime = performanceTiming.loadEventEnd - performanceTiming.navigationStart;
expect(pageLoadTime).toBeLessThan(2000);
```

---

## Error Scenarios

### Network Failures

**Test: Handle API Unavailable**
- Simulate shop-api downtime
- Verify error page displays
- Verify retry mechanism works
- Verify user-friendly error messages

**Test: Handle Timeout**
- Simulate slow API response (> 30s)
- Verify timeout handling
- Verify loading states don't hang
- Verify user can retry action

**Test: Handle Offline Mode**
- Disable network connection
- Verify offline indicator displays
- Verify cached data still accessible (if applicable)
- Verify graceful degradation

---

### Invalid Inputs

**Test: Form Validation**
- Submit forms with missing required fields
- Enter invalid email formats
- Enter weak passwords
- Enter invalid phone numbers
- Enter invalid credit card numbers
- Verify client-side validation messages
- Verify server-side validation (400 errors handled)

**Test: URL Manipulation**
- Navigate to `/products/invalid-id`
- Navigate to `/orders/non-existent-order`
- Verify 404 pages display correctly
- Verify proper error messaging

---

### Session Expiry

**Test: JWT Token Expiration**
- Login as user
- Wait for token expiration (or mock expired token)
- Attempt to perform authenticated action
- Verify redirect to login page
- Verify "Session expired" message
- Login again
- Verify redirect back to original page (if applicable)

**Test: Cart Session Expiry**
- Add items to cart as anonymous user
- Clear cart cookie
- Refresh page
- Verify new cart created
- Verify old cart items lost (expected behavior)

---

### Out of Stock Items

**Test: Handle Out of Stock**
- Navigate to out-of-stock product
- Verify "Out of Stock" badge displays
- Verify "Add to Cart" button disabled
- Verify "Notify Me" option available (optional)

**Test: Stock Changes During Checkout**
- Add last in-stock item to cart
- Simulate stock update (item becomes unavailable)
- Proceed to checkout
- Verify error message about unavailable item
- Verify cart updated to remove unavailable item

---

## Accessibility Testing

### Keyboard Navigation

**Test: Navigate Site with Keyboard Only**
- Tab through navigation menu
- Verify focus indicators visible
- Navigate to product page
- Tab through product options
- Add to cart using Enter key
- Navigate to cart using keyboard
- Complete checkout using keyboard only
- Verify all interactive elements accessible

**Test: Focus Management**
- Open modal dialog
- Verify focus trapped in modal
- Close modal with Escape key
- Verify focus returns to trigger element

---

### Screen Reader Compatibility

**Test: NVDA/JAWS/VoiceOver**
- Navigate site with screen reader
- Verify semantic HTML used correctly
- Verify ARIA labels on interactive elements
- Verify form labels associated with inputs
- Verify image alt text provided
- Verify heading hierarchy correct (h1, h2, h3)
- Verify live regions announce dynamic updates (cart badge)

**Test: Alternative Text**
- Verify all product images have meaningful alt text
- Verify decorative images have empty alt attribute
- Verify customization images have user-provided or default alt text

---

### WCAG 2.1 AA Compliance

**Test: Color Contrast**
- Verify text meets 4.5:1 contrast ratio
- Verify large text meets 3:1 contrast ratio
- Verify focus indicators meet 3:1 contrast ratio
- Use automated tool (axe, Lighthouse)

**Test: Text Resize**
- Increase browser text size to 200%
- Verify layout doesn't break
- Verify content remains readable
- Verify no text truncation

**Test: Motion and Animation**
- Verify animations respect `prefers-reduced-motion`
- Verify auto-playing content can be paused
- Verify no content flashing more than 3 times per second

---

## Browser Compatibility

### Desktop Browsers

**Chrome (latest stable)**
- Full test suite execution
- Verify Chrome-specific features work (e.g., autofill)

**Firefox (latest stable)**
- Full test suite execution
- Verify Firefox-specific rendering

**Safari (latest stable)**
- Full test suite execution
- Verify Safari-specific behaviors (e.g., date pickers)
- Test on macOS

**Edge (latest stable)**
- Full test suite execution
- Verify Chromium Edge compatibility

### Browser-Specific Tests

**Safari:**
- Test image upload (file input behavior)
- Test payment autofill
- Test localStorage persistence

**Firefox:**
- Test CORS handling
- Test cookie behavior
- Test font rendering

---

## Mobile Testing

### iOS Safari (iPhone)

**Devices to Test:**
- iPhone 14 Pro (iOS 17)
- iPhone SE (iOS 16)

**Tests:**
- Touch interactions (tap, swipe, pinch-to-zoom)
- Product image gallery swipe
- Mobile navigation menu (hamburger)
- Form inputs with iOS keyboard
- File upload from camera/photo library
- Add to Home Screen (PWA behavior)
- Orientation changes (portrait/landscape)

---

### Android Chrome (Pixel)

**Devices to Test:**
- Pixel 7 (Android 14)
- Samsung Galaxy S21 (Android 13)

**Tests:**
- Touch interactions
- Mobile navigation
- Form inputs with Android keyboard
- File upload from camera/gallery
- Landscape orientation
- Multi-window mode

---

### Responsive Design Breakpoints

**Test Breakpoints:**
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px - 1439px
- **Large Desktop:** 1440px+

**Responsive Tests:**
- Verify navigation collapses to hamburger menu (< 768px)
- Verify product grid adjusts columns (1 col mobile, 2 col tablet, 4 col desktop)
- Verify images scale appropriately
- Verify checkout form layout adapts
- Verify footer layout stacks on mobile
- Verify cart drawer vs. cart page (mobile vs. desktop)

---

## Implementation Steps

### 1. Set Up Playwright

**Install Dependencies:**
```bash
cd web-client
npm install -D @playwright/test
npx playwright install
```

**Create Configuration:**
```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### 2. Create Test Fixtures and Data

**Test Data Factory:**
```typescript
// e2e/fixtures/testData.ts
export const testData = {
  user: {
    email: `test-${Date.now()}@example.com`,
    password: 'SecurePass123!',
    name: 'Test User',
    phone: '+1234567890',
  },
  shippingAddress: {
    fullName: 'Test User',
    address: '123 Test Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'US',
    phone: '+1234567890',
  },
  payment: {
    cardNumber: '4242424242424242',
    expiry: '12/25',
    cvc: '123',
  },
};
```

**Page Object Models:**
```typescript
// e2e/pages/ProductPage.ts
import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly variantSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.productTitle = page.getByRole('heading', { level: 1 });
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.variantSelector = page.locator('[data-testid="variant-selector"]');
  }

  async goto(productId: string) {
    await this.page.goto(`/products/${productId}`);
  }

  async selectVariant(variant: string) {
    await this.variantSelector.selectOption(variant);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
}
```

**API Helpers:**
```typescript
// e2e/helpers/api.ts
export async function createTestProduct(apiUrl: string, apiKey: string) {
  const response = await fetch(`${apiUrl}/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      title: 'Test Product',
      description: 'Product for E2E testing',
      price: 29.99,
      variants: [
        { sku: 'TEST-S', size: 'S', price: 29.99 },
        { sku: 'TEST-M', size: 'M', price: 29.99 },
      ],
    }),
  });
  return response.json();
}

export async function cleanupTestData(userId: string, apiUrl: string) {
  // Delete test user's customizations, orders, etc.
}
```

---

### 3. Implement Test Scenarios

**Example Test:**
```typescript
// e2e/tests/cart.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart Management', () => {
  test('should add product to cart and update quantity', async ({ page }) => {
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Navigate to product
    await productPage.goto('prod_123');

    // Add to cart
    await productPage.selectVariant('M');
    await productPage.addToCart();

    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('1');

    // Open cart
    await page.click('[data-testid="cart-icon"]');

    // Verify item in cart
    await expect(cartPage.cartItems).toHaveCount(1);

    // Update quantity
    await cartPage.updateQuantity(0, 3);

    // Verify subtotal updates
    await expect(cartPage.subtotal).toContainText('$89.97');

    // Refresh page
    await page.reload();

    // Verify cart persists
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.itemQuantity(0)).toHaveText('3');
  });
});
```

---

### 4. Add to CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * *' # Nightly

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: web-client/package-lock.json

      - name: Install dependencies
        working-directory: web-client
        run: npm ci

      - name: Install Playwright Browsers
        working-directory: web-client
        run: npx playwright install --with-deps

      - name: Run E2E tests
        working-directory: web-client
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
          API_URL: ${{ secrets.STAGING_API_URL }}
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: web-client/playwright-report/
          retention-days: 30
```

---

### 5. Set Up Test Reporting

**HTML Reporter (Default):**
```bash
npx playwright show-report
```

**JUnit Reporter (for CI):**
```javascript
// playwright.config.ts
reporter: [
  ['html'],
  ['junit', { outputFile: 'test-results/junit.xml' }],
  ['json', { outputFile: 'test-results/results.json' }],
],
```

**Custom Reporter:**
```typescript
// e2e/reporters/customReporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Test ${test.title}: ${result.status}`);
    // Send to monitoring service, Slack, etc.
  }
}

export default CustomReporter;
```

---

## Success Criteria

### Test Coverage
- [ ] **100% of critical user paths covered**
  - Authentication (register, login, logout)
  - Product browsing (list, detail, filter, search)
  - Cart management (add, update, remove, persist)
  - Customization upload (upload, process, link)
  - Order placement (checkout, payment, confirmation)
  - Account management (profile, orders, customizations)

- [ ] **90% of secondary paths covered**
  - Collections browsing
  - Search functionality
  - Error handling flows
  - Mobile-specific interactions

- [ ] **80% of edge cases covered**
  - Network failures
  - Invalid inputs
  - Session expiry
  - Out of stock scenarios

### Test Quality
- [ ] **All tests passing in CI/CD**
  - 100% pass rate on main branch
  - < 5% flakiness rate
  - Consistent results across browsers

- [ ] **Test execution time < 5 minutes**
  - Parallel execution enabled
  - Tests optimized for speed
  - No unnecessary waits or sleeps

- [ ] **Clear test reports and failure logs**
  - Screenshots on failure
  - Trace files for debugging
  - Console logs captured
  - Network requests logged

### Performance Validation
- [ ] **All performance benchmarks met**
  - Page load times < targets
  - API response times < targets
  - Image load times < targets
  - Interaction responsiveness < targets

### Accessibility Compliance
- [ ] **WCAG 2.1 AA compliance verified**
  - Color contrast ratios pass
  - Keyboard navigation works
  - Screen reader compatibility confirmed
  - No automated accessibility violations

### Cross-Browser/Device Coverage
- [ ] **Tests pass on all target browsers**
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

- [ ] **Tests pass on mobile devices**
  - iOS Safari
  - Android Chrome

### Integration Validation
- [ ] **shop-api integration verified**
  - All API endpoints tested
  - Error responses handled correctly
  - Authentication/authorization works
  - Rate limiting respected

- [ ] **Data persistence verified**
  - Cart persists across sessions
  - Orders stored correctly
  - Customizations linked properly
  - User data maintained

### Maintainability
- [ ] **Page Object Models implemented**
  - Reusable page objects created
  - Test data factories set up
  - API helpers abstracted

- [ ] **Tests are readable and well-documented**
  - Clear test names
  - Descriptive assertions
  - Comments for complex logic

- [ ] **Easy to run locally and in CI**
  - Single command execution
  - Clear setup instructions
  - Environment configuration documented

---

## Maintenance and Updates

### Regular Maintenance
- **Weekly:** Review and triage flaky tests
- **Monthly:** Update test data and fixtures
- **Quarterly:** Review and update test scenarios for new features
- **Annually:** Audit entire test suite for relevance and coverage

### Test Ownership
- **Team:** Frontend team owns E2E test suite
- **Reviewer:** All PRs with UI changes must include E2E test updates
- **On-call:** Failing E2E tests in CI block merges

### Metrics to Track
- Test pass rate
- Test execution time
- Flakiness percentage
- Coverage percentage (user journeys)
- Time to fix failing tests

---

## Future Enhancements

### Visual Regression Testing
- Add Percy or Chromatic for screenshot comparisons
- Test UI changes don't break layouts
- Verify responsive design consistency

### Performance Testing
- Add Lighthouse CI for performance budgets
- Monitor Core Web Vitals (LCP, FID, CLS)
- Set up performance regression alerts

### Accessibility Testing
- Integrate axe-core for automated a11y testing
- Add Pa11y for continuous accessibility monitoring
- Test with real assistive technologies

### Load Testing
- Simulate high traffic scenarios
- Test concurrent user sessions
- Validate API rate limiting

### Internationalization Testing
- Test multi-language support (when implemented)
- Verify currency conversions
- Test RTL language layouts

---

## Appendix

### Useful Resources
- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [shop-api API Reference](/Users/santiagogomez/Projects/LemniSpace/docs/API-REFERENCE.md)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

### Contact
- **Questions:** Frontend team Slack channel
- **Issues:** File GitHub issue with `e2e-tests` label
- **CI Failures:** Check #ci-alerts Slack channel
