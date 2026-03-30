import { useContext } from 'react';
import { ThemeContext } from '../context/themeContextValue';
import type { ThemeContextValue } from '../context/themeContextValue';

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
