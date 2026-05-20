import { useEffect, useRef, useState } from 'react';
import { SvgIcon } from './SvgIcon';
import locationSvg from '../../assets/help-center/location.svg?raw';

const VISIBLE_COUNT = 2;

export interface LocationsRowProps {
  locations: string[];
  moreLocationsLabel: (count: number) => string;
  /** Called when the overflow badge is clicked and overflow > 2 (bottom-drawer case). */
  onShowAll?: () => void;
}

export function LocationsRow({
  locations,
  moreLocationsLabel,
  onShowAll,
}: LocationsRowProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visible = locations.slice(0, VISIBLE_COUNT).join('، ');
  const overflow = locations.length - VISIBLE_COUNT;

  useEffect(() => {
    if (!tooltipOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [tooltipOpen]);

  const handleBadgeClick = () => {
    if (overflow <= 2) {
      setTooltipOpen((prev) => !prev);
    } else {
      onShowAll?.();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex size-16 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        <SvgIcon svg={locationSvg} className="size-16" />
      </div>

      {visible && (
        <span className="text-button font-weight-regular text-text-black">
          {visible}
        </span>
      )}

      {overflow > 0 && (
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={handleBadgeClick}
            aria-expanded={overflow <= 2 ? tooltipOpen : undefined}
            className={[
              'inline-flex items-center rounded-md border border-black/10 px-8 py-4',
              'text-2xs font-weight-medium text-text-black cursor-pointer',
              'transition-colors hover:bg-black/5',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
            ].join(' ')}
          >
            {moreLocationsLabel(overflow)}
          </button>

          {tooltipOpen && overflow <= 2 && (
            <div
              role="tooltip"
              className={[
                'absolute bottom-full mb-6 start-0 z-20',
                'rounded-lg bg-text-black px-12 py-8 shadow-lg',
                'text-2xs font-weight-regular text-white whitespace-nowrap',
              ].join(' ')}
            >
              {locations.slice(VISIBLE_COUNT).join('، ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
