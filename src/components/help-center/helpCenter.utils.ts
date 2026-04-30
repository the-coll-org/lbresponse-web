import type {
  HelpCenterFiltersResponse,
  HelpCenterFilterSelection,
  HelpCenterOrganizationApiItem,
  HelpCenterOrganizationViewModel,
} from './helpCenter.types';
import { FILTER_SECTIONS } from './helpCenter.data';

export function createEmptyFilterSelection(
  sectionIds: string[] = FILTER_SECTIONS.map((section) => section.id)
): HelpCenterFilterSelection {
  return sectionIds.reduce<HelpCenterFilterSelection>(
    (accumulator, sectionId) => {
      accumulator[sectionId] = [];
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
    (selectedCount, values) => selectedCount + values.length,
    0
  );
}

export function collectFilterOptions(
  response: HelpCenterFiltersResponse,
  language: string
) {
  const isArabic = language.startsWith('ar');

  return response.data.reduce(
    (accumulator, group) => {
      accumulator[group.group_id] = group.options
        .slice()
        .sort((left, right) => left.display_order - right.display_order)
        .map((option) => ({
          id: option.id,
          label:
            (isArabic ? option.label_ar : option.label) ??
            option.label ??
            option.id,
          value: option.id,
        }));

      return accumulator;
    },
    {} as Record<
      string,
      {
        id: string;
        label: string;
        value: string;
      }[]
    >
  );
}

export function buildOrganizationsUrl(
  filters: HelpCenterFilterSelection,
  query: string,
  page: number,
  pageSize: number
) {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort: query.trim() ? 'relevance' : 'az',
  });

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    params.set('search', trimmedQuery);
  }

  for (const [groupId, values] of Object.entries(filters)) {
    for (const value of values) {
      params.append(groupId, value);
    }
  }

  return `/api/organizations?${params.toString()}`;
}

function matchesSearchValue(value: string | null, normalizedQuery: string) {
  return value?.toLocaleLowerCase().includes(normalizedQuery) ?? false;
}

function getOrganizationFilterValues(
  organization: HelpCenterOrganizationApiItem,
  filterKey: string
) {
  const filterValue =
    filterKey === 'provider_type'
      ? (organization.provider_type ?? organization.organization_type)
      : filterKey === 'location'
        ? organization.locations
        : organization[filterKey as keyof HelpCenterOrganizationApiItem];

  if (Array.isArray(filterValue)) {
    return filterValue.filter(
      (value): value is string => typeof value === 'string' && value.length > 0
    );
  }

  if (typeof filterValue === 'string' && filterValue.length > 0) {
    return [filterValue];
  }

  return [];
}

export function filterOrganizations(
  organizations: HelpCenterOrganizationApiItem[],
  filters: HelpCenterFilterSelection,
  query: string
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return organizations.filter((organization) => {
    for (const [filterKey, selectedValues] of Object.entries(filters)) {
      if (selectedValues.length === 0) {
        continue;
      }

      const organizationValues = getOrganizationFilterValues(
        organization,
        filterKey
      );

      if (!organizationValues.some((value) => selectedValues.includes(value))) {
        return false;
      }
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      organization.title,
      organization.title_ar,
      organization.description,
      organization.description_ar,
      organization.provider_type,
      organization.organization_type,
      organization.sector,
      organization.service_subtype,
      organization.shelter_type,
      organization.email,
      organization.phone_number,
      ...organization.locations,
    ].some((value) => matchesSearchValue(value, normalizedQuery));
  });
}

export function mapOrganizationToViewModel(
  organization: HelpCenterOrganizationApiItem,
  language: string,
  isPinned: boolean,
  labels: {
    call: string;
    email: string;
    unavailable: string;
    uncategorized: string;
  }
): HelpCenterOrganizationViewModel {
  const isArabic = language.startsWith('ar');
  const title =
    (isArabic ? organization.title_ar : organization.title) ??
    organization.title ??
    '';
  const description =
    (isArabic ? organization.description_ar : organization.description) ??
    organization.description ??
    '';
  const category =
    organization.provider_type ??
    organization.organization_type ??
    labels.uncategorized;
  const locations = organization.locations.join(', ');
  const phoneNumber = organization.phone_number?.trim() ?? '';
  const email = organization.email?.trim() ?? '';

  if (phoneNumber) {
    return {
      id: organization.id,
      title,
      category,
      description,
      locations,
      actionLabel: `${labels.call} ${phoneNumber}`,
      actionDisabled: false,
      actionType: 'phone',
      actionValue: phoneNumber,
      verified: organization.verified,
      isPinned,
    };
  }

  if (email) {
    return {
      id: organization.id,
      title,
      category,
      description,
      locations,
      actionLabel: `${labels.email} ${email}`,
      actionDisabled: false,
      actionType: 'email',
      actionValue: email,
      verified: organization.verified,
      isPinned,
    };
  }

  return {
    id: organization.id,
    title,
    category,
    description,
    locations,
    actionLabel: labels.unavailable,
    actionDisabled: true,
    actionType: 'email',
    actionValue: '',
    verified: organization.verified,
    isPinned,
  };
}

export function buildPinnedOrganizationOptions(
  pinnedOrganizationIds: string[],
  organizations: HelpCenterOrganizationViewModel[]
) {
  const organizationsById = new Map(
    organizations.map((organization) => [organization.id, organization])
  );

  return pinnedOrganizationIds
    .map((organizationId) => organizationsById.get(organizationId))
    .filter((organization): organization is HelpCenterOrganizationViewModel =>
      Boolean(organization)
    )
    .map((organization) => ({
      id: organization.id,
      title: organization.title,
      category: organization.category,
    }));
}

export function mergeOrganizations(
  currentOrganizations: HelpCenterOrganizationApiItem[],
  nextOrganizations: HelpCenterOrganizationApiItem[]
) {
  const organizationsById = new Map(
    currentOrganizations.map((organization) => [organization.id, organization])
  );

  for (const organization of nextOrganizations) {
    organizationsById.set(organization.id, organization);
  }

  return [...organizationsById.values()];
}

export function sortPinnedOrganizations(
  organizations: HelpCenterOrganizationViewModel[],
  pinnedOrganizationIds: string[]
) {
  if (pinnedOrganizationIds.length === 0) {
    return organizations;
  }

  const pinnedSet = new Set(pinnedOrganizationIds);
  return [...organizations].sort((left, right) => {
    const leftRank = pinnedSet.has(left.id) ? 0 : 1;
    const rightRank = pinnedSet.has(right.id) ? 0 : 1;
    return leftRank - rightRank;
  });
}

export function findOrganizationById(
  organizations: HelpCenterOrganizationViewModel[],
  organizationId: string
) {
  return organizations.find(
    (organization) => organization.id === organizationId
  );
}
