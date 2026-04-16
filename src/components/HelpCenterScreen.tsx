import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomSheet } from './ui/BottomSheet';
import { ScreenHeader } from './ui/ScreenHeader';
import { ServiceCard } from './ui/ServiceCard';

interface HelpCenterScreenProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

type HotlineItem = {
  id: string;
  labelKey: string;
  number: string;
  icon: React.ReactNode;
};

type OrganizationItem = {
  id: string;
  nameKey: string;
  categoryKey: string;
  descriptionKey: string;
  locationsKey: string;
  actionLabelKey: string;
  actionType: 'phone' | 'whatsapp';
};

function WaterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M6.2 6.2l2.8 2.8" />
      <path d="M15 15l2.8 2.8" />
      <path d="M17.8 6.2L15 9" />
      <path d="M9 15l-2.8 2.8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" />
    </svg>
  );
}

function SirenIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 14a4 4 0 0 1 8 0v2H8v-2z" />
      <path d="M9 16v2h6v-2" />
      <path d="M5 20h14" />
      <path d="M12 4v3" />
      <path d="M5 9l2 1" />
      <path d="M19 9l-2 1" />
      <path d="M6.5 5.5l1.5 1.5" />
      <path d="M17.5 5.5L16 7" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 5h18l-7 8v6l-4-2v-4L3 5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.47 7.52L3 21l1.98-5.03A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8.5 10.5h.01" />
      <path d="M12 10.5h.01" />
      <path d="M15.5 10.5h.01" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 17v4" />
      <path d="M8 3h8l-1 5 3 3v2H6v-2l3-3-1-5z" />
    </svg>
  );
}

function VerifyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 5.21 4.23 9.44 9.44 9.79z" />
    </svg>
  );
}

function EmergencyShortcut({
  label,
  number,
  icon,
}: {
  label: string;
  number: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex w-[76px] appearance-none flex-col items-center gap-4 bg-transparent text-center"
    >
      <span className="flex size-48 items-center justify-center rounded-md border border-solid-black-300 bg-solid-white-400 text-solid-black-500">
        {icon}
      </span>
      <span
        className="text-2xs font-weight-medium leading-[14px]"
        style={{
          color: 'var(--text-black)',
          WebkitTextFillColor: 'var(--text-black)',
        }}
      >
        {label}
      </span>
      <span
        className="text-2xs font-weight-medium leading-[14px]"
        style={{
          color: 'var(--text-black)',
          WebkitTextFillColor: 'var(--text-black)',
        }}
      >
        {number}
      </span>
    </button>
  );
}

const HOTLINES: HotlineItem[] = [
  {
    id: 'marine',
    labelKey: 'hotlines.marineRescue',
    number: '1714',
    icon: <WaterIcon />,
  },
  {
    id: 'medical',
    labelKey: 'hotlines.medicalAid',
    number: '129',
    icon: <ShieldIcon />,
  },
  {
    id: 'civil',
    labelKey: 'hotlines.civilDefense',
    number: '125',
    icon: <SirenIcon />,
  },
  {
    id: 'ambulance',
    labelKey: 'hotlines.ambulance',
    number: '140',
    icon: <CrossIcon />,
  },
];

const ORGANIZATIONS: OrganizationItem[] = [
  {
    id: 'ministry-phone',
    nameKey: 'items.ministryHealth',
    categoryKey: 'categories.government',
    descriptionKey: 'descriptions.healthServices',
    locationsKey: 'locations.beirutTripoliSidon',
    actionLabelKey: 'actions.call1900',
    actionType: 'phone',
  },
  {
    id: 'ministry-whatsapp',
    nameKey: 'items.ministryHealth',
    categoryKey: 'categories.government',
    descriptionKey: 'descriptions.healthServices',
    locationsKey: 'locations.beirutTripoliSidon',
    actionLabelKey: 'actions.whatsapp1900',
    actionType: 'whatsapp',
  },
  {
    id: 'screening',
    nameKey: 'items.screeningCenter',
    categoryKey: 'categories.private',
    descriptionKey: 'descriptions.screening',
    locationsKey: 'locations.sidon',
    actionLabelKey: 'actions.call1234800',
    actionType: 'phone',
  },
  {
    id: 'hope',
    nameKey: 'items.hopeAssociation',
    categoryKey: 'categories.nonProfit',
    descriptionKey: 'descriptions.support',
    locationsKey: 'locations.beirut',
    actionLabelKey: 'actions.call4567700',
    actionType: 'phone',
  },
  {
    id: 'care-point',
    nameKey: 'items.carePoint',
    categoryKey: 'categories.private',
    descriptionKey: 'descriptions.primaryCare',
    locationsKey: 'locations.tripoli',
    actionLabelKey: 'actions.call8002222',
    actionType: 'phone',
  },
  {
    id: 'response-network',
    nameKey: 'items.responseNetwork',
    categoryKey: 'categories.nonProfit',
    descriptionKey: 'descriptions.fieldResponse',
    locationsKey: 'locations.beirutTripoli',
    actionLabelKey: 'actions.whatsapp2200',
    actionType: 'whatsapp',
  },
];

function normalizeArabic(value: string) {
  return value
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .toLowerCase();
}

export default function HelpCenterScreen({
  theme,
  onToggleTheme,
  onToggleLanguage,
}: HelpCenterScreenProps) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const contentDirection = i18n.dir(i18n.language);
  const isRtl = contentDirection === 'rtl';

  const organizations = useMemo(() => {
    const normalizedQuery = normalizeArabic(query.trim());

    return ORGANIZATIONS.filter((item) => {
      if (!normalizedQuery) return true;

      const haystack = [
        t(`helpCenter.${item.nameKey}`),
        t(`helpCenter.${item.categoryKey}`),
        t(`helpCenter.${item.descriptionKey}`),
        t(`helpCenter.${item.locationsKey}`),
      ]
        .map(normalizeArabic)
        .join(' ');

      return haystack.includes(normalizedQuery);
    });
  }, [query, t]);

  const visibleOrganizations = organizations.slice(0, visibleCount);

  const headerToggleClass = [
    'flex size-24 items-center justify-center rounded-md border',
    'border-white/35 bg-white/10 text-solid-white-400',
    'backdrop-blur-sm',
  ].join(' ');

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-surface-primary pb-40">
        <ScreenHeader
          dir={contentDirection}
          title={t('helpCenter.title')}
          subtitle={t('helpCenter.subtitle')}
          actions={
            <>
              <button
                type="button"
                aria-label={t('common.toggleLanguage')}
                onClick={onToggleLanguage}
                className={headerToggleClass}
              >
                <GlobeIcon />
              </button>

              <button
                type="button"
                aria-label={t('common.toggleTheme')}
                onClick={onToggleTheme}
                className={headerToggleClass}
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </>
          }
        />

        <div className="mx-auto w-full max-w-[390px] px-16 pt-12">
          <section className="flex flex-col gap-8">
            <h2
              className={[
                'w-full text-lg font-weight-medium text-text-black',
                isRtl ? 'text-right' : 'text-left',
              ].join(' ')}
              style={{
                color: 'var(--text-black)',
                WebkitTextFillColor: 'var(--text-black)',
              }}
            >
              {t('helpCenter.emergencyTitle')}
            </h2>
            <div
              dir={contentDirection}
              className="flex h-[84px] items-center justify-between"
            >
              {HOTLINES.map((item) => (
                <EmergencyShortcut
                  key={item.id}
                  label={t(`helpCenter.${item.labelKey}`)}
                  number={item.number}
                  icon={item.icon}
                />
              ))}
            </div>
          </section>

          <section className="mt-22 flex flex-col gap-8">
            <div
              dir={contentDirection}
              className={[
                'flex items-center justify-between gap-16',
                isRtl ? '' : 'flex-row-reverse',
              ].join(' ')}
            >
              <button
                type="button"
                aria-label={t('helpCenter.openFilters')}
                onClick={() => setIsFilterOpen(true)}
                className="shrink-0 text-solid-black-400"
              >
                <FilterIcon />
              </button>

              <div
                dir={contentDirection}
                className={[
                  'flex min-h-[36px] w-[318px] items-center gap-8 rounded-md border border-textfield-default-stroke bg-textfield-bg px-12 py-8',
                  isRtl ? '' : 'flex-row-reverse',
                ].join(' ')}
              >
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(4);
                  }}
                  placeholder={t('helpCenter.searchPlaceholder')}
                  className={[
                    'min-w-0 flex-1 bg-transparent text-button font-weight-regular text-textfield-value placeholder:text-textfield-default-text outline-none',
                    isRtl ? 'text-right' : 'text-left',
                  ].join(' ')}
                />
                <span className="flex size-20 items-center justify-center text-solid-black-400">
                  <SearchIcon />
                </span>
              </div>
            </div>

            <p
              className={[
                'w-full text-2xs font-weight-medium text-solid-black-400',
                isRtl ? 'text-right' : 'text-left',
              ].join(' ')}
            >
              {t('helpCenter.resultsCountStatic')}
            </p>
          </section>

          <section className="relative mt-22 flex flex-col gap-12">
            {visibleOrganizations.map((item) => (
              <ServiceCard
                key={item.id}
                dir={contentDirection}
                title={t(`helpCenter.${item.nameKey}`)}
                category={t(`helpCenter.${item.categoryKey}`)}
                description={t(`helpCenter.${item.descriptionKey}`)}
                locations={t(`helpCenter.${item.locationsKey}`)}
                actionLabel={t(`helpCenter.${item.actionLabelKey}`)}
                actionIcon={
                  item.actionType === 'phone' ? <PhoneIcon /> : <ChatIcon />
                }
                actionVariant={
                  item.actionType === 'phone' ? 'filled' : 'success'
                }
                primaryAction={{
                  ariaLabel: t('helpCenter.pinAction'),
                  icon: <PinIcon />,
                }}
                secondaryAction={{
                  ariaLabel: t('helpCenter.verifyAction'),
                  icon: <VerifyIcon />,
                  variant: 'outline',
                }}
              />
            ))}

            <button
              type="button"
              aria-label={t('helpCenter.backToTop')}
              className="absolute bottom-[56px] left-0 flex size-[52px] items-center justify-center rounded-full border border-solid-black-300 bg-solid-white-400 text-solid-black-500 shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUpIcon />
            </button>
          </section>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 10)}
              className="inline-flex h-44 items-center justify-center gap-8 rounded-md px-16 py-8 text-button font-weight-medium text-text-black"
            >
              <ChevronDownIcon />
              <span>{t('helpCenter.loadMoreStatic')}</span>
            </button>
          </div>
        </div>
      </section>

      <BottomSheet
        open={isFilterOpen}
        title={t('helpCenter.filtersTitle')}
        description={t('helpCenter.filtersDescription')}
        secondaryActionLabel={t('helpCenter.filtersCancel')}
        primaryActionLabel={t('helpCenter.filtersApply')}
        primaryDisabled
        onOpenChange={setIsFilterOpen}
        onSecondaryAction={() => setIsFilterOpen(false)}
      >
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-solid-black-300 text-center text-button font-weight-regular text-solid-black-400">
          {t('helpCenter.filtersPlaceholder')}
        </div>
      </BottomSheet>
    </>
  );
}
