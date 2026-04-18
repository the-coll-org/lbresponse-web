import { Badge } from '../ui/Badge';
import { helpCenterIcons } from './helpCenter.icons';

interface HelpCenterSearchBarProps {
  query: string;
  placeholder: string;
  filterAriaLabel: string;
  clearFiltersAriaLabel: string;
  appliedFiltersCount: number;
  resultsLabel: string;
  onQueryChange: (query: string) => void;
  onOpenFilters: () => void;
  onClearFilters: () => void;
}

function ClearFiltersIcon() {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function HelpCenterSearchBar({
  query,
  placeholder,
  filterAriaLabel,
  clearFiltersAriaLabel,
  appliedFiltersCount,
  resultsLabel,
  onQueryChange,
  onOpenFilters,
  onClearFilters,
}: HelpCenterSearchBarProps) {
  const SearchIcon = helpCenterIcons.search;
  const FilterIcon = helpCenterIcons.filter;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-16">
        <div className="flex h-40 min-w-0 flex-1 items-center gap-8 rounded-md border border-textfield-default-stroke bg-textfield-bg px-12">
          <span
            className="flex size-20 items-center justify-center text-textfield-icon"
            aria-hidden="true"
          >
            <SearchIcon />
          </span>

          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-start text-button font-weight-regular text-textfield-value placeholder:text-textfield-default-text outline-none"
          />
        </div>

        <button
          type="button"
          aria-label={filterAriaLabel}
          onClick={onOpenFilters}
          className="relative flex size-40 shrink-0 items-center justify-center rounded-md border border-textfield-default-stroke bg-surface-primary text-text-black"
        >
          <FilterIcon />

          {appliedFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -start-4 -top-4 h-16 min-w-16 rounded-full p-0 text-2xs leading-none"
              aria-hidden="true"
            >
              {appliedFiltersCount}
            </Badge>
          )}
        </button>

        {appliedFiltersCount > 0 && (
          <button
            type="button"
            aria-label={clearFiltersAriaLabel}
            onClick={onClearFilters}
            className="flex size-40 shrink-0 items-center justify-center rounded-md border border-textfield-default-stroke bg-surface-primary text-text-black"
          >
            <ClearFiltersIcon />
          </button>
        )}
      </div>

      <p className="w-full text-start text-2xs font-weight-medium text-solid-black-400">
        {resultsLabel}
      </p>
    </section>
  );
}
