import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './styles/themes.css';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { ToastContainer } from './components/ui/ToastContainer.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import App from './App.tsx';
import { installGlobalErrorHandlers } from './lib/logger.ts';

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      void registration.unregister();
    }
  });
  void caches?.keys().then((keys) => {
    for (const key of keys) void caches.delete(key);
  });
}

installGlobalErrorHandlers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
