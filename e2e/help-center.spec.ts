import { expect, test, type Page } from '@playwright/test';

const organizations = Array.from({ length: 25 }, (_, index) => {
  const organizationNumber = index + 1;
  const isNgo = organizationNumber <= 12 || organizationNumber >= 21;

  return {
    id: `org-${organizationNumber}`,
    title: `Organization ${organizationNumber}`,
    title_ar: `منظمة ${organizationNumber}`,
    description: `Description ${organizationNumber}`,
    description_ar: `وصف ${organizationNumber}`,
    email:
      organizationNumber === 25 ? `org${organizationNumber}@example.com` : null,
    pinned: organizationNumber === 20,
    verified: organizationNumber % 2 === 0,
    phone_number: organizationNumber === 25 ? null : `100${organizationNumber}`,
    type: 'support',
    locations: isNgo ? ['Beirut'] : ['Tripoli'],
    organization_type: isNgo ? 'NGO' : 'UN Agency',
    provider_type: isNgo ? 'ngo' : 'un',
    sector: organizationNumber <= 12 ? 'wash' : 'nutrition',
    updated_at: '2026-04-27T10:00:00.000Z',
  };
});

async function mockHelpCenterApi(page: Page) {
  await page.route('**/api/filters', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            group_id: 'provider_type',
            group_label: 'Organization Type',
            group_label_ar: 'نوع المنظمة',
            options: [
              {
                id: 'ngo',
                label: 'NGO',
                label_ar: 'منظمة غير حكومية',
                result_count: 17,
                display_order: 0,
              },
              {
                id: 'un',
                label: 'UN Agency',
                label_ar: 'وكالة أممية',
                result_count: 8,
                display_order: 1,
              },
            ],
          },
        ],
      }),
    });
  });

  await page.route('**/api/organizations*', async (route, request) => {
    if (request.method() === 'POST') {
      const payload = request.postDataJSON();

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'created-1',
          title: payload.name,
          title_ar: payload.name_ar,
          description: payload.description ?? null,
          description_ar: payload.description_ar ?? null,
          email: payload.email ?? null,
          pinned: false,
          verified: false,
          phone_number: payload.phone_number ?? null,
          type: payload.contact_type,
          locations: [],
          organization_type: payload.organization_type,
          updated_at: '2026-04-27T10:00:00.000Z',
        }),
      });
      return;
    }

    const url = new URL(request.url());
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const organizationTypes = (url.searchParams.get('organization_type') ?? '')
      .split(',')
      .filter(Boolean);
    const pageNumber = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('page_size') ?? '20');

    const filteredOrganizations = organizations.filter((organization) => {
      if (
        organizationTypes.length > 0 &&
        (!organization.provider_type ||
          !organizationTypes.includes(organization.provider_type))
      ) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [
        organization.title,
        organization.title_ar,
        organization.description,
        organization.description_ar,
        organization.email,
        organization.phone_number,
      ].some((value) => value?.toLowerCase().includes(search));
    });

    const startIndex = (pageNumber - 1) * pageSize;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: filteredOrganizations.slice(startIndex, startIndex + pageSize),
        total: filteredOrganizations.length,
        page: pageNumber,
        page_size: pageSize,
      }),
    });
  });
}

test.describe('Help Center screen', () => {
  test.beforeEach(async ({ page }) => {
    await mockHelpCenterApi(page);
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('i18nextLng', 'en');
    });
    await page.goto('/');
  });

  test('renders the four emergency hotlines', async ({ page }) => {
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

  test('opens the request sheet from an empty search and submits to the API', async ({
    page,
  }) => {
    await page
      .getByPlaceholder('Search for an organization or area...')
      .fill('Acme Relief');

    await expect(page.getByText('No results found')).toBeVisible();

    await page
      .getByRole('button', { name: 'Request this organization' })
      .click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Request an organization')).toBeVisible();
    await expect(page.locator('#organization-name')).toHaveValue('Acme Relief');

    await page.locator('#organization-name-ar').fill('إغاثة أكمي');
    await page.getByRole('button', { name: 'NGO' }).click();
    await page.getByRole('button', { name: 'Email' }).click();
    await page.locator('#organization-email').fill('contact@acme.org');

    await page.getByRole('button', { name: 'Send request' }).click();

    await expect(page.getByText('Request received')).toBeVisible();
  });

  test('captures screenshots for the request organization UI flow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page
      .getByPlaceholder('Search for an organization or area...')
      .fill('Acme Relief');
    await expect(page.getByText('No results found')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/help-center-request-empty-state-mobile.png',
      fullPage: false,
    });

    await page
      .getByRole('button', { name: 'Request this organization' })
      .click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.screenshot({
      path: 'screenshots/help-center-request-sheet-mobile.png',
      fullPage: false,
    });

    await page.locator('#organization-name-ar').fill('إغاثة أكمي');
    await page.getByRole('button', { name: 'NGO' }).click();
    await page.getByRole('button', { name: 'Email' }).click();
    await page.locator('#organization-email').fill('contact@acme.org');
    await page
      .locator('#organization-description')
      .fill('Community food and hygiene support.');

    await page.screenshot({
      path: 'screenshots/help-center-request-sheet-filled-mobile.png',
      fullPage: false,
    });
  });
});

test.describe('Request organization sheet – design screenshot', () => {
  test.beforeEach(async ({ page }) => {
    await mockHelpCenterApi(page);
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.setItem('i18nextLng', 'ar');
    });
    await page.goto('/');
  });

  test('captures Arabic RTL sheet screenshot for design comparison', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Trigger the empty state by searching for something that won't match
    const searchInput = page.getByRole('textbox').first();
    await searchInput.fill('منظمة تجريبية فريدة');
    await expect(
      page.getByRole('button', {
        name: /طلب إضافة هذه المنظمة|Request this organization/i,
      })
    ).toBeVisible({ timeout: 5000 });

    // Open the request sheet
    await page
      .getByRole('button', {
        name: /طلب إضافة هذه المنظمة|Request this organization/i,
      })
      .click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Screenshot of just the dialog (matches the design frame)
    await dialog.screenshot({
      path: 'screenshots/request-org-sheet-ar-empty.png',
    });

    // Fill in some data to match the "filled" design frame
    // Type an email to trigger email mode
    const contactField = page.locator('#organization-contact');
    await contactField.fill('help@gmail.com');

    // Screenshot with email filled in (matches the design frame showing email icon)
    await dialog.screenshot({
      path: 'screenshots/request-org-sheet-ar-email.png',
    });

    // Select an organization type tag
    await page.locator('[role="button"][aria-pressed]').first().click();

    // Screenshot with org type selected
    await dialog.screenshot({
      path: 'screenshots/request-org-sheet-ar-with-type.png',
    });
  });
});
