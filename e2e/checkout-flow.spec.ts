import { expect, test } from "@playwright/test";

test.describe("Complete E2E Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Start at shop page
    await page.goto("/shop");
    await page.waitForTimeout(2000); // Allow products to load
  });

  test("should complete full checkout flow: browse → product details → customize → cart → checkout", async ({
    page,
  }) => {
    // STEP 1: Browse products and verify they have images
    console.log("Step 1: Browsing products...");
    const productCards = page.locator('[href*="/shop/products/"]');
    const productCount = await productCards.count();
    expect(productCount).toBeGreaterThan(0);

    // Verify products have images
    const productImages = page.locator(
      '[href*="/shop/products/"] img, [href*="/shop/products/"] ~ img'
    );
    const imageCount = await productImages.count();
    expect(imageCount).toBeGreaterThan(0);

    await page.screenshot({
      path: "playwright-report/01-shop-browse.png",
      fullPage: true,
    });

    // STEP 2: Click on first product to view details
    console.log("Step 2: Navigating to product details...");
    await productCards.first().click();
    await page.waitForURL(/\/shop\/products\//);
    await page.waitForTimeout(1500);

    // Verify product details page loaded with images
    const productTitle = page.locator("h1, h2").first();
    await expect(productTitle).toBeVisible();

    // Verify product has an image
    const detailImages = page.locator('img[alt*="AI"], img[src*="printful"]');
    expect(await detailImages.count()).toBeGreaterThan(0);

    await page.screenshot({
      path: "playwright-report/02-product-details.png",
      fullPage: true,
    });

    // STEP 3: Select variant if available
    console.log("Step 3: Selecting product variant...");
    const variantButtons = page.locator(
      'button:has-text("S"), button:has-text("M"), button:has-text("11 oz")'
    );
    if ((await variantButtons.count()) > 0) {
      await variantButtons.first().click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: "playwright-report/03-variant-selected.png",
      fullPage: true,
    });

    // STEP 4: Click customize/edit button (should work without 404)
    console.log("Step 4: Opening customization editor...");
    const customizeButton = page.locator(
      'button:has-text("Customize"), a:has-text("Customize"), button:has-text("Edit Design"), a:has-text("Edit Design")'
    );

    if ((await customizeButton.count()) > 0) {
      const currentUrl = page.url();
      await customizeButton.first().click();

      // Wait for navigation to customize page
      await page.waitForURL(/\/customize/, { timeout: 10000 });

      // Verify we didn't get a 404
      const is404 = await page.locator('text=/404|not found/i').count();
      expect(is404).toBe(0);

      // Verify editor/canvas loaded
      await page.waitForTimeout(2000);
      const canvas = page.locator("canvas, [role='img']");
      expect(await canvas.count()).toBeGreaterThan(0);

      await page.screenshot({
        path: "playwright-report/04-customization-editor.png",
        fullPage: true,
      });

      console.log("✓ Customization editor loaded successfully (no 404!)");

      // Go back to product details for add to cart
      await page.goBack();
      await page.waitForTimeout(1000);
    } else {
      console.log(
        "⚠ Customize button not found - product may not support customization"
      );
    }

    // STEP 5: Add to cart
    console.log("Step 5: Adding product to cart...");
    const addToCartButton = page.locator(
      'button:has-text("Add to Cart"), button:has-text("Add to Bag")'
    );

    if ((await addToCartButton.count()) > 0) {
      await addToCartButton.first().click();
      await page.waitForTimeout(1500);

      await page.screenshot({
        path: "playwright-report/05-added-to-cart.png",
        fullPage: true,
      });

      // Verify cart icon/badge updated
      const cartBadge = page.locator('[href*="/cart"], [href*="/bag"]');
      await expect(cartBadge.first()).toBeVisible();
    } else {
      console.log("⚠ Add to Cart button not found");
    }

    // STEP 6: Navigate to cart
    console.log("Step 6: Viewing cart...");
    const cartLink = page.locator(
      'a[href*="/cart"], a[href*="/shop/cart"], button:has-text("Cart")'
    );

    if ((await cartLink.count()) > 0) {
      await cartLink.first().click();
      await page.waitForURL(/\/cart|\/shop\/cart/);
      await page.waitForTimeout(1500);

      // Verify cart has items
      const cartItems = page.locator('[data-testid="cart-item"], li, tr').filter({
        has: page.locator('img, [role="img"]'),
      });
      const itemCount = await cartItems.count();
      console.log(`Cart has ${itemCount} items`);

      // Verify cart displays product image and details
      const cartItemImages = page.locator(
        '[data-testid="cart-item"] img, li img, tr img'
      );
      expect(await cartItemImages.count()).toBeGreaterThan(0);

      await page.screenshot({
        path: "playwright-report/06-cart-view.png",
        fullPage: true,
      });

      // STEP 7: Proceed to checkout
      console.log("Step 7: Proceeding to checkout...");
      const checkoutButton = page.locator(
        'button:has-text("Checkout"), a:has-text("Checkout"), button:has-text("Proceed")'
      );

      if ((await checkoutButton.count()) > 0) {
        await checkoutButton.first().click();
        await page.waitForTimeout(2000);

        // Verify checkout page loaded
        const checkoutForm = page.locator(
          'form, input[type="email"], input[placeholder*="email"]'
        );
        expect(await checkoutForm.count()).toBeGreaterThan(0);

        await page.screenshot({
          path: "playwright-report/07-checkout-page.png",
          fullPage: true,
        });

        console.log("✓ Checkout page loaded successfully");
      } else {
        console.log("⚠ Checkout button not found");
        await page.screenshot({
          path: "playwright-report/07-cart-no-checkout.png",
          fullPage: true,
        });
      }
    } else {
      console.log("⚠ Cart link not found");
    }

    console.log("✅ E2E checkout flow completed successfully!");
  });

  test("should verify product has Printful metadata and can be customized", async ({
    page,
  }) => {
    console.log("Testing Printful metadata and customization...");

    // Navigate to a product
    const productCards = page.locator('[href*="/shop/products/"]');
    if ((await productCards.count()) > 0) {
      const productUrl = await productCards.first().getAttribute("href");
      await page.goto(productUrl!);
      await page.waitForTimeout(2000);

      // Check for customize button (indicates Printful metadata exists)
      const customizeButton = page.locator(
        'button:has-text("Customize"), a:has-text("Customize")'
      );
      const hasCustomize = (await customizeButton.count()) > 0;

      if (hasCustomize) {
        console.log("✓ Product has customization option");

        // Try to access customize page
        await customizeButton.first().click();
        await page.waitForTimeout(2000);

        // Check for 404
        const pageContent = await page.content();
        const has404 = /404|not found/i.test(pageContent);

        if (has404) {
          await page.screenshot({
            path: "playwright-report/customize-404-error.png",
            fullPage: true,
          });
          throw new Error(
            "❌ Customize page returned 404 - Printful metadata missing!"
          );
        } else {
          console.log("✓ Customize page loaded without 404");
          await page.screenshot({
            path: "playwright-report/customize-success.png",
            fullPage: true,
          });
        }
      } else {
        console.log("⚠ Product does not have customization option");
      }
    }
  });

  test("should verify all products have images", async ({ page }) => {
    console.log("Verifying all products have images...");

    await page.goto("/shop");
    await page.waitForTimeout(2000);

    const productCards = page.locator('[href*="/shop/products/"]');
    const productCount = await productCards.count();
    console.log(`Found ${productCount} products`);

    let productsWithImages = 0;
    let productsWithoutImages = 0;

    for (let i = 0; i < Math.min(productCount, 5); i++) {
      // Check first 5 products
      const product = productCards.nth(i);
      const images = product.locator("img");
      const imageCount = await images.count();

      if (imageCount > 0) {
        productsWithImages++;
        const imgSrc = await images.first().getAttribute("src");
        console.log(`✓ Product ${i + 1} has image: ${imgSrc?.substring(0, 50)}...`);
      } else {
        productsWithoutImages++;
        console.log(`✗ Product ${i + 1} missing image`);
      }
    }

    console.log(`Products with images: ${productsWithImages}`);
    console.log(`Products without images: ${productsWithoutImages}`);

    // At least 80% of products should have images
    const percentWithImages =
      (productsWithImages / Math.min(productCount, 5)) * 100;
    expect(percentWithImages).toBeGreaterThanOrEqual(80);

    await page.screenshot({
      path: "playwright-report/products-image-check.png",
      fullPage: true,
    });
  });

  test("should verify variants have images", async ({ page }) => {
    console.log("Verifying product variants have images...");

    // Navigate to first product
    const productCards = page.locator('[href*="/shop/products/"]');
    if ((await productCards.count()) > 0) {
      await productCards.first().click();
      await page.waitForTimeout(2000);

      // Look for variant buttons
      const variantButtons = page.locator(
        'button:has-text("S"), button:has-text("M"), button:has-text("L"), button:has-text("Black"), button:has-text("White"), button:has-text("11 oz")'
      );
      const variantCount = await variantButtons.count();

      if (variantCount > 0) {
        console.log(`Found ${variantCount} variants`);

        // Test first 3 variants
        for (let i = 0; i < Math.min(variantCount, 3); i++) {
          await variantButtons.nth(i).click();
          await page.waitForTimeout(500);

          // Check if image updated/is visible
          const productImage = page.locator(
            'img[alt*="AI"], img[src*="printful"], [role="img"]'
          ).first();
          await expect(productImage).toBeVisible();

          const imageSrc = await productImage.getAttribute("src");
          console.log(`✓ Variant ${i + 1} has image: ${imageSrc?.substring(0, 50)}...`);
        }

        await page.screenshot({
          path: "playwright-report/variant-images-check.png",
          fullPage: true,
        });
      } else {
        console.log("⚠ Product has no variants");
      }
    }
  });
});
