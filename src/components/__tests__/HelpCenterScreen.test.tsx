import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../../context/ToastContext';
import '../../i18n';
import HelpCenterScreen from '../HelpCenterScreen';

const createdRequests: Array<Record<string, unknown>> = [];

const organizations = Array.from({ length: 25 }, (_, index) => {
  const organizationNumber = index + 1;
  const isNgo = organizationNumber <= 12 || organizationNumber >= 21;
  const hasUnavailableContact = organizationNumber === 5;
  const emailOnly = organizationNumber === 25;

  return {
    id: `org-${organizationNumber}`,
    title: `Organization ${organizationNumber}`,
    title_ar: `منظمة ${organizationNumber}`,
    description: `Description ${organizationNumber}`,
    description_ar: `وصف ${organizationNumber}`,
    email: hasUnavailableContact
      ? null
      : emailOnly
        ? `org${organizationNumber}@example.com`
        : null,
    pinned: organizationNumber === 20,
    verified: organizationNumber % 2 === 0,
    phone_numbers:
      hasUnavailableContact || emailOnly ? [] : [`100${organizationNumber}`],
    whatsapp: null,
    type: 'support',
    locations: isNgo ? ['Beirut'] : ['Tripoli'],
    map_url: null,
    organization_type: isNgo ? 'NGO' : 'UN Agency',
    provider_type: isNgo ? 'ngo' : 'un',
    sector: organizationNumber <= 12 ? 'wash' : 'nutrition',
    service_subtype: organizationNumber <= 12 ? 'wash' : 'sleeping_supplies',
    shelter_type:
      organizationNumber <= 12 ? 'collective_center' : 'host_community',
    updated_at: null,
  };
});

function countOrganizationsBy<K extends 'provider_type' | 'sector'>(
  key: K,
  value: NonNullable<(typeof organizations)[number][K]>
) {
  return organizations.filter((organization) => organization[key] === value)
    .length;
}

function flushPromises() {
  return act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function setInputValue(input: HTMLInputElement | null, value: string) {
  if (!input) {
    return;
  }

  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  )?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function createResponse(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  const parsedUrl = new URL(url, 'http://localhost');

  if (
    parsedUrl.pathname === '/api/organizations' &&
    ((input instanceof Request && input.method === 'POST') ||
      init?.method === 'POST')
  ) {
    const requestBody =
      input instanceof Request
        ? ((await input.json()) as Record<string, unknown>)
        : (JSON.parse(
            typeof init?.body === 'string' ? init.body : '{}'
          ) as Record<string, unknown>);
    createdRequests.push(requestBody);

    return new Response(
      JSON.stringify({
        id: `created-${createdRequests.length}`,
        title: requestBody.name ?? '',
        title_ar: requestBody.name_ar ?? '',
        description: requestBody.description ?? null,
        description_ar: requestBody.description_ar ?? null,
        email: requestBody.email ?? null,
        pinned: false,
        verified: false,
        phone_numbers: requestBody.phone_number
          ? [requestBody.phone_number]
          : [],
        whatsapp: null,
        type: requestBody.contact_type ?? null,
        locations: [],
        map_url: null,
        organization_type: requestBody.organization_type ?? null,
        updated_at: '2026-04-27T10:00:00.000Z',
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (parsedUrl.pathname === '/api/filters') {
    return Promise.resolve(
      new Response(
        JSON.stringify({
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
                  result_count: countOrganizationsBy('provider_type', 'ngo'),
                  display_order: 1,
                },
                {
                  id: 'un',
                  label: 'UN Agency',
                  label_ar: 'وكالة أممية',
                  result_count: countOrganizationsBy('provider_type', 'un'),
                  display_order: 2,
                },
              ],
            },
            {
              group_id: 'sector',
              group_label: 'Sector',
              group_label_ar: 'القطاع',
              options: [
                {
                  id: 'wash',
                  label: 'WASH',
                  label_ar: 'المياه والصرف الصحي والنظافة',
                  result_count: countOrganizationsBy('sector', 'wash'),
                  display_order: 1,
                },
                {
                  id: 'nutrition',
                  label: 'Nutrition',
                  label_ar: 'التغذية',
                  result_count: countOrganizationsBy('sector', 'nutrition'),
                  display_order: 2,
                },
              ],
            },
          ],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    );
  }

  const page = Number(parsedUrl.searchParams.get('page') ?? '1');
  const pageSize = Number(parsedUrl.searchParams.get('page_size') ?? '20');
  const search = parsedUrl.searchParams.get('search')?.toLowerCase() ?? '';
  const organizationTypes =
    parsedUrl.searchParams
      .get('organization_type')
      ?.split(',')
      .filter(Boolean) ?? parsedUrl.searchParams.getAll('provider_type');
  const sectors = parsedUrl.searchParams.getAll('sector');

  const filteredOrganizations = organizations.filter((organization) => {
    if (
      organizationTypes.length > 0 &&
      (!organization.provider_type ||
        !organizationTypes.includes(organization.provider_type))
    ) {
      return false;
    }

    if (
      sectors.length > 0 &&
      (!organization.sector || !sectors.includes(organization.sector))
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
      ...organization.phone_numbers,
    ].some((value) => value?.toLowerCase().includes(search));
  });

  const startIndex = (page - 1) * pageSize;

  return Promise.resolve(
    new Response(
      JSON.stringify({
        data: filteredOrganizations.slice(startIndex, startIndex + pageSize),
        total: filteredOrganizations.length,
        page,
        page_size: pageSize,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  );
}

describe('HelpCenterScreen', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    (
      globalThis as typeof globalThis & {
        IS_REACT_ACT_ENVIRONMENT?: boolean;
      }
    ).IS_REACT_ACT_ENVIRONMENT = true;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '(min-width: 768px)',
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });

    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    createdRequests.length = 0;

    vi.spyOn(globalThis, 'fetch').mockImplementation(createResponse);

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    vi.restoreAllMocks();

    act(() => {
      root.unmount();
    });
    container.remove();
    document.body.innerHTML = '';
  });

  async function renderScreen() {
    await act(async () => {
      root.render(
        <ToastProvider>
          <HelpCenterScreen
            theme="light"
            onToggleTheme={() => undefined}
            onToggleLanguage={() => undefined}
          />
        </ToastProvider>
      );
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it.skip('opens the replacement sheet with hydrated pinned organizations even after search narrows the visible list', async () => {
    await renderScreen();

    const clickFirstPinButton = () => {
      const button = document.body.querySelector<HTMLButtonElement>(
        'button[aria-label="Pin organization"]'
      );

      if (!button) {
        throw new Error('Missing pin button');
      }

      act(() => {
        button.click();
      });
    };

    clickFirstPinButton();
    clickFirstPinButton();
    clickFirstPinButton();
    clickFirstPinButton();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Organization 25');
    });

    await flushPromises();

    clickFirstPinButton();

    expect(document.body.textContent).toContain('Replace pinned organization');
    expect(document.body.textContent).toContain('Organization 20');
  });

  it('renders backend filter groups and updates the draft result count', async () => {
    await renderScreen();

    const openFiltersButton = document.body.querySelector<HTMLButtonElement>(
      'button[aria-label="Open filters"]'
    );

    act(() => {
      openFiltersButton?.click();
    });

    expect(document.body.textContent).toContain('Organization Type');
    expect(document.body.textContent).toContain('Sector');

    const ngoChip = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.trim() === 'NGO');

    act(() => {
      ngoChip?.click();
    });

    await flushPromises();

    expect(document.body.textContent).toContain('Apply (17 organizations)');

    const resetButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.trim() === 'Reset');

    act(() => {
      resetButton?.click();
    });

    await flushPromises();

    expect(document.body.textContent).toContain('Apply (25 organizations)');
  });

  it('searches organizations through the API', async () => {
    await renderScreen();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Organization 25');
    });

    await flushPromises();

    expect(document.body.textContent).toContain('1 / 1 result');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/organizations?')
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=Organization+25')
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=1&page_size=12')
    );
  });

  it.skip('renders backend-pinned organizations as pinned on first load', async () => {
    await renderScreen();

    expect(document.body.textContent).toContain('Organization 20');
    expect(
      document.body.querySelector('button[aria-label="Unpin organization"]')
    ).not.toBeNull();
  });

  it('disables the contact CTA when an organization has no reachable contact method', async () => {
    await renderScreen();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Organization 5');
    });

    await flushPromises();

    const unavailableButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.trim() === 'Contact unavailable');

    expect(unavailableButton?.disabled).toBe(true);
  });

  it('loads the next organizations page instead of refetching page one with a larger page size', async () => {
    await renderScreen();

    const loadMoreButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.includes('Show more'));

    act(() => {
      loadMoreButton?.click();
    });

    await flushPromises();

    expect(document.body.textContent).toContain('24 / 25 result');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=2')
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page_size=12')
    );
  });

  it('opens the request sheet from the empty state and prefills the search query', async () => {
    await renderScreen();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Acme Relief');
    });

    await flushPromises();

    const requestButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find(
      (button) => button.textContent?.trim() === 'Request this organization'
    );

    act(() => {
      requestButton?.click();
    });

    const requestNameInput =
      document.body.querySelector<HTMLInputElement>('#organization-name');

    expect(document.body.textContent).toContain('Request an organization');
    expect(requestNameInput?.value).toBe('Acme Relief');
  });

  it('submits the request organization form to the API', async () => {
    await renderScreen();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Acme Relief');
    });

    await flushPromises();

    const requestButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find(
      (button) => button.textContent?.trim() === 'Request this organization'
    );

    act(() => {
      requestButton?.click();
    });

    const contactInput = document.body.querySelector<HTMLInputElement>(
      '#organization-contact'
    );

    act(() => {
      setInputValue(contactInput, 'contact@acme.org');
    });

    const nonProfitOption = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.trim() === 'Non-profit');

    act(() => {
      nonProfitOption?.click();
    });

    const submitButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.trim() === 'Send request');

    await act(async () => {
      submitButton?.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(createdRequests).toHaveLength(1);
    expect(createdRequests[0]).toMatchObject({
      name: 'Acme Relief',
      name_ar: 'Acme Relief',
      contact_type: 'email',
      organization_type: 'ngo',
      email: 'contact@acme.org',
    });
  });

  it('shows validation errors when required request fields are missing', async () => {
    await renderScreen();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Acme Relief');
    });

    await flushPromises();

    const requestButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find(
      (button) => button.textContent?.trim() === 'Request this organization'
    );

    act(() => {
      requestButton?.click();
    });

    const contactInput = document.body.querySelector<HTMLInputElement>(
      '#organization-contact'
    );

    act(() => {
      setInputValue(contactInput, '70');
    });

    const submitButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find((button) => button.textContent?.trim() === 'Send request');

    await act(async () => {
      submitButton?.click();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(document.body.textContent).toContain(
      'Enter a valid email or Lebanese mobile number.'
    );
    expect(document.body.textContent).toContain('Choose an organization type.');
    expect(createdRequests).toHaveLength(0);
  });

  it.skip('switches the contact field into Lebanon mobile mode on the third digit', async () => {
    await renderScreen();

    const searchInput = document.body.querySelector<HTMLInputElement>(
      'input[placeholder="Search for an organization or area..."]'
    );

    act(() => {
      setInputValue(searchInput, 'Acme Relief');
    });

    await flushPromises();

    const requestButton = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>('button')
    ).find(
      (button) => button.textContent?.trim() === 'Request this organization'
    );

    act(() => {
      requestButton?.click();
    });

    const contactInput = document.body.querySelector<HTMLInputElement>(
      '#organization-contact'
    );

    act(() => {
      setInputValue(contactInput, '70');
    });

    expect(contactInput?.value).toBe('70');

    act(() => {
      setInputValue(contactInput, '701');
    });

    expect(contactInput?.value).toBe('+961701');
  });
});
