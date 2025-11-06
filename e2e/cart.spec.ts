import { test, expect } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('should load cart page', async ({ page }) => {
    await page.goto('/shop/cart');

    // Should show cart page
    await expect(page).toHaveURL('/shop/cart');

    // Take screenshot
    await page.screenshot({ path: 'playwright-report/cart-page.png', fullPage: true });
  });

  test('should show empty cart message when no items', async ({ page }) => {
    await page.goto('/shop/cart');

    // Look for empty cart indicators
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: 'playwright-report/cart-empty.png', fullPage: true });
  });

  test('should be able to navigate to cart from header', async ({ page }) => {
    await page.goto('/');

    // Click cart icon in header
    const cartLink = page.getByRole('link').filter({ hasText: /items in cart|view bag/i });
    await cartLink.click();

    // Should navigate to cart
    await page.waitForURL('/shop/cart');
    await expect(page).toHaveURL('/shop/cart');
  });

  test('should display cart count in header', async ({ page }) => {
    await page.goto('/');

    // Cart count should be visible (even if 0)
    const cartCount = page.locator('.text-sm.font-medium.text-gray-700').filter({ hasText: /^\d+$/ });
    await expect(cartCount.first()).toBeVisible();
  });
});
