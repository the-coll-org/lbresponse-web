import type { HTMLAttributes, ReactNode } from 'react';

export interface ScreenHeaderProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'title'
> {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  dir?: 'rtl' | 'ltr';
}

export function ScreenHeader({
  title,
  subtitle,
  actions,
  dir = 'rtl',
  className = '',
  ...props
}: ScreenHeaderProps) {
  const isRtl = dir === 'rtl';
  const actionsPositionClass = isRtl ? 'left-0' : 'right-0';
  const textBlockClass = isRtl
    ? 'w-full items-end text-right pl-48'
    : 'w-full items-start text-left pr-48';

  return (
    <header
      dir={dir}
      className={[
        'min-h-[110px] w-full rounded-b-2xl bg-solid-primary-700 px-16 pt-20 pb-16 text-solid-white-400',
        className,
      ].join(' ')}
      {...props}
    >
      <div className="mx-auto h-full w-full max-w-[390px]">
        <div className="relative h-full w-full">
          {actions && (
            <div
              className={`absolute top-0 flex items-center gap-8 ${actionsPositionClass}`}
            >
              {actions}
            </div>
          )}

          <div className={`flex flex-col ${textBlockClass}`}>
            <h1 className="w-full text-2xl font-weight-bold leading-[32px] text-solid-white-400">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 w-full text-button font-weight-medium text-solid-white-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
