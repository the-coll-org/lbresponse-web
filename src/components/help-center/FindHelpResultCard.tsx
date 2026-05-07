import type { KeyboardEvent, MouseEvent } from 'react';
import { SectorIcon } from './sectorIcons';
import type { FindHelpListingViewModel } from './findHelpAdapter';

interface FindHelpResultCardProps {
  item: FindHelpListingViewModel;
  verifiedLabel: string;
  detailsLabel: string;
  confidentialLabel: string;
  cardAriaLabel: string;
  onOpenDetail: (item: FindHelpListingViewModel, trigger: HTMLElement) => void;
  onPrimaryAction: (item: FindHelpListingViewModel) => void;
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

function MapPinIcon() {
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

function MailIcon() {
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
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

function WhatsappIcon() {
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

function ChevronEndIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14 shrink-0 rtl:-scale-x-100"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
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

export function FindHelpResultCard({
  item,
  verifiedLabel,
  detailsLabel,
  confidentialLabel,
  cardAriaLabel,
  onOpenDetail,
  onPrimaryAction,
}: FindHelpResultCardProps) {
  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    onOpenDetail(item, event.currentTarget);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenDetail(item, event.currentTarget);
    }
  };

  const stop = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleCallClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!item.primaryActionDisabled) {
      onPrimaryAction(item);
    }
  };

  const handleDetailsClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpenDetail(item, event.currentTarget);
  };

  const visibleAreas = item.locations.slice(0, 2);
  const extraAreaCount = Math.max(
    item.locations.length - visibleAreas.length,
    0
  );
  const locationsText =
    visibleAreas.join(', ') +
    (extraAreaCount > 0 ? ` +${extraAreaCount.toString()}` : '');

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={cardAriaLabel}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className={[
        'flex w-full cursor-pointer flex-col gap-12 rounded-xl border border-findhelp-border-subtle bg-surface-primary p-14 md:p-18',
        'transition-colors hover:border-findhelp-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
      ].join(' ')}
    >
      <div className="flex w-full flex-wrap items-center gap-8">
        <span className="inline-flex items-center gap-4 rounded-md bg-findhelp-primary-soft px-8 py-4 text-2xs font-weight-bold text-findhelp-primary-ink">
          <span
            className="flex size-12 items-center justify-center"
            aria-hidden="true"
          >
            <SectorIcon sector={item.sectorId ?? ''} />
          </span>
          <span>{item.sectorLabel}</span>
        </span>
        {item.verified && (
          <span className="inline-flex items-center gap-4 text-2xs font-weight-bold text-findhelp-success">
            <CheckIcon />
            <span>{verifiedLabel}</span>
          </span>
        )}
        <span className="ms-auto text-solid-black-400">
          <ChevronEndIcon />
        </span>
      </div>

      <div className="flex w-full flex-col gap-4 text-start">
        <p className="text-sm font-weight-bold leading-snug text-text-black md:text-md">
          {item.serviceHeadline}
        </p>
        {item.orgSecondaryName && (
          <p className="text-2xs font-weight-medium text-solid-black-500">
            {item.orgSecondaryName}
          </p>
        )}
      </div>

      {locationsText && (
        <div className="flex w-full items-start gap-8 text-2xs font-weight-regular text-solid-black-500">
          <MapPinIcon />
          <span className="leading-snug">{locationsText}</span>
        </div>
      )}

      {item.confidential && (
        <div className="inline-flex items-center gap-8 rounded-md bg-findhelp-success-soft px-8 py-4 text-2xs font-weight-medium text-findhelp-success">
          <ShieldIcon />
          <span>{confidentialLabel}</span>
        </div>
      )}

      <div className="mt-auto flex w-full items-stretch gap-8" onClick={stop}>
        <button
          type="button"
          disabled={item.contact.disabled}
          onClick={handleCallClick}
          className={[
            'inline-flex h-44 flex-1 items-center justify-center gap-8 rounded-md bg-findhelp-primary px-12 text-button font-weight-bold text-solid-white-400',
            'disabled:cursor-not-allowed disabled:opacity-40',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
          ].join(' ')}
        >
          {item.contact.kind === 'email' ? (
            <MailIcon />
          ) : item.contact.kind === 'whatsapp' ? (
            <WhatsappIcon />
          ) : (
            <PhoneIcon />
          )}
          <span className="truncate">{item.contact.label}</span>
        </button>
        <button
          type="button"
          onClick={handleDetailsClick}
          className="inline-flex h-44 shrink-0 items-center justify-center gap-8 rounded-md border border-findhelp-border-subtle bg-surface-primary px-12 text-button font-weight-medium text-text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
        >
          <LayersIcon />
          <span>{detailsLabel}</span>
        </button>
      </div>
    </article>
  );
}
