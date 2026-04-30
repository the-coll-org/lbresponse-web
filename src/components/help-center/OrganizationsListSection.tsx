import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { SearchEmptyState } from '../ui/SearchEmptyState';
import { ServiceCard } from '../ui/ServiceCard';
import { helpCenterIcons } from './helpCenter.icons';

interface OrganizationCardViewModel {
  id: string;
  title: string;
  category: string;
  description: string;
  locations: string;
  actionLabel: string;
  actionDisabled: boolean;
  actionType: 'phone' | 'email';
  actionValue: string;
  verified: boolean;
  isPinned: boolean;
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
  backToTopAriaLabel: string;
  pinActionAriaLabel: string;
  unpinActionAriaLabel: string;
  verifyActionAriaLabel: string;
  showLoadMore: boolean;
  onEmptyStateAction: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onActivateOrganizationAction: (organizationId: string) => void;
  onTogglePinnedOrganization: (organizationId: string) => void;
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
  pinActionAriaLabel,
  unpinActionAriaLabel,
  verifyActionAriaLabel,
  showLoadMore,
  onEmptyStateAction,
  onRetry,
  onLoadMore,
  onActivateOrganizationAction,
  onTogglePinnedOrganization,
}: OrganizationsListSectionProps) {
  const PhoneIcon = helpCenterIcons.phone;
  const WhatsappIcon = helpCenterIcons.whatsapp;
  const VerifyIcon = helpCenterIcons.verify;
  const ChevronDownIcon = helpCenterIcons.chevronDown;
  const ArrowUpIcon = helpCenterIcons.arrowUp;

  if (isLoading) {
    return (
      <section className="relative flex flex-col gap-12">
        <div className="flex min-h-160 items-center justify-center rounded-lg border border-textfield-default-stroke bg-surface-primary p-16 text-sm font-weight-medium text-text-black">
          {loadingLabel}
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
        {organizations.map((item) => {
          const PinIcon = item.isPinned
            ? helpCenterIcons.pinFilled
            : helpCenterIcons.pin;

          return (
            <ServiceCard
              key={item.id}
              title={item.title}
              category={item.category}
              description={item.description}
              locations={item.locations}
              actionLabel={item.actionLabel}
              actionIcon={
                item.actionDisabled ? undefined : item.actionType ===
                  'phone' ? (
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
              primaryAction={{
                ariaLabel: item.isPinned
                  ? unpinActionAriaLabel
                  : pinActionAriaLabel,
                icon: <PinIcon />,
                onClick: () => onTogglePinnedOrganization(item.id),
                variant: item.isPinned ? 'filled' : 'soft',
                iconClassName: item.isPinned
                  ? 'scale-110 rotate-12 text-button-filled-text transition-transform duration-200 ease-out'
                  : 'text-button-icon-icon transition-transform duration-200 ease-out',
              }}
              secondaryAction={
                item.verified
                  ? {
                      ariaLabel: verifyActionAriaLabel,
                      icon: <VerifyIcon />,
                      variant: 'outline',
                    }
                  : undefined
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
