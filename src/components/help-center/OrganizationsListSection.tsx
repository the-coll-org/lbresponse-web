import { useEffect, useLayoutEffect, useRef } from 'react';
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
  actionValue: string;
  whatsappMessage: string;
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
  onFitCountChange: (count: number) => void;
  onActivateOrganizationAction: (organizationId: string) => void;
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
  onFitCountChange,
  onActivateOrganizationAction,
  onTogglePinnedOrganization,
}: OrganizationsListSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const fitCountChangeRef = useRef(onFitCountChange);

  useEffect(() => {
    fitCountChangeRef.current = onFitCountChange;
  }, [onFitCountChange]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const computeFit = () => {
      const firstCard = grid.firstElementChild as HTMLElement | null;
      if (!firstCard) return;

      const style = window.getComputedStyle(grid);
      const columns = style.gridTemplateColumns
        .split(' ')
        .filter(Boolean).length;
      const rowGap = parseFloat(style.rowGap) || 0;
      const cardHeight = firstCard.getBoundingClientRect().height;
      if (!cardHeight || !columns) return;

      const gridTop = grid.getBoundingClientRect().top + window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;
      const available = Math.max(viewportBottom - gridTop, cardHeight);
      const rows = Math.max(
        1,
        Math.floor((available + rowGap) / (cardHeight + rowGap))
      );

      fitCountChangeRef.current(columns * rows);
    };

    computeFit();

    const observer = new ResizeObserver(computeFit);
    observer.observe(grid);
    if (grid.firstElementChild) observer.observe(grid.firstElementChild);
    window.addEventListener('resize', computeFit);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', computeFit);
    };
  }, [organizations.length]);

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
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3"
          >
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
                    onActionClick={() => onActivateOrganizationAction(item.id)}
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
          </div>

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
              className="fixed bottom-24 end-24 z-10 flex size-48 items-center justify-center rounded-full border border-textfield-default-stroke bg-button-icon-bg text-button-icon-icon shadow-md"
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
