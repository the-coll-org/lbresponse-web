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
        'h-23.5 w-full rounded-b-2xl bg-solid-primary-700 px-16 pt-20 pb-20 text-solid-white-400',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mx-auto flex h-full w-full items-start justify-between gap-12">
        <div className="min-w-0 flex-1">
          <div className="flex w-full flex-col items-start gap-4 text-start">
            <h1 className="w-full text-2xl font-weight-bold leading-32 text-solid-white-400">
              {title}
            </h1>
            {subtitle && (
              <p className="w-full text-button font-weight-medium text-solid-white-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-8">{actions}</div>
        )}
      </div>
    </header>
  );
}
