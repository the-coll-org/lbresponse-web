import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';

export interface ServiceCardAction {
  ariaLabel: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'soft' | 'outline';
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
  onActionClick?: MouseEventHandler<HTMLButtonElement>;
  primaryAction?: ServiceCardAction;
  secondaryAction?: ServiceCardAction;
}

const CARD_BASE = [
  'w-[358px] max-w-full rounded-lg border border-solid-black-300',
  'bg-solid-white-400 p-12 overflow-hidden',
].join(' ');

function CardIconButton({
  ariaLabel,
  icon,
  onClick,
  variant = 'soft',
}: ServiceCardAction) {
  const variantClass =
    variant === 'outline'
      ? 'w-[38px] h-[40px] border border-solid-black-300 bg-solid-white-400 p-4'
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
      <span
        className="size-[18px] flex items-center justify-center"
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
}

function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md border border-black/10 px-8 py-4 text-2xs font-weight-regular text-[#0a0a0a] whitespace-nowrap">
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
  onActionClick,
  primaryAction,
  secondaryAction,
  className = '',
  ...props
}: ServiceCardProps) {
  const actionClass =
    actionVariant === 'success'
      ? 'bg-[#00a63e] text-button-filled-text'
      : 'bg-button-filled-bg text-button-filled-text';
  const contentDirection = props.dir === 'ltr' ? 'ltr' : 'rtl';
  const isRtl = contentDirection === 'rtl';
  const topRowClass = isRtl
    ? 'flex items-start justify-between gap-12 w-full'
    : 'flex flex-row-reverse items-start justify-between gap-12 w-full';
  const contentRowClass = isRtl
    ? 'flex items-center gap-12 shrink min-w-0'
    : 'flex flex-row-reverse items-center gap-12 shrink min-w-0';
  const metaRowClass = isRtl
    ? 'flex items-center gap-4 text-right text-button font-weight-regular text-text-black'
    : 'flex flex-row-reverse items-center gap-4 text-left text-button font-weight-regular text-text-black';
  const titleRowClass = isRtl
    ? 'flex items-center justify-end gap-8 w-full min-w-0'
    : 'flex flex-row-reverse items-center justify-end gap-8 w-full min-w-0';

  return (
    <div
      className={`${CARD_BASE} ${className}`.trim()}
      dir={contentDirection}
      {...props}
    >
      <div className="flex flex-col items-end justify-center gap-12 w-full">
        <div className={topRowClass}>
          {primaryAction ? (
            <CardIconButton {...primaryAction} />
          ) : (
            <span className="size-32 shrink-0" aria-hidden="true" />
          )}

          <div className={contentRowClass}>
            <div className="flex flex-col items-end gap-8 min-w-0 text-right w-[161px]">
              <div className={titleRowClass}>
                {category && <CategoryPill>{category}</CategoryPill>}
                <p className="text-sm font-weight-bold text-text-black whitespace-nowrap">
                  {title}
                </p>
              </div>
              {description && (
                <p className="w-full text-2xs font-weight-regular text-solid-black-400">
                  {description}
                </p>
              )}
            </div>

            {secondaryAction && <CardIconButton {...secondaryAction} />}
          </div>
        </div>

        {locations && (
          <div className={metaRowClass}>
            <span>{locations}</span>
            <span
              className="size-16 flex items-center justify-center"
              aria-hidden="true"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s-6-5.33-6-11a6 6 0 1 1 12 0c0 5.67-6 11-6 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onActionClick}
          className={[
            'w-full h-[44px] min-h-[37px] max-h-[48px]',
            'inline-flex items-center justify-center gap-8',
            'px-16 py-8 rounded-md overflow-hidden',
            actionClass,
            'text-button font-weight-medium',
            'cursor-pointer transition-opacity',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-solid-primary-500',
          ].join(' ')}
        >
          {actionIcon && (
            <span
              className="shrink-0 size-16 flex items-center justify-center"
              aria-hidden="true"
            >
              {actionIcon}
            </span>
          )}
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}
