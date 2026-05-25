import { expect, test, type Page } from '@playwright/test';

async function mockHelpCenterApi(page: Page) {
  await page.route('**/api/filters', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/organizations*', async (route) => {
    const orgs = Array.from({ length: 15 }, (_, i) => ({
      id: `org-${i + 1}`,
      title: `Organization ${i + 1}`,
      title_ar: `منظمة ${i + 1}`,
      description: `Description ${i + 1}`,
      description_ar: `وصف ${i + 1}`,
      email: null,
      pinned: false,
      verified: false,
      phone_number: `100${i + 1}`,
      type: 'support',
      locations: ['Beirut'],
      organization_type: 'NGO',
      provider_type: 'ngo',
      sector: 'wash',
      updated_at: '2026-04-27T10:00:00.000Z',
    }));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: orgs,
        total: orgs.length,
        page: 1,
        page_size: 20,
      }),
    });
  });
}

test.describe('Back-to-top FAB', () => {
  test.beforeEach(async ({ page }) => {
    await mockHelpCenterApi(page);
    await page.addInitScript(() => {
      window.localStorage.setItem('i18nextLng', 'ar');
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/help-center');
  });

  test('FAB is hidden at page start (no scroll)', async ({ page }) => {
    // aria-hidden="true" is set when hidden, so use attribute selector to find it in DOM
    const fab = page
      .locator('button[aria-hidden="true"]')
      .filter({ hasText: '' })
      .and(page.locator('button').filter({ has: page.locator('svg') }));
    // Simpler: just check nothing with a back-to-top aria-label is visible
    const visibleFab = page.locator('button[aria-label]').filter({
      hasText: '',
    });
    // The FAB with aria-hidden is in the DOM
    await expect(
      page.locator('button[aria-hidden="true"]').first()
    ).toBeAttached();
    // Nothing matching Back to top role is visible
    await expect(
      page.getByRole('button', { name: /العودة إلى الأعلى|Back to top/i })
    ).toHaveCount(0);
    await page.screenshot({ path: 'screenshots/fab-hidden-at-start.png' });
  });

  test('FAB appears after scrolling 300px', async ({ page }) => {
    const fab = page.getByRole('button', {
      name: /العودة إلى الأعلى|Back to top/i,
    });
    await expect(fab).not.toBeVisible();

    await page.evaluate(() => window.scrollTo({ top: 400 }));
    await page.waitForTimeout(300); // allow 200ms transition + buffer

    await expect(fab).toBeVisible();
    await page.screenshot({ path: 'screenshots/fab-visible-after-scroll.png' });
  });

  test('FAB is above the bottom navbar (not overlapped)', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400 }));
    await page.waitForTimeout(300);

    const fab = page.getByRole('button', {
      name: /العودة إلى الأعلى|Back to top/i,
    });
    await expect(fab).toBeVisible();

    const fabBox = await fab.boundingBox();
    const navbar = page.getByRole('navigation');
    const navBox = await navbar.boundingBox();

    expect(fabBox).not.toBeNull();
    expect(navBox).not.toBeNull();

    // FAB bottom edge must be above navbar top edge
    const fabBottom = fabBox!.y + fabBox!.height;
    const navTop = navBox!.y;
    expect(fabBottom).toBeLessThan(navTop);

    await page.screenshot({ path: 'screenshots/fab-above-navbar.png' });
  });

  test('FAB click scrolls back to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400 }));
    await page.waitForTimeout(300);

    const fab = page.getByRole('button', {
      name: /العودة إلى الأعلى|Back to top/i,
    });
    await expect(fab).toBeVisible();
    await fab.click();

    await page.waitForFunction(() => window.scrollY < 50, { timeout: 2000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);

    await page.screenshot({ path: 'screenshots/fab-after-click-top.png' });
  });

  test('FAB hides again after scrolling back to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 400 }));
    await page.waitForTimeout(300);

    const fab = page.getByRole('button', {
      name: /العودة إلى الأعلى|Back to top/i,
    });
    await expect(fab).toBeVisible();

    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.waitForTimeout(300);

    await expect(fab).not.toBeVisible();
  });
});
