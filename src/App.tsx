import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import AppLayout from './components/AppLayout';
import NeedHelpScreen from './components/need-help/NeedHelpScreen';
import HelpCenterScreen from './components/HelpCenterScreen';
import MapScreen from './components/map/MapScreen';
import './App.css';

declare global {
  interface Window {
    __lbResponseLoadedFonts?: Record<'Roboto' | 'Tajawal', boolean>;
  }
}

function ensureFontLoaded(family: 'Roboto' | 'Tajawal'): void {
  if (typeof document === 'undefined') return;
  const flags = (window.__lbResponseLoadedFonts ??= {
    Roboto: false,
    Tajawal: false,
  });
  if (flags[family]) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;700&display=swap`;
  document.head.appendChild(link);
  flags[family] = true;
}

function App() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
    const next = currentLanguage?.startsWith('ar') ? 'en' : 'ar';
    ensureFontLoaded(next === 'ar' ? 'Tajawal' : 'Roboto');
    void i18n.changeLanguage(next);
  };

  return (
    <div className="app-shell">
      <main className="app-stage">
        <Routes>
          <Route
            element={
              <AppLayout
                theme={theme}
                onToggleTheme={toggleTheme}
                onToggleLanguage={toggleLanguage}
              />
            }
          >
            <Route index element={<Navigate to="/need-help" replace />} />
            <Route path="/need-help" element={<NeedHelpScreen />} />
            <Route path="/help-center" element={<HelpCenterScreen />} />
            <Route path="/map" element={<MapScreen />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
