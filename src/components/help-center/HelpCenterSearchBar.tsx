import type { ReactNode } from 'react';
import { Badge } from '../ui/Badge';
import { helpCenterIcons } from './helpCenter.icons';

export interface AppliedFilterChip {
  sectionId: string;
  value: string;
  label: string;
  icon?: ReactNode;
}

interface HelpCenterSearchBarProps {
  query: string;
  placeholder: string;
  filterAriaLabel: string;
  clearFiltersAriaLabel: string;
  clearFiltersLabel: string;
  appliedFiltersCount: number;
  appliedFilterChips: AppliedFilterChip[];
  resultsLabel: string;
  onQueryChange: (query: string) => void;
  onOpenFilters: () => void;
  onClearFilters: () => void;
  onRemoveFilter: (sectionId: string, value: string) => void;
}

function ChipRemoveIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export function HelpCenterSearchBar({
  query,
  placeholder,
  filterAriaLabel,
  clearFiltersAriaLabel,
  clearFiltersLabel,
  appliedFiltersCount,
  appliedFilterChips,
  resultsLabel,
  onQueryChange,
  onOpenFilters,
  onClearFilters,
  onRemoveFilter,
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
      </div>

      {appliedFiltersCount > 0 && appliedFilterChips.length > 0 && (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex w-max items-center gap-8">
            <button
              type="button"
              aria-label={clearFiltersAriaLabel}
              onClick={onClearFilters}
              className="inline-flex h-32 shrink-0 items-center gap-4 rounded-md bg-badge-destructive px-8 text-2xs font-weight-medium text-badge-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
            >
              <TrashIcon />
              <span>{clearFiltersLabel}</span>
            </button>

            {appliedFilterChips.map((chip) => (
              <button
                key={`${chip.sectionId}-${chip.value}`}
                type="button"
                onClick={() => onRemoveFilter(chip.sectionId, chip.value)}
                className="inline-flex h-32 w-auto shrink-0 items-center gap-4 rounded-md border border-solid-primary-400 bg-solid-primary-300 px-8 text-solid-black-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
              >
                {chip.icon && (
                  <span
                    className="flex h-14 w-auto shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    {chip.icon}
                  </span>
                )}
                <span
                  className="truncate text-2xs font-weight-regular"
                  dir="auto"
                >
                  {chip.label}
                </span>
                <span
                  className="flex h-14 w-auto shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <ChipRemoveIcon />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="w-full text-start text-2xs font-weight-medium text-solid-black-400">
        {resultsLabel}
      </p>
    </section>
  );
}
