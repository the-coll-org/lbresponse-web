import type { HTMLAttributes, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = 'primary' | 'secondary' | 'outline' | 'destructive';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Icon rendered before the label. Inherits the badge's text color via currentColor. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. Inherits the badge's text color via currentColor. */
  rightIcon?: ReactNode;
  children?: ReactNode;
}

// ─── Style maps ───────────────────────────────────────────────────────────────

const BASE =
  'inline-flex items-center justify-center px-8 py-4 gap-4 rounded-md ' +
  'text-2xs font-weight-medium';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  // --components-badges-primary (#2b272b) / text (#f2eeeb)
  primary: 'bg-badge-primary text-badge-text',

  // --components-badges-secondary (#fcfbfa) / text-dark (#2b272b)
  secondary: 'bg-badge-secondary text-badge-text-dark',

  // No fill — border + dark text
  outline: 'border border-badge-outline-stroke text-badge-text-dark',

  // --components-badges-destructive (#ed5158) / text (#f2eeeb)
  destructive: 'bg-badge-destructive text-badge-text',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  variant = 'primary',
  className = '',
  leftIcon,
  rightIcon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`${BASE} ${VARIANT_STYLES[variant]} ${className}`.trim()}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  );
}
