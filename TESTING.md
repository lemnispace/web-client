# Testing Documentation

## Current Test Coverage

### Shop-API Provider Tests
**File**: `src/lib/commerce/__tests__/shop-api.test.ts`
**Status**: ✅ **36 tests passing**
**Coverage**: **98.56% statement coverage** on provider implementation

#### What's Tested

**Cart Operations** (Currently Used):
- ✅ `createCart()` - Creates new shopping cart
- ✅ `getCart()` - Retrieves cart by ID
- ✅ `addToCart()` - Adds items to cart (loops through items, fetches final state)
- ✅ `updateCartItem()` - Updates item quantity
- ✅ `removeCartItem()` - Removes item from cart

**Customization Operations** (Currently Used):
- ✅ `uploadCustomizationImage()` - Uploads image with multipart/form-data

**Integration Operations** (Currently Used):
- ✅ `syncPrintfulCatalog()` - Triggers async Printful catalog sync

**Additional Operations** (Tested for future use):
- ✅ `getProducts()`, `getProduct()` - Product listing and retrieval
- ✅ `getCollections()`, `getCollection()` - Collection operations
- ✅ `createOrder()`, `getOrder()`, `getCustomerOrders()` - Order management
- ✅ `registerCustomer()`, `loginCustomer()`, `getCustomer()` - Customer auth
- ✅ `processCustomizationImage()` - Image processing operations

**Error Handling & Edge Cases**:
- ✅ HTTP error codes (401, 403, 404, 429, 500, 503)
- ✅ Network errors and timeouts
- ✅ Malformed JSON responses
- ✅ Empty response bodies
- ✅ API key authentication (with and without)
- ✅ Concurrent requests
- ✅ Large datasets (50-item cart)
- ✅ Special characters in IDs
- ✅ Trailing slashes in URLs

## Testing Approach

### Unit Tests
**Focus**: Business logic in commerce provider layer

The shop-api provider acts as the integration layer between the web-client and shop-api backend. All business logic for transforming data, handling errors, and managing state is tested here.

**Why this approach?**
- API routes are thin wrappers that delegate to commerce provider
- Testing the provider tests the actual business logic
- Avoids Next.js/Jest module mocking issues
- Provides reliable, fast unit tests

### API Route Testing (Not Included)
**Status**: Not implemented with Jest

**Why not?**
- Next.js API routes require Next.js runtime environment
- Jest cannot properly mock Next.js Request/Response objects
- Results in "ReferenceError: Request is not defined" errors
- Would require full Next.js test harness or E2E framework

**Alternative approaches**:
1. **E2E Testing** (Recommended): Use Playwright or Cypress to test full request/response cycle
2. **Integration Testing**: Start actual Next.js server and make HTTP requests
3. **Manual Testing**: Test with running development server

### Currently Used Commerce Methods

Based on analysis of `src/app/api/` routes:

| Method | Used In | Status |
|--------|---------|--------|
| `createCart()` | cart/route.ts | ✅ Tested |
| `getCart()` | cart/route.ts, cart/line/route.ts | ✅ Tested |
| `addToCart()` | cart/route.ts | ✅ Tested |
| `updateCartItem()` | cart/line/route.ts | ✅ Tested |
| `removeCartItem()` | cart/line/route.ts | ✅ Tested |
| `uploadCustomizationImage()` | products/route.ts | ✅ Tested |
| `syncPrintfulCatalog()` | sync/route.ts | ✅ Tested |

All currently used methods have comprehensive test coverage.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in CI mode
npm run test:ci

# Run specific test file
npm test src/lib/commerce/__tests__/shop-api.test.ts

# Run with coverage
npm test -- --coverage
```

## Test Quality Metrics

- **Total Tests**: 36 (shop-api provider)
- **Pass Rate**: 100% (36/36)
- **Statement Coverage**: 98.56%
- **Branch Coverage**: 89.47%
- **Function Coverage**: 100%
- **Flaky Tests**: 0
- **Test Execution Time**: < 1 second

## Compatibility Validation

All tests validate shop-api compatibility fixes:

1. ✅ Cart endpoints use singular `/v1/cart` not `/v1/carts`
2. ✅ Cart mutations fetch complete cart state after operations
3. ✅ AddToCart processes items one-by-one (shop-api format)
4. ✅ Multipart uploads use FormData without Content-Type header
5. ✅ Printful sync returns 202 Accepted for async operation
6. ✅ API key included in X-API-Key header when provided

## Future Recommendations

### Short-term
1. Add E2E tests for critical user journeys (cart flow, checkout)
2. Add integration tests with actual shop-api instance
3. Monitor test coverage and maintain >75% threshold

### Long-term
1. Implement Playwright/Cypress test suite
2. Add visual regression testing
3. Add performance/load testing
4. Set up continuous monitoring of API integration

## Test Maintenance

### When to Update Tests
- ✅ When adding new commerce provider methods
- ✅ When changing API request/response formats
- ✅ When fixing bugs (add regression test)
- ✅ When shop-api endpoints change

### Test File Organization
```
src/lib/commerce/
├── __tests__/
│   └── shop-api.test.ts      # Provider unit tests
├── providers/
│   └── shop-api.ts            # Implementation
├── provider.ts                 # Interface definition
└── types.ts                    # Type definitions
```

All provider tests are colocated with the implementation in `__tests__/` directories.
