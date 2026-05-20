import { OrganizationCard } from '../ui/OrganizationCard';
import { Tag } from '../ui/Tag';
import { needHelpResponse } from './needHelp.data';
import { needHelpIcons } from './needHelp.icons';
import { useNeedHelpScreenState } from './useNeedHelpScreenState';
import type {
  LocalizedText,
  NeedHelpFilterIcon,
  NeedHelpOrganizationViewModel,
} from './needHelp.types';

function copyForLanguage(copy: LocalizedText, language: string) {
  return language.startsWith('ar') ? copy.ar : copy.en;
}

function NeedHelpSearch({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const SearchIcon = needHelpIcons.search;

  return (
    <section className="flex flex-col gap-8">
      <label htmlFor="need-help-search" className="sr-only">
        {placeholder}
      </label>
      <div className="flex h-40 items-center gap-8 rounded-md border border-textfield-default-stroke bg-textfield-bg px-12">
        <span
          className="flex size-20 items-center justify-center text-textfield-icon"
          aria-hidden="true"
        >
          <SearchIcon />
        </span>
        <input
          id="need-help-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-start text-button font-weight-regular text-textfield-value placeholder:text-textfield-default-text outline-none"
        />
      </div>
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

function NeedHelpOrganizationCard({
  org,
  isArabic,
}: {
  org: NeedHelpOrganizationViewModel;
  isArabic: boolean;
}) {
  const ServiceIcon = needHelpIcons[org.icon as keyof typeof needHelpIcons];
  const PhoneIcon = needHelpIcons.phone;
  const WhatsappIcon = needHelpIcons.whatsapp;

  return (
    <OrganizationCard
      title={org.title}
      category={org.category}
      serviceIcon={<ServiceIcon />}
      description={org.description}
      locationsArray={org.locations}
      moreLocationsLabel={(count) =>
        isArabic ? `+${count} أخرى` : `+${count} more`
      }
      locationsDialogTitle={org.title}
      locationsDialogCloseLabel={isArabic ? 'إغلاق' : 'Close'}
      updatedAt={org.updatedAtLabel ?? undefined}
      mapLabel={org.mapUrl ? org.mapLabel : undefined}
      onMapClick={() => {
        if (org.mapUrl) window.open(org.mapUrl, '_blank', 'noopener');
      }}
      actionLabel={org.actionLabel}
      actionIcon={org.actionType === 'phone' ? <PhoneIcon /> : <WhatsappIcon />}
      actionVariant={org.actionType === 'phone' ? 'filled' : 'success'}
      actionDisabled={org.actionDisabled}
      onActionClick={() => {
        if (!org.actionDisabled && org.actionHref) {
          window.location.href = org.actionHref;
        }
      }}
    />
  );
}

function NeedHelpBackToTop({ label }: { label: string }) {
  const ArrowUpIcon = needHelpIcons.arrowUp;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 end-24 z-10 flex size-48 items-center justify-center rounded-full border border-textfield-default-stroke bg-button-icon-bg text-button-icon-icon shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
    >
      <ArrowUpIcon />
    </button>
  );
}

function LoadingSkeletonCard() {
  return (
    <div className="w-full animate-pulse rounded-lg border border-textfield-default-stroke bg-surface-primary p-12">
      <div className="mb-8 h-16 w-2/3 rounded bg-solid-black-100" />
      <div className="mb-4 h-12 w-1/3 rounded bg-solid-black-100" />
      <div className="h-12 w-1/2 rounded bg-solid-black-100" />
    </div>
  );
}

export default function NeedHelpScreen() {
  const {
    language,
    query,
    filters,
    visibleOrganizations,
    total,
    shownCount,
    remaining,
    isLoading,
    isLoadingMore,
    error,
    canLoadMore,
    handleQueryChange,
    handleToggleFilter,
    handleLoadMore,
    handleRetry,
  } = useNeedHelpScreenState();

  const isArabic = language.startsWith('ar');

  const resultsLabel = isLoading
    ? ''
    : isArabic
      ? `${shownCount.toString()} / ${total.toString()} منظمة`
      : `${shownCount.toString()} / ${total.toString()} organizations`;

  const showMoreLabel =
    remaining > 0
      ? copyForLanguage(needHelpResponse.showMoreLabel, language).replace(
          /\d+/,
          remaining.toString()
        )
      : copyForLanguage(needHelpResponse.showMoreLabel, language);

  return (
    <section className="min-h-screen w-full overflow-x-hidden bg-surface-primary pt-20 pb-[calc(64px+env(safe-area-inset-bottom)+16px)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-22 px-16 md:px-32 lg:px-48">
        <div className="flex flex-col gap-8" data-testid="need-help-screen">
          <NeedHelpSearch
            placeholder={copyForLanguage(
              needHelpResponse.searchPlaceholder,
              language
            )}
            value={query}
            onChange={handleQueryChange}
          />

          <section className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex w-max items-center gap-8">
              {filters.map((filter) => (
                <Tag
                  key={filter.id}
                  leadingIcon={<FilterIcon icon={filter.icon} />}
                  className={[
                    'shrink-0 cursor-pointer',
                    filter.active
                      ? 'border-solid-primary-400 bg-solid-primary-300 text-solid-black-600'
                      : '',
                  ].join(' ')}
                  onClick={() => handleToggleFilter(filter.id)}
                >
                  {copyForLanguage(filter.label, language)}
                </Tag>
              ))}
            </div>
          </section>

          {resultsLabel ? (
            <p className="text-start text-2xs font-weight-medium text-solid-black-400">
              {resultsLabel}
            </p>
          ) : null}
        </div>

        {error && !isLoading && (
          <div className="flex flex-col items-center gap-12 py-32 text-center">
            <p className="text-sm text-text-secondary">
              {isArabic
                ? 'حدث خطأ. يرجى المحاولة مرة أخرى.'
                : 'Something went wrong. Please try again.'}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex h-40 items-center rounded-md bg-button-filled-bg px-16 text-button font-weight-medium text-button-filled-text"
            >
              {isArabic ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingSkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {!error && visibleOrganizations.length === 0 && (
              <p className="py-32 text-center text-sm text-text-secondary">
                {isArabic ? 'لا توجد نتائج' : 'No results found'}
              </p>
            )}

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
              {visibleOrganizations.map((org) => (
                <NeedHelpOrganizationCard
                  key={org.id}
                  org={org}
                  isArabic={isArabic}
                />
              ))}
            </div>

            {canLoadMore && (
              <div className="flex justify-center">
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  className="inline-flex h-44 items-center justify-center gap-8 rounded-md px-16 py-8 text-button font-weight-medium text-text-black disabled:opacity-50"
                >
                  <span>{showMoreLabel}</span>
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
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <NeedHelpBackToTop
        label={isArabic ? 'العودة إلى الأعلى' : 'Back to top'}
      />
    </section>
  );
}
