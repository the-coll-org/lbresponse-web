import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional explicit label. Falls back to `children` when omitted. */
  label?: ReactNode;
  /** Icon rendered before the label in the DOM. In RTL, this appears on the inline-end. */
  leadingIcon?: ReactNode;
  /** Optional non-interactive icon rendered after the label. */
  trailingIcon?: ReactNode;
  /** Renders the built-in clear button when provided. */
  onClear?: () => void;
}

const BASE =
  'inline-flex items-center gap-4 h-[32px] px-[8px] rounded-md border ' +
  'border-solid-black-300 bg-transparent text-solid-black-600 ' +
  'text-button font-weight-medium whitespace-nowrap';

const ICON_SLOT = 'shrink-0 size-[18px] flex items-center justify-center';

function ClearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Tag({
  label,
  leadingIcon,
  trailingIcon,
  onClear,
  className = '',
  children,
  ...props
}: TagProps) {
  const content = label ?? children;

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClear?.();
  };

  return (
    <span className={`${BASE} ${className}`.trim()} {...props}>
      {leadingIcon && <span className={ICON_SLOT}>{leadingIcon}</span>}
      {content && (
        <span className="shrink-0 min-w-0" dir="auto">
          {content}
        </span>
      )}
      {trailingIcon && <span className={ICON_SLOT}>{trailingIcon}</span>}
      {onClear && (
        <button
          type="button"
          aria-label="Clear tag"
          onClick={handleClear}
          className={[
            ICON_SLOT,
            'cursor-pointer rounded-full transition-opacity',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-solid-primary-500',
          ].join(' ')}
        >
          <ClearIcon />
        </button>
      )}
    </span>
  );
}
