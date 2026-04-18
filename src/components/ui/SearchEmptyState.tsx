import { Button } from './Button';
import { SvgIcon } from './SvgIcon';
import emptySearchIllustrationSvg from '../../assets/help-center/empty-search-illustration.svg?raw';
import addSvg from '../../assets/help-center/add.svg?raw';

export interface SearchEmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionAriaLabel: string;
  onAction: () => void;
}

function EmptySearchIllustration() {
  return (
    <SvgIcon
      svg={emptySearchIllustrationSvg}
      className="size-70 text-solid-black-400"
    />
  );
}

function AddIcon() {
  return <SvgIcon svg={addSvg} className="size-16" />;
}

export function SearchEmptyState({
  title,
  description,
  actionLabel,
  actionAriaLabel,
  onAction,
}: SearchEmptyStateProps) {
  return (
    <section className="flex w-full flex-col items-center gap-12  text-center">
      <EmptySearchIllustration />

      <div className="flex w-full max-w-full flex-col items-center gap-4">
        <h3 className="text-sm font-weight-medium text-text-black">{title}</h3>
        <p className="text-xs font-weight-regular text-solid-black-400">
          {description}
        </p>
      </div>

      <Button
        aria-label={actionAriaLabel}
        className="h-44 justify-center"
        onClick={onAction}
        leftIcon={<AddIcon />}
      >
        {actionLabel}
      </Button>
    </section>
  );
}
