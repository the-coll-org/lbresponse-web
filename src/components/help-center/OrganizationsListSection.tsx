import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { SearchEmptyState } from '../ui/SearchEmptyState';
import { ServiceCard } from '../ui/ServiceCard';
import { ServiceCardSkeleton } from '../ui/ServiceCardSkeleton';
import { helpCenterIcons } from './helpCenter.icons';
import type { HelpCenterOrganizationViewModel } from './helpCenter.types';

interface OrganizationsListSectionProps {
  organizations: HelpCenterOrganizationViewModel[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
  hasActiveQuery: boolean;
  hasSearchResults: boolean;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateActionLabel: string;
  emptyStateActionAriaLabel: string;
  loadMoreLabel: string;
  backToTopAriaLabel: string;
  showLoadMore: boolean;
  onEmptyStateAction: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onActivateOrganizationAction: (organizationId: string) => void;
}

export function OrganizationsListSection({
  organizations,
  isLoading,
  isLoadingMore,
  hasError,
  loadingLabel,
  errorLabel,
  retryLabel,
  hasActiveQuery,
  hasSearchResults,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateActionLabel,
  emptyStateActionAriaLabel,
  loadMoreLabel,
  backToTopAriaLabel,
  showLoadMore,
  onEmptyStateAction,
  onRetry,
  onLoadMore,
  onActivateOrganizationAction,
}: OrganizationsListSectionProps) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.resolvedLanguage ?? i18n.language ?? 'ar').startsWith(
    'ar'
  );
  const Shield18Icon = helpCenterIcons.shield18;
  const PhoneIcon = helpCenterIcons.phone;
  const MailIcon = helpCenterIcons.mail;
  const ChevronDownIcon = helpCenterIcons.chevronDown;
  const ArrowUpIcon = helpCenterIcons.arrowUp;

  if (isLoading) {
    return (
      <section className="relative flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="relative flex flex-col gap-12">
        <div className="flex w-full flex-col items-center gap-12 py-32 text-center">
          <p className="text-sm font-weight-medium text-text-black">
            {errorLabel}
          </p>
          <Button className="h-44 justify-center" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      </section>
    );
  }

  if (hasActiveQuery && !hasSearchResults) {
    return (
      <section className="relative flex flex-col gap-12">
        <SearchEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
          actionLabel={emptyStateActionLabel}
          actionAriaLabel={emptyStateActionAriaLabel}
          onAction={onEmptyStateAction}
        />
      </section>
    );
  }

  if (!hasSearchResults) {
    return (
      <section className="relative flex flex-col gap-12">
        <SearchEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
        />
      </section>
    );
  }

  return (
    <section className="relative flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
        {organizations.map((item) => {
          const ActionIcon = item.actionType === 'email' ? MailIcon : PhoneIcon;
          return (
            <ServiceCard
              key={item.id}
              title={item.title}
              category={item.category}
              description={item.description}
              locationsArray={item.locations ? [item.locations] : []}
              moreLocationsLabel={(count: number) =>
                isArabic ? `+${count} أخرى` : `+${count} more`
              }
              locationsDialogTitle={item.title}
              locationsDialogCloseLabel={isArabic ? 'إغلاق' : 'Close'}
              categoryIcon={<Shield18Icon />}
              actionLabel={item.actionLabel}
              actionIcon={item.actionDisabled ? undefined : <ActionIcon />}
              actionVariant="filled"
              actionDisabled={item.actionDisabled}
              onActionClick={
                item.actionDisabled
                  ? undefined
                  : () => onActivateOrganizationAction(item.id)
              }
            />
          );
        })}
      </div>

      {showLoadMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex h-44 items-center justify-center gap-8 rounded-md px-16 py-8 text-button font-weight-medium text-text-black disabled:opacity-40"
          >
            <span>{isLoadingMore ? loadingLabel : loadMoreLabel}</span>
            {!isLoadingMore && <ChevronDownIcon />}
          </button>
        </div>
      )}

      <button
        type="button"
        aria-label={backToTopAriaLabel}
        className="fixed bottom-24 end-24 z-10 flex size-48 items-center justify-center rounded-full border border-textfield-default-stroke bg-button-icon-bg text-button-icon-icon shadow-md"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpIcon />
      </button>
    </section>
  );
}
