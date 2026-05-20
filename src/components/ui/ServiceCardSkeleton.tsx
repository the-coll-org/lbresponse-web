import { Skeleton } from './skeleton';

/**
 * Loading placeholder that mirrors the OrganizationCard layout.
 * Use inside the same grid you use for the real cards.
 */
export function ServiceCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-textfield-default-stroke bg-surface-primary p-12">
      <div className="flex flex-col gap-12">
        {/* Icon + title/description column */}
        <div className="flex w-full items-start gap-12">
          <Skeleton className="h-[40px] w-[38px] shrink-0 rounded-md" />
          {/* Title + category pill on the same row */}
          <div className="flex flex-1 items-center gap-8">
            <Skeleton className="h-[14px] w-1/2" />
            <Skeleton className="h-[22px] w-[64px] rounded-md" />
          </div>
        </div>

        {/* Location row: pin icon + text */}
        <div className="flex items-center gap-4">
          <Skeleton className="size-[16px] shrink-0 rounded-sm" />
          <Skeleton className="h-[12px] w-2/5" />
        </div>

        {/* Action button */}
        <Skeleton className="h-[44px] w-full rounded-md" />
      </div>
    </div>
  );
}
