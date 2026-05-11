import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { needHelpResponse } from './needHelp.data';
import { needHelpIcons } from './needHelp.icons';
import type {
  LocalizedText,
  NeedHelpActionType,
  NeedHelpFilter,
  NeedHelpFilterIcon,
  NeedHelpService,
  NeedHelpServiceIcon,
} from './needHelp.types';

function copyForLanguage(copy: LocalizedText, language: string) {
  return language.startsWith('ar') ? copy.ar : copy.en;
}

function NeedHelpSearch({
  placeholder,
  resultsLabel,
}: {
  placeholder: string;
  resultsLabel: string;
}) {
  const SearchIcon = needHelpIcons.search;

  return (
    <section className="flex flex-col gap-8">
      <label htmlFor="need-help-search" className="sr-only">
        {placeholder}
      </label>
      <div className="flex items-center gap-8 rounded-xl border border-textfield-default-stroke bg-surface-primary px-16 py-12 shadow-2xs">
        <input
          id="need-help-search"
          type="search"
          readOnly
          value=""
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-weight-regular text-textfield-value placeholder:text-textfield-default-text outline-none"
        />
        <span className="text-textfield-icon" aria-hidden="true">
          <SearchIcon />
        </span>
      </div>
      <p className="text-end text-2xs font-weight-medium text-solid-black-400">
        {resultsLabel}
      </p>
    </section>
  );
}

function FilterIcon({ icon }: { icon: NeedHelpFilterIcon }) {
  if (icon === 'location') {
    const Icon = needHelpIcons.map;
    return <Icon />;
  }

  const Icon = needHelpIcons[icon];
  return <Icon />;
}

function NeedHelpFilters({
  filters,
  language,
}: {
  filters: NeedHelpFilter[];
  language: string;
}) {
  return (
    <section className="flex flex-wrap gap-8">
      {filters.map((filter) => (
        <Tag
          key={filter.id}
          leadingIcon={<FilterIcon icon={filter.icon} />}
          className={
            filter.active
              ? 'border-transparent bg-button-tonal-bg text-text-black'
              : ''
          }
        >
          {copyForLanguage(filter.label, language)}
        </Tag>
      ))}
    </section>
  );
}

function ServiceTypeIcon({ icon }: { icon: NeedHelpServiceIcon }) {
  const Icon = needHelpIcons[icon];

  return (
    <div className="flex size-44 items-center justify-center rounded-xl border border-textfield-default-stroke bg-surface-primary text-text-black">
      <Icon />
    </div>
  );
}

function ServiceMeta({
  updatedAtLabel,
  location,
}: {
  updatedAtLabel: string;
  location: string;
}) {
  const ClockIcon = needHelpIcons.clock;
  const PersonIcon = needHelpIcons.person;

  return (
    <>
      <div className="flex items-center gap-4 text-2xs font-weight-regular text-solid-black-400">
        <ClockIcon />
        <span>{updatedAtLabel}</span>
      </div>
      <div className="flex items-center gap-4 text-2xs font-weight-regular text-text-black">
        <PersonIcon />
        <span>{location}</span>
      </div>
    </>
  );
}

function ActionIcon({ type }: { type: NeedHelpActionType }) {
  const Icon = type === 'phone' ? needHelpIcons.phone : needHelpIcons.whatsapp;

  return <Icon />;
}

function NeedHelpActionLink({
  href,
  label,
  type,
}: {
  href: string;
  label: string;
  type: NeedHelpActionType;
}) {
  return (
    <a
      href={href}
      className={[
        'inline-flex min-h-44 flex-1 items-center justify-center gap-8 rounded-md px-16 py-8 text-button font-weight-medium',
        'bg-button-filled-bg text-button-filled-text',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
        type === 'whatsapp' ? 'bg-solid-green-600' : '',
      ].join(' ')}
    >
      <span>{label}</span>
      <span className="shrink-0" aria-hidden="true">
        <ActionIcon type={type} />
      </span>
    </a>
  );
}

function NeedHelpServiceCard({
  service,
  language,
}: {
  service: NeedHelpService;
  language: string;
}) {
  const mapLabel = copyForLanguage(service.mapLabel, language);

  return (
    <article className="rounded-2xl border border-textfield-default-stroke bg-button-tonal-bg/30 p-12 shadow-xs">
      <div className="flex flex-col gap-16">
        <div className="flex items-start justify-between gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-12">
            <div className="flex items-start justify-between gap-8">
              <div className="flex min-w-0 flex-1 flex-col gap-8 text-start">
                <div className="flex flex-wrap items-center gap-8">
                  <h2 className="text-lg font-weight-bold text-text-black">
                    {copyForLanguage(service.title, language)}
                  </h2>
                  <Tag>{copyForLanguage(service.category, language)}</Tag>
                </div>
                <p className="text-2xs font-weight-regular text-solid-black-400">
                  {copyForLanguage(service.description, language)}
                </p>
              </div>
              <ServiceTypeIcon icon={service.icon} />
            </div>

            <ServiceMeta
              updatedAtLabel={copyForLanguage(service.updatedAtLabel, language)}
              location={copyForLanguage(service.location, language)}
            />
          </div>
        </div>

        <div className="flex items-center gap-12">
          <NeedHelpActionLink
            href={service.action.href}
            label={copyForLanguage(service.action.label, language)}
            type={service.action.type}
          />

          <Button
            variant="tonal"
            className="min-h-44 bg-solid-primary-300 text-text-black"
            rightIcon={<needHelpIcons.map />}
          >
            {mapLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

function NeedHelpBackToTop({ label }: { label: string }) {
  const ArrowUpIcon = needHelpIcons.arrowUp;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed start-16 bottom-[80px] flex size-64 items-center justify-center rounded-full border border-textfield-default-stroke bg-surface-primary text-solid-black-400 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
    >
      <ArrowUpIcon />
    </button>
  );
}

export default function NeedHelpScreen() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ar';
  const pageLabel = copyForLanguage(needHelpResponse.pageLabel, language);

  return (
    <section className="min-h-screen bg-surface-primary px-16 pt-20 pb-[calc(64px+env(safe-area-inset-bottom)+16px)]">
      <div className="mx-auto flex w-full max-w-screen-sm flex-col gap-16">
        <p className="text-center text-xs font-weight-medium text-solid-black-300">
          {pageLabel}
        </p>

        <div
          className="overflow-hidden rounded-2xl bg-surface-primary"
          data-testid="need-help-screen"
        >
          <div className="flex flex-col gap-16 px-12 py-16">
            <NeedHelpSearch
              placeholder={copyForLanguage(
                needHelpResponse.searchPlaceholder,
                language
              )}
              resultsLabel={copyForLanguage(
                needHelpResponse.resultsLabel,
                language
              )}
            />

            <NeedHelpFilters
              filters={needHelpResponse.filters}
              language={language}
            />

            <div className="flex flex-col gap-16">
              {needHelpResponse.services.map((service) => (
                <NeedHelpServiceCard
                  key={service.id}
                  service={service}
                  language={language}
                />
              ))}
            </div>

            <Button
              variant="text"
              className="justify-center text-sm font-weight-bold text-text-black"
              rightIcon={
                <svg
                  viewBox="0 0 24 24"
                  className="size-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              }
            >
              {copyForLanguage(needHelpResponse.showMoreLabel, language)}
            </Button>
          </div>
        </div>
      </div>

      <NeedHelpBackToTop
        label={language.startsWith('ar') ? 'العودة إلى الأعلى' : 'Back to top'}
      />
    </section>
  );
}
