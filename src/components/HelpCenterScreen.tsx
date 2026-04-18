import { useToast } from '../hooks/useToast';
import { EmergencyHotlinesSection } from './help-center/EmergencyHotlinesSection';
import { HelpCenterHeaderActions } from './help-center/HelpCenterHeaderActions';
import { HelpCenterSearchBar } from './help-center/HelpCenterSearchBar';
import { OrganizationsListSection } from './help-center/OrganizationsListSection';
import type { HelpCenterScreenProps } from './help-center/helpCenter.types';
import { useHelpCenterScreenState } from './help-center/useHelpCenterScreenState';
import { HelpCenterFiltersSheet } from './ui/HelpCenterFiltersSheet';
import { PinnedOrganizationsSheet } from './ui/PinnedOrganizationsSheet';
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
    maxPinnedOrganizations,
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
  } = useHelpCenterScreenState();

  const resultsLabel =
    hasActiveQuery && !hasSearchResults
      ? `0 ${t('helpCenter.organizationLabel')}`
      : `${visibleOrganizations.length} / ${organizations.length} ${t(
          'helpCenter.organizationLabel'
        )}`;

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

        <div className="mx-auto flex w-full flex-col gap-22 px-16 pt-12">
          <EmergencyHotlinesSection
            title={t('helpCenter.emergencyTitle')}
            hotlines={hotlines}
          />

          <HelpCenterSearchBar
            query={query}
            placeholder={t('helpCenter.searchPlaceholder')}
            filterAriaLabel={t('helpCenter.openFilters')}
            appliedFiltersCount={appliedFiltersCount}
            resultsLabel={resultsLabel}
            onQueryChange={handleQueryChange}
            onOpenFilters={handleOpenFilters}
          />

          <OrganizationsListSection
            organizations={visibleOrganizations}
            hasActiveQuery={hasActiveQuery}
            hasSearchResults={hasSearchResults}
            emptyStateTitle={t('helpCenter.emptyStateTitle')}
            emptyStateDescription={t('helpCenter.emptyStateDescription', {
              query: trimmedQuery,
            })}
            emptyStateActionLabel={t('helpCenter.emptyStateAction')}
            emptyStateActionAriaLabel={t(
              'helpCenter.emptyStateActionAriaLabel'
            )}
            loadMoreLabel={t('helpCenter.loadMore', {
              count: organizations.length - visibleCount,
            })}
            backToTopAriaLabel={t('helpCenter.backToTop')}
            pinActionAriaLabel={t('helpCenter.pinAction')}
            unpinActionAriaLabel={t('helpCenter.unpinAction')}
            verifyActionAriaLabel={t('helpCenter.verifyAction')}
            showLoadMore={organizations.length > visibleCount}
            onEmptyStateAction={() =>
              addToast({
                heading: t('helpCenter.emptyStateToastHeading'),
                body: t('helpCenter.emptyStateToastBody'),
              })
            }
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
          count: draftOrganizations.length,
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
    </>
  );
}
