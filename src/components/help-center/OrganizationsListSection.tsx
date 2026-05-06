import { Button } from '../ui/Button';
import { SearchEmptyState } from '../ui/SearchEmptyState';
import { ServiceCard } from '../ui/ServiceCard';
import { helpCenterIcons } from './helpCenter.icons';
import { SectorIcon } from './sectorIcons';
import type { HelpCenterOrganizationViewModel } from './helpCenter.types';

interface OrganizationsListSectionProps {
  organizations: HelpCenterOrganizationViewModel[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  loadingLabel: string;
  errorTitle: string;
  errorDescription: string;
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
  mapActionLabel: string;
  mapActionAriaLabel: string;
  showLoadMore: boolean;
  onEmptyStateAction: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
  onActivateOrganizationAction: (organizationId: string) => void;
  onOpenMap: (mapUrl: string) => void;
  onTogglePinnedOrganization: (organizationId: string) => void;
}

export function OrganizationsListSection({
  organizations,
  isLoading,
  isLoadingMore,
  hasError,
  loadingLabel,
  errorTitle,
  errorDescription,
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
  mapActionLabel,
  mapActionAriaLabel,
  showLoadMore,
  onEmptyStateAction,
  onRetry,
  onLoadMore,
  onActivateOrganizationAction,
  onOpenMap,
  onTogglePinnedOrganization,
}: OrganizationsListSectionProps) {
  const PhoneIcon = helpCenterIcons.phone;
  const WhatsappIcon = helpCenterIcons.whatsapp;
  const MailIcon = helpCenterIcons.mail;
  const MapButtonIcon = helpCenterIcons.map;
  const ChevronDownIcon = helpCenterIcons.chevronDown;
  const ArrowUpIcon = helpCenterIcons.arrowUp;
  void unpinActionAriaLabel;
  void pinActionAriaLabel;
  void verifyActionAriaLabel;
  void onTogglePinnedOrganization;

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
        <div className="flex w-full flex-col items-center gap-12 py-32 text-center">
          <div className="flex w-full max-w-full flex-col items-center gap-4">
            <h3 className="text-sm font-weight-medium text-text-black">
              {errorTitle}
            </h3>
            <p className="text-xs font-weight-regular text-solid-black-400">
              {errorDescription}
            </p>
          </div>
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
          const ActionIcon =
            item.primaryActionType === 'whatsapp'
              ? WhatsappIcon
              : item.primaryActionType === 'email'
                ? MailIcon
                : PhoneIcon;
          return (
            <ServiceCard
              key={item.id}
              title={item.title}
              category={item.category}
              description={item.description}
              locations={item.locations}
              actionLabel={item.primaryActionLabel}
              actionIcon={
                item.primaryActionDisabled ? undefined : <ActionIcon />
              }
              actionVariant={
                item.primaryActionType === 'whatsapp' ? 'success' : 'filled'
              }
              actionDisabled={item.primaryActionDisabled}
              onActionClick={
                item.primaryActionDisabled
                  ? undefined
                  : () => onActivateOrganizationAction(item.id)
              }
              timeLabel={item.timeLabel || undefined}
              categoryIcon={<SectorIcon sector={item.category} />}
              secondaryButton={
                item.mapUrl
                  ? {
                      label: mapActionLabel,
                      ariaLabel: mapActionAriaLabel,
                      icon: <MapButtonIcon />,
                      onClick: () => onOpenMap(item.mapUrl!),
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
