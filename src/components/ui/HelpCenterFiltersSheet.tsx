import { useState, type ReactNode } from 'react';
import { BottomSheet } from './BottomSheet';
import { Tag } from './Tag';

export interface HelpCenterFilterOption {
  id: string;
  label: string;
  value: string;
}

export interface HelpCenterFilterSection {
  id: string;
  title: string;
  icon?: ReactNode;
  options: HelpCenterFilterOption[];
}

export interface HelpCenterFiltersSheetProps {
  open: boolean;
  title: string;
  closeAriaLabel: string;
  showMoreLabel: (remainingCount: number) => string;
  secondaryActionLabel: string;
  primaryActionLabel: string;
  sections: HelpCenterFilterSection[];
  selectedValues: Record<string, string[]>;
  onOpenChange: (open: boolean) => void;
  onToggleOption: (sectionId: string, optionValue: string) => void;
  onSecondaryAction: () => void;
  onPrimaryAction: () => void;
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        'inline-flex h-32 w-auto items-center gap-4 rounded-md border px-8',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
        selected
          ? 'border-solid-primary-400 bg-solid-primary-300 text-solid-black-600'
          : 'border-textfield-default-stroke bg-surface-primary text-text-black',
      ].join(' ')}
    >
      <span className="truncate text-2xs font-weight-regular" dir="auto">
        {label}
      </span>
      {selected && (
        <span
          className="flex h-14 w-auto shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </span>
      )}
    </button>
  );
}

function PlusIcon() {
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
      className="size-16"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function createVisibleOptionCounts(sections: HelpCenterFilterSection[]) {
  return Object.fromEntries(sections.map((section) => [section.id, 10]));
}

export function HelpCenterFiltersSheet({
  open,
  title,
  closeAriaLabel,
  showMoreLabel,
  secondaryActionLabel,
  primaryActionLabel,
  sections,
  selectedValues,
  onOpenChange,
  onToggleOption,
  onSecondaryAction,
  onPrimaryAction,
}: HelpCenterFiltersSheetProps) {
  const [visibleOptionCounts, setVisibleOptionCounts] = useState<
    Record<string, number>
  >(() => createVisibleOptionCounts(sections));

  return (
    <BottomSheet
      open={open}
      title={title}
      closeAriaLabel={closeAriaLabel}
      secondaryActionLabel={secondaryActionLabel}
      primaryActionLabel={primaryActionLabel}
      onOpenChange={onOpenChange}
      onSecondaryAction={onSecondaryAction}
      onPrimaryAction={onPrimaryAction}
    >
      <div className="flex w-full flex-col gap-16">
        {sections.map((section) => {
          const activeValues = selectedValues[section.id] ?? [];
          const visibleCount = visibleOptionCounts[section.id] ?? 10;
          const visibleOptions = section.options.slice(0, visibleCount);
          const remainingCount = Math.max(
            section.options.length - visibleCount,
            0
          );

          return (
            <fieldset
              key={section.id}
              className="flex w-full min-w-0 flex-col gap-12 border-0 p-0"
            >
              <div className="flex w-full items-center justify-start gap-4 text-start">
                {section.icon && (
                  <span
                    className="flex size-16 items-center justify-center text-text-black"
                    aria-hidden="true"
                  >
                    {section.icon}
                  </span>
                )}
                <span className="text-xs font-weight-medium text-text-black">
                  {section.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-start gap-8">
                {visibleOptions.map((option) => (
                  <FilterChip
                    key={option.id}
                    label={option.label}
                    selected={activeValues.includes(option.value)}
                    onClick={() => onToggleOption(section.id, option.value)}
                  />
                ))}
              </div>

              {remainingCount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleOptionCounts((currentCounts) => ({
                      ...currentCounts,
                      [section.id]: visibleCount + 10,
                    }))
                  }
                  className="inline-flex items-center justify-start rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
                >
                  <Tag
                    label={showMoreLabel(remainingCount)}
                    leadingIcon={<PlusIcon />}
                    className="h-32 border-textfield-default-stroke bg-surface-primary px-8 text-text-black"
                  />
                </button>
              )}
            </fieldset>
          );
        })}
      </div>
    </BottomSheet>
  );
}
