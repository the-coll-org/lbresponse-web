import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  NeedHelpOrganizationViewModel,
  NeedHelpServiceIcon,
  OrganizationApiItem,
  OrganizationsApiResponse,
} from '../need-help/needHelp.types';

const FILTER_TO_SECTOR: Record<string, string> = {
  food: 'food',
  medical: 'medical',
  shelter: 'shelter',
  clothes: 'clothes',
};

// Maps governorate id → district-level region_ids used by the API
export const CITY_MARKER_REGIONS: Record<string, string[]> = {
  akkar: ['akkar'],
  north: ['tripoli', 'bcharre', 'el-koura', 'el-batroun', 'el-minieh-dennie'],
  beirut: ['beirut', 'aley', 'baabda', 'chouf', 'el-meten', 'jbeil'],
  bekaa: ['zahle', 'west-bekaa', 'rachaya'],
  baalbek: ['baalbek', 'el-hermel'],
  south: ['saida', 'sour', 'jezzine'],
  nabatieh: ['el-nabatieh', 'bent-jbeil', 'hasbaya'],
};

export interface MapRegion {
  region_id: string;
  region: string;
  count: number;
}

interface MapApiResponse {
  data: MapRegion[];
  total: number;
}

function buildMapUrl(activeFilter: string | null): string {
  const params = new URLSearchParams();
  if (activeFilter && FILTER_TO_SECTOR[activeFilter]) {
    params.set('sector', FILTER_TO_SECTOR[activeFilter]);
  }
  const qs = params.toString();
  return `/api/organizations/map${qs ? `?${qs}` : ''}`;
}

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

  if (org.whatsapp) {
    const cleaned = org.whatsapp.replace(/\D/g, '');
    return {
      id: org.id,
      icon,
      title,
      category,
      description,
      locations,
      mapUrl: org.map_url,
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
    actionType: 'phone',
    actionLabel: isArabic ? 'غير متاح' : 'Unavailable',
    actionHref: '',
    actionDisabled: true,
  };
}

const PAGE_SIZE = 10;

export function useMapScreenState() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ar';

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeGovId, setActiveGovId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedOrgs, setSelectedOrgs] = useState<
    NeedHelpOrganizationViewModel[]
  >([]);
  const [selectedOrgTotal, setSelectedOrgTotal] = useState(0);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [isLoadingMoreOrgs, setIsLoadingMoreOrgs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loadingMoreRef = useRef(false);

  const hasMoreOrgs = selectedOrgs.length < selectedOrgTotal;

  // Fetch region counts for the map
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function load() {
      try {
        const response = await fetch(buildMapUrl(activeFilter));
        if (!response.ok) throw new Error(`HTTP ${response.status.toString()}`);
        const json = (await response.json()) as MapApiResponse;
        if (cancelled) return;
        const counts: Record<string, number> = {};
        for (const region of json.data) {
          counts[region.region_id] = region.count;
        }
        setRegionCounts(counts);
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [activeFilter]);

  // Fetch page 1 when the selected governorate or filter changes
  useEffect(() => {
    if (!activeGovId) {
      setSelectedOrgs([]);
      setSelectedOrgTotal(0);
      setCurrentPage(1);
      return;
    }

    const regionIds = CITY_MARKER_REGIONS[activeGovId] ?? [];
    if (regionIds.length === 0) {
      setSelectedOrgs([]);
      setSelectedOrgTotal(0);
      setCurrentPage(1);
      return;
    }

    let cancelled = false;
    setIsLoadingOrgs(true);
    setSelectedOrgs([]);
    setSelectedOrgTotal(0);
    setCurrentPage(1);

    async function loadOrgs() {
      const params = new URLSearchParams({
        page: '1',
        page_size: String(PAGE_SIZE),
      });
      params.set('region', regionIds.join(','));
      if (activeFilter && FILTER_TO_SECTOR[activeFilter]) {
        params.set('sector', FILTER_TO_SECTOR[activeFilter]);
      }

      try {
        const response = await fetch(`/api/organizations?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status.toString()}`);
        const json = (await response.json()) as OrganizationsApiResponse;
        if (cancelled) return;
        setSelectedOrgs(
          json.data.map((org) => mapOrganizationToViewModel(org, language))
        );
        setSelectedOrgTotal(json.total);
      } catch {
        if (!cancelled) {
          setSelectedOrgs([]);
          setSelectedOrgTotal(0);
        }
      } finally {
        if (!cancelled) setIsLoadingOrgs(false);
      }
    }

    void loadOrgs();
    return () => {
      cancelled = true;
    };
  }, [activeGovId, activeFilter, language]);

  async function loadMoreOrgs() {
    if (!activeGovId || !hasMoreOrgs || loadingMoreRef.current || isLoadingOrgs)
      return;

    const regionIds = CITY_MARKER_REGIONS[activeGovId] ?? [];
    if (regionIds.length === 0) return;

    const nextPage = currentPage + 1;
    loadingMoreRef.current = true;
    setIsLoadingMoreOrgs(true);

    const params = new URLSearchParams({
      page: String(nextPage),
      page_size: String(PAGE_SIZE),
    });
    params.set('region', regionIds.join(','));
    if (activeFilter && FILTER_TO_SECTOR[activeFilter]) {
      params.set('sector', FILTER_TO_SECTOR[activeFilter]);
    }

    try {
      const response = await fetch(`/api/organizations?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status.toString()}`);
      const json = (await response.json()) as OrganizationsApiResponse;
      setSelectedOrgs((prev) => [
        ...prev,
        ...json.data.map((org) => mapOrganizationToViewModel(org, language)),
      ]);
      setSelectedOrgTotal(json.total);
      setCurrentPage(nextPage);
    } catch {
      // leave existing orgs intact; user can scroll again to retry
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMoreOrgs(false);
    }
  }

  function handleToggleFilter(filterId: string) {
    if (filterId === 'nearby') return;
    setActiveFilter((prev) => (prev === filterId ? null : filterId));
  }

  function handleGovClick(govId: string) {
    setActiveGovId((prev) => (prev === govId ? null : govId));
  }

  return {
    query,
    setQuery,
    activeFilter,
    activeGovId,
    regionCounts,
    isLoading,
    error,
    selectedOrgs,
    selectedOrgTotal,
    isLoadingOrgs,
    isLoadingMoreOrgs,
    hasMoreOrgs,
    loadMoreOrgs,
    handleToggleFilter,
    handleGovClick,
  };
}
