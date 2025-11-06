import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/LemniSpace/);

    // Check main heading
    await expect(page.getByRole('heading', { name: /Transform.*your ideas.*into art/i })).toBeVisible();

    // Check hero description
    await expect(page.getByText(/Every product is a blank canvas/i)).toBeVisible();

    // Check CTA button
    const ctaButton = page.getByRole('link', { name: /Craft Your Masterpiece/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/shop');
  });

  test('should navigate to shop from hero CTA', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Craft Your Masterpiece/i }).click();

    // Wait for navigation
    await page.waitForURL('/shop');
    await expect(page).toHaveURL('/shop');
  });

  test('should display mosaic section', async ({ page }) => {
    await page.goto('/');

    // Check mosaic section heading
    await expect(page.getByRole('heading', { name: /Text Mosaic Magic/i })).toBeVisible();

    // Check mosaic description
    await expect(page.getByText(/Weave your words into a stunning portrait/i)).toBeVisible();
  });

  test('should have functional navigation header', async ({ page }) => {
    await page.goto('/');

    // Check header navigation
    const nav = page.getByTestId('main-header-nav');
    await expect(nav).toBeVisible();

    // Check logo link
    const logoLink = nav.getByRole('link', { name: /Home/i });
    await expect(logoLink).toBeVisible();

    // Check Collections link
    const collectionsLink = nav.getByRole('link', { name: /Collections/i });
    await expect(collectionsLink).toBeVisible();
    await expect(collectionsLink).toHaveAttribute('href', '/shop');

    // Check cart link
    const cartLink = nav.getByRole('link').filter({ hasText: 'items in cart' });
    await expect(cartLink).toBeVisible();
  });

  test('should display cart with 0 items initially', async ({ page }) => {
    await page.goto('/');

    // Check cart badge shows 0
    await expect(page.getByText('0', { exact: true }).first()).toBeVisible();
  });
});
