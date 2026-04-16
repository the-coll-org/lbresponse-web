import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import HelpCenterScreen from './components/HelpCenterScreen';
import './App.css';

function App() {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(next);
  };

  return (
    <div className="app-shell">
      <main className="app-stage">
        <HelpCenterScreen
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleLanguage={toggleLanguage}
        />
      </main>
    </div>
  );
}

export default App;
