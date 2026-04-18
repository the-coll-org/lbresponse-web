import type {
  HelpCenterFilterSelection,
  HelpCenterOrganization,
} from './helpCenter.types';
import { FILTER_SECTIONS, ORGANIZATIONS } from './helpCenter.data';

type Translate = (key: string) => string;

export function createEmptyFilterSelection(): HelpCenterFilterSelection {
  return FILTER_SECTIONS.reduce<HelpCenterFilterSelection>(
    (accumulator, section) => {
      accumulator[section.id] = [];
      return accumulator;
    },
    {}
  );
}

export function cloneFilterSelection(
  selection: HelpCenterFilterSelection
): HelpCenterFilterSelection {
  return Object.fromEntries(
    Object.entries(selection).map(([sectionId, values]) => [
      sectionId,
      [...values],
    ])
  );
}

export function countSelectedFilters(selection: HelpCenterFilterSelection) {
  return Object.values(selection).reduce(
    (total, values) => total + values.length,
    0
  );
}

export function findOrganizationById(organizationId: string) {
  return ORGANIZATIONS.find(
    (organization) => organization.id === organizationId
  );
}

export function normalizeArabic(value: string) {
  return value
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .toLowerCase();
}

export function filterOrganizations(
  filters: HelpCenterFilterSelection,
  query: string,
  translate: Translate
) {
  const normalizedQuery = normalizeArabic(query.trim());

  return ORGANIZATIONS.filter((item) => {
    const matchesFilters = FILTER_SECTIONS.every((section) => {
      const activeValues = filters[section.id] ?? [];

      if (activeValues.length === 0) {
        return true;
      }

      return activeValues.some((value) => item[section.field].includes(value));
    });

    if (!matchesFilters) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      translate(`helpCenter.${item.nameKey}`),
      translate(`helpCenter.${item.categoryKey}`),
      translate(`helpCenter.${item.descriptionKey}`),
      translate(`helpCenter.${item.locationsKey}`),
    ]
      .map(normalizeArabic)
      .join(' ');

    return haystack.includes(normalizedQuery);
  });
}

export function buildPinnedOrganizationOptions(
  pinnedOrganizationIds: string[],
  translate: Translate
) {
  return pinnedOrganizationIds
    .map(findOrganizationById)
    .filter((organization): organization is HelpCenterOrganization =>
      Boolean(organization)
    )
    .map((organization) => ({
      id: organization.id,
      title: translate(`helpCenter.${organization.nameKey}`),
      category: translate(`helpCenter.${organization.categoryKey}`),
    }));
}
