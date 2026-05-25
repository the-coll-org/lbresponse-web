import { useTranslation } from 'react-i18next';

export type Tab = 'need-help' | 'help-center';

function NeedHelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="8" r="2.5" fill="currentColor" />
      <path
        d="M8 17c0-2.21 1.79-4 4-4s4 1.79 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HelpCenterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="13"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const tabs: { id: Tab; labelKey: string; icon: () => JSX.Element }[] = [
  { id: 'need-help', labelKey: 'tab.needHelp', icon: NeedHelpIcon },
  { id: 'help-center', labelKey: 'tab.helpCenter', icon: HelpCenterIcon },
];

const tabLabels: Record<Tab, { en: string; ar: string }> = {
  'need-help': { en: 'Need Help', ar: 'أحتاج مساعدة' },
  'help-center': { en: 'Help Center', ar: 'مركز المساعدة' },
};

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomTabBar({
  activeTab,
  onTabChange,
}: BottomTabBarProps) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'en';
  const isAr = language.startsWith('ar');

  return (
    <nav
      data-testid="bottom-tab-bar"
      className="fixed bottom-0 inset-x-0 z-50 flex border-t border-textfield-default-stroke bg-surface-primary pb-[env(safe-area-inset-bottom)]"
      style={{ height: 'calc(64px + env(safe-area-inset-bottom))' }}
    >
      {tabs.map(({ id, icon: Icon }) => {
        const active = activeTab === id;
        const label = isAr ? tabLabels[id].ar : tabLabels[id].en;

        return (
          <button
            key={id}
            type="button"
            data-testid={`tab-${id}`}
            onClick={() => onTabChange(id)}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-4 h-16 py-8 text-2xs font-weight-medium transition-colors',
              active ? 'text-solid-primary-700' : 'text-solid-black-400',
            ].join(' ')}
            aria-current={active ? 'page' : undefined}
          >
            <Icon />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
