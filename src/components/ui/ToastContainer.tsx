import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from '../../context/toastContextValue';
import { Alert } from './Alert';

// ─── Close icon ───────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-16 inset-x-0 z-[9999] flex flex-col items-center gap-8 px-16 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={[
            'w-full max-w-[480px] pointer-events-auto',
            'shadow-xs',
            toast.isExiting ? 'animate-toast-exit' : 'animate-toast-enter',
          ].join(' ')}
        >
          <Alert
            variant={toast.variant}
            heading={toast.heading}
            action={
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 flex items-center justify-center size-16 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <CloseIcon />
              </button>
            }
          >
            {toast.body}
          </Alert>
        </div>
      ))}
    </div>,
    document.body
  );
}
