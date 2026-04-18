import { describe, expect, it } from 'vitest';
import {
  cloneFilterSelection,
  countSelectedFilters,
  createEmptyFilterSelection,
  filterOrganizations,
  normalizeArabic,
} from '../helpCenter.utils';

describe('helpCenter.utils', () => {
  it('creates a full empty filter selection and clones it safely', () => {
    const emptySelection = createEmptyFilterSelection();

    expect(emptySelection).toEqual({
      location: [],
      providerType: [],
      contact: [],
    });

    const clone = cloneFilterSelection({
      location: ['beirut'],
      providerType: ['organization'],
      contact: [],
    });

    clone.location.push('tripoli');

    expect(countSelectedFilters(clone)).toBe(3);
    expect(
      countSelectedFilters({
        location: ['beirut'],
        providerType: ['organization'],
        contact: [],
      })
    ).toBe(2);
  });

  it('normalizes Arabic text and matches translated organization content', () => {
    expect(normalizeArabic('إغاثة')).toBe('اغاثه');

    const results = filterOrganizations(
      {
        location: ['beirut'],
        providerType: ['organization'],
        contact: ['phone'],
      },
      'الصحه',
      (key) => {
        const translations: Record<string, string> = {
          'helpCenter.items.ministryHealth': 'وزارة الصحة',
          'helpCenter.categories.government': 'حكومي',
          'helpCenter.descriptions.healthServices': 'خدمات صحية',
          'helpCenter.locations.beirutTripoliSidon': 'بيروت طرابلس صيدا',
          'helpCenter.items.hopeAssociation': 'جمعية الأمل',
          'helpCenter.categories.nonProfit': 'غير ربحي',
          'helpCenter.descriptions.support': 'دعم ميداني',
          'helpCenter.locations.beirut': 'بيروت',
        };

        return translations[key] ?? key;
      }
    );

    expect(results.map((item) => item.id)).toContain('ministry-phone');
    expect(results.map((item) => item.id)).not.toContain('response-network');
  });
});
