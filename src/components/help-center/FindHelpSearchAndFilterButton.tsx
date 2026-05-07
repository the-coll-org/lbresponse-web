import { helpCenterIcons } from './helpCenter.icons';

interface FindHelpSearchAndFilterButtonProps {
  query: string;
  placeholder: string;
  searchClearLabel: string;
  filtersLabel: string;
  filtersBadgeAriaLabel: string;
  appliedFiltersCount: number;
  onQueryChange: (query: string) => void;
  onOpenFilters: () => void;
}

function CloseSmallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function FindHelpSearchAndFilterButton({
  query,
  placeholder,
  searchClearLabel,
  filtersLabel,
  filtersBadgeAriaLabel,
  appliedFiltersCount,
  onQueryChange,
  onOpenFilters,
}: FindHelpSearchAndFilterButtonProps) {
  const SearchIcon = helpCenterIcons.search;
  const FilterIcon = helpCenterIcons.filter;

  const filterButtonClass =
    appliedFiltersCount > 0
      ? 'border-findhelp-primary bg-findhelp-primary-soft text-findhelp-primary-ink'
      : 'border-findhelp-border-subtle bg-surface-primary text-text-black';

  return (
    <div className="flex w-full items-center gap-8">
      <div className="flex h-44 min-w-0 flex-1 items-center gap-8 rounded-md border border-findhelp-border-subtle bg-surface-primary ps-12 pe-8">
        <span
          className="flex size-20 shrink-0 items-center justify-center text-textfield-icon"
          aria-hidden="true"
        >
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-start text-button font-weight-regular text-text-black placeholder:text-solid-black-400 outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            aria-label={searchClearLabel}
            onClick={() => onQueryChange('')}
            className="flex size-32 shrink-0 items-center justify-center rounded-md text-solid-black-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
          >
            <CloseSmallIcon />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenFilters}
        className={[
          'relative inline-flex h-44 shrink-0 items-center gap-8 rounded-md border px-16',
          'text-button font-weight-medium',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
          filterButtonClass,
        ].join(' ')}
      >
        <span
          className="flex size-16 items-center justify-center"
          aria-hidden="true"
        >
          <FilterIcon />
        </span>
        <span>{filtersLabel}</span>
        {appliedFiltersCount > 0 && (
          <span
            aria-label={filtersBadgeAriaLabel}
            className="ms-4 inline-flex h-20 min-w-20 items-center justify-center rounded-full bg-findhelp-primary px-4 text-2xs font-weight-bold text-solid-white-400"
          >
            {appliedFiltersCount}
          </span>
        )}
      </button>
    </div>
  );
}
