import type {
  HelpCenterFiltersResponse,
  HelpCenterFilterSelection,
  HelpCenterOrganizationApiItem,
  HelpCenterOrganizationType,
  HelpCenterOrganizationRequestFormValues,
  HelpCenterOrganizationRequestPayload,
  HelpCenterOrganizationViewModel,
  HotlineApiItem,
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
    if (values.length === 0) {
      continue;
    }

    const parameterName =
      groupId === 'provider_type'
        ? 'organization_type'
        : groupId === 'district'
          ? 'city'
          : groupId === 'sector'
            ? 'category'
            : groupId;

    params.set(parameterName, values.join(','));
  }

  return `/api/hotlines?${params.toString()}`;
}

function matchesSearchValue(
  value: string | null | undefined,
  normalizedQuery: string
) {
  return value?.toLocaleLowerCase().includes(normalizedQuery) ?? false;
}

function getOrganizationFilterValues(
  organization: HelpCenterOrganizationApiItem,
  filterKey: string
) {
  const filterValue =
    filterKey === 'provider_type' || filterKey === 'organization_type'
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
      ...organization.phone_numbers,
      ...organization.locations,
    ].some((value) => matchesSearchValue(value, normalizedQuery));
  });
}

const ARABIC_DIGIT_MAP: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
};

export function localizeDigits(
  value: string | number,
  language: string
): string {
  const text = String(value);
  if (!language.startsWith('ar')) return text;
  return text.replace(/[0-9]/g, (d) => ARABIC_DIGIT_MAP[d] ?? d);
}

export function formatRelativeTime(iso: string | null): string {
  if (!iso) return '';
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day`;
  const diffWk = Math.floor(diffDay / 7);
  if (diffWk < 5) return `${diffWk} wk`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `${diffMo} mo`;
  return `${Math.floor(diffDay / 365)} y`;
}

export function mapHotlineToViewModel(
  item: HotlineApiItem,
  language: string,
  labels: {
    call: string;
    email: string;
    unavailable: string;
    uncategorized: string;
  }
): HelpCenterOrganizationViewModel {
  const isArabic = language.startsWith('ar');
  const title = (isArabic ? item.name_ar : item.name_en) ?? item.name_en;
  const category = item.category || labels.uncategorized;
  const locations = item.city.trim();
  const phoneNumber = (item.hotline ?? item.phone).trim();
  const email = item.email?.trim() ?? '';

  if (phoneNumber) {
    return {
      id: item.id,
      title,
      category,
      description: '',
      locations,
      actionLabel: `${labels.call} ${phoneNumber}`,
      actionType: 'phone',
      actionValue: phoneNumber,
      actionDisabled: false,
    };
  }

  if (email) {
    return {
      id: item.id,
      title,
      category,
      description: '',
      locations,
      actionLabel: `${labels.email} ${email}`,
      actionType: 'email',
      actionValue: email,
      actionDisabled: false,
    };
  }

  return {
    id: item.id,
    title,
    category,
    description: '',
    locations,
    actionLabel: labels.unavailable,
    actionType: 'phone',
    actionValue: '',
    actionDisabled: true,
  };
}

export function mergeOrganizations<T extends { id: string }>(
  currentItems: T[],
  nextItems: T[]
): T[] {
  const byId = new Map(currentItems.map((item) => [item.id, item]));
  for (const item of nextItems) {
    byId.set(item.id, item);
  }
  return [...byId.values()];
}

export function findOrganizationById(
  organizations: HelpCenterOrganizationViewModel[],
  organizationId: string
) {
  return organizations.find(
    (organization) => organization.id === organizationId
  );
}

const LEBANON_PHONE_PREFIX = '+961';
const LEBANON_LOCAL_DIGITS_MAX = 8;

export function createEmptyOrganizationRequestForm(
  _language: string,
  query = ''
): HelpCenterOrganizationRequestFormValues {
  const trimmedQuery = query.trim();

  return {
    organizationName: trimmedQuery,
    organizationType: '',
    contactValue: '',
    contactMode: 'neutral',
  };
}

function compactContactValue(value: string) {
  return value.replace(/\s+/g, '');
}

function extractLocalLebanonDigits(value: string) {
  const digitsOnly = compactContactValue(value).replace(/\D/g, '');

  if (digitsOnly.startsWith('961')) {
    return digitsOnly.slice(3);
  }

  return digitsOnly;
}

export function normalizeRequestContactInput(
  value: string
): Pick<
  HelpCenterOrganizationRequestFormValues,
  'contactValue' | 'contactMode'
> {
  const compactValue = compactContactValue(value);

  if (!compactValue) {
    return {
      contactValue: '',
      contactMode: 'neutral',
    };
  }

  if (/[A-Za-z]/.test(compactValue) || compactValue.includes('@')) {
    return {
      contactValue: value,
      contactMode: 'email',
    };
  }

  const localDigits = extractLocalLebanonDigits(compactValue);

  if (localDigits.length < 3) {
    return {
      contactValue: localDigits,
      contactMode: 'neutral',
    };
  }

  return {
    contactValue: localDigits.slice(0, LEBANON_LOCAL_DIGITS_MAX),
    contactMode: 'phone',
  };
}

export function isValidRequestEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidRequestPhone(value: string) {
  return extractLocalLebanonDigits(value).length >= 8;
}

export function buildOrganizationRequestPayload(
  formValues: HelpCenterOrganizationRequestFormValues
): HelpCenterOrganizationRequestPayload {
  const trimmedName = formValues.organizationName.trim();
  const organizationType =
    formValues.organizationType || ('ngo' as HelpCenterOrganizationType);
  const payload: HelpCenterOrganizationRequestPayload = {
    name: trimmedName,
    name_ar: trimmedName,
    contact_type: formValues.contactMode === 'phone' ? 'phone' : 'email',
    organization_type: organizationType,
  };

  if (formValues.contactMode === 'phone') {
    payload.phone_number = `${LEBANON_PHONE_PREFIX}${extractLocalLebanonDigits(
      formValues.contactValue
    )}`;
  } else {
    const trimmedContactValue = formValues.contactValue.trim();
    if (trimmedContactValue) {
      payload.email = trimmedContactValue;
    }
  }

  return payload;
}
