import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type HelpCenterFilterSection } from '../ui/HelpCenterFiltersSheet';
import {
  FILTER_SECTIONS,
  HOTLINES,
  MAX_PINNED_ORGANIZATIONS,
  ORGANIZATIONS_PAGE_SIZE,
} from './helpCenter.data';
import { helpCenterIcons } from './helpCenter.icons';
import {
  buildPinnedOrganizationOptions,
  buildOrganizationRequestPayload,
  buildOrganizationsUrl,
  cloneFilterSelection,
  collectFilterOptions,
  countSelectedFilters,
  createEmptyOrganizationRequestForm,
  createEmptyFilterSelection,
  findOrganizationById,
  isValidRequestEmail,
  isValidRequestPhone,
  mapOrganizationToViewModel,
  mergeOrganizations,
  normalizeRequestContactInput,
  sortPinnedOrganizations,
} from './helpCenter.utils';
import type {
  HelpCenterFiltersResponse,
  HelpCenterFilterSelection,
  HelpCenterOrganizationsResponse,
  HelpCenterOrganizationApiItem,
  HelpCenterOrganizationRequestErrors,
  HelpCenterOrganizationRequestField,
  HelpCenterOrganizationRequestFormValues,
  HelpCenterOrganizationType,
} from './helpCenter.types';

function mapSectionIcon(icon: 'pin' | 'shield' | 'phone') {
  if (icon === 'pin') {
    return helpCenterIcons.smallPin;
  }

  if (icon === 'phone') {
    return helpCenterIcons.smallPhone;
  }

  return helpCenterIcons.smallShield;
}

export function useHelpCenterScreenState() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPinnedOrganizationsSheetOpen, setIsPinnedOrganizationsSheetOpen] =
    useState(false);
  const [isRequestOrganizationSheetOpen, setIsRequestOrganizationSheetOpen] =
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
  const [page, setPage] = useState(1);
  const [allOrganizations, setAllOrganizations] = useState<
    HelpCenterOrganizationApiItem[]
  >([]);
  const [organizationDirectory, setOrganizationDirectory] = useState<
    HelpCenterOrganizationApiItem[]
  >([]);
  const [totalOrganizations, setTotalOrganizations] = useState(0);
  const [filtersResponse, setFiltersResponse] =
    useState<HelpCenterFiltersResponse | null>(null);
  const [isOrganizationsLoading, setIsOrganizationsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [organizationsError, setOrganizationsError] = useState(false);
  const [draftOrganizationsCount, setDraftOrganizationsCount] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [pinOverrides, setPinOverrides] = useState<Record<string, boolean>>({});
  const [requestOrganizationForm, setRequestOrganizationForm] =
    useState<HelpCenterOrganizationRequestFormValues>(() =>
      createEmptyOrganizationRequestForm(i18n.resolvedLanguage ?? i18n.language)
    );
  const [requestOrganizationErrors, setRequestOrganizationErrors] =
    useState<HelpCenterOrganizationRequestErrors>({});
  const [isSubmittingOrganizationRequest, setIsSubmittingOrganizationRequest] =
    useState(false);
  const pinOverridesRef = useRef(pinOverrides);

  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;
  const languageToggleLabel = activeLanguage?.startsWith('ar') ? 'EN' : 'AR';

  useEffect(() => {
    pinOverridesRef.current = pinOverrides;
  }, [pinOverrides]);

  const filterOptions = useMemo(
    () =>
      filtersResponse
        ? collectFilterOptions(filtersResponse, activeLanguage)
        : ({} as Record<string, HelpCenterFilterSection['options']>),
    [activeLanguage, filtersResponse]
  );

  const filterSections = useMemo<HelpCenterFilterSection[]>(
    () =>
      filtersResponse?.data.map((group) => {
        const section = FILTER_SECTIONS.find(
          ({ id }) => id === group.group_id
        ) ?? {
          id: group.group_id,
          titleKey: '',
          icon: 'shield' as const,
        };
        const Icon = mapSectionIcon(section.icon);
        const isArabic = activeLanguage.startsWith('ar');

        return {
          id: group.group_id,
          title:
            (isArabic ? group.group_label_ar : group.group_label) ??
            group.group_label ??
            group.group_id,
          icon: <Icon />,
          options: filterOptions[group.group_id] ?? [],
        };
      }) ?? [],
    [activeLanguage, filterOptions, filtersResponse]
  );

  const hotlines = useMemo(
    () =>
      HOTLINES.map((item) => ({
        ...item,
        label: t(`helpCenter.${item.labelKey}`),
      })),
    [t]
  );

  const organizationTypeOptions = useMemo<
    { value: HelpCenterOrganizationType; label: string }[]
  >(
    () => [
      {
        value: 'government',
        label: t('helpCenter.requestForm.options.organizationTypes.government'),
      },
      {
        value: 'private_company',
        label: t('helpCenter.requestForm.options.organizationTypes.private'),
      },
      {
        value: 'ngo',
        label: t('helpCenter.requestForm.options.organizationTypes.nonProfit'),
      },
      {
        value: 'local_organization',
        label: t('helpCenter.requestForm.options.organizationTypes.other'),
      },
    ],
    [t]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadFilterOptions() {
      try {
        const response = await fetch('/api/filters');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status.toString()}`);
        }

        const json = (await response.json()) as HelpCenterFiltersResponse;

        if (!cancelled) {
          setFiltersResponse(json);
        }
      } catch {
        if (!cancelled) {
          setFiltersResponse(null);
        }
      }
    }

    void loadFilterOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizations() {
      const isLoadingFirstPage = page === 1;

      if (isLoadingFirstPage) {
        setIsOrganizationsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await fetch(
          buildOrganizationsUrl(
            appliedFilters,
            query,
            page,
            ORGANIZATIONS_PAGE_SIZE
          )
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status.toString()}`);
        }

        const json = (await response.json()) as HelpCenterOrganizationsResponse;

        if (cancelled) {
          return;
        }

        setAllOrganizations((currentOrganizations) =>
          isLoadingFirstPage
            ? json.data
            : mergeOrganizations(currentOrganizations, json.data)
        );
        setOrganizationDirectory((currentOrganizations) =>
          mergeOrganizations(currentOrganizations, json.data)
        );
        setPinnedOrganizationIds((currentIds) => {
          const nextIds = new Set(currentIds);

          for (const organization of json.data) {
            if (pinOverridesRef.current[organization.id] !== undefined) {
              continue;
            }

            if (organization.pinned) {
              nextIds.add(organization.id);
            } else {
              nextIds.delete(organization.id);
            }
          }

          return [...nextIds];
        });
        setTotalOrganizations(json.total);
        setOrganizationsError(false);
      } catch {
        if (!cancelled) {
          setOrganizationsError(true);
          if (isLoadingFirstPage) {
            setAllOrganizations([]);
            setTotalOrganizations(0);
          }
        }
      } finally {
        if (!cancelled) {
          setIsOrganizationsLoading(false);
          setIsLoadingMore(false);
        }
      }
    }

    void loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, page, query, reloadKey]);

  useEffect(() => {
    if (!isFilterOpen) {
      setDraftOrganizationsCount(totalOrganizations);
      return;
    }

    let cancelled = false;

    async function loadDraftOrganizationsCount() {
      try {
        const response = await fetch(
          buildOrganizationsUrl(draftFilters, query, 1, 1)
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status.toString()}`);
        }

        const json = (await response.json()) as HelpCenterOrganizationsResponse;

        if (!cancelled) {
          setDraftOrganizationsCount(json.total);
        }
      } catch {
        if (!cancelled) {
          setDraftOrganizationsCount(0);
        }
      }
    }

    void loadDraftOrganizationsCount();

    return () => {
      cancelled = true;
    };
  }, [draftFilters, isFilterOpen, query, totalOrganizations]);

  const organizationLabels = useMemo(
    () => ({
      call: t('helpCenter.contactCall'),
      whatsapp: t('helpCenter.contactWhatsapp'),
      email: t('helpCenter.contactEmail'),
      unavailable: t('helpCenter.contactUnavailable'),
      uncategorized: t('helpCenter.uncategorized'),
    }),
    [t]
  );

  const visibleOrganizations = useMemo(
    () =>
      sortPinnedOrganizations(
        allOrganizations.map((organization) =>
          mapOrganizationToViewModel(
            organization,
            activeLanguage,
            pinnedOrganizationIds.includes(organization.id),
            organizationLabels
          )
        ),
        pinnedOrganizationIds
      ),
    [
      activeLanguage,
      allOrganizations,
      organizationLabels,
      pinnedOrganizationIds,
    ]
  );

  const appliedFiltersCount = useMemo(
    () => countSelectedFilters(appliedFilters),
    [appliedFilters]
  );

  const appliedFilterChips = useMemo(
    () =>
      filterSections.flatMap((section) =>
        (appliedFilters[section.id] ?? []).map((value) => {
          const option = (filterOptions[section.id] ?? []).find(
            (o) => o.value === value
          );
          return {
            sectionId: section.id,
            value,
            label: option?.label ?? value,
            icon: section.icon,
          };
        })
      ),
    [appliedFilters, filterOptions, filterSections]
  );

  const pinnedOrganizations = useMemo(
    () =>
      buildPinnedOrganizationOptions(
        pinnedOrganizationIds,
        sortPinnedOrganizations(
          organizationDirectory.map((organization) =>
            mapOrganizationToViewModel(
              organization,
              activeLanguage,
              pinnedOrganizationIds.includes(organization.id),
              organizationLabels
            )
          ),
          pinnedOrganizationIds
        )
      ),
    [
      activeLanguage,
      organizationDirectory,
      organizationLabels,
      pinnedOrganizationIds,
    ]
  );

  const trimmedQuery = query.trim();
  const hasActiveQuery = trimmedQuery.length > 0;
  const hasSearchResults = visibleOrganizations.length > 0;
  const canLoadMore = visibleOrganizations.length < totalOrganizations;

  function resetRequestOrganizationForm() {
    setRequestOrganizationForm(
      createEmptyOrganizationRequestForm(activeLanguage, trimmedQuery)
    );
    setRequestOrganizationErrors({});
  }

  function validateOrganizationRequestForm() {
    const nextErrors: HelpCenterOrganizationRequestErrors = {};
    const trimmedName = requestOrganizationForm.organizationName.trim();
    const trimmedContactValue = requestOrganizationForm.contactValue.trim();

    if (!trimmedName) {
      nextErrors.organizationName = t(
        'helpCenter.requestForm.errors.nameRequired'
      );
    }

    if (!requestOrganizationForm.organizationType) {
      nextErrors.organizationType = t(
        'helpCenter.requestForm.errors.organizationTypeRequired'
      );
    }

    if (!trimmedContactValue) {
      nextErrors.contactValue = t(
        'helpCenter.requestForm.errors.contactRequired'
      );
    } else if (requestOrganizationForm.contactMode === 'email') {
      if (!isValidRequestEmail(trimmedContactValue)) {
        nextErrors.contactValue = t(
          'helpCenter.requestForm.errors.emailInvalid'
        );
      }
    } else if (requestOrganizationForm.contactMode === 'phone') {
      if (!isValidRequestPhone(trimmedContactValue)) {
        nextErrors.contactValue = t(
          'helpCenter.requestForm.errors.phoneInvalid'
        );
      }
    } else {
      nextErrors.contactValue = t(
        'helpCenter.requestForm.errors.contactInvalid'
      );
    }

    return nextErrors;
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setPage(1);
  }

  function handleToggleFilterOption(sectionId: string, optionValue: string) {
    setDraftFilters((currentFilters) => {
      const currentValues = currentFilters[sectionId] ?? [];
      const hasValue = currentValues.includes(optionValue);

      return {
        ...currentFilters,
        [sectionId]: hasValue
          ? currentValues.filter((value) => value !== optionValue)
          : [...currentValues, optionValue],
      };
    });
  }

  function handleToggleSectorChip(value: string) {
    setAppliedFilters((current) => {
      const currentValues = current.sector ?? [];
      const isSelected =
        currentValues.length === 1 && currentValues[0] === value;
      return {
        ...current,
        sector: isSelected ? [] : [value],
      };
    });
    setPage(1);
  }

  function handleOpenRequestOrganizationSheet() {
    setRequestOrganizationForm(
      createEmptyOrganizationRequestForm(activeLanguage, trimmedQuery)
    );
    setRequestOrganizationErrors({});
    setIsRequestOrganizationSheetOpen(true);
  }

  function handleCloseRequestOrganizationSheet() {
    setIsRequestOrganizationSheetOpen(false);
    setRequestOrganizationErrors({});
  }

  function handleRequestOrganizationFieldChange(
    field: HelpCenterOrganizationRequestField,
    value: string
  ) {
    if (field === 'contactValue') {
      const normalizedContact = normalizeRequestContactInput(value);

      setRequestOrganizationForm((currentForm) => ({
        ...currentForm,
        ...normalizedContact,
      }));
      setRequestOrganizationErrors((currentErrors) => ({
        ...currentErrors,
        contactValue: undefined,
        submit: undefined,
      }));
      return;
    }

    setRequestOrganizationForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
    setRequestOrganizationErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
      submit: undefined,
    }));
  }

  function handleSelectRequestOrganizationType(
    value: HelpCenterOrganizationType
  ) {
    setRequestOrganizationForm((currentForm) => ({
      ...currentForm,
      organizationType: value,
    }));
    setRequestOrganizationErrors((currentErrors) => ({
      ...currentErrors,
      organizationType: undefined,
      submit: undefined,
    }));
  }

  function handleRemoveFilter(sectionId: string, value: string) {
    setAppliedFilters((currentFilters) => ({
      ...currentFilters,
      [sectionId]: (currentFilters[sectionId] ?? []).filter((v) => v !== value),
    }));
    setPage(1);
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
    const emptyFilters = createEmptyFilterSelection(
      filterSections.map((section) => section.id)
    );
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  }

  function handleApplyFilters() {
    setAppliedFilters(cloneFilterSelection(draftFilters));
    setPage(1);
    setIsFilterOpen(false);
  }

  function handleClosePinnedOrganizationsSheet() {
    setOrganizationPendingReplacementId(null);
    setIsPinnedOrganizationsSheetOpen(false);
  }

  function handleTogglePinnedOrganization(organizationId: string) {
    if (pinnedOrganizationIds.includes(organizationId)) {
      setPinOverrides((currentOverrides) => ({
        ...currentOverrides,
        [organizationId]: false,
      }));
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

    setPinOverrides((currentOverrides) => ({
      ...currentOverrides,
      [organizationId]: true,
    }));
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
    setPinOverrides((currentOverrides) => ({
      ...currentOverrides,
      [organizationIdToReplace]: false,
      [organizationPendingReplacementId]: true,
    }));
    handleClosePinnedOrganizationsSheet();
  }

  function handleLoadMore() {
    if (canLoadMore) {
      setPage((currentPage) => currentPage + 1);
    }
  }

  function handleRetryOrganizations() {
    setReloadKey((currentKey) => currentKey + 1);
  }

  async function handleSubmitOrganizationRequest() {
    const nextErrors = validateOrganizationRequestForm();

    if (Object.keys(nextErrors).length > 0) {
      setRequestOrganizationErrors(nextErrors);
      return false;
    }

    setIsSubmittingOrganizationRequest(true);
    setRequestOrganizationErrors({});

    try {
      const payload = buildOrganizationRequestPayload(requestOrganizationForm);
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = t('helpCenter.requestForm.errors.submitFailed');

        try {
          const json = (await response.json()) as { message?: string };
          if (json.message) {
            errorMessage = json.message;
          }
        } catch {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        }

        setRequestOrganizationErrors({ submit: errorMessage });
        return false;
      }

      const createdOrganization =
        (await response.json()) as HelpCenterOrganizationApiItem;

      setOrganizationDirectory((currentOrganizations) =>
        mergeOrganizations(currentOrganizations, [createdOrganization])
      );
      setIsRequestOrganizationSheetOpen(false);
      resetRequestOrganizationForm();
      return true;
    } catch {
      setRequestOrganizationErrors({
        submit: t('helpCenter.requestForm.errors.submitFailed'),
      });
      return false;
    } finally {
      setIsSubmittingOrganizationRequest(false);
    }
  }

  function handleActivateOrganizationAction(organizationId: string) {
    const organization = findOrganizationById(
      visibleOrganizations,
      organizationId
    );

    if (
      !organization ||
      organization.primaryActionDisabled ||
      typeof window === 'undefined'
    ) {
      return;
    }

    if (organization.primaryActionType === 'phone') {
      window.location.href = `tel:${organization.primaryActionValue}`;
      return;
    }

    if (organization.primaryActionType === 'whatsapp') {
      const digits = organization.primaryActionValue.replace(/\D/g, '');
      const intl = digits.startsWith('961')
        ? digits
        : `961${digits.replace(/^0+/, '')}`;
      window.open(`https://wa.me/${intl}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (organization.primaryActionType === 'email') {
      window.location.href = `mailto:${organization.primaryActionValue}`;
    }
  }

  function handleOpenMap(mapUrl: string) {
    if (typeof window === 'undefined') return;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  }

  return {
    t,
    query,
    organizations: allOrganizations,
    visibleOrganizations,
    filterSections,
    appliedFilters,
    activeLanguage,
    hotlines,
    pinnedOrganizations,
    appliedFiltersCount,
    appliedFilterChips,
    draftFilters,
    isFilterOpen,
    isPinnedOrganizationsSheetOpen,
    isRequestOrganizationSheetOpen,
    isOrganizationsLoading,
    isLoadingMore,
    organizationsError,
    requestOrganizationForm,
    requestOrganizationErrors,
    isSubmittingOrganizationRequest,
    organizationTypeOptions,
    languageToggleLabel,
    trimmedQuery,
    hasActiveQuery,
    hasSearchResults,
    totalOrganizations,
    draftOrganizationsCount,
    canLoadMore,
    maxPinnedOrganizations: MAX_PINNED_ORGANIZATIONS,
    handleQueryChange,
    handleRemoveFilter,
    handleOpenFilters,
    handleCancelFilters,
    handleClearFilters,
    handleApplyFilters,
    handleToggleFilterOption,
    handleToggleSectorChip,
    handleTogglePinnedOrganization,
    handleReplacePinnedOrganization,
    handleClosePinnedOrganizationsSheet,
    handleOpenRequestOrganizationSheet,
    handleCloseRequestOrganizationSheet,
    handleRequestOrganizationFieldChange,
    handleSelectRequestOrganizationType,
    handleSubmitOrganizationRequest,
    handleLoadMore,
    handleRetryOrganizations,
    handleActivateOrganizationAction,
    handleOpenMap,
    setIsFilterOpen,
    setIsPinnedOrganizationsSheetOpen,
    setIsRequestOrganizationSheetOpen,
  };
}
