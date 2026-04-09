/**
 * Solid color palette — base design tokens.
 *
 * These are the raw hex values from the design system.
 * Tailwind utilities are generated from these values via `src/styles/tokens.css`.
 *
 * Usage in TS/JS:
 *   import { solidColors } from '../tokens/colors';
 *   const buttonBg = solidColors.primary[700]; // '#2e4369'
 */
export const solidColors = {
  primary: {
    300: '#d9e9ff',
    400: '#b0ccf4',
    500: '#5189ed',
    600: '#375da1',
    700: '#2e4369',
  },
  green: {
    400: '#77aa7b',
    500: '#54b661',
    600: '#37a145',
    700: '#2b5e33',
  },
  red: {
    400: '#e39684',
    500: '#ed5158',
    600: '#a1373c',
    700: '#a61e24',
  },
  black: {
    300: '#c5c6c8',
    400: '#818283',
    500: '#4f5052',
    600: '#2b272b',
    700: '#0d0e10',
  },
  white: {
    400: '#fcfbfa',
    500: '#f9f7f5',
    600: '#f5f2f0',
    700: '#f2eeeb',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
} as const;

export type SolidColorGroup = keyof typeof solidColors;
export type SolidColorShade<G extends SolidColorGroup> =
  keyof (typeof solidColors)[G];
