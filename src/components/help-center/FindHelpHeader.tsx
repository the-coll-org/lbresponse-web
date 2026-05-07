import { helpCenterIcons } from './helpCenter.icons';

interface FindHelpHeaderProps {
  brandName: string;
  brandTagline: string;
  language: string;
  theme: 'light' | 'dark';
  languageToggleLabel: string;
  languageToggleAriaLabel: string;
  themeToggleAriaLabel: string;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.5 2.5 4 5.5 4 8.5s-1.5 6-4 8.5" />
      <path d="M12 3.5c-2.5 2.5-4 5.5-4 8.5s1.5 6 4 8.5" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-22"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="m7.6 7.6 2.8 2.8M16.4 7.6l-2.8 2.8M7.6 16.4l2.8-2.8M16.4 16.4l-2.8-2.8" />
    </svg>
  );
}

export function FindHelpHeader({
  brandName,
  brandTagline,
  language,
  theme,
  languageToggleLabel,
  languageToggleAriaLabel,
  themeToggleAriaLabel,
  onToggleLanguage,
  onToggleTheme,
}: FindHelpHeaderProps) {
  const ThemeIcon =
    theme === 'light' ? helpCenterIcons.moon : helpCenterIcons.sun;
  const isArabic = language.startsWith('ar');

  return (
    <header className="flex w-full items-center justify-between gap-12 border-b border-findhelp-border-subtle bg-surface-primary px-16 py-12 md:px-32">
      <div className="flex min-w-0 items-center gap-12">
        <span
          className="flex size-32 items-center justify-center text-findhelp-primary"
          aria-hidden="true"
        >
          <NetworkIcon />
        </span>
        <div className="flex min-w-0 flex-col text-start leading-tight">
          <span className="text-button font-weight-bold text-text-black">
            {brandName}
          </span>
          <span
            className={[
              'text-[10.5px] font-weight-regular text-solid-black-400',
              isArabic ? '' : 'uppercase tracking-[0.12em]',
            ].join(' ')}
          >
            {brandTagline}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-8">
        <button
          type="button"
          aria-label={languageToggleAriaLabel}
          onClick={onToggleLanguage}
          className="inline-flex h-32 items-center gap-8 rounded-md border border-findhelp-border-subtle bg-surface-primary px-12 text-2xs font-weight-medium text-text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
        >
          <GlobeIcon />
          <span>{languageToggleLabel}</span>
        </button>
        <button
          type="button"
          aria-label={themeToggleAriaLabel}
          onClick={onToggleTheme}
          className="inline-flex size-32 items-center justify-center rounded-md border border-findhelp-border-subtle bg-surface-primary text-text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
        >
          <span className="size-16">
            <ThemeIcon />
          </span>
        </button>
      </div>
    </header>
  );
}
