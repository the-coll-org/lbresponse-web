import type { ButtonHTMLAttributes, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'text'
  | 'icon'
  | 'destructive';
export type ButtonSize = 'md' | 'sm';
/** Maps directly to --radius-* tokens from tokens.css */
export type ButtonRadius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Border radius — defaults to 'md' (var(--radius-md, 8px)) */
  radius?: ButtonRadius;
  /** Icon rendered before the label. Inherits the button's text color via currentColor. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. Inherits the button's text color via currentColor. */
  rightIcon?: ReactNode;
  /** Label text. Not used when variant="icon". */
  children?: ReactNode;
}

// ─── Style maps — only token-based Tailwind classes ──────────────────────────

/**
 * Base styles shared across all variants.
 */
const BASE =
  'inline-flex items-center justify-center text-button font-weight-medium ' +
  'transition-opacity select-none cursor-pointer ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500';

/** Border radius — source: --radius-* tokens */
const RADIUS_STYLES: Record<ButtonRadius, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

/**
 * Per-variant color tokens.
 * All classes come directly from src/styles/tokens.css @theme inline declarations.
 */
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  // --components-button-filled-*
  filled: 'bg-button-filled-bg text-button-filled-text',

  // --components-button-destructive-*
  destructive: 'bg-button-destructive-bg text-button-destructive-text',

  // --components-button-tonal-*
  tonal: 'bg-button-tonal-bg text-button-tonal-text',

  // --components-button-text-*  (no background)
  text: 'text-button-text-text bg-transparent',

  // --components-button-icon-*  (no label, square shape)
  icon: 'bg-button-icon-bg text-button-icon-icon',
};

/**
 * Per-size padding and typography.
 * spacing tokens: --spacing-8 = 8px, --spacing-12 = 12px, --spacing-16 = 16px
 * typography tokens: --text-sm (16px mobile / 18px desktop), --text-xs (14px / 16px)
 */
const SIZE_STYLES: Record<ButtonSize, Record<ButtonVariant, string>> = {
  md: {
    filled: 'px-16 py-8 gap-8',
    destructive: 'px-16 py-8 gap-8',
    tonal: 'px-16 py-8 gap-8',
    text: 'px-8  py-8 gap-8',
    icon: 'p-12',
  },
  sm: {
    filled: 'px-12 py-8 gap-8',
    destructive: 'px-12 py-8 gap-8',
    tonal: 'px-12 py-8 gap-8',
    text: 'px-8  py-8 gap-8',
    icon: 'p-8',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Button({
  variant = 'filled',
  size = 'md',
  radius = 'md',
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass = VARIANT_STYLES[variant];
  const sizeClass = SIZE_STYLES[size][variant];
  const radiusClass = RADIUS_STYLES[radius];

  return (
    <button
      type={type}
      className={`${BASE} ${radiusClass} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {variant === 'icon' ? (
        // Icon-only: children is the single icon element
        children
      ) : (
        <>
          {leftIcon && (
            <span className="shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          {children && <span>{children}</span>}
          {rightIcon && (
            <span className="shrink-0" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
