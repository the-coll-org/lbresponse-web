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

export interface ServiceCardSecondaryButton {
  label: ReactNode;
  icon?: ReactNode;
  ariaLabel: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
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
  timeLabel?: ReactNode;
  categoryIcon?: ReactNode;
  secondaryButton?: ServiceCardSecondaryButton;
}

const CARD_BASE = [
  'w-full rounded-xl border border-textfield-default-stroke',
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

function CategoryIconBadge({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex size-40 shrink-0 items-center justify-center rounded-md border border-textfield-default-stroke bg-surface-primary text-text-black"
      aria-hidden="true"
    >
      <div className="flex size-20 items-center justify-center">{children}</div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-12"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.5v3.7l2.2 1.3" />
    </svg>
  );
}

function TimeBadge({ children }: { children: ReactNode }) {
  return (
    <span
      dir="ltr"
      className="inline-flex shrink-0 items-center gap-4 text-2xs font-weight-regular leading-none text-solid-black-400"
    >
      <span className="flex size-12 shrink-0 items-center justify-center">
        <ClockIcon />
      </span>
      <span className="leading-none">{children}</span>
    </span>
  );
}

function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex min-w-0 max-w-[10rem] shrink items-center justify-center overflow-hidden truncate whitespace-nowrap rounded-md border border-textfield-default-stroke px-8 py-4 text-2xs font-weight-regular text-text-black">
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
  timeLabel,
  categoryIcon,
  secondaryButton,
  className = '',
  ...props
}: ServiceCardProps) {
  const actionClass = ACTION_VARIANTS[actionVariant];

  const showHeader = Boolean(
    timeLabel ||
    secondaryAction ||
    primaryAction ||
    categoryIcon ||
    title ||
    category
  );

  return (
    <article className={`${CARD_BASE} ${className}`.trim()} {...props}>
      <div className="flex h-full w-full flex-col items-start gap-12">
        {showHeader && (
          <div className="flex w-full flex-wrap items-center gap-8">
            {categoryIcon && (
              <CategoryIconBadge>{categoryIcon}</CategoryIconBadge>
            )}
            {primaryAction && <CardIconButton {...primaryAction} />}
            <p className="min-w-0 text-sm font-weight-bold text-text-black break-words text-start">
              {title}
            </p>
            {category && <CategoryPill>{category}</CategoryPill>}
            <div className="ms-auto flex shrink-0 items-center gap-8">
              {secondaryAction ? (
                <CardIconButton {...secondaryAction} />
              ) : timeLabel ? (
                <TimeBadge>{timeLabel}</TimeBadge>
              ) : null}
            </div>
          </div>
        )}

        {description && (
          <p className="w-full text-2xs font-weight-regular text-textfield-default-text text-start">
            {description}
          </p>
        )}

        {locations && (
          <div className="flex w-full items-start justify-start gap-4 text-start text-button font-weight-regular text-text-black">
            <div
              className="flex h-[1.5em] shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <SvgIcon svg={locationSvg} className="size-16" />
            </div>
            <p className="break-words leading-[1.5em]">{locations}</p>
          </div>
        )}

        <div className="mt-auto flex w-full items-stretch gap-8">
          <Button
            onClick={actionDisabled ? undefined : onActionClick}
            disabled={actionDisabled}
            className={[
              'h-[44px] flex-1 min-h-[37px] max-h-[48px] overflow-hidden',
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
          {secondaryButton && (
            <button
              type="button"
              aria-label={secondaryButton.ariaLabel}
              onClick={secondaryButton.onClick}
              disabled={secondaryButton.disabled}
              className={[
                'inline-flex h-[44px] shrink-0 items-center justify-center gap-4 rounded-md',
                'border border-textfield-default-stroke bg-surface-secondary px-12',
                'text-button font-weight-medium text-text-black',
                'focus-visible:outline-2 focus-visible:outline-offset-2',
                'focus-visible:outline-solid-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
              ].join(' ')}
            >
              <span>{secondaryButton.label}</span>
              {secondaryButton.icon && (
                <span
                  className="flex size-16 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {secondaryButton.icon}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
