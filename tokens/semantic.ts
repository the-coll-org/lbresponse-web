/**
 * Semantic design tokens — component and surface aliases.
 *
 * This file provides two exports:
 *
 * 1. `semanticTokens` — resolved hex values (for TS/JS consumers, tests, Storybook).
 *    Values are derived directly from the solidColors palette.
 *
 * 2. `semanticCssVars` — CSS variable reference strings (for dynamic inline styles
 *    or Tailwind arbitrary values like `bg-[var(--components-button-filled-bg)]`).
 *    The actual CSS variables are declared in src/styles/tokens.css.
 *
 * Tailwind utility class mapping (generated via @theme inline in tokens.css):
 *   --surface-primary                  → bg-surface-primary
 *   --text-black                       → text-text-black
 *   --components-button-filled-bg      → bg-button-filled-bg
 *   etc. (see tokens.css for the full list)
 *
 * shadcn/ui compatibility note:
 *   shadcn/ui expects tokens named --background, --foreground, --primary, etc.
 *   If you install shadcn/ui, add a mapping layer in tokens.css:
 *     --background: var(--surface-primary);
 *     --primary:    var(--components-button-filled-bg);
 */

import { solidColors } from './colors';

// ─── Resolved semantic token values ──────────────────────────────────────────

export const semanticTokens = {
  // source: --surface-primary
  surface: {
    primary: solidColors.white[400],
  },

  // source: --text-black
  text: {
    black: solidColors.black[600],
  },

  // source: --icon-black
  icon: {
    black: solidColors.black[600],
  },

  components: {
    // source: --components-button-*
    button: {
      filled: {
        bg: solidColors.primary[700], // --components-button-filled-bg
        text: solidColors.white[400], // --components-button-filled-text
        icon: solidColors.white[400], // --components-button-filled-icon
      },
      tonal: {
        bg: solidColors.primary[300], // --components-button-tonal-bg
        text: solidColors.black[600], // --components-button-tonal-text
        icon: solidColors.black[600], // --components-button-tonal-icon
      },
      text: {
        text: solidColors.black[600], // --components-button-text-text
        icon: solidColors.black[600], // --components-button-text-icon
      },
      icon: {
        bg: solidColors.white[600], // --components-button-icon-bg
        icon: solidColors.black[600], // --components-button-icon-icon
      },
    },

    // source: --components-text-*  (text field component)
    textField: {
      bg: solidColors.white[400], // --components-text-bg
      defaultText: solidColors.black[400], // --components-text-default-text
      defaultStroke: solidColors.black[300], // --components-text-default-stroke
      value: solidColors.black[600], // --components-text-value
      valueStroke: solidColors.black[300], // --components-text-value-stroke
      focusStroke: solidColors.black[400], // --components-text-focus-stroke
      errorStroke: solidColors.red[500], // --components-text-error-stroke
      icon: solidColors.black[300], // --components-text-icon
    },

    // source: --components-alert-*
    alert: {
      bg: solidColors.white[400], // --components-alert-bg
      stroke: solidColors.black[300], // --components-alert-stroke
      error: {
        text: solidColors.red[500], // --components-alert-error-text
        icon: solidColors.red[500], // --components-alert-error-icon
      },
      neutral: {
        text: solidColors.black[600], // --components-alert-neutral-text
        icon: solidColors.black[400], // --components-alert-neutral-icon
      },
    },
  },
} as const;

// ─── CSS variable reference strings ──────────────────────────────────────────
// Use these when you need to reference a semantic token in inline styles or
// Tailwind arbitrary values, e.g.: style={{ color: semanticCssVars['text-black'] }}

export const semanticCssVars = {
  'surface-primary': 'var(--surface-primary)',
  'text-black': 'var(--text-black)',
  'icon-black': 'var(--icon-black)',

  'components-button-filled-bg': 'var(--components-button-filled-bg)',
  'components-button-filled-text': 'var(--components-button-filled-text)',
  'components-button-filled-icon': 'var(--components-button-filled-icon)',

  'components-button-tonal-bg': 'var(--components-button-tonal-bg)',
  'components-button-tonal-text': 'var(--components-button-tonal-text)',
  'components-button-tonal-icon': 'var(--components-button-tonal-icon)',

  'components-button-text-text': 'var(--components-button-text-text)',
  'components-button-text-icon': 'var(--components-button-text-icon)',

  'components-button-icon-bg': 'var(--components-button-icon-bg)',
  'components-button-icon-icon': 'var(--components-button-icon-icon)',

  'components-text-bg': 'var(--components-text-bg)',
  'components-text-default-text': 'var(--components-text-default-text)',
  'components-text-default-stroke': 'var(--components-text-default-stroke)',
  'components-text-value': 'var(--components-text-value)',
  'components-text-value-stroke': 'var(--components-text-value-stroke)',
  'components-text-focus-stroke': 'var(--components-text-focus-stroke)',
  'components-text-error-stroke': 'var(--components-text-error-stroke)',
  'components-text-icon': 'var(--components-text-icon)',

  'components-alert-bg': 'var(--components-alert-bg)',
  'components-alert-stroke': 'var(--components-alert-stroke)',
  'components-alert-error-text': 'var(--components-alert-error-text)',
  'components-alert-error-icon': 'var(--components-alert-error-icon)',
  'components-alert-neutral-text': 'var(--components-alert-neutral-text)',
  'components-alert-neutral-icon': 'var(--components-alert-neutral-icon)',
} as const;

export type SemanticCssVarKey = keyof typeof semanticCssVars;
