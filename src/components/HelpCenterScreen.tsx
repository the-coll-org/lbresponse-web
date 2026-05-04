import { useToast } from '../hooks/useToast';
import { EmergencyHotlinesSection } from './help-center/EmergencyHotlinesSection';
import { HelpCenterHeaderActions } from './help-center/HelpCenterHeaderActions';
import { HelpCenterSearchBar } from './help-center/HelpCenterSearchBar';
import { OrganizationsListSection } from './help-center/OrganizationsListSection';
import type { HelpCenterScreenProps } from './help-center/helpCenter.types';
import { useHelpCenterScreenState } from './help-center/useHelpCenterScreenState';
import { HelpCenterFiltersSheet } from './ui/HelpCenterFiltersSheet';
import { PinnedOrganizationsSheet } from './ui/PinnedOrganizationsSheet';
import { RequestOrganizationSheet } from './ui/RequestOrganizationSheet';
import { ScreenHeader } from './ui/ScreenHeader';

export default function HelpCenterScreen({
  theme,
  onToggleTheme,
  onToggleLanguage,
}: HelpCenterScreenProps) {
  const { addToast } = useToast();
  const {
    t,
    query,
    visibleOrganizations,
    filterSections,
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
    maxPinnedOrganizations,
    handleQueryChange,
    handleRemoveFilter,
    handleOpenFilters,
    handleCancelFilters,
    handleClearFilters,
    handleApplyFilters,
    handleToggleFilterOption,
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
    setIsFilterOpen,
    setIsPinnedOrganizationsSheetOpen,
  } = useHelpCenterScreenState();

  const resultsLabel =
    hasActiveQuery && !hasSearchResults
      ? `0 ${t('helpCenter.organizationLabel')}`
      : `${visibleOrganizations.length} / ${totalOrganizations} ${t(
          'helpCenter.organizationLabel'
        )}`;

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

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-surface-primary pb-32">
        <ScreenHeader
          title={t('helpCenter.title')}
          subtitle={t('helpCenter.subtitle')}
          actions={
            <HelpCenterHeaderActions
              theme={theme}
              languageToggleLabel={languageToggleLabel}
              languageToggleAriaLabel={t('common.toggleLanguage')}
              themeToggleAriaLabel={t('common.toggleTheme')}
              onToggleLanguage={onToggleLanguage}
              onToggleTheme={onToggleTheme}
            />
          }
        />

        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-22 px-16 pt-12 md:px-32 lg:px-48">
          <EmergencyHotlinesSection
            title={t('helpCenter.emergencyTitle')}
            hotlines={hotlines}
          />

          <HelpCenterSearchBar
            query={query}
            placeholder={t('helpCenter.searchPlaceholder')}
            filterAriaLabel={t('helpCenter.openFilters')}
            clearFiltersAriaLabel={t('helpCenter.filtersClear')}
            clearFiltersLabel={t('helpCenter.filtersClear')}
            appliedFiltersCount={appliedFiltersCount}
            appliedFilterChips={appliedFilterChips}
            resultsLabel={resultsLabel}
            onQueryChange={handleQueryChange}
            onOpenFilters={handleOpenFilters}
            onClearFilters={handleClearFilters}
            onRemoveFilter={handleRemoveFilter}
          />

          <OrganizationsListSection
            organizations={visibleOrganizations}
            isLoading={isOrganizationsLoading}
            isLoadingMore={isLoadingMore}
            hasError={organizationsError}
            loadingLabel={t('common.loading')}
            errorTitle={t('helpCenter.errorStateTitle')}
            errorDescription={t('helpCenter.errorStateDescription')}
            retryLabel={t('showcase.alert.retry')}
            hasActiveQuery={hasActiveQuery}
            hasSearchResults={hasSearchResults}
            emptyStateTitle={t(
              hasActiveQuery
                ? 'helpCenter.emptyStateTitle'
                : 'helpCenter.emptyStateNoDataTitle'
            )}
            emptyStateDescription={t(
              hasActiveQuery
                ? 'helpCenter.emptyStateDescription'
                : 'helpCenter.emptyStateNoDataDescription',
              {
                query: trimmedQuery,
              }
            )}
            emptyStateActionLabel={t('helpCenter.emptyStateAction')}
            emptyStateActionAriaLabel={t(
              'helpCenter.emptyStateActionAriaLabel'
            )}
            loadMoreLabel={t('helpCenter.loadMore', {
              count: Math.max(
                totalOrganizations - visibleOrganizations.length,
                0
              ),
            })}
            backToTopAriaLabel={t('helpCenter.backToTop')}
            pinActionAriaLabel={t('helpCenter.pinAction')}
            unpinActionAriaLabel={t('helpCenter.unpinAction')}
            verifyActionAriaLabel={t('helpCenter.verifyAction')}
            showLoadMore={canLoadMore}
            onEmptyStateAction={handleOpenRequestOrganizationSheet}
            onRetry={handleRetryOrganizations}
            onLoadMore={handleLoadMore}
            onActivateOrganizationAction={handleActivateOrganizationAction}
            onTogglePinnedOrganization={handleTogglePinnedOrganization}
          />
        </div>
      </section>

      <HelpCenterFiltersSheet
        key={isFilterOpen ? 'open' : 'closed'}
        open={isFilterOpen}
        title={t('helpCenter.filtersTitle')}
        closeAriaLabel={t('helpCenter.filtersClose')}
        showMoreLabel={() => t('helpCenter.filtersShowMore')}
        secondaryActionLabel={t('helpCenter.filtersReset')}
        primaryActionLabel={t('helpCenter.filtersApplyCount', {
          count: draftOrganizationsCount,
        })}
        sections={filterSections}
        selectedValues={draftFilters}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelFilters();
            return;
          }

          setIsFilterOpen(true);
        }}
        onToggleOption={handleToggleFilterOption}
        onSecondaryAction={handleClearFilters}
        onPrimaryAction={handleApplyFilters}
      />

      <PinnedOrganizationsSheet
        open={isPinnedOrganizationsSheetOpen}
        title={t('helpCenter.pinnedOrganizationsTitle')}
        description={t('helpCenter.pinnedOrganizationsDescription', {
          count: maxPinnedOrganizations,
        })}
        closeAriaLabel={t('helpCenter.pinnedOrganizationsClose')}
        cancelLabel={t('helpCenter.pinnedOrganizationsCancel')}
        replaceLabel={t('helpCenter.pinnedOrganizationsReplace')}
        replaceAriaLabel={(organizationTitle) =>
          t('helpCenter.pinnedOrganizationsReplaceAriaLabel', {
            organization: organizationTitle,
          })
        }
        pinnedOrganizations={pinnedOrganizations}
        onOpenChange={(open) => {
          if (!open) {
            handleClosePinnedOrganizationsSheet();
            return;
          }

          setIsPinnedOrganizationsSheetOpen(true);
        }}
        onCancel={handleClosePinnedOrganizationsSheet}
        onReplace={handleReplacePinnedOrganization}
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
