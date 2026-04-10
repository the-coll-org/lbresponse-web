import type { TextareaHTMLAttributes } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Applies error border and error focus ring. Sets aria-invalid="true". */
  isError?: boolean;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

/**
 * State mapping:
 *
 *   placeholder  → default border + shadow-xs
 *   value        → value-stroke border + shadow-2xs   (:not(:placeholder-shown))
 *   focus        → focus-stroke border + focus-ring shadow
 *   error        → error-stroke border               (aria-invalid=true)
 *   error-focus  → error-stroke border + error focus-ring shadow
 *   disabled     → opacity-40
 *
 * RTL-safe: uses ps-N / pe-N (padding-inline-start/end) instead of pl-N / pr-N.
 */
const BASE = [
  // Layout
  'w-full resize-none',

  // Radius — default token, caller can override via className
  'rounded-md',

  // Typography
  'text-button font-weight-regular',

  // Spacing — padding-inline-start/end for RTL safety
  'ps-12 pe-12 py-8',

  // Colors
  'bg-textfield-bg',
  'text-textfield-value',
  'placeholder:text-textfield-default-text',

  // Border — placeholder / default state
  'border border-textfield-default-stroke',

  // Shadow — placeholder state
  'shadow-xs',

  // ── Value state (:not(:placeholder-shown)) ─────────────────────────────
  '[&:not(:placeholder-shown)]:border-textfield-value-stroke',
  '[&:not(:placeholder-shown)]:shadow-2xs',

  // ── Focus state ────────────────────────────────────────────────────────
  'outline-none',
  'focus:border-textfield-focus-stroke',
  'focus:shadow-focus-ring',

  // ── Error state (aria-invalid=true) ────────────────────────────────────
  'aria-[invalid=true]:border-textfield-error-stroke',

  // ── Error + focus: overrides the default focus ring ────────────────────
  // Higher specificity (2 conditions) wins over plain focus:shadow-focus-ring
  'aria-[invalid=true]:focus:shadow-focus-ring-error',

  // ── Disabled ───────────────────────────────────────────────────────────
  'disabled:opacity-40',
  'disabled:cursor-not-allowed',
  'disabled:pointer-events-none',

  // Smooth transitions between states
  'transition-[border-color,box-shadow]',
].join(' ');

// ─── Component ────────────────────────────────────────────────────────────────

export function TextArea({
  isError = false,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <textarea
      aria-invalid={isError ? true : undefined}
      className={`${BASE} ${className}`.trim()}
      {...props}
    />
  );
}
