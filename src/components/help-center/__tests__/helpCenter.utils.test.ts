import { describe, expect, it } from 'vitest';
import {
  buildOrganizationsUrl,
  cloneFilterSelection,
  collectFilterOptions,
  countSelectedFilters,
  createEmptyFilterSelection,
  filterOrganizations,
} from '../helpCenter.utils';

describe('helpCenter.utils', () => {
  it('creates a dynamic empty filter selection and clones it safely', () => {
    const emptySelection = createEmptyFilterSelection([
      'provider_type',
      'sector',
    ]);

    expect(emptySelection).toEqual({
      provider_type: [],
      sector: [],
    });

    const clone = cloneFilterSelection({
      provider_type: ['ngo'],
      sector: ['wash'],
    });

    clone.provider_type.push('un');

    expect(countSelectedFilters(clone)).toBe(3);
    expect(
      countSelectedFilters({
        provider_type: ['ngo'],
        sector: ['wash'],
      })
    ).toBe(2);
  });

  it('collects backend filter options in API order and language', () => {
    const result = collectFilterOptions(
      {
        data: [
          {
            group_id: 'provider_type',
            group_label: 'Organization Type',
            group_label_ar: 'نوع المنظمة',
            options: [
              {
                id: 'un',
                label: 'UN Agency',
                label_ar: 'وكالة أممية',
                result_count: 7,
                display_order: 1,
              },
              {
                id: 'ngo',
                label: 'NGO',
                label_ar: 'منظمة غير حكومية',
                result_count: 203,
                display_order: 0,
              },
            ],
          },
        ],
      },
      'ar'
    );

    expect(result.provider_type).toEqual([
      { id: 'ngo', label: 'منظمة غير حكومية', value: 'ngo' },
      { id: 'un', label: 'وكالة أممية', value: 'un' },
    ]);
  });

  it('filters organizations using dynamic backend filter keys', () => {
    const results = filterOrganizations(
      [
        {
          id: 'ministry-phone',
          title: 'Ministry of Health',
          title_ar: 'وزارة الصحة',
          description: 'Health services',
          description_ar: 'خدمات صحية',
          email: null,
          pinned: false,
          verified: true,
          phone_numbers: ['140'],
          type: 'support',
          locations: ['Beirut'],
          organization_type: 'Government',
          provider_type: 'government',
          sector: 'wash',
          service_subtype: 'nutrition',
          shelter_type: 'collective_center',
          updated_at: null,
        },
        {
          id: 'response-network',
          title: 'Response Network',
          title_ar: 'شبكة الاستجابة',
          description: 'Field support',
          description_ar: 'دعم ميداني',
          email: 'help@example.com',
          pinned: false,
          verified: false,
          phone_numbers: [],
          type: 'support',
          locations: ['Tripoli'],
          organization_type: 'NGO',
          provider_type: 'ngo',
          sector: 'nutrition',
          service_subtype: 'wash',
          shelter_type: 'host_community',
          updated_at: null,
        },
      ],
      {
        provider_type: ['government'],
        sector: ['wash'],
      },
      'الصحة'
    );

    expect(results.map((item) => item.id)).toContain('ministry-phone');
    expect(results.map((item) => item.id)).not.toContain('response-network');
  });

  it('builds organization URLs from dynamic filters', () => {
    expect(
      buildOrganizationsUrl(
        {
          provider_type: ['ngo'],
          sector: ['wash'],
        },
        '',
        1,
        20
      )
    ).toContain('organization_type=ngo');
  });
});
