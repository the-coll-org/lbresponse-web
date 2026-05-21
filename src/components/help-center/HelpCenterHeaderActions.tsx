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
  'inline-flex items-center justify-center min-h-32 min-w-32 p-8 rounded-md gap-2 ' +
  'bg-button-tonal-bg text-button-tonal-text ' +
  'cursor-pointer select-none transition-opacity ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500';

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
      <button
        type="button"
        aria-label={languageToggleAriaLabel}
        onClick={onToggleLanguage}
        className={ACTION_CLASS}
      >
        <span
          className="text-button font-weight-medium leading-none"
          aria-hidden="true"
        >
          {languageToggleLabel}
        </span>
        <helpCenterIcons.globe />
      </button>

      <button
        type="button"
        aria-label={themeToggleAriaLabel}
        onClick={onToggleTheme}
        className={ACTION_CLASS}
      >
        <ThemeIcon />
      </button>
    </>
  );
}
