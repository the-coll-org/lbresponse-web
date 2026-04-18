import { type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../hooks/useToast';
import {
  HelpCenterFiltersSheet,
  type HelpCenterFilterSection,
} from './ui/HelpCenterFiltersSheet';
import { Badge } from './ui/Badge';
import {
  PinnedOrganizationsSheet,
  type PinnedOrganizationOption,
} from './ui/PinnedOrganizationsSheet';
import { ScreenHeader } from './ui/ScreenHeader';
import { SearchEmptyState } from './ui/SearchEmptyState';
import { ServiceCard } from './ui/ServiceCard';
import { SvgIcon } from './ui/SvgIcon';
import waterSvg from '../assets/help-center/water.svg?raw';
import shieldSvg from '../assets/help-center/shield.svg?raw';
import sirenSvg from '../assets/help-center/siren.svg?raw';
import crossSvg from '../assets/help-center/cross.svg?raw';
import filterSvg from '../assets/help-center/filter.svg?raw';
import filterLocationSvg from '../assets/help-center/filter-location.svg?raw';
import filterProviderSvg from '../assets/help-center/filter-provider.svg?raw';
import filterCategorySvg from '../assets/help-center/filter-category.svg?raw';
import searchSvg from '../assets/help-center/search.svg?raw';
import chevronDownSvg from '../assets/help-center/chevron-down.svg?raw';
import phoneSvg from '../assets/help-center/phone.svg?raw';
import chatSvg from '../assets/help-center/chat.svg?raw';
import pinSvg from '../assets/help-center/pin.svg?raw';
import arrowUpSvg from '../assets/help-center/arrow-up.svg?raw';

interface HelpCenterScreenProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

type HotlineItem = {
  id: string;
  labelKey: string;
  number: string;
  icon: ReactNode;
};

type OrganizationItem = {
  id: string;
  nameKey: string;
  categoryKey: string;
  descriptionKey: string;
  locationsKey: string;
  actionLabelKey: string;
  actionType: 'phone' | 'whatsapp';
  regionValues: string[];
  providerTypeValues: string[];
  contactMethodValues: string[];
};

type FilterField =
  | 'regionValues'
  | 'providerTypeValues'
  | 'contactMethodValues';

type FilterSectionConfig = {
  id: string;
  titleKey: string;
  field: FilterField;
  icon: 'pin' | 'shield' | 'phone';
  options: Array<{
    id: string;
    labelKey: string;
    value: string;
  }>;
};

function WaterIcon() {
  return <SvgIcon svg={waterSvg} className="size-24" />;
}

function ShieldIcon() {
  return <SvgIcon svg={shieldSvg} className="size-24" />;
}

function SirenIcon() {
  return <SvgIcon svg={sirenSvg} className="size-24" />;
}

function CrossIcon() {
  return <SvgIcon svg={crossSvg} className="size-24" />;
}

function FilterIcon() {
  return <SvgIcon svg={filterSvg} className="size-24" />;
}

function SearchIcon() {
  return <SvgIcon svg={searchSvg} className="size-16" />;
}

function ChevronDownIcon() {
  return <SvgIcon svg={chevronDownSvg} className="h-[8.17px] w-[14.83px]" />;
}

function PhoneIcon() {
  return <SvgIcon svg={phoneSvg} className="size-16" />;
}

function ChatIcon() {
  return <SvgIcon svg={chatSvg} className="size-16" />;
}

function PinIcon() {
  return <SvgIcon svg={pinSvg} className="size-[18px]" />;
}

function VerifyIcon() {
  return <SvgIcon svg={shieldSvg} className="size-[18px]" />;
}

function ArrowUpIcon() {
  return <SvgIcon svg={arrowUpSvg} className="size-24" />;
}

function SmallPinIcon() {
  return <SvgIcon svg={filterLocationSvg} className="size-16" />;
}

function SmallShieldIcon() {
  return <SvgIcon svg={filterProviderSvg} className="size-16" />;
}

function SmallFilterIcon() {
  return <SvgIcon svg={filterSvg} className="size-16" />;
}

function SmallPhoneIcon() {
  return <SvgIcon svg={filterCategorySvg} className="size-16" />;
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
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex w-[76px] appearance-none flex-col items-center gap-4 bg-transparent text-center"
    >
      <div className="flex size-48 items-center justify-center rounded-md border border-textfield-default-stroke bg-surface-primary text-button-icon-icon">
        {icon}
      </div>
      <p className="text-2xs font-weight-medium text-text-black">{label}</p>
      <p className="text-2xs font-weight-medium text-text-black">{number}</p>
    </button>
  );
}

const HOTLINES: HotlineItem[] = [
  {
    id: 'ambulance',
    labelKey: 'hotlines.ambulance',
    number: '140',
    icon: <CrossIcon />,
  },
  {
    id: 'civil',
    labelKey: 'hotlines.civilDefense',
    number: '125',
    icon: <SirenIcon />,
  },
  {
    id: 'medical',
    labelKey: 'hotlines.medicalAid',
    number: '129',
    icon: <ShieldIcon />,
  },
  {
    id: 'marine',
    labelKey: 'hotlines.marineRescue',
    number: '1714',
    icon: <WaterIcon />,
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
    regionValues: ['beirut', 'tripoli', 'sidon'],
    providerTypeValues: ['organization', 'clinic', 'medical'],
    contactMethodValues: ['phone', 'visit', 'hotline'],
  },
  {
    id: 'ministry-whatsapp',
    nameKey: 'items.ministryHealth',
    categoryKey: 'categories.government',
    descriptionKey: 'descriptions.healthServices',
    locationsKey: 'locations.beirutTripoliSidon',
    actionLabelKey: 'actions.whatsapp1900',
    actionType: 'whatsapp',
    regionValues: ['beirut', 'tripoli', 'sidon'],
    providerTypeValues: ['organization', 'clinic', 'medical'],
    contactMethodValues: ['whatsapp', 'message', 'hotline'],
  },
  {
    id: 'screening',
    nameKey: 'items.screeningCenter',
    categoryKey: 'categories.private',
    descriptionKey: 'descriptions.screening',
    locationsKey: 'locations.sidon',
    actionLabelKey: 'actions.call1234800',
    actionType: 'phone',
    regionValues: ['sidon'],
    providerTypeValues: ['clinic', 'screening', 'medical'],
    contactMethodValues: ['phone', 'appointment', 'visit'],
  },
  {
    id: 'hope',
    nameKey: 'items.hopeAssociation',
    categoryKey: 'categories.nonProfit',
    descriptionKey: 'descriptions.support',
    locationsKey: 'locations.beirut',
    actionLabelKey: 'actions.call4567700',
    actionType: 'phone',
    regionValues: ['beirut'],
    providerTypeValues: ['organization', 'care', 'field'],
    contactMethodValues: ['phone', 'visit', 'referral'],
  },
  {
    id: 'care-point',
    nameKey: 'items.carePoint',
    categoryKey: 'categories.private',
    descriptionKey: 'descriptions.primaryCare',
    locationsKey: 'locations.tripoli',
    actionLabelKey: 'actions.call8002222',
    actionType: 'phone',
    regionValues: ['tripoli'],
    providerTypeValues: ['clinic', 'care', 'medical'],
    contactMethodValues: ['phone', 'appointment', 'visit'],
  },
  {
    id: 'response-network',
    nameKey: 'items.responseNetwork',
    categoryKey: 'categories.nonProfit',
    descriptionKey: 'descriptions.fieldResponse',
    locationsKey: 'locations.beirutTripoli',
    actionLabelKey: 'actions.whatsapp2200',
    actionType: 'whatsapp',
    regionValues: ['beirut', 'tripoli'],
    providerTypeValues: ['organization', 'field', 'care'],
    contactMethodValues: ['whatsapp', 'message', 'field-support'],
  },
];

const FILTER_SECTIONS: FilterSectionConfig[] = [
  {
    id: 'location',
    titleKey: 'filtersSections.location',
    field: 'regionValues',
    icon: 'pin',
    options: [
      { id: 'beirut', labelKey: 'filtersOptions.beirut', value: 'beirut' },
      {
        id: 'ain-el-tineh',
        labelKey: 'filtersOptions.ainElTineh',
        value: 'ain-el-tineh',
      },
      { id: 'chouf', labelKey: 'filtersOptions.chouf', value: 'chouf' },
      { id: 'tripoli', labelKey: 'filtersOptions.tripoli', value: 'tripoli' },
      { id: 'sidon', labelKey: 'filtersOptions.sidon', value: 'sidon' },
      { id: 'jbeil', labelKey: 'filtersOptions.jbeil', value: 'jbeil' },
      { id: 'zahle', labelKey: 'filtersOptions.zahle', value: 'zahle' },
      { id: 'baalbek', labelKey: 'filtersOptions.baalbek', value: 'baalbek' },
      { id: 'tyre', labelKey: 'filtersOptions.tyre', value: 'tyre' },
      {
        id: 'bourj-hammoud',
        labelKey: 'filtersOptions.bourjHammoud',
        value: 'bourj-hammoud',
      },
      { id: 'hamra', labelKey: 'filtersOptions.hamra', value: 'hamra' },
      {
        id: 'ain-el-remmaneh',
        labelKey: 'filtersOptions.ainElRemmaneh',
        value: 'ain-el-remmaneh',
      },
    ],
  },
  {
    id: 'providerType',
    titleKey: 'filtersSections.serviceType',
    field: 'providerTypeValues',
    icon: 'shield',
    options: [
      {
        id: 'organization',
        labelKey: 'filtersOptions.organization',
        value: 'organization',
      },
      { id: 'care', labelKey: 'filtersOptions.care', value: 'care' },
      { id: 'clinic', labelKey: 'filtersOptions.clinic', value: 'clinic' },
      { id: 'medical', labelKey: 'filtersOptions.medical', value: 'medical' },
      {
        id: 'screening',
        labelKey: 'filtersOptions.screening',
        value: 'screening',
      },
      {
        id: 'hospital',
        labelKey: 'filtersOptions.hospital',
        value: 'hospital',
      },
      {
        id: 'pharmacy',
        labelKey: 'filtersOptions.pharmacy',
        value: 'pharmacy',
      },
      { id: 'lab', labelKey: 'filtersOptions.lab', value: 'lab' },
      { id: 'shelter', labelKey: 'filtersOptions.shelter', value: 'shelter' },
      { id: 'field', labelKey: 'filtersOptions.field', value: 'field' },
      {
        id: 'mental-health',
        labelKey: 'filtersOptions.mentalHealth',
        value: 'mental-health',
      },
    ],
  },
  {
    id: 'contact',
    titleKey: 'filtersSections.contact',
    field: 'contactMethodValues',
    icon: 'phone',
    options: [
      { id: 'phone', labelKey: 'filtersOptions.phone', value: 'phone' },
      {
        id: 'whatsapp',
        labelKey: 'filtersOptions.whatsapp',
        value: 'whatsapp',
      },
      { id: 'visit', labelKey: 'filtersOptions.visit', value: 'visit' },
      { id: 'hotline', labelKey: 'filtersOptions.hotline', value: 'hotline' },
      { id: 'message', labelKey: 'filtersOptions.message', value: 'message' },
      {
        id: 'appointment',
        labelKey: 'filtersOptions.appointment',
        value: 'appointment',
      },
      {
        id: 'referral',
        labelKey: 'filtersOptions.referral',
        value: 'referral',
      },
      {
        id: 'field-support',
        labelKey: 'filtersOptions.fieldSupport',
        value: 'field-support',
      },
      { id: 'email', labelKey: 'filtersOptions.email', value: 'email' },
      { id: 'walk-in', labelKey: 'filtersOptions.walkIn', value: 'walk-in' },
      { id: 'booking', labelKey: 'filtersOptions.booking', value: 'booking' },
    ],
  },
];

const MAX_PINNED_ORGANIZATIONS = 5;

function createEmptyFilterSelection() {
  return FILTER_SECTIONS.reduce<Record<string, string[]>>(
    (accumulator, section) => {
      accumulator[section.id] = [];
      return accumulator;
    },
    {}
  );
}

function cloneFilterSelection(selection: Record<string, string[]>) {
  return Object.fromEntries(
    Object.entries(selection).map(([sectionId, values]) => [
      sectionId,
      [...values],
    ])
  );
}

function countSelectedFilters(selection: Record<string, string[]>) {
  return Object.values(selection).reduce(
    (total, values) => total + values.length,
    0
  );
}

function findOrganizationById(organizationId: string) {
  return ORGANIZATIONS.find(
    (organization) => organization.id === organizationId
  );
}

function normalizeArabic(value: string) {
  return value
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .toLowerCase();
}

function filterOrganizations(
  filters: Record<string, string[]>,
  query: string,
  translate: (key: string) => string
) {
  const normalizedQuery = normalizeArabic(query.trim());

  return ORGANIZATIONS.filter((item) => {
    const matchesFilters = FILTER_SECTIONS.every((section) => {
      const activeValues = filters[section.id] ?? [];

      if (activeValues.length === 0) return true;

      return activeValues.some((value) => item[section.field].includes(value));
    });

    if (!matchesFilters) return false;

    if (!normalizedQuery) return true;

    const haystack = [
      translate(`helpCenter.${item.nameKey}`),
      translate(`helpCenter.${item.categoryKey}`),
      translate(`helpCenter.${item.descriptionKey}`),
      translate(`helpCenter.${item.locationsKey}`),
    ]
      .map(normalizeArabic)
      .join(' ');

    return haystack.includes(normalizedQuery);
  });
}

export default function HelpCenterScreen({
  theme,
  onToggleTheme,
  onToggleLanguage,
}: HelpCenterScreenProps) {
  const { t, i18n } = useTranslation();
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(4);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPinnedOrganizationsSheetOpen, setIsPinnedOrganizationsSheetOpen] =
    useState(false);
  const [
    organizationPendingReplacementId,
    setOrganizationPendingReplacementId,
  ] = useState<string | null>(null);
  const [pinnedOrganizationIds, setPinnedOrganizationIds] = useState<string[]>(
    []
  );
  const [appliedFilters, setAppliedFilters] = useState<
    Record<string, string[]>
  >(() => createEmptyFilterSelection());
  const [draftFilters, setDraftFilters] = useState<Record<string, string[]>>(
    () => createEmptyFilterSelection()
  );
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;
  const languageToggleLabel = activeLanguage?.startsWith('ar') ? 'EN' : 'AR';

  const filterSections = useMemo<HelpCenterFilterSection[]>(
    () =>
      FILTER_SECTIONS.map((section) => ({
        id: section.id,
        title: t(`helpCenter.${section.titleKey}`),
        icon:
          section.icon === 'pin' ? (
            <SmallPinIcon />
          ) : section.icon === 'shield' ? (
            <SmallShieldIcon />
          ) : section.icon === 'phone' ? (
            <SmallPhoneIcon />
          ) : (
            <SmallFilterIcon />
          ),
        options: section.options.map((option) => ({
          id: option.id,
          label: t(`helpCenter.${option.labelKey}`),
          value: option.value,
        })),
      })),
    [t]
  );

  const organizations = useMemo(
    () => filterOrganizations(appliedFilters, query, t),
    [appliedFilters, query, t]
  );
  const appliedFiltersCount = useMemo(
    () => countSelectedFilters(appliedFilters),
    [appliedFilters]
  );
  const draftOrganizations = useMemo(
    () => filterOrganizations(draftFilters, query, t),
    [draftFilters, query, t]
  );
  const pinnedOrganizations = useMemo<PinnedOrganizationOption[]>(
    () =>
      pinnedOrganizationIds
        .map(findOrganizationById)
        .filter((organization): organization is OrganizationItem =>
          Boolean(organization)
        )
        .map((organization) => ({
          id: organization.id,
          title: t(`helpCenter.${organization.nameKey}`),
          category: t(`helpCenter.${organization.categoryKey}`),
        })),
    [pinnedOrganizationIds, t]
  );

  const trimmedQuery = query.trim();
  const hasActiveQuery = trimmedQuery.length > 0;
  const hasSearchResults = organizations.length > 0;
  const visibleOrganizations = organizations.slice(0, visibleCount);

  const headerToggleClass = [
    'flex size-24 items-center justify-center rounded-md border',
    'border-white/35 bg-white/10 text-solid-white-400',
    'backdrop-blur-sm text-[10px] font-weight-bold tracking-[0.08em]',
  ].join(' ');

  const handleToggleFilterOption = (sectionId: string, optionValue: string) => {
    setDraftFilters((currentFilters) => {
      const currentValues = currentFilters[sectionId] ?? [];
      const hasValue = currentValues.includes(optionValue);
      const nextValues = hasValue
        ? currentValues.filter((value) => value !== optionValue)
        : [...currentValues, optionValue];

      return {
        ...currentFilters,
        [sectionId]: nextValues,
      };
    });
  };

  const handleOpenFilters = () => {
    setDraftFilters(cloneFilterSelection(appliedFilters));
    setIsFilterOpen(true);
  };

  const handleCancelFilters = () => {
    setDraftFilters(cloneFilterSelection(appliedFilters));
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = createEmptyFilterSelection();
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setVisibleCount(4);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(cloneFilterSelection(draftFilters));
    setVisibleCount(4);
    setIsFilterOpen(false);
  };

  const handleClosePinnedOrganizationsSheet = () => {
    setOrganizationPendingReplacementId(null);
    setIsPinnedOrganizationsSheetOpen(false);
  };

  const handleTogglePinnedOrganization = (organizationId: string) => {
    if (pinnedOrganizationIds.includes(organizationId)) {
      setPinnedOrganizationIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== organizationId)
      );
      return;
    }

    if (pinnedOrganizationIds.length >= MAX_PINNED_ORGANIZATIONS) {
      setOrganizationPendingReplacementId(organizationId);
      setIsPinnedOrganizationsSheetOpen(true);
      return;
    }

    setPinnedOrganizationIds((currentIds) => [...currentIds, organizationId]);
  };

  const handleReplacePinnedOrganization = (organizationIdToReplace: string) => {
    if (!organizationPendingReplacementId) return;

    setPinnedOrganizationIds((currentIds) => [
      ...currentIds.filter(
        (currentId) =>
          currentId !== organizationIdToReplace &&
          currentId !== organizationPendingReplacementId
      ),
      organizationPendingReplacementId,
    ]);
    handleClosePinnedOrganizationsSheet();
  };

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden bg-surface-primary pb-32">
        <ScreenHeader
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
                <span aria-hidden="true">{languageToggleLabel}</span>
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

        <div className="mx-auto flex w-full  flex-col gap-22 px-16 pt-12">
          <section className="flex flex-col gap-8">
            <h2
              className="w-full text-lg font-weight-medium text-start text-text-black"
              style={{
                color: 'var(--text-black)',
                WebkitTextFillColor: 'var(--text-black)',
              }}
            >
              {t('helpCenter.emergencyTitle')}
            </h2>
            <div className="flex h-[84px] items-center justify-between">
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

          <section className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-16">
              <div className="flex min-h-[36px] w-[318px] items-center gap-8 rounded-md border border-textfield-default-stroke bg-textfield-bg px-12 py-8">
                <span
                  className="flex size-20 items-center justify-center"
                  style={{ color: 'var(--components-text-icon)' }}
                >
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setVisibleCount(4);
                  }}
                  placeholder={t('helpCenter.searchPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent text-button font-weight-regular text-textfield-value placeholder:text-textfield-default-text outline-none text-start"
                />
              </div>

              <button
                type="button"
                aria-label={t('helpCenter.openFilters')}
                onClick={handleOpenFilters}
                className="relative flex shrink-0 items-center justify-center bg-surface-primary text-text-black"
              >
                <FilterIcon />
                {appliedFiltersCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -start-4 -top-4 h-16 min-w-16 rounded-full p-0 text-[10px] leading-none"
                    aria-hidden="true"
                  >
                    {appliedFiltersCount}
                  </Badge>
                )}
              </button>
            </div>

            <p className="w-full text-2xs font-weight-medium text-start text-solid-black-400">
              {hasActiveQuery && !hasSearchResults
                ? `0 ${t('helpCenter.organizationLabel')}`
                : `${visibleOrganizations.length} / ${organizations.length} ${t(
                    'helpCenter.organizationLabel'
                  )}`}
            </p>
          </section>

          <section className="relative flex flex-col gap-12">
            {hasActiveQuery && !hasSearchResults ? (
              <SearchEmptyState
                title={t('helpCenter.emptyStateTitle')}
                description={t('helpCenter.emptyStateDescription', {
                  query: trimmedQuery,
                })}
                actionLabel={t('helpCenter.emptyStateAction')}
                actionAriaLabel={t('helpCenter.emptyStateActionAriaLabel')}
                onAction={() =>
                  addToast({
                    heading: t('helpCenter.emptyStateToastHeading'),
                    body: t('helpCenter.emptyStateToastBody'),
                  })
                }
              />
            ) : (
              <>
                {visibleOrganizations.map((item) => {
                  const isPinned = pinnedOrganizationIds.includes(item.id);

                  return (
                    <ServiceCard
                      key={item.id}
                      title={t(`helpCenter.${item.nameKey}`)}
                      category={t(`helpCenter.${item.categoryKey}`)}
                      description={t(`helpCenter.${item.descriptionKey}`)}
                      locations={t(`helpCenter.${item.locationsKey}`)}
                      actionLabel={t(`helpCenter.${item.actionLabelKey}`)}
                      actionIcon={
                        item.actionType === 'phone' ? (
                          <PhoneIcon />
                        ) : (
                          <ChatIcon />
                        )
                      }
                      actionVariant={
                        item.actionType === 'phone' ? 'filled' : 'success'
                      }
                      primaryAction={{
                        ariaLabel: isPinned
                          ? t('helpCenter.unpinAction')
                          : t('helpCenter.pinAction'),
                        icon: <PinIcon />,
                        onClick: () => handleTogglePinnedOrganization(item.id),
                        variant: isPinned ? 'filled' : 'soft',
                        iconClassName: isPinned
                          ? 'rotate-[18deg] text-button-filled-text transition-transform duration-200 ease-out'
                          : 'text-button-icon-icon transition-transform duration-200 ease-out',
                      }}
                      secondaryAction={{
                        ariaLabel: t('helpCenter.verifyAction'),
                        icon: <VerifyIcon />,
                        variant: 'outline',
                      }}
                    />
                  );
                })}

                {organizations.length > visibleCount && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + 10)}
                      className="inline-flex h-11 items-center justify-center gap-8 rounded-md px-16 py-8 text-button font-weight-medium text-text-black"
                    >
                      <span>
                        {t('helpCenter.loadMore', {
                          count: organizations.length - visibleCount,
                        })}
                      </span>
                      <ChevronDownIcon />
                    </button>
                  </div>
                )}

                {hasSearchResults && (
                  <button
                    type="button"
                    aria-label={t('helpCenter.backToTop')}
                    className="absolute bottom-[56px] end-0 flex size-[52px] items-center justify-center rounded-full border border-textfield-default-stroke bg-button-icon-bg text-button-icon-icon shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  >
                    <ArrowUpIcon />
                  </button>
                )}
              </>
            )}
          </section>
        </div>
      </section>

      <HelpCenterFiltersSheet
        key={isFilterOpen ? 'open' : 'closed'}
        open={isFilterOpen}
        title={t('helpCenter.filtersTitle')}
        closeAriaLabel={t('helpCenter.filtersClose')}
        showMoreLabel={() => t('helpCenter.filtersShowMore')}
        secondaryActionLabel={t('helpCenter.filtersReset')}
        primaryActionLabel={t('helpCenter.filtersApplyCount', {
          count: draftOrganizations.length,
        })}
        sections={filterSections}
        selectedValues={draftFilters}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelFilters();
            return;
          }

          setIsFilterOpen(true);
        }}
        onToggleOption={handleToggleFilterOption}
        onSecondaryAction={handleClearFilters}
        onPrimaryAction={handleApplyFilters}
      />

      <PinnedOrganizationsSheet
        open={isPinnedOrganizationsSheetOpen}
        title={t('helpCenter.pinnedOrganizationsTitle')}
        description={t('helpCenter.pinnedOrganizationsDescription', {
          count: MAX_PINNED_ORGANIZATIONS,
        })}
        closeAriaLabel={t('helpCenter.pinnedOrganizationsClose')}
        cancelLabel={t('helpCenter.pinnedOrganizationsCancel')}
        replaceLabel={t('helpCenter.pinnedOrganizationsReplace')}
        replaceAriaLabel={(organizationTitle) =>
          t('helpCenter.pinnedOrganizationsReplaceAriaLabel', {
            organization: organizationTitle,
          })
        }
        pinnedOrganizations={pinnedOrganizations}
        onOpenChange={(open) => {
          if (!open) {
            handleClosePinnedOrganizationsSheet();
            return;
          }

          setIsPinnedOrganizationsSheetOpen(true);
        }}
        onCancel={handleClosePinnedOrganizationsSheet}
        onReplace={handleReplacePinnedOrganization}
      />
    </>
  );
}
