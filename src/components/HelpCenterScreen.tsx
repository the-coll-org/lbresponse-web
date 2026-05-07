import { useEffect, useMemo } from 'react';
import { useToast } from '../hooks/useToast';
import { FindHelpEmergencyStrip } from './help-center/FindHelpEmergencyStrip';
import { FindHelpHeader } from './help-center/FindHelpHeader';
import { FindHelpHero } from './help-center/FindHelpHero';
import { FindHelpSearchAndFilterButton } from './help-center/FindHelpSearchAndFilterButton';
import { FindHelpNeedChips } from './help-center/FindHelpNeedChips';
import { FindHelpActiveFilters } from './help-center/FindHelpActiveFilters';
import type { FindHelpActiveFilterChip } from './help-center/FindHelpActiveFilters';
import { FindHelpResultsHeader } from './help-center/FindHelpResultsHeader';
import { FindHelpResultCard } from './help-center/FindHelpResultCard';
import { FindHelpFiltersSheet } from './help-center/FindHelpFiltersSheet';
import { FindHelpDetailModal } from './help-center/FindHelpDetailModal';
import {
  buildFindHelpFilterCatalog,
  buildFindHelpListingViewModel,
  type FindHelpListingViewModel,
} from './help-center/findHelpAdapter';
import { useFindHelpDetail } from './help-center/useFindHelpDetail';
import { useFindHelpUrlSync } from './help-center/useFindHelpFilters';
import { SearchEmptyState } from './ui/SearchEmptyState';
import { Button } from './ui/Button';
import { RequestOrganizationSheet } from './ui/RequestOrganizationSheet';
import type { HelpCenterScreenProps } from './help-center/helpCenter.types';
import { useHelpCenterScreenState } from './help-center/useHelpCenterScreenState';

export default function HelpCenterScreen({
  theme,
  onToggleTheme,
  onToggleLanguage,
}: HelpCenterScreenProps) {
  const { addToast } = useToast();
  const {
    t,
    query,
    organizations,
    appliedFilters,
    activeLanguage,
    appliedFiltersCount,
    draftFilters,
    isFilterOpen,
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
    totalOrganizations,
    draftOrganizationsCount,
    canLoadMore,
    handleQueryChange,
    handleRemoveFilter,
    handleOpenFilters,
    handleCancelFilters,
    handleClearFilters,
    handleApplyFilters,
    handleToggleFilterOption,
    handleToggleAppliedOption,
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
    filterSections,
    appliedFilterChips,
  } = useHelpCenterScreenState();

  void filterSections;
  void appliedFilterChips;

  useFindHelpUrlSync({ filters: appliedFilters, query });

  const {
    detailId,
    openDetail,
    closeDetail,
    isOpen: isDetailOpen,
  } = useFindHelpDetail();

  const filtersResponse = useMemo(() => {
    const groups = new Map<
      string,
      {
        group_id: string;
        group_label: string;
        group_label_ar: string;
        options: {
          id: string;
          label: string;
          label_ar: string | null;
          result_count: number;
          display_order: number;
        }[];
      }
    >();
    for (const section of filterSections) {
      groups.set(section.id, {
        group_id: section.id,
        group_label: section.title,
        group_label_ar: section.title,
        options: section.options.map((option, index) => ({
          id: option.value,
          label: option.label,
          label_ar: option.label,
          result_count: 0,
          display_order: index,
        })),
      });
    }
    return { data: [...groups.values()] };
  }, [filterSections]);

  const catalog = useMemo(
    () => buildFindHelpFilterCatalog(filtersResponse, activeLanguage),
    [filtersResponse, activeLanguage]
  );

  const adapterLabels = useMemo(
    () => ({
      call: t('helpCenter.contactCall'),
      whatsapp: t('helpCenter.contactWhatsapp'),
      email: t('helpCenter.contactEmail'),
      unavailable: t('helpCenter.contactUnavailable'),
      uncategorized: t('helpCenter.uncategorized'),
      emailButton: t('helpCenter.findHelp.contactEmailButton'),
      offeredSector: (value: string) =>
        t('helpCenter.findHelp.detailOfferedSector', { value }),
      offeredService: (value: string) =>
        t('helpCenter.findHelp.detailOfferedService', { value }),
      offeredShelter: (value: string) =>
        t('helpCenter.findHelp.detailOfferedShelter', { value }),
      offeredType: (value: string) =>
        t('helpCenter.findHelp.detailOfferedType', { value }),
    }),
    [t]
  );

  const items = useMemo<FindHelpListingViewModel[]>(
    () =>
      organizations.map((organization) =>
        buildFindHelpListingViewModel(
          organization,
          activeLanguage,
          catalog,
          adapterLabels
        )
      ),
    [organizations, activeLanguage, catalog, adapterLabels]
  );

  const detailItem = useMemo(
    () => items.find((item) => item.id === detailId) ?? null,
    [items, detailId]
  );

  const activeFilterChips = useMemo<FindHelpActiveFilterChip[]>(() => {
    const allGroups = [
      ...(catalog.needs ? [catalog.needs] : []),
      ...(catalog.areas ? [catalog.areas] : []),
      ...catalog.others,
    ];
    return allGroups.flatMap((group) =>
      (appliedFilters[group.id] ?? []).map((optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        return {
          groupId: group.id,
          optionId,
          label: option?.label ?? optionId,
        };
      })
    );
  }, [appliedFilters, catalog]);

  const resultsHeadline = useMemo(() => {
    if (totalOrganizations === 0) {
      return t('helpCenter.findHelp.resultsHeadlineEmpty');
    }
    const needsLabels =
      catalog.needs?.options
        .filter((o) => (appliedFilters[catalog.needs!.id] ?? []).includes(o.id))
        .map((o) => o.label) ?? [];
    const areasLabels =
      catalog.areas?.options
        .filter((o) => (appliedFilters[catalog.areas!.id] ?? []).includes(o.id))
        .map((o) => o.label) ?? [];

    if (needsLabels.length === 0 && areasLabels.length === 0) {
      return t('helpCenter.findHelp.resultsHeadlineNoFilters', {
        count: totalOrganizations,
      });
    }

    const needsJoin = t('helpCenter.findHelp.resultsNeedsJoin');
    const needsFallback = t('helpCenter.findHelp.resultsNeedsFallback');
    const needsText =
      needsLabels.length > 0
        ? needsLabels.slice(0, 2).join(needsJoin) +
          (needsLabels.length > 2
            ? t('helpCenter.findHelp.resultsAreasMore', {
                count: needsLabels.length - 2,
              })
            : '')
        : needsFallback;

    let areasText = '';
    if (areasLabels.length > 0) {
      const areasJoin = t('helpCenter.findHelp.resultsAreasJoin');
      const prefix = t('helpCenter.findHelp.resultsAreasPrefix');
      const head = areasLabels.slice(0, 2).join(areasJoin);
      const tail =
        areasLabels.length > 2
          ? t('helpCenter.findHelp.resultsAreasMore', {
              count: areasLabels.length - 2,
            })
          : '';
      areasText = ` ${prefix}${head}${tail}`;
    }

    return t('helpCenter.findHelp.resultsHeadlineWithFilters', {
      count: totalOrganizations,
      needs: needsText,
      areas: areasText,
    });
  }, [appliedFilters, catalog, t, totalOrganizations]);

  useEffect(() => {
    if (detailId === null) return;
    if (organizations.length === 0) return;
    const stillExists = organizations.some((o) => o.id === detailId);
    if (!stillExists) closeDetail();
  }, [detailId, organizations, closeDetail]);

  function handlePrimaryAction(item: FindHelpListingViewModel) {
    handleActivateOrganizationAction(item.id);
  }

  async function handleShare(item: FindHelpListingViewModel) {
    const shareData = {
      title: item.title,
      text: item.description || item.title,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fall through to clipboard
      }
    }
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      shareData.url
    ) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        addToast({
          heading: t('helpCenter.findHelp.detailShareCopiedHeading'),
          body: t('helpCenter.findHelp.detailShareCopiedBody'),
        });
      } catch {
        // best-effort
      }
    }
  }

  const requestOrganizationSheetCopy = {
    title: t('helpCenter.requestForm.title'),
    closeAriaLabel: t('helpCenter.requestForm.close'),
    cancelLabel: t('helpCenter.requestForm.cancel'),
    submitLabel: t('helpCenter.requestForm.submit'),
    submittingLabel: t('helpCenter.requestForm.submitting'),
    fields: {
      name: t('helpCenter.requestForm.fields.name'),
      namePlaceholder: t('helpCenter.requestForm.placeholders.name'),
      contact: t('helpCenter.requestForm.fields.contact'),
      contactPlaceholder: t('helpCenter.requestForm.placeholders.contact'),
      organizationType: t('helpCenter.requestForm.fields.organizationType'),
    },
  };

  const filtersSheetCopy = {
    title: t('helpCenter.findHelp.filtersSheetTitle'),
    closeAriaLabel: t('helpCenter.findHelp.filtersSheetClose'),
    resetLabel: t('helpCenter.findHelp.filtersSheetReset'),
    applyLabel: t('helpCenter.findHelp.filtersSheetApplyCount', {
      count: draftOrganizationsCount,
    }),
    needsTitle: t('helpCenter.findHelp.filtersSectionNeedsTitle'),
    needsHint: t('helpCenter.findHelp.filtersSectionNeedsHint'),
    needsClear: t('helpCenter.findHelp.filtersSectionNeedsClear'),
    areasTitle: t('helpCenter.findHelp.filtersSectionAreasTitle'),
    areasHint: t('helpCenter.findHelp.filtersSectionAreasHint'),
    areasClear: t('helpCenter.findHelp.filtersSectionAreasClear'),
  };

  const detailModalCopy = {
    closeAriaLabel: t('helpCenter.findHelp.detailClose'),
    confidentialBanner: t('helpCenter.findHelp.detailConfidentialBanner'),
    coverageTitle: t('helpCenter.findHelp.detailCoverageTitle'),
    contactTitle: t('helpCenter.findHelp.detailContactTitle'),
    contactHint: t('helpCenter.findHelp.detailContactHint'),
    offeredTitle: t('helpCenter.findHelp.detailOfferedTitle'),
    updatedBy: (time: string, org: string) =>
      t('helpCenter.findHelp.detailUpdatedBy', { time, org }),
    updatedNoOrg: (time: string) =>
      t('helpCenter.findHelp.detailUpdatedNoOrg', { time }),
    reportProblem: t('helpCenter.findHelp.detailReportProblem'),
    callLabel: t('helpCenter.contactCall'),
    directionsLabel: t('helpCenter.findHelp.detailDirections'),
    shareLabel: t('helpCenter.findHelp.detailShare'),
    shareCopiedHeading: t('helpCenter.findHelp.detailShareCopiedHeading'),
    shareCopiedBody: t('helpCenter.findHelp.detailShareCopiedBody'),
    verifiedLabel: t('helpCenter.findHelp.cardVerified'),
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-surface-page">
        <FindHelpEmergencyStrip
          label={t('helpCenter.findHelp.emergencyLabel')}
          hint={t('helpCenter.findHelp.emergencyHint')}
          callLabel={t('helpCenter.findHelp.emergencyCallLabel')}
          callNumber="140"
        />

        <FindHelpHeader
          brandName={t('helpCenter.findHelp.brandName')}
          brandTagline={t('helpCenter.findHelp.brandTagline')}
          language={activeLanguage}
          theme={theme}
          languageToggleLabel={languageToggleLabel}
          languageToggleAriaLabel={t('common.toggleLanguage')}
          themeToggleAriaLabel={t('common.toggleTheme')}
          onToggleLanguage={onToggleLanguage}
          onToggleTheme={onToggleTheme}
        />

        <main className="flex-1 px-16 py-22 md:px-32 md:py-32">
          <div className="mx-auto flex w-full max-w-[1100px] flex-col">
            <FindHelpHero
              title={t('helpCenter.findHelp.heroTitle')}
              subtitle={t('helpCenter.findHelp.heroSubtitle')}
            />

            <div className="mt-22" />
            <FindHelpSearchAndFilterButton
              query={query}
              placeholder={t('helpCenter.findHelp.searchPlaceholder')}
              searchClearLabel={t('helpCenter.findHelp.searchClear')}
              filtersLabel={t('helpCenter.findHelp.filtersLabel')}
              filtersBadgeAriaLabel={t(
                'helpCenter.findHelp.filtersBadgeAriaLabel',
                { count: appliedFiltersCount }
              )}
              appliedFiltersCount={appliedFiltersCount}
              onQueryChange={handleQueryChange}
              onOpenFilters={handleOpenFilters}
            />

            {catalog.needs && (
              <>
                <div className="mt-12" />
                <FindHelpNeedChips
                  ariaLabel={t('helpCenter.findHelp.needsRowAriaLabel')}
                  options={catalog.needs.options}
                  selectedIds={appliedFilters[catalog.needs.id] ?? []}
                  onToggle={(id) =>
                    handleToggleAppliedOption(catalog.needs!.id, id)
                  }
                />
              </>
            )}

            <div className="mt-12" />
            <FindHelpActiveFilters
              label={t('helpCenter.findHelp.activeFiltersLabel')}
              clearAllLabel={t('helpCenter.findHelp.activeFiltersClearAll')}
              removeAriaLabel={(label) =>
                t('helpCenter.findHelp.removeFilterAriaLabel', { label })
              }
              chips={activeFilterChips}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />

            <div className="mt-16" />
            <section className="flex w-full flex-col gap-16">
              <FindHelpResultsHeader
                headline={resultsHeadline}
                liveLabel={t('helpCenter.findHelp.resultsLive')}
              />

              {isOrganizationsLoading ? (
                <div className="flex min-h-160 items-center justify-center rounded-xl border border-findhelp-border-subtle bg-surface-primary p-16 text-sm font-weight-medium text-text-black">
                  {t('common.loading')}
                </div>
              ) : organizationsError ? (
                <div className="flex w-full flex-col items-center gap-12 py-32 text-center">
                  <h3 className="text-sm font-weight-medium text-text-black">
                    {t('helpCenter.errorStateTitle')}
                  </h3>
                  <p className="text-xs font-weight-regular text-solid-black-400">
                    {t('helpCenter.errorStateDescription')}
                  </p>
                  <Button
                    className="h-44 justify-center"
                    onClick={handleRetryOrganizations}
                  >
                    {t('showcase.alert.retry')}
                  </Button>
                </div>
              ) : items.length === 0 ? (
                <SearchEmptyState
                  title={t(
                    hasActiveQuery
                      ? 'helpCenter.findHelp.emptyTitle'
                      : 'helpCenter.emptyStateNoDataTitle'
                  )}
                  description={t(
                    hasActiveQuery
                      ? 'helpCenter.findHelp.emptyDescription'
                      : 'helpCenter.emptyStateNoDataDescription',
                    { query: trimmedQuery }
                  )}
                  actionLabel={t('helpCenter.emptyStateAction')}
                  actionAriaLabel={t('helpCenter.emptyStateActionAriaLabel')}
                  onAction={handleOpenRequestOrganizationSheet}
                />
              ) : (
                <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-2">
                  {items.map((item) => (
                    <FindHelpResultCard
                      key={item.id}
                      item={item}
                      verifiedLabel={t('helpCenter.findHelp.cardVerified')}
                      detailsLabel={t('helpCenter.findHelp.cardDetails')}
                      confidentialLabel={t(
                        'helpCenter.findHelp.cardConfidential'
                      )}
                      cardAriaLabel={t(
                        'helpCenter.findHelp.cardOpenCardAriaLabel',
                        { title: item.title }
                      )}
                      onOpenDetail={(viewModel, trigger) =>
                        openDetail(viewModel.id, trigger)
                      }
                      onPrimaryAction={handlePrimaryAction}
                    />
                  ))}
                </div>
              )}

              {canLoadMore && items.length > 0 && (
                <div className="flex w-full justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex h-44 items-center justify-center gap-8 rounded-md px-16 text-button font-weight-medium text-text-black disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
                  >
                    {isLoadingMore
                      ? t('common.loading')
                      : t('helpCenter.loadMore', {
                          count: Math.max(totalOrganizations - items.length, 0),
                        })}
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <FindHelpFiltersSheet
        open={isFilterOpen}
        catalog={catalog}
        draftFilters={draftFilters}
        copy={filtersSheetCopy}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelFilters();
            return;
          }
          setIsFilterOpen(true);
        }}
        onToggleOption={handleToggleFilterOption}
        onClearGroup={(groupId) =>
          (draftFilters[groupId] ?? []).forEach((id) =>
            handleToggleFilterOption(groupId, id)
          )
        }
        onReset={handleClearFilters}
        onApply={handleApplyFilters}
      />

      <FindHelpDetailModal
        open={isDetailOpen}
        item={detailItem}
        copy={detailModalCopy}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
        onPrimaryAction={handlePrimaryAction}
        onOpenMap={handleOpenMap}
        onShare={(item) => {
          void handleShare(item);
        }}
      />

      <RequestOrganizationSheet
        open={isRequestOrganizationSheetOpen}
        copy={requestOrganizationSheetCopy}
        submitError={requestOrganizationErrors.submit}
        isSubmitting={isSubmittingOrganizationRequest}
        values={requestOrganizationForm}
        errors={requestOrganizationErrors}
        organizationTypeOptions={organizationTypeOptions}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseRequestOrganizationSheet();
            return;
          }
          handleOpenRequestOrganizationSheet();
        }}
        onFieldChange={handleRequestOrganizationFieldChange}
        onSelectOrganizationType={handleSelectRequestOrganizationType}
        onCancel={handleCloseRequestOrganizationSheet}
        onSubmit={() => {
          void (async () => {
            const submitted = await handleSubmitOrganizationRequest();
            if (submitted) {
              addToast({
                heading: t('helpCenter.requestForm.successHeading'),
                body: t('helpCenter.requestForm.successBody'),
              });
            }
          })();
        }}
      />
    </>
  );
}
