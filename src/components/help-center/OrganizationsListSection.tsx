import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { SearchEmptyState } from '../ui/SearchEmptyState';
import { ServiceCard } from '../ui/ServiceCard';
import { ServiceCardSkeleton } from '../ui/ServiceCardSkeleton';
import { helpCenterIcons } from './helpCenter.icons';

interface OrganizationCardViewModel {
  id: string;
  title: string;
  category: string;
  description: string;
  locations: string[];
  actionLabel: string;
  actionDisabled: boolean;
  actionType: 'phone' | 'email';
  actionValue: string;
}

interface OrganizationsListSectionProps {
  organizations: OrganizationCardViewModel[];
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
  showLoadMore: boolean;
  moreLocationsLabel: (count: number) => string;
  locationsDialogCloseLabel: string;
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
  showLoadMore,
  moreLocationsLabel,
  locationsDialogCloseLabel,
  onEmptyStateAction,
  onRetry,
  onLoadMore,
  onActivateOrganizationAction,
}: OrganizationsListSectionProps) {
  const PhoneIcon = helpCenterIcons.phone;
  const WhatsappIcon = helpCenterIcons.whatsapp;
  const ChevronDownIcon = helpCenterIcons.chevronDown;

  if (isLoading) {
    return (
      <section className="relative flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
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
        <Alert
          variant="error"
          heading={errorLabel}
          action={
            <Button variant="text" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          }
        />
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
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
        {organizations.map((item) => (
          <ServiceCard
            key={item.id}
            title={item.title}
            category={item.category}
            description={item.description}
            locationsArray={item.locations}
            moreLocationsLabel={moreLocationsLabel}
            locationsDialogTitle={item.title}
            locationsDialogCloseLabel={locationsDialogCloseLabel}
            actionLabel={item.actionLabel}
            actionIcon={
              item.actionDisabled ? undefined : item.actionType === 'phone' ? (
                <PhoneIcon />
              ) : (
                <WhatsappIcon />
              )
            }
            actionVariant={item.actionType === 'phone' ? 'filled' : 'success'}
            actionDisabled={item.actionDisabled}
            onActionClick={
              item.actionDisabled
                ? undefined
                : () => onActivateOrganizationAction(item.id)
            }
          />
        ))}
      </div>

      {showLoadMore && (
        <div className="flex justify-center">
          <Button
            variant="text"
            size="md"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            rightIcon={!isLoadingMore ? <ChevronDownIcon /> : undefined}
            className="h-44 text-text-black"
          >
            {isLoadingMore ? loadingLabel : loadMoreLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
