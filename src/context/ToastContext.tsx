import { useCallback, useRef, useState, type ReactNode } from 'react';
import type { AlertVariant } from '../components/ui/Alert';
import { ToastContext } from './toastContextValue';
import type { ToastItem } from './toastContextValue';

// ─── Exit animation duration — must match CSS ─────────────────────────────────

const EXIT_MS = 280;

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const removeToast = useCallback((id: string) => {
    // 1. Flip isExiting → triggers exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );
    // 2. Remove from state after animation finishes
    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(`exit-${id}`);
    }, EXIT_MS);
    timers.current.set(`exit-${id}`, exitTimer);
  }, []);

  const addToast = useCallback(
    (opts: {
      variant?: AlertVariant;
      heading?: string;
      body?: string;
      duration?: number;
    }): string => {
      const id = crypto.randomUUID();
      const duration = opts.duration ?? 4000;

      setToasts((prev) => [
        ...prev,
        {
          id,
          variant: opts.variant ?? 'neutral',
          heading: opts.heading,
          body: opts.body,
          duration,
          isExiting: false,
        },
      ]);

      // Auto-dismiss
      const autoTimer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, autoTimer);

      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}
