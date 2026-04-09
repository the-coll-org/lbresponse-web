/**
 * Typography tokens — font families, weights, and mobile/desktop scales.
 *
 * Font families (source: --family-family):
 *   Arabic content → Dubai    (--family-family: "Dubai")
 *   English content → Roboto  (--family-family: "Roboto")
 *   The source token --family-lang resolves to the active language's font family.
 *
 * Responsive scale strategy:
 *   Mobile scale  = default (mobile-first baseline)
 *   Desktop scale = applied at md breakpoint (768px) via CSS overrides in tokens.css
 */

// ─── Font Families ────────────────────────────────────────────────────────────
// source: --family-family (Arabic) | --family-family (English)

export const fontFamily = {
  /** Arabic content — source: --family-family: "Dubai" */
  arabic: ['"Dubai"', 'sans-serif'] as const,
  /** English content — source: --family-family: "Roboto" */
  english: ['"Roboto"', 'sans-serif'] as const,
} as const;

// ─── Font Weights ─────────────────────────────────────────────────────────────
// source: --weight-regular | --weight-medium | --weight-semibold | --weight-bold

export const fontWeight = {
  regular: '400', // --weight-regular:  "Regular"
  medium: '500', // --weight-medium:   "Medium"
  semibold: '600', // --weight-semibold: "SemiBold"
  bold: '700', // --weight-bold:     "Bold"
} as const;

// ─── Mobile Typescale ─────────────────────────────────────────────────────────
// source: --size-* and --lineheight-* (mobile variant)

export const mobileFontSize = {
  '2xs': { size: '12px', lineHeight: '14px' }, // --size-2xs: 12px  | --lineheight-2xs: 14px
  xs: { size: '14px', lineHeight: '18px' }, // --size-xs:  14px  | --lineheight-xs:  18px
  sm: { size: '16px', lineHeight: '20px' }, // --size-sm:  16px  | --lineheight-sm:  20px
  md: { size: '18px', lineHeight: '28px' }, // --size-md:  18px  | --lineheight-md:  28px
  lg: { size: '20px', lineHeight: '28px' }, // --size-lg:  20px  | --lineheight-lg:  28px
  xl: { size: '22px', lineHeight: '32px' }, // --size-xl:  22px  | --lineheight-xl:  32px
  '2xl': { size: '24px', lineHeight: '34px' }, // --size-2xl: 24px  | --lineheight-2xl: 34px
  '3xl': { size: '32px', lineHeight: '40px' }, // --size-3xl: 32px  | --lineheight-3xl: 40px
  '4xl': { size: '40px', lineHeight: '48px' }, // --size-4xl: 40px  | --lineheight-4xl: 48px
} as const;

// ─── Desktop Typescale ────────────────────────────────────────────────────────
// source: --size-* and --lineheight-* (desktop variant)
// Applied at min-width: 768px via CSS variable overrides in tokens.css.

export const desktopFontSize = {
  '2xs': { size: '14px', lineHeight: '18px' }, // --size-2xs: 14px  | --lineheight-2xs: 18px
  xs: { size: '16px', lineHeight: '20px' }, // --size-xs:  16px  | --lineheight-xs:  20px
  sm: { size: '18px', lineHeight: '20px' }, // --size-sm:  18px  | --lineheight-sm:  20px
  md: { size: '20px', lineHeight: '28px' }, // --size-md:  20px  | --lineheight-md:  28px
  lg: { size: '22px', lineHeight: '28px' }, // --size-lg:  22px  | --lineheight-lg:  28px
  xl: { size: '24px', lineHeight: '32px' }, // --size-xl:  24px  | --lineheight-xl:  32px
  '2xl': { size: '32px', lineHeight: '34px' }, // --size-2xl: 32px  | --lineheight-2xl: 34px
  '3xl': { size: '40px', lineHeight: '40px' }, // --size-3xl: 40px  | --lineheight-3xl: 40px
  '4xl': { size: '48px', lineHeight: '48px' }, // --size-4xl: 48px  | --lineheight-4xl: 48px
} as const;

export type FontSizeStep = keyof typeof mobileFontSize;
