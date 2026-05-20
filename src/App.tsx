import { Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import AppLayout from './components/AppLayout';
import NeedHelpScreen from './components/need-help/NeedHelpScreen';
import HelpCenterScreen from './components/HelpCenterScreen';
import MapScreen from './components/map/MapScreen';
import './App.css';

function App() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
    const next = currentLanguage?.startsWith('ar') ? 'en' : 'ar';
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
