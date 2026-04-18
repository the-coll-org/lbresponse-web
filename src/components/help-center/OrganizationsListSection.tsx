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
  actionType: 'phone' | 'whatsapp';
  isPinned: boolean;
}

interface OrganizationsListSectionProps {
  organizations: OrganizationCardViewModel[];
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
  onLoadMore: () => void;
  onTogglePinnedOrganization: (organizationId: string) => void;
}

export function OrganizationsListSection({
  organizations,
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
  onLoadMore,
  onTogglePinnedOrganization,
}: OrganizationsListSectionProps) {
  const PhoneIcon = helpCenterIcons.phone;
  const ChatIcon = helpCenterIcons.chat;
  const VerifyIcon = helpCenterIcons.verify;
  const ChevronDownIcon = helpCenterIcons.chevronDown;
  const ArrowUpIcon = helpCenterIcons.arrowUp;

  return (
    <section className="relative flex flex-col gap-12">
      {hasActiveQuery && !hasSearchResults ? (
        <SearchEmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
          actionLabel={emptyStateActionLabel}
          actionAriaLabel={emptyStateActionAriaLabel}
          onAction={onEmptyStateAction}
        />
      ) : (
        <>
          {organizations.map((item) =>
            (() => {
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
                    item.actionType === 'phone' ? <PhoneIcon /> : <ChatIcon />
                  }
                  actionVariant={
                    item.actionType === 'phone' ? 'filled' : 'success'
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
                  secondaryAction={{
                    ariaLabel: verifyActionAriaLabel,
                    icon: <VerifyIcon />,
                    variant: 'outline',
                  }}
                />
              );
            })()
          )}

          {showLoadMore && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onLoadMore}
                className="inline-flex h-44 items-center justify-center gap-8 rounded-md px-16 py-8 text-button font-weight-medium text-text-black"
              >
                <span>{loadMoreLabel}</span>
                <ChevronDownIcon />
              </button>
            </div>
          )}

          {hasSearchResults && (
            <button
              type="button"
              aria-label={backToTopAriaLabel}
              className="absolute bottom-48 end-0 flex size-48 items-center justify-center rounded-full border border-textfield-default-stroke bg-button-icon-bg text-button-icon-icon shadow-2xs"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUpIcon />
            </button>
          )}
        </>
      )}
    </section>
  );
}
