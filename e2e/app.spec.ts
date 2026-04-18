import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('/');
  });

  test('loads the homepage with the help center screen', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Help Center' })
    ).toBeVisible();
    await expect(
      page.getByText('Hello, how can we help you today?')
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Emergency Hotlines' })
    ).toBeVisible();
  });

  test('toggles between light and dark theme', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: 'Toggle theme' });
    const html = page.locator('html');

    const initialTheme = await html.getAttribute('data-theme');
    await themeButton.click();
    await expect(html).not.toHaveAttribute('data-theme', initialTheme ?? '');

    const toggledTheme = await html.getAttribute('data-theme');
    await themeButton.click();
    await expect(html).not.toHaveAttribute('data-theme', toggledTheme ?? '');
  });

  test('switches language to Arabic and applies RTL', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');

    await page.getByRole('button', { name: 'Toggle language' }).click();

    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(
      page.getByRole('heading', { name: 'مركز المساعدة' })
    ).toBeVisible();
  });

  test('switches language back to English and applies LTR', async ({
    page,
  }) => {
    const html = page.locator('html');
    const languageButton = page.getByRole('button', {
      name: /Toggle language|تبديل اللغة/,
    });

    await languageButton.click();
    await expect(html).toHaveAttribute('dir', 'rtl');

    await languageButton.click();
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(
      page.getByRole('heading', { name: 'Help Center' })
    ).toBeVisible();
  });
});
