import { BottomSheet } from '../ui/BottomSheet';
import { SectorIcon } from './sectorIcons';
import type { FindHelpListingViewModel } from './findHelpAdapter';

interface FindHelpDetailModalProps {
  open: boolean;
  item: FindHelpListingViewModel | null;
  copy: {
    closeAriaLabel: string;
    confidentialBanner: string;
    coverageTitle: string;
    contactTitle: string;
    contactHint: string;
    offeredTitle: string;
    updatedBy: (time: string, org: string) => string;
    updatedNoOrg: (time: string) => string;
    reportProblem: string;
    callLabel: string;
    directionsLabel: string;
    shareLabel: string;
    shareCopiedHeading: string;
    shareCopiedBody: string;
    verifiedLabel: string;
  };
  onOpenChange: (open: boolean) => void;
  onPrimaryAction: (item: FindHelpListingViewModel) => void;
  onOpenMap: (mapUrl: string) => void;
  onShare: (item: FindHelpListingViewModel) => void;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-12"
      aria-hidden="true"
    >
      <path d="m4.5 12.5 4 4L20 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14 shrink-0"
      aria-hidden="true"
    >
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14"
      aria-hidden="true"
    >
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14"
      aria-hidden="true"
    >
      <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8 11 8-4M8 13l8 4" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14"
      aria-hidden="true"
    >
      <path d="M12 3 3 8l9 5 9-5z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}

function DetailRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid w-full grid-cols-[24px_1fr] gap-12 text-start">
      <div className="pt-2 text-solid-black-400" aria-hidden="true">
        {icon}
      </div>
      <div className="flex w-full flex-col gap-8">
        <span className="text-2xs font-weight-bold uppercase tracking-wide text-solid-black-400">
          {title}
        </span>
        {children}
      </div>
    </div>
  );
}

export function FindHelpDetailModal({
  open,
  item,
  copy,
  onOpenChange,
  onPrimaryAction,
  onOpenMap,
  onShare,
}: FindHelpDetailModalProps) {
  if (!item) return null;
  const stableItem = item;

  return (
    <BottomSheet
      open={open}
      title={stableItem.title}
      closeAriaLabel={copy.closeAriaLabel}
      onOpenChange={onOpenChange}
      footer={
        <div className="flex w-full flex-col items-center gap-12 pt-16">
          <div className="w-full border-t border-solid-black-300" />
          <div className="flex w-full items-stretch gap-8 px-16 pb-24">
            <button
              type="button"
              disabled={stableItem.primaryActionDisabled}
              onClick={() => onPrimaryAction(stableItem)}
              className="inline-flex h-44 flex-1 items-center justify-center gap-8 rounded-md bg-findhelp-primary px-16 text-button font-weight-bold text-solid-white-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
            >
              <PhoneIcon />
              <span className="truncate">{stableItem.primaryActionLabel}</span>
            </button>
            {stableItem.mapUrl && (
              <button
                type="button"
                onClick={() => onOpenMap(stableItem.mapUrl!)}
                className="inline-flex h-44 shrink-0 items-center justify-center gap-8 rounded-md border border-findhelp-border-subtle bg-surface-primary px-12 text-button font-weight-medium text-text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
              >
                <MapPinIcon />
                <span>{copy.directionsLabel}</span>
              </button>
            )}
            <button
              type="button"
              aria-label={copy.shareLabel}
              onClick={() => onShare(stableItem)}
              className="inline-flex size-44 shrink-0 items-center justify-center rounded-md border border-findhelp-border-subtle bg-surface-primary text-text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
            >
              <ShareIcon />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex w-full flex-col gap-22 pb-16 text-start">
        <div className="flex w-full items-start gap-12">
          <span
            className="flex size-40 shrink-0 items-center justify-center rounded-md bg-findhelp-primary-soft text-findhelp-primary"
            aria-hidden="true"
          >
            <span className="size-20">
              <SectorIcon sector={stableItem.sectorId ?? ''} />
            </span>
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-8">
              <span className="rounded-md bg-findhelp-primary-soft px-8 py-2 text-2xs font-weight-bold text-findhelp-primary-ink">
                {stableItem.sectorLabel}
              </span>
              {stableItem.verified && (
                <span className="inline-flex items-center gap-4 text-2xs font-weight-bold text-findhelp-success">
                  <CheckIcon />
                  <span>{copy.verifiedLabel}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {stableItem.confidential && (
          <div className="flex items-start gap-8 rounded-md bg-findhelp-success-soft p-12 text-2xs font-weight-medium text-findhelp-success">
            <ShieldIcon />
            <span>{copy.confidentialBanner}</span>
          </div>
        )}

        {stableItem.locations.length > 0 && (
          <DetailRow icon={<MapPinIcon />} title={copy.coverageTitle}>
            <div className="flex flex-wrap gap-4">
              {stableItem.locations.map((location) => (
                <span
                  key={location}
                  className="inline-block rounded-md bg-surface-muted px-8 py-4 text-2xs font-weight-medium text-text-black"
                >
                  {location}
                </span>
              ))}
            </div>
          </DetailRow>
        )}

        {(stableItem.phoneDisplay ||
          stableItem.whatsappDisplay ||
          stableItem.emailDisplay) && (
          <DetailRow icon={<PhoneIcon />} title={copy.contactTitle}>
            <div className="flex w-full flex-col gap-4">
              {stableItem.phoneDisplay && (
                <span
                  dir="ltr"
                  className="text-button font-weight-bold text-text-black"
                >
                  {stableItem.phoneDisplay}
                </span>
              )}
              {stableItem.whatsappDisplay && (
                <span
                  dir="ltr"
                  className="text-button font-weight-medium text-text-black"
                >
                  {stableItem.whatsappDisplay}
                </span>
              )}
              {stableItem.emailDisplay && (
                <a
                  href={`mailto:${stableItem.emailDisplay}`}
                  className="text-button font-weight-medium text-findhelp-primary underline"
                >
                  {stableItem.emailDisplay}
                </a>
              )}
              <span className="text-2xs font-weight-regular text-solid-black-400">
                {copy.contactHint}
              </span>
            </div>
          </DetailRow>
        )}

        {stableItem.offered.length > 0 && (
          <DetailRow icon={<LayersIcon />} title={copy.offeredTitle}>
            <ul className="flex w-full flex-col gap-4 ps-16 text-2xs font-weight-regular text-solid-black-500 [list-style:disc]">
              {stableItem.offered.map((entry) => (
                <li key={entry.key}>{entry.label}</li>
              ))}
            </ul>
          </DetailRow>
        )}

        <div className="flex w-full items-center gap-8 border-t border-findhelp-border-subtle pt-12 text-2xs font-weight-regular text-solid-black-400">
          <span
            aria-hidden="true"
            className="inline-block size-8 rounded-full bg-findhelp-success"
          />
          <span>
            {stableItem.organizationShortName
              ? copy.updatedBy(
                  stableItem.updatedRelative,
                  stableItem.organizationShortName
                )
              : copy.updatedNoOrg(stableItem.updatedRelative)}
          </span>
          {stableItem.emailDisplay && (
            <a
              href={`mailto:${stableItem.emailDisplay}`}
              className="ms-auto text-2xs font-weight-medium text-findhelp-primary underline"
            >
              {copy.reportProblem}
            </a>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
