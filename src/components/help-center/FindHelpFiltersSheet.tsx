import { BottomSheet } from '../ui/BottomSheet';
import { SectorIcon } from './sectorIcons';
import type {
  FindHelpFilterCatalog,
  FindHelpFilterGroup,
} from './findHelpAdapter';
import type { HelpCenterFilterSelection } from './helpCenter.types';

interface FindHelpFiltersSheetProps {
  open: boolean;
  catalog: FindHelpFilterCatalog;
  draftFilters: HelpCenterFilterSelection;
  copy: {
    title: string;
    closeAriaLabel: string;
    resetLabel: string;
    applyLabel: string;
    needsTitle: string;
    needsHint: string;
    needsClear: string;
    areasTitle: string;
    areasHint: string;
    areasClear: string;
  };
  onOpenChange: (open: boolean) => void;
  onToggleOption: (groupId: string, optionId: string) => void;
  onClearGroup: (groupId: string) => void;
  onReset: () => void;
  onApply: () => void;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-12"
      aria-hidden="true"
    >
      <path d="m4.5 12.5 4 4L20 6" />
    </svg>
  );
}

function NeedsTile({
  option,
  active,
  onToggle,
}: {
  option: { id: string; label: string };
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={[
        'inline-flex w-full items-center gap-12 rounded-md px-12 py-12 text-start text-button font-weight-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
        active
          ? 'border border-findhelp-primary bg-findhelp-primary-soft text-findhelp-primary-ink'
          : 'border border-transparent bg-surface-muted text-text-black',
      ].join(' ')}
    >
      <span
        className={[
          'flex size-28 shrink-0 items-center justify-center rounded-md',
          active
            ? 'bg-findhelp-primary text-solid-white-400'
            : 'bg-surface-primary text-findhelp-primary',
        ].join(' ')}
        aria-hidden="true"
      >
        {active ? <CheckIcon /> : <SectorIcon sector={option.id} />}
      </span>
      <span className="flex-1 truncate">{option.label}</span>
    </button>
  );
}

function AreaPill({
  option,
  active,
  onToggle,
}: {
  option: { id: string; label: string };
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={[
        'inline-flex h-32 items-center gap-4 rounded-full px-12 text-2xs font-weight-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
        active
          ? 'border border-findhelp-primary bg-findhelp-primary text-solid-white-400'
          : 'border border-findhelp-border-subtle bg-surface-muted text-text-black',
      ].join(' ')}
    >
      {active && (
        <span
          className="flex size-12 items-center justify-center"
          aria-hidden="true"
        >
          <CheckIcon />
        </span>
      )}
      <span>{option.label}</span>
    </button>
  );
}

function FilterGroupHeader({
  title,
  hint,
  showClear,
  clearLabel,
  onClear,
}: {
  title: string;
  hint: string;
  showClear: boolean;
  clearLabel: string;
  onClear: () => void;
}) {
  return (
    <div className="flex w-full items-baseline justify-between gap-8">
      <div className="flex min-w-0 items-baseline gap-4 text-start">
        <span className="text-button font-weight-bold text-text-black">
          {title}
        </span>
        <span className="text-2xs font-weight-regular text-solid-black-400">
          ({hint})
        </span>
      </div>
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-2xs font-weight-medium text-findhelp-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}

function NeedsSection({
  group,
  selectedIds,
  copy,
  onToggle,
  onClear,
}: {
  group: FindHelpFilterGroup;
  selectedIds: string[];
  copy: { title: string; hint: string; clear: string };
  onToggle: (optionId: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="flex w-full flex-col gap-12">
      <FilterGroupHeader
        title={copy.title}
        hint={copy.hint}
        showClear={selectedIds.length > 0}
        clearLabel={copy.clear}
        onClear={onClear}
      />
      <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-3">
        {group.options.map((option) => (
          <NeedsTile
            key={option.id}
            option={option}
            active={selectedIds.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>
    </section>
  );
}

function AreasSection({
  group,
  selectedIds,
  copy,
  onToggle,
  onClear,
}: {
  group: FindHelpFilterGroup;
  selectedIds: string[];
  copy: { title: string; hint: string; clear: string };
  onToggle: (optionId: string) => void;
  onClear: () => void;
}) {
  return (
    <section className="flex w-full flex-col gap-12">
      <FilterGroupHeader
        title={copy.title}
        hint={copy.hint}
        showClear={selectedIds.length > 0}
        clearLabel={copy.clear}
        onClear={onClear}
      />
      <div className="flex w-full flex-wrap gap-8">
        {group.options.map((option) => (
          <AreaPill
            key={option.id}
            option={option}
            active={selectedIds.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>
    </section>
  );
}

function OtherGroupSection({
  group,
  selectedIds,
  onToggle,
}: {
  group: FindHelpFilterGroup;
  selectedIds: string[];
  onToggle: (optionId: string) => void;
}) {
  return (
    <section className="flex w-full flex-col gap-12">
      <span className="text-button font-weight-bold text-text-black">
        {group.label}
      </span>
      <div className="flex w-full flex-wrap gap-8">
        {group.options.map((option) => (
          <AreaPill
            key={option.id}
            option={option}
            active={selectedIds.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>
    </section>
  );
}

export function FindHelpFiltersSheet({
  open,
  catalog,
  draftFilters,
  copy,
  onOpenChange,
  onToggleOption,
  onClearGroup,
  onReset,
  onApply,
}: FindHelpFiltersSheetProps) {
  return (
    <BottomSheet
      open={open}
      title={copy.title}
      closeAriaLabel={copy.closeAriaLabel}
      onOpenChange={onOpenChange}
      secondaryActionLabel={copy.resetLabel}
      primaryActionLabel={copy.applyLabel}
      onSecondaryAction={onReset}
      onPrimaryAction={onApply}
    >
      <div className="flex w-full flex-col gap-22 pb-16">
        {catalog.needs && (
          <NeedsSection
            group={catalog.needs}
            selectedIds={draftFilters[catalog.needs.id] ?? []}
            copy={{
              title: copy.needsTitle,
              hint: copy.needsHint,
              clear: copy.needsClear,
            }}
            onToggle={(optionId) => onToggleOption(catalog.needs!.id, optionId)}
            onClear={() => onClearGroup(catalog.needs!.id)}
          />
        )}
        {catalog.areas && (
          <AreasSection
            group={catalog.areas}
            selectedIds={draftFilters[catalog.areas.id] ?? []}
            copy={{
              title: copy.areasTitle,
              hint: copy.areasHint,
              clear: copy.areasClear,
            }}
            onToggle={(optionId) => onToggleOption(catalog.areas!.id, optionId)}
            onClear={() => onClearGroup(catalog.areas!.id)}
          />
        )}
        {catalog.others.map((group) => (
          <OtherGroupSection
            key={group.id}
            group={group}
            selectedIds={draftFilters[group.id] ?? []}
            onToggle={(optionId) => onToggleOption(group.id, optionId)}
          />
        ))}
      </div>
    </BottomSheet>
  );
}
