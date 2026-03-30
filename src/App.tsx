import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import './App.css';

interface ApiStatus {
  name: string;
  version: string;
  uptime: number;
  environment: string;
}

interface HealthStatus {
  status: string;
  timestamp: string;
}

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(next);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [statusRes, healthRes] = await Promise.all([
          fetch('/api/status'),
          fetch('/health'),
        ]);
        if (statusRes.ok) {
          setApiStatus((await statusRes.json()) as ApiStatus);
        }
        if (healthRes.ok) {
          setHealth((await healthRes.json()) as HealthStatus);
        }
        setError(null);
      } catch {
        setError('API is not reachable. Make sure the backend is running.');
      }
    };

    void fetchStatus();
  }, []);

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

        <div className="status-cards">
          <div className="card">
            <h2>{t('common.health')}</h2>
            {error ? (
              <p className="error">{error}</p>
            ) : health ? (
              <>
                <p className="status-ok">{health.status}</p>
                <p className="meta">{health.timestamp}</p>
              </>
            ) : (
              <p className="loading">{t('common.loading')}</p>
            )}
          </div>

          <div className="card">
            <h2>API</h2>
            {apiStatus ? (
              <>
                <p>
                  {apiStatus.name} v{apiStatus.version}
                </p>
                <p className="meta">
                  {t('common.uptime')}: {Math.round(apiStatus.uptime)}s
                </p>
                <p className="meta">
                  {t('common.environment')}: {apiStatus.environment}
                </p>
              </>
            ) : (
              <p className="loading">{t('common.loading')}</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
