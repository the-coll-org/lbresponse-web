import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const viewport of viewports) {
  test(`filter menu — ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: `screenshots/${viewport.name}-home.png`,
      fullPage: false,
    });

    await page.getByRole('button', { name: 'Open filters' }).click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `screenshots/${viewport.name}-filter-open.png`,
      fullPage: false,
    });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await page.addInitScript(() =>
      window.localStorage.setItem('i18nextLng', 'ar')
    );
    await page.goto('/');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `screenshots/${viewport.name}-home-ar.png`,
      fullPage: false,
    });
  });
}
