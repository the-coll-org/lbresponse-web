export interface FindHelpActiveFilterChip {
  groupId: string;
  optionId: string;
  label: string;
}

interface FindHelpActiveFiltersProps {
  label: string;
  clearAllLabel: string;
  removeAriaLabel: (optionLabel: string) => string;
  chips: FindHelpActiveFilterChip[];
  onRemove: (groupId: string, optionId: string) => void;
  onClearAll: () => void;
}

function CloseSmallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-10"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function FindHelpActiveFilters({
  label,
  clearAllLabel,
  removeAriaLabel,
  chips,
  onRemove,
  onClearAll,
}: FindHelpActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap items-center gap-8">
      <span className="text-2xs font-weight-regular text-solid-black-400">
        {label}
      </span>
      {chips.map((chip) => (
        <button
          key={`${chip.groupId}-${chip.optionId}`}
          type="button"
          aria-label={removeAriaLabel(chip.label)}
          onClick={() => onRemove(chip.groupId, chip.optionId)}
          className="inline-flex h-24 max-w-[180px] items-center gap-4 rounded-full bg-findhelp-primary-soft ps-8 pe-4 text-2xs font-weight-bold text-findhelp-primary-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
        >
          <span className="truncate">{chip.label}</span>
          <CloseSmallIcon />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-2xs font-weight-bold text-findhelp-primary underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
      >
        {clearAllLabel}
      </button>
    </div>
  );
}
