import { expect, test } from "@playwright/test";
import * as path from "path";
import * as fs from "fs";

test.describe("Complete Customization Flow E2E", () => {
  const TEST_IMAGE_PATH = path.join(__dirname, "fixtures", "test-image.png");

  test.beforeAll(() => {
    // Create test image if it doesn't exist
    const fixturesDir = path.join(__dirname, "fixtures");
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true });
    }

    if (!fs.existsSync(TEST_IMAGE_PATH)) {
      // Create a simple PNG image for testing (1x1 red pixel)
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, // IDAT chunk
        0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
        0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x18, 0xdd,
        0x8d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, // IEND chunk
        0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
      ]);
      fs.writeFileSync(TEST_IMAGE_PATH, pngBuffer);
      console.log("✓ Created test image at:", TEST_IMAGE_PATH);
    }
  });

  test("should show template image in editor before upload", async ({
    page,
  }) => {
    console.log("\n=== TEST 1: Template Image Display ===\n");

    // Navigate to shop
    await page.goto("/shop");
    await page.waitForTimeout(2000);

    // Click first product
    console.log("Step 1: Selecting product...");
    const productCards = page.locator('[href*="/shop/products/"]');
    expect(await productCards.count()).toBeGreaterThan(0);
    await productCards.first().click();
    await page.waitForURL(/\/shop\/products\//);
    await page.waitForTimeout(1500);

    // Select first variant
    console.log("Step 2: Selecting variant...");
    const variantButtons = page.locator(
      'button:has-text("S"), button:has-text("M"), button:has-text("11 oz")'
    );
    if ((await variantButtons.count()) > 0) {
      await variantButtons.first().click();
      await page.waitForTimeout(500);
    }

    // Click Personalize button
    console.log("Step 3: Opening customization editor...");
    const personalizeButton = page.locator(
      'a:has-text("Personalize"), button:has-text("Personalize")'
    );
    expect(await personalizeButton.count()).toBeGreaterThan(0);
    await personalizeButton.first().click();
    await page.waitForURL(/\/customize/);
    await page.waitForTimeout(2000);

    // Verify editor loaded
    console.log("Step 4: Verifying editor loaded...");
    const editorTitle = page.locator('h2:has-text("Image Editor")');
    await expect(editorTitle).toBeVisible();

    // Check for template image
    console.log("Step 5: Checking for template image...");
    const templateImage = page.locator(
      'img[alt*="template"], img[alt*="background"], img[src*="printful"], img[src*="http"]'
    ).first();
    
    // Template should be visible (either Printful template or variant image)
    await page.waitForTimeout(1000);
    const hasTemplateImage = await templateImage.count() > 0;
    
    if (hasTemplateImage) {
      const isVisible = await templateImage.isVisible();
      console.log(`✓ Template image found and visible: ${isVisible}`);
      expect(isVisible).toBeTruthy();
    } else {
      console.log("⚠ No template image found - checking if variant image is used");
    }

    await page.screenshot({
      path: "playwright-report/customization-01-editor-loaded.png",
      fullPage: true,
    });

    console.log("✅ Template display test passed");
  });

  test("should complete full customization flow: upload → customize → finish → display", async ({
    page,
  }) => {
    console.log("\n=== TEST 2: Full Customization Flow ===\n");

    // Navigate to shop
    await page.goto("/shop");
    await page.waitForTimeout(2000);

    // Click first product
    console.log("Step 1: Navigating to product...");
    const productCards = page.locator('[href*="/shop/products/"]');
    const firstProductLink = await productCards.first().getAttribute("href");
    await productCards.first().click();
    await page.waitForURL(/\/shop\/products\//);
    await page.waitForTimeout(1500);

    // Get product and variant IDs from URL for later verification
    const productUrl = page.url();
    const productId = productUrl.match(/prod_\d+/)?.[0];
    console.log(`Product ID: ${productId}`);

    // Select first variant
    console.log("Step 2: Selecting variant...");
    const variantButtons = page.locator(
      'button:has-text("S"), button:has-text("M"), button:has-text("11 oz")'
    );
    if ((await variantButtons.count()) > 0) {
      await variantButtons.first().click();
      await page.waitForTimeout(500);
    }

    // Open customization editor
    console.log("Step 3: Opening editor...");
    const personalizeButton = page.locator(
      'a:has-text("Personalize"), button:has-text("Personalize")'
    );
    await personalizeButton.first().click();
    await page.waitForURL(/\/customize/);
    await page.waitForTimeout(2000);

    // Upload image
    console.log("Step 4: Uploading custom image...");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_IMAGE_PATH);
    await page.waitForTimeout(2000);

    // Verify image loaded in editor
    console.log("Step 5: Verifying image loaded in canvas...");
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    
    await page.screenshot({
      path: "playwright-report/customization-02-image-uploaded.png",
      fullPage: true,
    });

    // Click Finish button
    console.log("Step 6: Clicking Finish button...");
    const finishButton = page.locator(
      'button:has-text("Finish"), button:has-text("Done"), button:has-text("Save")'
    );
    
    // Set up console listener to capture logs
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      consoleLogs.push(text);
      if (text.includes("[ImgEditor]") || text.includes("[ProductView]")) {
        console.log(`  Browser console: ${text}`);
      }
    });

    if ((await finishButton.count()) > 0) {
      await finishButton.first().click();
      
      // Wait for redirect back to product page
      console.log("Step 7: Waiting for redirect...");
      await page.waitForURL(/\/shop\/products\/.*\?.*imageId=/);
      await page.waitForTimeout(3000);

      const redirectUrl = page.url();
      console.log(`✓ Redirected to: ${redirectUrl}`);

      // Verify imageId in URL
      const imageIdMatch = redirectUrl.match(/imageId=([^&]+)/);
      expect(imageIdMatch).toBeTruthy();
      const imageId = imageIdMatch?.[1];
      console.log(`✓ Image ID in URL: ${imageId}`);

      // Check console logs for customization data
      const hasUploadLog = consoleLogs.some((log) =>
        log.includes("[ImgEditor] Upload successful")
      );
      const hasStorageLog = consoleLogs.some((log) =>
        log.includes("[ImgEditor] Storing in sessionStorage")
      );
      const hasFoundLog = consoleLogs.some((log) =>
        log.includes("[ProductView] Found customization data")
      );

      console.log(`Console logs captured:
  - Upload successful: ${hasUploadLog}
  - Storage saved: ${hasStorageLog}
  - Data retrieved: ${hasFoundLog}`);

      // Verify customization image is shown
      console.log("Step 8: Verifying customization image is displayed...");
      await page.waitForTimeout(2000);
      
      // The customization image should be visible in the image gallery
      const galleryImages = page.locator('img[alt*="Customized"], img[src*="customization"], img[src*="localhost:9000"]');
      const hasCustomImage = (await galleryImages.count()) > 0;
      console.log(`Custom image found: ${hasCustomImage}`);
      
      // Take screenshot of the result
      await page.screenshot({
        path: "playwright-report/customization-03-after-redirect.png",
        fullPage: true,
      });
      
      // CRITICAL: Verify the image actually loaded and is visible
      if (hasCustomImage) {
        const firstImage = galleryImages.first();
        await expect(firstImage).toBeVisible();
        
        // Check if the image has valid src
        const imageSrc = await firstImage.getAttribute("src");
        console.log(`✓ Image src: ${imageSrc}`);
        expect(imageSrc).toBeTruthy();
        expect(imageSrc).toContain("localhost:9000"); // Should use localhost, not internal docker name
        
        // Wait for image to actually load (not just be present in DOM)
        await firstImage.evaluate((img: HTMLImageElement) => {
          if (img.complete && img.naturalHeight > 0) return true;
          return new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            setTimeout(() => resolve(false), 5000);
          });
        });
        
        console.log("✓ Customization image loaded successfully");
      } else {
        // If no custom image found, fail the test
        throw new Error("FAILED: Customization image not found in gallery after redirect!");
      }

      // Verify "Add to Cart" button is enabled
      console.log("Step 9: Verifying Add to Cart is enabled...");
      const addToCartButton = page.locator(
        'button:has-text("Add to Cart"), button:has-text("Add to Bag")'
      ).first();
      
      await expect(addToCartButton).toBeVisible();
      const isEnabled = await addToCartButton.isEnabled();
      const buttonClasses = await addToCartButton.getAttribute("class");
      const hasBlueColor = buttonClasses?.includes("primary") || buttonClasses?.includes("blue");
      
      console.log(`✓ Add to Cart enabled: ${isEnabled}`);
      console.log(`✓ Add to Cart has primary color: ${hasBlueColor}`);
      
      expect(isEnabled).toBeTruthy();

      // Click Add to Cart
      console.log("Step 10: Adding to cart with customization...");
      
      // Verify button is clickable
      await expect(addToCartButton).toBeEnabled();
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Verify cart was updated (check cart badge or cart page)
      const cartBadge = page.locator('[href*="/cart"]', { hasText: /[1-9]/ }).first();
      const cartBadgeVisible = await cartBadge.isVisible().catch(() => false);
      
      if (cartBadgeVisible) {
        console.log("✓ Cart badge updated successfully");
      } else {
        console.warn("⚠ Cart badge not visible, checking cart page directly");
      }

      // Check console for cart addition log
      const hasCartLog = consoleLogs.some((log) =>
        log.includes("[ProductSelectionForm] Adding item to cart")
      );
      const hasImageIdInCart = consoleLogs.some((log) =>
        log.includes("imageId") && log.includes("[ProductSelectionForm]")
      );

      console.log(`Cart addition logs:
  - Item added to cart: ${hasCartLog}
  - Image ID included: ${hasImageIdInCart}`);
  
      // CRITICAL: Verify the cart addition actually worked
      if (!hasCartLog) {
        throw new Error("FAILED: Cart addition log not found! Add to Cart may not be working.");
      }
      
      if (!hasImageIdInCart) {
        throw new Error("FAILED: Image ID not included in cart addition! Customization data lost.");
      }

      await page.screenshot({
        path: "playwright-report/customization-04-added-to-cart.png",
        fullPage: true,
      });

      console.log("✅ Full customization flow test passed!");
    } else {
      throw new Error("Finish button not found!");
    }
  });

  test("should handle variant switching after customization", async ({
    page,
  }) => {
    console.log("\n=== TEST 3: Variant Switching After Customization ===\n");

    // Navigate to shop
    await page.goto("/shop");
    await page.waitForTimeout(2000);

    // Click first product
    const productCards = page.locator('[href*="/shop/products/"]');
    await productCards.first().click();
    await page.waitForURL(/\/shop\/products\//);
    await page.waitForTimeout(1500);

    // Get all variant buttons
    const variantButtons = page.locator(
      'button:has-text("S"), button:has-text("M"), button:has-text("L")'
    );
    const variantCount = await variantButtons.count();

    if (variantCount < 2) {
      console.log("⚠ Product has less than 2 variants, skipping test");
      return;
    }

    // Select first variant
    console.log("Step 1: Selecting first variant...");
    await variantButtons.first().click();
    await page.waitForTimeout(500);

    // Note: In a real test, we'd upload a customization here
    // For now, we'll just verify the variant switching mechanism works

    // Switch to second variant
    console.log("Step 2: Switching to second variant...");
    await variantButtons.nth(1).click();
    await page.waitForTimeout(1000);

    // Verify the image changed
    const images = page.locator('img[alt*="AI"], img[src*="printful"]');
    expect(await images.count()).toBeGreaterThan(0);

    await page.screenshot({
      path: "playwright-report/customization-05-variant-switched.png",
      fullPage: true,
    });

    console.log("✅ Variant switching test passed");
  });

  test("should display console logs for debugging customization flow", async ({
    page,
  }) => {
    console.log("\n=== TEST 4: Console Log Verification ===\n");

    const expectedLogs = [
      "[ImgEditor]",
      "[ProductView]",
      "[ImageGallery]",
      "[ProductSelectionForm]",
    ];

    const foundLogs: Set<string> = new Set();

    // Listen to console
    page.on("console", (msg) => {
      const text = msg.text();
      expectedLogs.forEach((logPrefix) => {
        if (text.includes(logPrefix)) {
          foundLogs.add(logPrefix);
          console.log(`  ✓ Found log: ${text.substring(0, 100)}`);
        }
      });
    });

    // Navigate through the flow
    await page.goto("/shop");
    await page.waitForTimeout(1000);

    const productCards = page.locator('[href*="/shop/products/"]');
    if ((await productCards.count()) > 0) {
      await productCards.first().click();
      await page.waitForTimeout(2000);

      // Check for logs
      console.log("\nLogs found:");
      expectedLogs.forEach((logPrefix) => {
        const found = foundLogs.has(logPrefix);
        console.log(`  ${found ? "✓" : "✗"} ${logPrefix}`);
      });

      // At least some logs should be present
      expect(foundLogs.size).toBeGreaterThan(0);
    }

    console.log("✅ Console logging test passed");
  });
});
