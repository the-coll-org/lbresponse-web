import { SectorIcon } from './sectorIcons';
import type { FindHelpFilterOption } from './findHelpAdapter';

interface FindHelpNeedChipsProps {
  ariaLabel: string;
  options: FindHelpFilterOption[];
  selectedIds: string[];
  onToggle: (optionId: string) => void;
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

export function FindHelpNeedChips({
  ariaLabel,
  options,
  selectedIds,
  onToggle,
}: FindHelpNeedChipsProps) {
  if (options.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex w-full gap-8 overflow-x-auto whitespace-nowrap py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => {
        const isActive = selectedIds.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(option.id)}
            className={[
              'inline-flex h-36 shrink-0 items-center gap-8 rounded-full border px-16',
              'text-button font-weight-medium transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
              isActive
                ? 'border-findhelp-primary bg-findhelp-primary text-solid-white-400'
                : 'border-findhelp-border-subtle bg-surface-primary text-text-black',
            ].join(' ')}
          >
            <span
              className={[
                'flex size-16 items-center justify-center',
                isActive ? 'text-solid-white-400' : 'text-findhelp-primary',
              ].join(' ')}
              aria-hidden="true"
            >
              {isActive ? <CheckIcon /> : <SectorIcon sector={option.id} />}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
