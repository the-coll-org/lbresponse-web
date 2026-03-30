import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import ResponsesTable from './components/ResponsesTable';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(next);
  };

  return (
    <>
      <header className="toolbar">
        <span className="toolbar-title">{t('app.title')}</span>
        <div className="toolbar-actions">
          <button className="toolbar-btn" onClick={toggleTheme}>
            {theme === 'light' ? t('common.darkMode') : t('common.lightMode')}
          </button>
          <button className="toolbar-btn" onClick={toggleLanguage}>
            {i18n.language === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </header>

      <main className="content">
        <h1>{t('app.title')}</h1>
        <p>{t('app.description')}</p>

        <section className="section">
          <h2>{t('responses.title')}</h2>
          <ResponsesTable />
        </section>
      </main>
    </>
  );
}

export default App;
