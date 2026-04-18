import { Badge } from '../ui/Badge';
import { helpCenterIcons } from './helpCenter.icons';

interface HelpCenterSearchBarProps {
  query: string;
  placeholder: string;
  filterAriaLabel: string;
  appliedFiltersCount: number;
  resultsLabel: string;
  onQueryChange: (query: string) => void;
  onOpenFilters: () => void;
}

export function HelpCenterSearchBar({
  query,
  placeholder,
  filterAriaLabel,
  appliedFiltersCount,
  resultsLabel,
  onQueryChange,
  onOpenFilters,
}: HelpCenterSearchBarProps) {
  const SearchIcon = helpCenterIcons.search;
  const FilterIcon = helpCenterIcons.filter;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-16">
        <div className="flex min-w-0 flex-1 items-center gap-8 rounded-md border border-textfield-default-stroke bg-textfield-bg px-12 py-8">
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
          className="relative flex shrink-0 items-center justify-center bg-surface-primary text-text-black"
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
      </div>

      <p className="w-full text-start text-2xs font-weight-medium text-solid-black-400">
        {resultsLabel}
      </p>
    </section>
  );
}
