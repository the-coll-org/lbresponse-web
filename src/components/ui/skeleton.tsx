import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse rounded-md bg-solid-black-300/40',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
