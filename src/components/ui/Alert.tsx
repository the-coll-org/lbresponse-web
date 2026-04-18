import type { HTMLAttributes, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertVariant = 'neutral' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style. 'neutral' = info/default; 'error' = destructive/failure. */
  variant?: AlertVariant;
  /** Short heading — Line 1. Font: 14px / medium / lh-18. */
  heading?: ReactNode;
  /** Leading icon. Defaults to the variant's built-in icon when omitted. */
  icon?: ReactNode;
  /** Trailing action slot (e.g. a Button component). */
  action?: ReactNode;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

/**
 * Container token classes (Figma: Type=Neutral, Lang=EN — node 10:3358)
 *
 *   flex flex-row items-center   → layoutMode: HORIZONTAL, counterAxisAlignItems: CENTER
 *   px-16 py-12                  → paddingLeft/Right: 16px, paddingTop/Bottom: 12px
 *   gap-16                       → itemSpacing: 16px  (Icon+Content group ↔ Button)
 *   rounded-md                   → cornerRadius: 8px  (--radius-md)
 *   border bg-alert-bg           → fill #FCFBFA, stroke #C5C6C8 w1
 *   No shadow                    → effects: [] in Figma
 */
const BASE = [
  'w-full flex flex-row items-start',
  'px-16 py-12 gap-16',
  'rounded-md border bg-alert-bg',
  'transition-[border-color,color]',
].join(' ');

/**
 * Per-variant token classes.
 *
 * container  → sets text color on the container; all text nodes inherit it
 * icon       → overrides text color on the icon slot (neutral-icon ≠ neutral-text)
 *
 * Figma values:
 *   Neutral — text: #2B272B (solid-black-600)  / icon: #818283 (solid-black-400)
 *   Error   — text: #ED5158 (solid-red-500)    / icon: #ED5158 (same as text)
 */
const VARIANT_STYLES: Record<
  AlertVariant,
  { container: string; icon: string }
> = {
  neutral: {
    container: 'border-alert-stroke text-alert-neutral-text',
    icon: 'text-alert-neutral-icon',
  },
  error: {
    container: 'border-alert-stroke text-alert-error-text',
    icon: 'text-alert-error-icon',
  },
};

// ─── Default icons (Figma: 16×16, stroke currentColor) ───────────────────────

function DefaultNeutralIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function DefaultErrorIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Alert({
  variant = 'neutral',
  heading,
  icon,
  action,
  className = '',
  children,
  ...props
}: AlertProps) {
  const styles = VARIANT_STYLES[variant];
  const defaultIcon =
    variant === 'error' ? <DefaultErrorIcon /> : <DefaultNeutralIcon />;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`${BASE} ${styles.container} ${className}`.trim()}
      {...props}
    >
      {/*
       * Icon + Content group
       *   gap-12 → itemSpacing: 12px (Figma "Icon + Content" frame)
       *   items-center → icon vertically centered against the 2-line text block
       */}
      <div className="flex flex-row items-start gap-12 flex-1 min-w-0">
        {/*
         * Icon-aligner — 16×16 fixed (Figma: Icon-aligner frame = 16×16)
         * Color override: neutral-icon (#818283) differs from neutral-text (#2B272B)
         */}
        <span
          className={`shrink-0 size-16 flex items-center justify-center ${styles.icon}`}
        >
          {icon ?? defaultIcon}
        </span>

        {/*
         * Content — vertical stack of Line 1 (heading) + Line 2 (body)
         *   gap-[2px] → itemSpacing: 2px between the two text nodes in Figma
         *   Line 1: Roboto/Dubai 500 14px lh:18 → text-button font-weight-medium
         *   Line 2: Roboto/Dubai 400 12px lh:14 → text-2xs  font-weight-regular
         */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {heading && (
            <p className="text-button font-weight-medium">{heading}</p>
          )}
          {children && (
            <div className="text-2xs font-weight-regular">{children}</div>
          )}
        </div>
      </div>

      {/* Action slot (optional Button) — shrinks to content, sits at inline-end */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
