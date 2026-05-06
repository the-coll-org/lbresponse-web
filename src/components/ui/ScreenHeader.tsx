import type { HTMLAttributes, ReactNode } from 'react';

export interface ScreenHeaderProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'title'
> {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  actions,
  className = '',
  ...props
}: ScreenHeaderProps) {
  return (
    <header
      className={[
        'w-full rounded-b-2xl bg-solid-primary-700 px-16 pt-20 pb-24 text-solid-white-400',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mx-auto flex w-full items-start justify-between gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-4 text-start">
          <h1 className="w-full text-2xl font-weight-bold leading-tight text-solid-white-400">
            {title}
          </h1>
          {subtitle && (
            <p className="w-full text-button font-weight-regular leading-snug text-solid-white-400/85">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-8">{actions}</div>
        )}
      </div>
    </header>
  );
}
