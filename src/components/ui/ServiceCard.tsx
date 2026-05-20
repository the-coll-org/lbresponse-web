import {
  useState,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { LocationsRow } from './LocationsRow';
import { SvgIcon } from './SvgIcon';
import locationSvg from '../../assets/help-center/location.svg?raw';

export interface ServiceCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: ReactNode;
  category?: ReactNode;
  description?: ReactNode;
  /** Legacy: renders the value directly as ReactNode. Ignored when `locationsArray` is set. */
  locations?: ReactNode;
  /** When provided, renders locations with overflow tooltip / bottom-drawer behaviour. */
  locationsArray?: string[];
  /** Formats the "+N more" overflow badge label. Receives the overflow count. */
  moreLocationsLabel?: (count: number) => string;
  /** Title shown in the bottom drawer (typically the org name). */
  locationsDialogTitle?: string;
  /** Label for the drawer close button. */
  locationsDialogCloseLabel?: string;
  actionLabel: ReactNode;
  actionIcon?: ReactNode;
  actionVariant?: 'filled' | 'success';
  actionDisabled?: boolean;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
}

// Matches Figma: border-radius: 16px; outline: 1px stroke-primary; outline-offset: -1px; padding: 12px
const CARD_BASE = [
  'w-full rounded-lg border border-textfield-default-stroke',
  'bg-surface-primary p-12 overflow-hidden',
].join(' ');

const ACTION_VARIANTS = {
  filled: 'bg-button-filled-bg text-button-filled-text',
  success: 'bg-solid-green-whatsapp text-button-filled-text',
} as const;

// Matches Figma shield icon: width: 38px; height: 40px; padding: 4px; border-radius: 8px; outline: 1px stroke-primary
function CardShieldIcon() {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 flex items-center justify-center w-[38px] h-[40px] border border-textfield-default-stroke bg-surface-primary p-4 rounded-md"
    >
      <div className="size-[18px] flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 9.74997C15 13.5 12.375 15.375 9.255 16.4625C9.09162 16.5178 8.91415 16.5152 8.7525 16.455C5.625 15.375 3 13.5 3 9.74997V4.49997C3 4.30106 3.07902 4.11029 3.21967 3.96964C3.36032 3.82899 3.55109 3.74997 3.75 3.74997C5.25 3.74997 7.125 2.84997 8.43 1.70997C8.58889 1.57422 8.79102 1.49963 9 1.49963C9.20898 1.49963 9.41111 1.57422 9.57 1.70997C10.8825 2.85747 12.75 3.74997 14.25 3.74997C14.4489 3.74997 14.6397 3.82899 14.7803 3.96964C14.921 4.11029 15 4.30106 15 4.49997V9.74997Z"
            stroke="#2B272B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// Matches Figma category pill: px-8 py-4; border-radius: 8px; outline: 1px rgba(0,0,0,0.10); font-size: 12px
function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-md border border-black/10 px-8 py-4 text-2xs font-weight-regular text-text-black">
      {children}
    </span>
  );
}

export function ServiceCard({
  title,
  category,
  description,
  locations,
  locationsArray,
  moreLocationsLabel = (n) => `+${n}`,
  locationsDialogTitle = '',
  locationsDialogCloseLabel = 'Close',
  actionLabel,
  actionIcon,
  actionVariant = 'filled',
  actionDisabled = false,
  onActionClick,
  className = '',
  ...props
}: ServiceCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const actionClass = ACTION_VARIANTS[actionVariant];

  const locationRow =
    locationsArray && locationsArray.length > 0 ? (
      <LocationsRow
        locations={locationsArray}
        moreLocationsLabel={moreLocationsLabel}
        onShowAll={() => setDrawerOpen(true)}
      />
    ) : locations ? (
      <div className="flex items-center gap-4">
        <div
          className="flex size-16 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <SvgIcon svg={locationSvg} className="size-16" />
        </div>
        <p className="text-button font-weight-regular text-text-black break-words">
          {locations}
        </p>
      </div>
    ) : null;

  return (
    <>
      <article className={`${CARD_BASE} ${className}`.trim()} {...props}>
        <div className="flex h-full w-full flex-col gap-12">
          <div className="flex w-full items-start gap-12">
            <CardShieldIcon />
            <div className="flex flex-1 flex-col gap-8">
              <div className="flex items-center gap-8">
                <p className="text-sm font-weight-bold text-text-black break-words">
                  {title}
                </p>
                {category && <CategoryPill>{category}</CategoryPill>}
              </div>
              {description && (
                <p className="text-2xs font-weight-regular text-textfield-default-text">
                  {description}
                </p>
              )}
            </div>
          </div>

          {locationRow}

          <Button
            onClick={actionDisabled ? undefined : onActionClick}
            disabled={actionDisabled}
            className={[
              'mt-auto h-[44px] w-full min-h-[37px] max-h-[48px] overflow-hidden',
              actionClass,
            ].join(' ')}
            rightIcon={
              actionIcon ? (
                <div
                  className="flex size-16 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {actionIcon}
                </div>
              ) : undefined
            }
          >
            {actionLabel}
          </Button>
        </div>
      </article>

      {drawerOpen && locationsArray && locationsArray.length > 0 && (
        <BottomSheet
          open={drawerOpen}
          title={locationsDialogTitle}
          onOpenChange={setDrawerOpen}
          closeAriaLabel={locationsDialogCloseLabel}
          footer={
            <div className="flex w-full flex-col pt-16">
              <div className="w-full border-t border-solid-black-300" />
              <div className="px-16 pb-24 pt-12">
                <Button
                  variant="tonal"
                  className="h-48 w-full justify-center"
                  onClick={() => setDrawerOpen(false)}
                >
                  {locationsDialogCloseLabel}
                </Button>
              </div>
            </div>
          }
        >
          <div className="pb-24 pt-4">
            <div className={CARD_BASE}>
              <div className="flex h-full w-full flex-col gap-12">
                <div className="flex w-full items-start gap-12">
                  <CardShieldIcon />
                  <div className="flex flex-1 flex-col gap-8">
                    <div className="flex items-center gap-8">
                      <p className="text-sm font-weight-bold text-text-black break-words">
                        {title}
                      </p>
                      {category && <CategoryPill>{category}</CategoryPill>}
                    </div>
                    {description && (
                      <p className="text-2xs font-weight-regular text-textfield-default-text">
                        {description}
                      </p>
                    )}
                  </div>
                </div>

                {/* All locations side by side */}
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="flex size-16 shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <SvgIcon svg={locationSvg} className="size-16" />
                  </div>
                  <p className="text-button font-weight-regular text-text-black">
                    {locationsArray.join('، ')}
                  </p>
                </div>

                <Button
                  onClick={actionDisabled ? undefined : onActionClick}
                  disabled={actionDisabled}
                  className={[
                    'mt-auto h-[44px] w-full min-h-[37px] max-h-[48px] overflow-hidden',
                    actionClass,
                  ].join(' ')}
                  rightIcon={
                    actionIcon ? (
                      <div
                        className="flex size-16 shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        {actionIcon}
                      </div>
                    ) : undefined
                  }
                >
                  {actionLabel}
                </Button>
              </div>
            </div>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
