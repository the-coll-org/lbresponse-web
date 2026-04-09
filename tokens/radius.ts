/**
 * Border radius tokens — source: --radius-*
 *
 * In tokens.css these map to Tailwind v4's --radius-* theme variables,
 * generating utilities: rounded-sm, rounded-md, rounded-lg, rounded-xl,
 * rounded-2xl, rounded-full.
 */
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '20px',
  '2xl': '32px',
  full: '1000px',
} as const;

export type RadiusKey = keyof typeof borderRadius;
