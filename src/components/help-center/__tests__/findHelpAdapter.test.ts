import { describe, expect, it } from 'vitest';
import {
  buildFindHelpFilterCatalog,
  buildFindHelpListingViewModel,
  type FindHelpAdapterLabels,
} from '../findHelpAdapter';
import type {
  HelpCenterFiltersResponse,
  HelpCenterOrganizationApiItem,
} from '../helpCenter.types';

const labels: FindHelpAdapterLabels = {
  call: 'Call',
  whatsapp: 'WhatsApp',
  email: 'Email',
  unavailable: 'Contact unavailable',
  uncategorized: 'Uncategorized',
  offeredSector: (v) => `Sector: ${v}`,
  offeredService: (v) => `Service: ${v}`,
  offeredShelter: (v) => `Shelter type: ${v}`,
  offeredType: (v) => `Type: ${v}`,
};

const filtersResponse: HelpCenterFiltersResponse = {
  data: [
    {
      group_id: 'sector',
      group_label: 'Sector',
      group_label_ar: 'القطاع',
      options: [
        {
          id: 'shelter',
          label: 'Shelter',
          label_ar: 'مأوى',
          result_count: 0,
          display_order: 0,
        },
        {
          id: 'gbv',
          label: 'GBV',
          label_ar: 'العنف',
          result_count: 0,
          display_order: 1,
        },
      ],
    },
    {
      group_id: 'location',
      group_label: 'Location',
      group_label_ar: 'الموقع',
      options: [
        {
          id: 'beirut',
          label: 'Beirut',
          label_ar: 'بيروت',
          result_count: 0,
          display_order: 0,
        },
      ],
    },
    {
      group_id: 'service_subtype',
      group_label: 'Service',
      group_label_ar: 'الخدمة',
      options: [
        {
          id: 'pharmacy',
          label: 'Pharmacy',
          label_ar: 'صيدلية',
          result_count: 0,
          display_order: 0,
        },
      ],
    },
  ],
};

function makeOrg(
  overrides: Partial<HelpCenterOrganizationApiItem> = {}
): HelpCenterOrganizationApiItem {
  return {
    id: 'o1',
    title: 'Sample Org',
    title_ar: 'منظمة تجريبية',
    description: 'A description',
    description_ar: 'وصف',
    email: null,
    pinned: false,
    verified: true,
    phone_numbers: ['01-234567'],
    whatsapp: null,
    type: null,
    locations: ['Beirut'],
    map_url: null,
    organization_type: 'NGO',
    provider_type: 'ngo',
    sector: 'shelter',
    service_subtype: null,
    shelter_type: null,
    updated_at: null,
    ...overrides,
  };
}

describe('findHelpAdapter', () => {
  it('builds a catalog with needs (sector) + areas (location) + others', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    expect(catalog.needs?.id).toBe('sector');
    expect(catalog.needs?.options.map((o) => o.id)).toEqual(['shelter', 'gbv']);
    expect(catalog.areas?.id).toBe('location');
    expect(catalog.others.map((g) => g.id)).toEqual(['service_subtype']);
  });

  it('localizes labels in Arabic', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'ar');
    expect(catalog.needs?.options[0].label).toBe('مأوى');
    expect(catalog.areas?.options[0].label).toBe('بيروت');
  });

  it('returns empty catalog when filters are null', () => {
    const catalog = buildFindHelpFilterCatalog(null, 'en');
    expect(catalog).toEqual({ needs: null, areas: null, others: [] });
  });

  it('picks phone as primary action when present', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({ phone_numbers: ['01-111222'], whatsapp: '03-999888' }),
      'en',
      catalog,
      labels
    );
    expect(vm.primaryActionType).toBe('phone');
    expect(vm.primaryActionValue).toBe('01-111222');
    expect(vm.primaryActionLabel).toBe('Call 01-111222');
  });

  it('falls back to WhatsApp when no phone', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({ phone_numbers: [], whatsapp: '03-999888' }),
      'en',
      catalog,
      labels
    );
    expect(vm.primaryActionType).toBe('whatsapp');
    expect(vm.primaryActionValue).toBe('03-999888');
  });

  it('falls back to email when no phone or whatsapp', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({
        phone_numbers: [],
        whatsapp: null,
        email: 'help@example.com',
      }),
      'en',
      catalog,
      labels
    );
    expect(vm.primaryActionType).toBe('email');
    expect(vm.primaryActionValue).toBe('help@example.com');
  });

  it('marks unavailable when no contact channels exist', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({
        phone_numbers: [],
        whatsapp: null,
        email: null,
      }),
      'en',
      catalog,
      labels
    );
    expect(vm.primaryActionType).toBe('unavailable');
    expect(vm.primaryActionDisabled).toBe(true);
  });

  it('infers confidential from sector === gbv', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({ sector: 'gbv' }),
      'en',
      catalog,
      labels
    );
    expect(vm.confidential).toBe(true);
  });

  it('does not mark non-protection sectors as confidential', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({ sector: 'shelter' }),
      'en',
      catalog,
      labels
    );
    expect(vm.confidential).toBe(false);
  });

  it('derives offered list only from fields that exist', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({
        sector: 'shelter',
        service_subtype: 'pharmacy',
        shelter_type: null,
        type: null,
      }),
      'en',
      catalog,
      labels
    );
    expect(vm.offered.map((o) => o.key)).toEqual(['sector', 'service']);
    expect(vm.offered[0].label).toBe('Sector: Shelter');
    expect(vm.offered[1].label).toBe('Service: Pharmacy');
  });

  it('keeps offered empty when sector + subtypes are all null', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'en');
    const vm = buildFindHelpListingViewModel(
      makeOrg({
        sector: null,
        service_subtype: null,
        shelter_type: null,
        type: null,
      }),
      'en',
      catalog,
      labels
    );
    expect(vm.offered).toEqual([]);
  });

  it('localizes title in Arabic', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'ar');
    const vm = buildFindHelpListingViewModel(makeOrg(), 'ar', catalog, labels);
    expect(vm.title).toBe('منظمة تجريبية');
  });

  it('falls back to English title when Arabic missing', () => {
    const catalog = buildFindHelpFilterCatalog(filtersResponse, 'ar');
    const vm = buildFindHelpListingViewModel(
      makeOrg({ title_ar: null }),
      'ar',
      catalog,
      labels
    );
    expect(vm.title).toBe('Sample Org');
  });
});
