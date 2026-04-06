import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import './App.css';

interface Visual {
  key: string;
  visual_name?: string;
  page?: string;
  row_count?: number;
}

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [visuals, setVisuals] = useState<Visual[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/visuals')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ data: Visual[] }>;
      })
      .then((json) => {
        if (!cancelled) setVisuals(json.data);
      })
      .catch(() => {
        /* ignored */
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

      <nav className="tab-nav">
        <button
          className={`tab-btn ${selected === null ? 'tab-active' : ''}`}
          onClick={() => setSelected(null)}
        >
          {t('nav.dashboard')}
        </button>
        {visuals.map((v) => (
          <button
            key={v.key}
            className={`tab-btn ${selected === v.key ? 'tab-active' : ''}`}
            onClick={() => setSelected(v.key)}
            title={v.visual_name}
          >
            {v.page ?? v.key}
            {v.row_count != null && (
              <span className="tab-count">{v.row_count}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="content">
        {selected === null ? (
          <Dashboard />
        ) : (
          <DataTable endpoint={`/api/visuals/${selected}`} />
        )}
      </main>
    </>
  );
}

export default App;
