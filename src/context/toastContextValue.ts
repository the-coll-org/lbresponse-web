import { createContext } from 'react';
import type { AlertVariant } from '../components/ui/Alert';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  variant: AlertVariant;
  heading?: string;
  body?: string;
  /** Display duration in ms. Default: 4000 */
  duration: number;
  /** True while the exit animation is playing */
  isExiting: boolean;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (opts: {
    variant?: AlertVariant;
    heading?: string;
    body?: string;
    duration?: number;
  }) => string;
  removeToast: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
});
