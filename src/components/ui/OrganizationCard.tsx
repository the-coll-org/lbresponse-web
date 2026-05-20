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

export interface OrganizationCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** Relative time label e.g. "منذ 5 دقائق" */
  updatedAt?: ReactNode;
  title: ReactNode;
  /** Category pill label e.g. "مأوى وسكن" */
  category?: ReactNode;
  /** Service-type icon rendered inside the bordered icon box */
  serviceIcon?: ReactNode;
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
  /** When provided, renders the secondary tonal map button */
  mapLabel?: ReactNode;
  onMapClick?: MouseEventHandler<HTMLButtonElement>;
  actionLabel: ReactNode;
  actionIcon?: ReactNode;
  actionVariant?: 'filled' | 'success';
  actionDisabled?: boolean;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l2.5 2.5" />
    </svg>
  );
}

function MapRouteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7l6-4 6 4 6-4v14l-6 4-6-4-6 4V7z" />
      <path d="M9 3v14M15 7v14" />
    </svg>
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

// Matches Figma icon box: 38×40px; border-radius: 8px; outline: 1px stroke-primary; p-4
function ServiceIconBox({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 flex items-center justify-center w-[38px] h-[40px] border border-textfield-default-stroke bg-surface-primary p-4 rounded-md"
    >
      <span className="size-[18px] flex items-center justify-center text-text-black">
        {children}
      </span>
    </div>
  );
}

const ACTION_VARIANTS = {
  filled: 'bg-button-filled-bg text-button-filled-text',
  success: 'bg-solid-green-whatsapp text-button-filled-text',
} as const;

const CARD_BASE = [
  'w-full rounded-lg border border-textfield-default-stroke',
  'bg-surface-primary p-12 overflow-hidden',
].join(' ');

export function OrganizationCard({
  updatedAt,
  title,
  category,
  serviceIcon,
  description,
  locations,
  locationsArray,
  moreLocationsLabel = (n) => `+${n}`,
  locationsDialogTitle = '',
  locationsDialogCloseLabel = 'Close',
  mapLabel,
  onMapClick,
  actionLabel,
  actionIcon,
  actionVariant = 'filled',
  actionDisabled = false,
  onActionClick,
  className = '',
  ...props
}: OrganizationCardProps) {
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

  const actionButtons = (
    <div className="flex items-center gap-12">
      <Button
        onClick={actionDisabled ? undefined : onActionClick}
        disabled={actionDisabled}
        className={[
          'flex-1 h-[44px] min-h-[37px] max-h-[48px] overflow-hidden',
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

      {mapLabel && (
        <Button
          variant="tonal"
          onClick={onMapClick}
          className="shrink-0 h-[44px] min-h-[37px] max-h-[48px]"
          leftIcon={<MapRouteIcon />}
        >
          {mapLabel}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <article className={[CARD_BASE, className].join(' ').trim()} {...props}>
        <div className="flex flex-col gap-12">
          <div className="flex w-full items-start gap-12">
            {serviceIcon && <ServiceIconBox>{serviceIcon}</ServiceIconBox>}

            <div className="flex flex-1 flex-col gap-8">
              <div className="flex items-center gap-8 flex-wrap">
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

            {updatedAt && (
              <div className="flex shrink-0 items-center gap-2 text-2xs font-weight-regular text-textfield-default-text">
                <span className="shrink-0">
                  <ClockIcon />
                </span>
                <span>{updatedAt}</span>
              </div>
            )}
          </div>

          {locationRow}

          {actionButtons}
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
              <div className="flex flex-col gap-12">
                <div className="flex w-full items-start gap-12">
                  {serviceIcon && (
                    <ServiceIconBox>{serviceIcon}</ServiceIconBox>
                  )}

                  <div className="flex flex-1 flex-col gap-8">
                    <div className="flex items-center gap-8 flex-wrap">
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

                  {updatedAt && (
                    <div className="flex shrink-0 items-center gap-2 text-2xs font-weight-regular text-textfield-default-text">
                      <span className="shrink-0">
                        <ClockIcon />
                      </span>
                      <span>{updatedAt}</span>
                    </div>
                  )}
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

                {actionButtons}
              </div>
            </div>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
