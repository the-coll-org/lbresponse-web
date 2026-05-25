import type { ReactNode } from 'react';

export interface HelpCenterFilterChip {
  id: string;
  label: string;
  icon?: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

interface HelpCenterFilterChipsProps {
  chips: HelpCenterFilterChip[];
  ariaLabel: string;
  className?: string;
}

export function HelpCenterFilterChips({
  chips,
  ariaLabel,
  className = '',
}: HelpCenterFilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex w-full gap-8 overflow-x-auto whitespace-nowrap pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`.trim()}
    >
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          aria-pressed={chip.isActive}
          onClick={chip.onClick}
          className={[
            'inline-flex shrink-0 items-center gap-8 rounded-md px-12 py-8',
            'text-button font-weight-bold transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-solid-primary-500',
            chip.isActive
              ? 'border border-transparent bg-button-filled-bg text-button-filled-text'
              : 'border border-textfield-default-stroke bg-surface-primary text-text-black',
          ].join(' ')}
        >
          {chip.icon && (
            <span
              className="flex size-16 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              {chip.icon}
            </span>
          )}
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  );
}
