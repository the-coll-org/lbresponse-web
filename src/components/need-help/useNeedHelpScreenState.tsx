import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { needHelpResponse } from './needHelp.data';
import type {
  NeedHelpOrganizationViewModel,
  NeedHelpServiceIcon,
  OrganizationApiItem,
  OrganizationsApiResponse,
} from './needHelp.types';

const PAGE_SIZE = 10;

function formatRelativeTime(
  isoDate: string | null,
  isArabic: boolean
): string | null {
  if (!isoDate) return null;
  try {
    const diff = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (isArabic) {
      if (minutes < 1) return 'الآن';
      if (minutes < 60) return `منذ ${minutes.toString()} دق`;
      if (hours < 24) return `منذ ${hours.toString()} ساعة`;
      return `منذ ${days.toString()} يوم`;
    }
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes.toString()}m ago`;
    if (hours < 24) return `${hours.toString()}h ago`;
    return `${days.toString()}d ago`;
  } catch {
    return null;
  }
}

const FILTER_TO_SECTOR: Record<string, string> = {
  food: 'food',
  medical: 'medical',
  shelter: 'shelter',
  clothes: 'clothes',
};

function deriveIcon(sectors: string[] | null | undefined): NeedHelpServiceIcon {
  const normalized = (sectors ?? []).map((s) => s?.toLowerCase() ?? '');
  if (
    normalized.some(
      (s) => s.includes('food') || s.includes('wash') || s.includes('water')
    )
  )
    return 'food';
  if (normalized.some((s) => s.includes('health') || s.includes('medical')))
    return 'medical';
  if (normalized.some((s) => s.includes('shelter') || s.includes('housing')))
    return 'shelter';
  if (normalized.some((s) => s.includes('cloth') || s.includes('nfi')))
    return 'clothes';
  return 'shelter';
}

function mapOrganizationToViewModel(
  org: OrganizationApiItem,
  language: string
): NeedHelpOrganizationViewModel {
  const isArabic = language.startsWith('ar');
  const title = (isArabic ? org.title_ar : org.title) ?? org.title ?? '';
  const description =
    (isArabic ? org.description_ar : org.description) ?? org.description ?? '';
  const sectors = org.sectors ?? [];
  const category = org.organization_type ?? sectors[0] ?? '';
  const locations = org.locations ?? [];
  const icon = deriveIcon(sectors);
  const callPrefix = isArabic ? 'اتصل' : 'Call';
  const mapLabel = isArabic ? 'خريطة' : 'Map';
  const updatedAtLabel = formatRelativeTime(org.updated_at, isArabic);

  if (org.whatsapp) {
    const cleaned = org.whatsapp.replace(/\D/g, '') ?? '';
    return {
      id: org.id,
      icon,
      title,
      category,
      description,
      locations,
      mapUrl: org.map_url,
      mapLabel,
      updatedAtLabel,
      actionType: 'whatsapp',
      actionLabel: `WhatsApp ${org.whatsapp}`,
      actionHref: `https://wa.me/${cleaned}`,
      actionDisabled: false,
    };
  }

  const phone = (org.phone_numbers ?? [])[0];
  if (phone) {
    return {
      id: org.id,
      icon,
      title,
      category,
      description,
      locations,
      mapUrl: org.map_url,
      mapLabel,
      updatedAtLabel,
      actionType: 'phone',
      actionLabel: `${callPrefix} ${phone}`,
      actionHref: `tel:${phone.replace(/\s/g, '')}`,
      actionDisabled: false,
    };
  }

  return {
    id: org.id,
    icon,
    title,
    category,
    description,
    locations,
    mapUrl: org.map_url,
    mapLabel,
    updatedAtLabel,
    actionType: 'phone',
    actionLabel: isArabic ? 'غير متاح' : 'Unavailable',
    actionHref: '',
    actionDisabled: true,
  };
}

function buildOrganizationsUrl(
  query: string,
  activeFilterIds: string[],
  page: number
) {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: PAGE_SIZE.toString(),
    sort: query.trim() ? 'relevance' : 'az',
  });

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    params.set('search', trimmedQuery);
  }

  const sectorSlugs = activeFilterIds
    .map((id) => FILTER_TO_SECTOR[id])
    .filter((slug): slug is string => Boolean(slug));

  if (sectorSlugs.length > 0) {
    params.set('sector', sectorSlugs.join(','));
  }

  return `/api/organizations?${params.toString()}`;
}

export function useNeedHelpScreenState() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ar';

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [allOrganizations, setAllOrganizations] = useState<
    OrganizationApiItem[]
  >([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [activeFilterIds]);

  useEffect(() => {
    let cancelled = false;
    const isFirstPage = page === 1;

    if (isFirstPage) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    async function load() {
      try {
        const response = await fetch(
          buildOrganizationsUrl(debouncedQuery, activeFilterIds, page)
        );
        if (!response.ok) throw new Error(`HTTP ${response.status.toString()}`);
        const json = (await response.json()) as OrganizationsApiResponse;
        if (cancelled) return;
        setAllOrganizations((current) =>
          isFirstPage ? json.data : [...current, ...json.data]
        );
        setTotal(json.total);
        setError(false);
      } catch {
        if (!cancelled) {
          setError(true);
          if (isFirstPage) {
            setAllOrganizations([]);
            setTotal(0);
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, activeFilterIds, page, reloadKey]);

  const visibleOrganizations = useMemo(
    () =>
      allOrganizations.map((org) => mapOrganizationToViewModel(org, language)),
    [allOrganizations, language]
  );

  const filters = useMemo(
    () =>
      needHelpResponse.filters.map((filter) => ({
        ...filter,
        active: activeFilterIds.includes(filter.id),
      })),
    [activeFilterIds]
  );

  const canLoadMore = allOrganizations.length < total;
  const remaining = total - allOrganizations.length;

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
  }

  function handleToggleFilter(filterId: string) {
    if (filterId === 'nearest') return; // geolocation not implemented
    setActiveFilterIds((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    );
  }

  function handleLoadMore() {
    if (canLoadMore && !isLoadingMore) {
      setPage((p) => p + 1);
    }
  }

  function handleRetry() {
    setReloadKey((k) => k + 1);
  }

  return {
    language,
    query,
    filters,
    visibleOrganizations,
    total,
    shownCount: allOrganizations.length,
    remaining,
    isLoading,
    isLoadingMore,
    error,
    canLoadMore,
    handleQueryChange,
    handleToggleFilter,
    handleLoadMore,
    handleRetry,
  };
}
