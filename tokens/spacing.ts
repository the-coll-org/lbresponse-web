/**
 * Spacing tokens — source: --spacing-*
 *
 * Keys match the pixel value for direct human readability.
 * In tokens.css these override Tailwind v4's default spacing scale so that:
 *   m-4  → 4px  (instead of Tailwind default 1rem)
 *   m-8  → 8px  (instead of Tailwind default 2rem)
 *   p-24 → 24px (instead of Tailwind default 6rem)
 *   etc.
 */
export const spacing = {
  2: '2px',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  22: '22px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  64: '64px',
} as const;

export type SpacingKey = keyof typeof spacing;
