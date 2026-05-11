import { useTranslation } from 'react-i18next';

export type NavbarTab = 'main' | 'hotlines' | 'map';

const tabLabels: Record<NavbarTab, { en: string; ar: string }> = {
  main: { en: 'Need Help', ar: 'أحتاج مساعدة' },
  hotlines: { en: 'Help Center', ar: 'مركز المساعدة' },
  map: { en: 'Map', ar: 'الخريطة' },
};

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3z" />
      <line x1="9" y1="4" x2="9" y2="17" />
      <line x1="15" y1="7" x2="15" y2="20" />
    </svg>
  );
}

function OrgIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function ReliefIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M12 7.5C12 6.1 13.1 5 14.5 5S17 6.1 17 7.5c0 1.4-1 2.5-5 5.1C8 10 7 8.9 7 7.5 7 6.1 8.1 5 9.5 5S12 6.1 12 7.5z"
        strokeWidth="1.3"
      />
      <path d="M8 14h8a1 1 0 0 1 1 1v4H7v-4a1 1 0 0 1 1-1z" />
      <path d="M10 14v-1.5" />
      <path d="M14 14v-1.5" />
      <path d="M5 19h14" />
    </svg>
  );
}

// DOM order: main → hotlines → map.
// With dir="rtl" the browser visually reverses flex-row so "main" (Need Help)
// appears on the right (RTL start) and "map" on the left — matching the Figma.
const tabs: { id: NavbarTab; icon: () => JSX.Element }[] = [
  { id: 'main', icon: ReliefIcon },
  { id: 'hotlines', icon: OrgIcon },
  { id: 'map', icon: MapIcon },
];

interface MobileNavbarProps {
  selected?: NavbarTab;
  onSelect?: (tab: NavbarTab) => void;
  className?: string;
}

export default function MobileNavbar({
  selected = 'main',
  onSelect,
  className,
}: MobileNavbarProps) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ar';
  const isAr = language.startsWith('ar');

  return (
    <nav
      data-testid="mobile-navbar"
      className={className ?? 'flex justify-center'}
      aria-label={isAr ? 'التنقل الرئيسي' : 'Main navigation'}
    >
      <div className="flex h-[72px] w-full max-w-[358px] overflow-hidden rounded-2xl bg-solid-white-600 shadow-xs">
        {tabs.map(({ id, icon: Icon }) => {
          const active = selected === id;
          const label = isAr ? tabLabels[id].ar : tabLabels[id].en;

          return (
            <button
              key={id}
              type="button"
              data-testid={`navbar-tab-${id}`}
              onClick={() => onSelect?.(id)}
              className={[
                'relative flex flex-1 flex-col items-center justify-center gap-4 h-full transition-colors',
                active ? 'text-solid-black-600' : 'text-solid-black-400',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <div className="absolute top-0 inset-x-0 h-[6px] rounded-b-md bg-solid-primary-700" />
              )}
              <Icon />
              <span
                className={[
                  'text-xs leading-[18px]',
                  active ? 'font-weight-medium' : 'font-weight-regular',
                ].join(' ')}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
