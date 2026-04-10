import type { InputHTMLAttributes, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextFieldSize = 'md' | 'lg';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  /** 'md' = 36px min-height · 'lg' = 40px min-height. Default: 'md' */
  size?: TextFieldSize;
  /** Applies error-state border and error focus ring. Sets aria-invalid on the input. */
  isError?: boolean;
  /** Icon rendered before the input text. Color inherits from `text-textfield-icon`. */
  leftIcon?: ReactNode;
  /** Icon rendered after the input text. Color inherits from `text-textfield-icon`. */
  rightIcon?: ReactNode;
  /** Classes applied to the outer wrapper div (use to control width, margin, etc.). */
  className?: string;
  /** Classes applied to the inner <input> element. */
  inputClassName?: string;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

/**
 * Wrapper div carries the visible border, background, and shadow.
 * Focus state is propagated via `focus-within` so the ring appears when
 * the inner <input> receives focus.
 *
 * State summary:
 *   placeholder / value → default-stroke border + shadow-xs
 *   focus               → focus-stroke border + focus-ring shadow
 *   error               → error-stroke border (no ring)
 *   error + focus       → error-stroke border + error focus-ring shadow
 *   disabled            → opacity-40 (mirrored via has-[:disabled])
 *
 * Specificity note: `data-[error=true]:focus-within:` compiles to an
 * attribute + pseudo-class selector (0-3-0) which beats the plain
 * `focus-within:` selector (0-2-0), so the error ring safely overrides
 * the default focus ring without needing explicit resets.
 */
const WRAPPER_BASE = [
  // Layout
  'flex items-center w-full',
  'rounded-md',

  // Colors
  'bg-textfield-bg',

  // Border — default / placeholder state
  'border border-textfield-default-stroke',

  // Shadow — default (shadow-xs)
  'shadow-xs',

  // ── Focus ──────────────────────────────────────────────────────────────
  'focus-within:border-textfield-focus-stroke',
  'focus-within:shadow-focus-ring',

  // ── Error (data-error="true") ──────────────────────────────────────────
  'data-[error=true]:border-textfield-error-stroke',

  // ── Error + focus: overrides the default focus ring ────────────────────
  'data-[error=true]:focus-within:shadow-focus-ring-error',

  // ── Disabled (mirrors child input's disabled state) ────────────────────
  'has-[:disabled]:opacity-40',
  'has-[:disabled]:cursor-not-allowed',
  'has-[:disabled]:pointer-events-none',

  // Smooth transitions between states
  'transition-[border-color,box-shadow]',
].join(' ');

/** Per-size padding and gap on the wrapper */
const WRAPPER_SIZE: Record<TextFieldSize, string> = {
  // Regular: min-height 36px · padding 7.5px 12px · gap 8px
  md: 'min-h-[36px] px-12 py-[7.5px] gap-8',
  // Large:   min-height 40px · padding 9.5px 16px · gap 12px
  lg: 'min-h-[40px] px-16 py-[9.5px] gap-12',
};

/**
 * Inner <input> — transparent background, no border, fills remaining space.
 * Does NOT manage its own focus ring; the wrapper handles all visual states.
 */
const INPUT_BASE = [
  'flex-1 min-w-0',
  'bg-transparent border-none outline-none',
  'text-button font-weight-regular',
  'text-textfield-value placeholder:text-textfield-default-text',
  'disabled:cursor-not-allowed',
].join(' ');

/**
 * Icon slot wrapper — constrains the icon per design spec.
 *
 *   md: 20px wide · column flex · 2px padding (var(--3xs, 2px))
 *   lg: inline-flex · column flex · 12px padding (var(--sm, 12px))
 */
const ICON_WRAPPER: Record<TextFieldSize, string> = {
  md: 'flex flex-col w-20 shrink-0 justify-center items-center p-[2px]',
  lg: 'inline-flex flex-col shrink-0 justify-center items-center p-12',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TextField({
  size = 'md',
  isError = false,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = '',
  ...props
}: TextFieldProps) {
  const wrapperClass =
    `${WRAPPER_BASE} ${WRAPPER_SIZE[size]} ${className}`.trim();
  const inputClass = `${INPUT_BASE} ${inputClassName}`.trim();

  return (
    <div data-error={isError ? 'true' : undefined} className={wrapperClass}>
      {leftIcon && (
        <span className={`${ICON_WRAPPER[size]} text-textfield-icon`}>
          {leftIcon}
        </span>
      )}

      <input
        aria-invalid={isError ? true : undefined}
        className={inputClass}
        {...props}
      />

      {rightIcon && (
        <span className={`${ICON_WRAPPER[size]} text-textfield-icon`}>
          {rightIcon}
        </span>
      )}
    </div>
  );
}
