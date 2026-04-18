import { test, expect } from '@playwright/test';

test.describe('Help Center screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto('/');
  });

  test('renders the four emergency hotlines', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Emergency Hotlines' })
    ).toBeVisible();
    for (const label of [
      'Ambulance',
      'Civil defense',
      'Medical aid',
      'Marine rescue',
    ]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('140', { exact: true })).toBeVisible();
  });

  test('filters the organizations list via search', async ({ page }) => {
    const search = page.getByPlaceholder(
      'Search for an organization or area...'
    );
    await search.fill('Ministry');

    await expect(page.getByText('Ministry of Health').first()).toBeVisible();
    await expect(page.getByText('Hope Association')).toHaveCount(0);
  });

  test('shows an empty state for a non-matching query', async ({ page }) => {
    await page
      .getByPlaceholder('Search for an organization or area...')
      .fill('zzzzznomatch');

    await expect(page.getByText('No results found')).toBeVisible();
    await expect(
      page.getByText('We couldn\'t find "zzzzznomatch"')
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Request this organization' })
    ).toBeVisible();
  });

  test('opens and closes the filters sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'Open filters' }).click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Filter Results')).toBeVisible();

    await page
      .getByRole('button', { name: 'Close filters', includeHidden: true })
      .click();
    await expect(dialog).toHaveCount(0);
  });
});
