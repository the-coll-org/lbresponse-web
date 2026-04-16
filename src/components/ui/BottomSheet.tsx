import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

const FIGMA_CLOSE_ICON =
  'https://www.figma.com/api/mcp/asset/8376fc76-f12d-42f7-b569-83f80f4392a4';

export interface BottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  secondaryActionLabel: string;
  onSecondaryAction?: () => void;
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  primaryDisabled?: boolean;
}

const OVERLAY_BASE =
  'fixed inset-0 z-[9998] bg-solid-black-700/30 flex justify-center';

const SHEET_BASE = [
  'relative h-[585px] overflow-hidden bg-surface-primary',
  'shadow-[0_-12px_32px_rgba(13,14,16,0.12)]',
].join(' ');

export function BottomSheet({
  open,
  title,
  description,
  children,
  onOpenChange,
  secondaryActionLabel,
  onSecondaryAction,
  primaryActionLabel,
  onPrimaryAction,
  primaryDisabled = false,
}: BottomSheetProps) {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(min-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateLayout = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    updateLayout(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateLayout);

      return () => {
        mediaQuery.removeEventListener('change', updateLayout);
      };
    }

    mediaQuery.addListener(updateLayout);

    return () => {
      mediaQuery.removeListener(updateLayout);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const overlayClass = `${OVERLAY_BASE} ${isDesktop ? 'items-center' : 'items-end'}`;
  const sheetClass = `${SHEET_BASE} ${
    isDesktop
      ? 'w-[390px] max-w-[calc(100vw-32px)] rounded-2xl'
      : 'w-full rounded-t-2xl'
  }`;

  return createPortal(
    <div
      className={overlayClass}
      onClick={() => onOpenChange(false)}
      aria-hidden="true"
      data-layout={isDesktop ? 'popup' : 'bottom-sheet'}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        aria-describedby={description ? 'bottom-sheet-description' : undefined}
        className={sheetClass}
        onClick={(event) => event.stopPropagation()}
        data-layout={isDesktop ? 'popup' : 'bottom-sheet'}
      >
        {!isDesktop && (
          <div className="flex h-[30px] items-start justify-center px-[171px] pt-16 pb-8">
            <div className="h-6 w-48 rounded-full bg-solid-black-400" />
          </div>
        )}

        <div
          className={`flex flex-col items-center gap-24 ${isDesktop ? 'pt-24' : 'pt-10'}`}
        >
          <div className="flex w-full flex-col items-center gap-12">
            <div
              className={[
                'flex items-center justify-between',
                isDesktop
                  ? 'w-[359px] max-w-[359px]'
                  : 'w-full px-16 flex-row-reverse',
              ].join(' ')}
            >
              <div className="flex flex-col items-end justify-center gap-4 text-right whitespace-nowrap">
                <p
                  id="bottom-sheet-title"
                  className="text-xl font-weight-medium text-text-black"
                >
                  {title}
                </p>
                {description && (
                  <p
                    id="bottom-sheet-description"
                    className="text-button font-weight-regular text-[#6a7282]"
                  >
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label="Close bottom sheet"
                onClick={() => onOpenChange(false)}
                className={[
                  'flex size-24 shrink-0 items-center justify-center p-2 text-solid-black-400',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-solid-primary-500',
                ].join(' ')}
              >
                <img
                  src={FIGMA_CLOSE_ICON}
                  alt=""
                  aria-hidden="true"
                  className="size-16 block max-w-none"
                />
              </button>
            </div>

            <div className="w-full border-t border-solid-black-300" />
          </div>

          <div className="h-[365px] w-[358px] shrink-0">{children}</div>

          <div className="flex w-full flex-col items-center gap-12">
            <div className="w-full border-t border-solid-black-300" />

            <div className="flex w-[360px] max-w-[360px] items-center justify-between">
              <Button
                variant="tonal"
                className="h-48 w-[172px] justify-center"
                onClick={onSecondaryAction}
              >
                {secondaryActionLabel}
              </Button>

              <Button
                variant="filled"
                className="h-48 w-[172px] justify-center"
                onClick={onPrimaryAction}
                disabled={primaryDisabled}
              >
                {primaryActionLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
