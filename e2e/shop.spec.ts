import { expect, test } from "@playwright/test";

test.describe("Shop/Collections Page", () => {
  test("should load shop page successfully", async ({ page }) => {
    await page.goto("/shop");

    // Wait for products to load - look for product titles
    await page.waitForSelector('h3:has-text("AI Art Classic T-Shirt")', {
      timeout: 10000,
    });

    // Take screenshot for manual review
    await page.screenshot({
      path: "playwright-report/shop-page.png",
      fullPage: true,
    });
  });

  test("should display products from local database", async ({ page }) => {
    await page.goto("/shop");

    // Wait for any product elements to appear
    await page.waitForTimeout(2000); // Give time for API calls

    // Look for common product elements
    const productImages = page.locator('img[alt*="Canvas"], img[alt*="Shirt"]');
    const productTitles = page.locator(
      "text=/AI Art Classic T-Shirt|AI Generated Canvas Print/i"
    );
    const productPrices = page.locator("text=/\\$\\d+\\.\\d{2}/");

    // Check if products are displayed
    const imageCount = await productImages.count();
    const titleCount = await productTitles.count();
    const priceCount = await productPrices.count();

    console.log("Product images found:", imageCount);
    console.log("Product titles found:", titleCount);
    console.log("Product prices found:", priceCount);

    // At least one of these should be > 0 if products are loading
    expect(imageCount + titleCount + priceCount).toBeGreaterThan(0);

    // Take screenshot
    await page.screenshot({
      path: "playwright-report/shop-products.png",
      fullPage: true,
    });
  });

  test("should fetch products from local shop-api (Server-Side)", async ({
    page,
  }) => {
    // Note: Next.js Server Components fetch data on the server, not in the browser
    // So we verify products are rendered correctly from the server-side fetch

    await page.goto("/shop");

    // Wait for products to load
    await page.waitForTimeout(2000);

    // Verify products from local DB are displayed
    const productTitles = page.locator("h3").filter({ hasText: /AI Art/ });
    const count = await productTitles.count();

    console.log("Products rendered from server:", count);

    // Should have multiple products from local DB
    expect(count).toBeGreaterThan(0);

    // Verify specific products from our local database exist
    await expect(
      page.getByText("AI Generated Canvas Print").first()
    ).toBeVisible();
    await expect(page.getByText("$129.99").first()).toBeVisible();
  });

  test("should navigate to product details when clicking a product", async ({
    page,
  }) => {
    await page.goto("/shop");

    // Wait for products to load
    await page.waitForTimeout(3000);

    // Find first clickable product link
    const productLinks = page.locator(
      'a[href*="/shop/products/"], a[href*="/products/"]'
    );
    const count = await productLinks.count();

    if (count > 0) {
      const firstProduct = productLinks.first();
      await firstProduct.click();

      // Verify navigation to product page
      await page.waitForURL(/\/products\/|\/shop\/products\//);

      // Take screenshot
      await page.screenshot({
        path: "playwright-report/product-details.png",
        fullPage: true,
      });
    } else {
      console.log(
        "No product links found - products may not be loading correctly"
      );
      await page.screenshot({
        path: "playwright-report/shop-no-products.png",
        fullPage: true,
      });

      // Fail the test if no products found
      expect(count).toBeGreaterThan(0);
    }
  });
});
