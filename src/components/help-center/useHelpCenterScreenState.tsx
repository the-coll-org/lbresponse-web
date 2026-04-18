import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type HelpCenterFilterSection } from '../ui/HelpCenterFiltersSheet';
import {
  FILTER_SECTIONS,
  HOTLINES,
  MAX_PINNED_ORGANIZATIONS,
} from './helpCenter.data';
import { helpCenterIcons } from './helpCenter.icons';
import {
  buildPinnedOrganizationOptions,
  cloneFilterSelection,
  countSelectedFilters,
  createEmptyFilterSelection,
  findOrganizationById,
  filterOrganizations,
} from './helpCenter.utils';
import type { HelpCenterFilterSelection } from './helpCenter.types';

export function useHelpCenterScreenState() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPinnedOrganizationsSheetOpen, setIsPinnedOrganizationsSheetOpen] =
    useState(false);
  const [
    organizationPendingReplacementId,
    setOrganizationPendingReplacementId,
  ] = useState<string | null>(null);
  const [pinnedOrganizationIds, setPinnedOrganizationIds] = useState<string[]>(
    []
  );
  const [appliedFilters, setAppliedFilters] =
    useState<HelpCenterFilterSelection>(() => createEmptyFilterSelection());
  const [draftFilters, setDraftFilters] = useState<HelpCenterFilterSelection>(
    () => createEmptyFilterSelection()
  );

  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;
  const languageToggleLabel = activeLanguage?.startsWith('ar') ? 'EN' : 'AR';

  const filterSections = useMemo<HelpCenterFilterSection[]>(
    () =>
      FILTER_SECTIONS.map((section) => {
        const icon =
          section.icon === 'pin'
            ? helpCenterIcons.smallPin
            : section.icon === 'shield'
              ? helpCenterIcons.smallShield
              : helpCenterIcons.smallPhone;
        const Icon = icon;

        return {
          id: section.id,
          title: t(`helpCenter.${section.titleKey}`),
          icon: <Icon />,
          options: section.options.map((option) => ({
            id: option.id,
            label: t(`helpCenter.${option.labelKey}`),
            value: option.value,
          })),
        };
      }),
    [t]
  );

  const hotlines = useMemo(
    () =>
      HOTLINES.map((item) => ({
        ...item,
        label: t(`helpCenter.${item.labelKey}`),
      })),
    [t]
  );

  const organizations = useMemo(
    () => filterOrganizations(appliedFilters, query, t),
    [appliedFilters, query, t]
  );
  const draftOrganizations = useMemo(
    () => filterOrganizations(draftFilters, query, t),
    [draftFilters, query, t]
  );
  const appliedFiltersCount = useMemo(
    () => countSelectedFilters(appliedFilters),
    [appliedFilters]
  );
  const pinnedOrganizations = useMemo(
    () => buildPinnedOrganizationOptions(pinnedOrganizationIds, t),
    [pinnedOrganizationIds, t]
  );
  const visibleOrganizations = useMemo(
    () =>
      organizations.slice(0, visibleCount).map((organization) => ({
        id: organization.id,
        title: t(`helpCenter.${organization.nameKey}`),
        category: t(`helpCenter.${organization.categoryKey}`),
        description: t(`helpCenter.${organization.descriptionKey}`),
        locations: t(`helpCenter.${organization.locationsKey}`),
        actionLabel: t(`helpCenter.${organization.actionLabelKey}`),
        actionType: organization.actionType,
        actionValue: organization.actionValue,
        whatsappMessage: organization.whatsappMessageKey
          ? t(`helpCenter.${organization.whatsappMessageKey}`)
          : '',
        isPinned: pinnedOrganizationIds.includes(organization.id),
      })),
    [organizations, pinnedOrganizationIds, t, visibleCount]
  );

  const trimmedQuery = query.trim();
  const hasActiveQuery = trimmedQuery.length > 0;
  const hasSearchResults = organizations.length > 0;

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleCount(4);
  }

  function handleToggleFilterOption(sectionId: string, optionValue: string) {
    setDraftFilters((currentFilters) => {
      const currentValues = currentFilters[sectionId] ?? [];
      const hasValue = currentValues.includes(optionValue);
      const nextValues = hasValue
        ? currentValues.filter((value) => value !== optionValue)
        : [...currentValues, optionValue];

      return {
        ...currentFilters,
        [sectionId]: nextValues,
      };
    });
  }

  function handleOpenFilters() {
    setDraftFilters(cloneFilterSelection(appliedFilters));
    setIsFilterOpen(true);
  }

  function handleCancelFilters() {
    setDraftFilters(cloneFilterSelection(appliedFilters));
    setIsFilterOpen(false);
  }

  function handleClearFilters() {
    const emptyFilters = createEmptyFilterSelection();
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setVisibleCount(4);
  }

  function handleApplyFilters() {
    setAppliedFilters(cloneFilterSelection(draftFilters));
    setVisibleCount(4);
    setIsFilterOpen(false);
  }

  function handleClosePinnedOrganizationsSheet() {
    setOrganizationPendingReplacementId(null);
    setIsPinnedOrganizationsSheetOpen(false);
  }

  function handleTogglePinnedOrganization(organizationId: string) {
    if (pinnedOrganizationIds.includes(organizationId)) {
      setPinnedOrganizationIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== organizationId)
      );
      return;
    }

    if (pinnedOrganizationIds.length >= MAX_PINNED_ORGANIZATIONS) {
      setOrganizationPendingReplacementId(organizationId);
      setIsPinnedOrganizationsSheetOpen(true);
      return;
    }

    setPinnedOrganizationIds((currentIds) => [...currentIds, organizationId]);
  }

  function handleReplacePinnedOrganization(organizationIdToReplace: string) {
    if (!organizationPendingReplacementId) {
      return;
    }

    setPinnedOrganizationIds((currentIds) => [
      ...currentIds.filter(
        (currentId) =>
          currentId !== organizationIdToReplace &&
          currentId !== organizationPendingReplacementId
      ),
      organizationPendingReplacementId,
    ]);
    handleClosePinnedOrganizationsSheet();
  }

  function handleLoadMore() {
    setVisibleCount((count) => count + 10);
  }

  function handleActivateOrganizationAction(organizationId: string) {
    const organization = findOrganizationById(organizationId);

    if (!organization || typeof window === 'undefined') {
      return;
    }

    if (organization.actionType === 'phone') {
      window.location.href = `tel:${organization.actionValue}`;
      return;
    }

    const message = organization.whatsappMessageKey
      ? t(`helpCenter.${organization.whatsappMessageKey}`)
      : '';
    const whatsappUrl = `https://wa.me/${organization.actionValue}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  return {
    t,
    query,
    visibleOrganizations,
    organizations,
    draftOrganizations,
    filterSections,
    hotlines,
    pinnedOrganizations,
    appliedFiltersCount,
    draftFilters,
    isFilterOpen,
    isPinnedOrganizationsSheetOpen,
    languageToggleLabel,
    trimmedQuery,
    hasActiveQuery,
    hasSearchResults,
    visibleCount,
    maxPinnedOrganizations: MAX_PINNED_ORGANIZATIONS,
    handleQueryChange,
    handleOpenFilters,
    handleCancelFilters,
    handleClearFilters,
    handleApplyFilters,
    handleToggleFilterOption,
    handleTogglePinnedOrganization,
    handleReplacePinnedOrganization,
    handleClosePinnedOrganizationsSheet,
    handleLoadMore,
    handleActivateOrganizationAction,
    setIsFilterOpen,
    setIsPinnedOrganizationsSheetOpen,
  };
}
