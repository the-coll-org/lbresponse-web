import { Button } from '../ui/Button';
import { helpCenterIcons } from './helpCenter.icons';

interface HelpCenterHeaderActionsProps {
  theme: 'light' | 'dark';
  languageToggleLabel: string;
  languageToggleAriaLabel: string;
  themeToggleAriaLabel: string;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

const ACTION_CLASS =
  'size-24 border border-solid-white-400/35 bg-solid-white-400/10 text-solid-white-400 text-2xs font-weight-bold backdrop-blur-sm';

export function HelpCenterHeaderActions({
  theme,
  languageToggleLabel,
  languageToggleAriaLabel,
  themeToggleAriaLabel,
  onToggleLanguage,
  onToggleTheme,
}: HelpCenterHeaderActionsProps) {
  const ThemeIcon =
    theme === 'light' ? helpCenterIcons.moon : helpCenterIcons.sun;

  return (
    <>
      <Button
        variant="icon"
        size="sm"
        aria-label={languageToggleAriaLabel}
        onClick={onToggleLanguage}
        className={ACTION_CLASS}
      >
        <span aria-hidden="true">{languageToggleLabel}</span>
      </Button>

      <Button
        variant="icon"
        size="sm"
        aria-label={themeToggleAriaLabel}
        onClick={onToggleTheme}
        className={ACTION_CLASS}
      >
        <ThemeIcon />
      </Button>
    </>
  );
}
