import { expect, test } from '@playwright/test';

test('need help page matches the provided mobile layout', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem('i18nextLng', 'ar');
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByTestId('need-help-screen')).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 1, name: 'أحتاج مساعدة' })
  ).toBeVisible();

  await page.screenshot({
    path: 'screenshots/need-help-mobile-ar.png',
    fullPage: true,
  });
});
