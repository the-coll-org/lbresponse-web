import { helpCenterIcons } from './helpCenter.icons';

interface HelpCenterHeaderActionsProps {
  theme: 'light' | 'dark';
  languageToggleLabel: string;
  languageToggleAriaLabel: string;
  themeToggleAriaLabel: string;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

const ACTION_CLASS = [
  'flex size-24 items-center justify-center rounded-md border',
  'border-solid-white-400/35 bg-solid-white-400/10 text-solid-white-400',
  'text-2xs font-weight-bold backdrop-blur-sm',
].join(' ');

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
        <span aria-hidden="true">{languageToggleLabel}</span>
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
