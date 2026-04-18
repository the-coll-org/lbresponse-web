import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { SvgIcon } from './SvgIcon';
import closeSvg from '../../assets/help-center/close.svg?raw';

export interface BottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  onOpenChange: (open: boolean) => void;
  closeAriaLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryDisabled?: boolean;
  contentClassName?: string;
  footer?: ReactNode;
}

const OVERLAY_BASE =
  'fixed inset-0 z-[9998] bg-solid-black-700/30 backdrop-blur-[6px] flex justify-center';

const SHEET_BASE = [
  'relative flex max-h-[calc(100svh-32px)] w-full flex-col overflow-hidden bg-surface-primary',
  'shadow-[0_-12px_32px_rgba(13,14,16,0.12)]',
].join(' ');
const DRAG_CLOSE_THRESHOLD = 48;
const SHEET_CLOSE_DURATION_MS = 220;
const SHEET_TRANSITION = `transform ${SHEET_CLOSE_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

export function BottomSheet({
  open,
  title,
  description,
  children,
  onOpenChange,
  closeAriaLabel = 'Close bottom sheet',
  secondaryActionLabel,
  onSecondaryAction,
  primaryActionLabel,
  onPrimaryAction,
  primaryDisabled = false,
  contentClassName = '',
  footer,
}: BottomSheetProps) {
  const dragStartYRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const documentDirection =
    typeof document === 'undefined'
      ? undefined
      : document.documentElement.getAttribute('dir') || undefined;
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPresented, setIsPresented] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(min-width: 768px)').matches;
  });

  const requestClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) return;

    setIsPresented(false);
    setDragOffset(0);
    setIsDragging(false);
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      onOpenChange(false);
    }, SHEET_CLOSE_DURATION_MS);
  }, [onOpenChange]);

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
      if (event.key === 'Escape') requestClose();
    };
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const frameId = window.requestAnimationFrame(() => {
      setIsPresented(true);
    });

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      dragStartYRef.current = null;
    };
  }, [open, requestClose]);

  const overlayClass = `${OVERLAY_BASE} ${isDesktop ? 'items-center' : 'items-end'}`;
  const sheetClass = `${SHEET_BASE} ${isDesktop ? 'mx-16 w-[390px] rounded-2xl' : 'w-full rounded-t-2xl'}`;

  const handleDragStart = (clientY: number) => {
    dragStartYRef.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = (clientY: number) => {
    if (dragStartYRef.current === null) return;

    setDragOffset(Math.max(clientY - dragStartYRef.current, 0));
  };

  const handleDragEnd = (clientY: number) => {
    if (dragStartYRef.current === null) return;

    const dragDistance = clientY - dragStartYRef.current;
    dragStartYRef.current = null;
    setIsDragging(false);

    if (dragDistance >= DRAG_CLOSE_THRESHOLD) {
      requestClose();
      return;
    }

    setDragOffset(0);
  };

  if (!open) return null;

  const sheetStyle = isDesktop
    ? {
        opacity: isPresented ? 1 : 0,
        transform: isPresented ? 'scale(1)' : 'scale(0.96)',
        transition: isDragging
          ? 'none'
          : 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
      }
    : {
        transform: `translateY(calc(${isPresented ? '0%' : '100%'} + ${dragOffset}px))`,
        transition: isDragging ? 'none' : SHEET_TRANSITION,
      };

  return createPortal(
    <div
      className={overlayClass}
      onClick={requestClose}
      aria-hidden="true"
      data-layout={isDesktop ? 'popup' : 'bottom-sheet'}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        aria-describedby={description ? 'bottom-sheet-description' : undefined}
        dir={documentDirection}
        className={sheetClass}
        style={sheetStyle}
        onClick={(event) => event.stopPropagation()}
        data-layout={isDesktop ? 'popup' : 'bottom-sheet'}
      >
        {!isDesktop && (
          <div
            data-testid="bottom-sheet-drag-handle"
            onTouchStart={(event) =>
              handleDragStart(event.touches[0]?.clientY ?? 0)
            }
            onTouchMove={(event) =>
              handleDragMove(event.touches[0]?.clientY ?? 0)
            }
            onTouchEnd={(event) =>
              handleDragEnd(event.changedTouches[0]?.clientY ?? 0)
            }
            onTouchCancel={() => {
              dragStartYRef.current = null;
              setDragOffset(0);
              setIsDragging(false);
            }}
            className="flex h-7.5 w-full touch-none select-none items-start justify-center px-42.75 pt-16 pb-8"
            aria-hidden="true"
          >
            <div className="h-1.5 w-48 rounded-full bg-solid-black-400" />
          </div>
        )}

        <div
          className={`flex min-h-0 flex-1 flex-col items-center ${isDesktop ? 'pt-24' : 'pt-0'}`}
        >
          <div className="flex w-full flex-col items-center gap-12 pb-16">
            <div className="flex w-full items-start justify-between gap-12 px-16">
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 text-start">
                <h2
                  id="bottom-sheet-title"
                  className="text-xl font-weight-medium text-text-black"
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id="bottom-sheet-description"
                    className="text-button font-weight-regular text-textfield-default-text"
                  >
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                aria-label={closeAriaLabel}
                onClick={requestClose}
                className={[
                  'flex size-24 shrink-0 items-center justify-center text-solid-black-400',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-solid-primary-500',
                ].join(' ')}
              >
                <SvgIcon svg={closeSvg} className="size-16" />
              </button>
            </div>

            <div className="w-full border-t border-solid-black-300" />
          </div>

          <div
            className={`min-h-0 w-full flex-1 overflow-y-auto px-16 ${contentClassName}`.trim()}
          >
            {children}
          </div>

          {footer ? (
            footer
          ) : primaryActionLabel && secondaryActionLabel ? (
            <div className="flex w-full flex-col items-center gap-12 pt-16">
              <div className="w-full border-t border-solid-black-300" />

              <div className="flex w-full items-center gap-16 px-16 pb-24">
                <Button
                  variant="filled"
                  className="h-48 flex-1 justify-center"
                  onClick={onPrimaryAction}
                  disabled={primaryDisabled}
                >
                  {primaryActionLabel}
                </Button>

                <Button
                  variant="tonal"
                  className="h-48 flex-1 justify-center"
                  onClick={onSecondaryAction}
                >
                  {secondaryActionLabel}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
