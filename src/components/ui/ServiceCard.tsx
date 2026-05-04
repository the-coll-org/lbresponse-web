import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { Button } from './Button';
import { SvgIcon } from './SvgIcon';
import locationSvg from '../../assets/help-center/location.svg?raw';

export interface ServiceCardAction {
  ariaLabel: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'soft' | 'outline' | 'filled';
  iconClassName?: string;
}

export interface ServiceCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  title: ReactNode;
  category?: ReactNode;
  description?: ReactNode;
  locations?: ReactNode;
  actionLabel: ReactNode;
  actionIcon?: ReactNode;
  actionVariant?: 'filled' | 'success';
  actionDisabled?: boolean;
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  primaryAction?: ServiceCardAction;
  secondaryAction?: ServiceCardAction;
}

const CARD_BASE = [
  'w-full rounded-lg border border-textfield-default-stroke',
  'bg-surface-primary p-12 overflow-hidden',
].join(' ');

const ACTION_VARIANTS = {
  filled: 'bg-button-filled-bg text-button-filled-text',
  success: 'bg-solid-green-600 text-button-filled-text',
} as const;

function CardIconButton({
  ariaLabel,
  icon,
  onClick,
  variant = 'soft',
  iconClassName = '',
}: ServiceCardAction) {
  const variantClass =
    variant === 'filled'
      ? 'size-32 bg-button-filled-bg p-8 text-button-filled-text'
      : variant === 'outline'
        ? 'w-[38px] h-[40px] border border-textfield-default-stroke bg-surface-primary p-4'
        : 'size-32 bg-button-icon-bg p-8';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        'shrink-0 rounded-md text-button-icon-icon',
        'flex items-center justify-center',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-solid-primary-500',
        variantClass,
      ].join(' ')}
    >
      <div
        className={`size-[18px] flex items-center justify-center ${iconClassName}`.trim()}
        aria-hidden="true"
      >
        {icon}
      </div>
    </button>
  );
}

function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-md border border-textfield-default-stroke px-8 py-4 text-2xs font-weight-regular text-text-black">
      {children}
    </span>
  );
}

export function ServiceCard({
  title,
  category,
  description,
  locations,
  actionLabel,
  actionIcon,
  actionVariant = 'filled',
  actionDisabled = false,
  onActionClick,
  primaryAction,
  secondaryAction,
  className = '',
  ...props
}: ServiceCardProps) {
  const actionClass = ACTION_VARIANTS[actionVariant];

  return (
    <article className={`${CARD_BASE} ${className}`.trim()} {...props}>
      <div className="flex h-full w-full flex-col items-start gap-12">
        <header className="flex w-full items-start justify-start gap-12">
          {secondaryAction && <CardIconButton {...secondaryAction} />}

          <div className="flex flex-1 justify-start">
            <div className="flex flex-1 flex-col items-start gap-8 text-start">
              <div className="flex w-full items-start justify-between gap-8">
                <p className="min-w-0 flex-1 text-sm font-weight-bold text-text-black break-words">
                  {title}
                </p>
                {category && <CategoryPill>{category}</CategoryPill>}
              </div>
              {description && (
                <p className="w-full text-2xs font-weight-regular text-textfield-default-text">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {primaryAction ? (
              <CardIconButton {...primaryAction} />
            ) : (
              <div className="block size-32" aria-hidden="true" />
            )}
          </div>
        </header>

        {locations && (
          <div className="flex w-full items-center justify-start gap-4 text-start text-button font-weight-regular text-text-black">
            <div
              className="flex size-16 items-center justify-center"
              aria-hidden="true"
            >
              <SvgIcon svg={locationSvg} className="size-16" />
            </div>
            <p className="break-words">{locations}</p>
          </div>
        )}

        <Button
          onClick={actionDisabled ? undefined : onActionClick}
          disabled={actionDisabled}
          className={[
            'mt-auto h-[44px] w-full min-h-[37px] max-h-[48px] overflow-hidden',
            actionClass,
          ].join(' ')}
          rightIcon={
            actionIcon ? (
              <div
                className="flex size-16 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                {actionIcon}
              </div>
            ) : undefined
          }
        >
          {actionLabel}
        </Button>
      </div>
    </article>
  );
}
