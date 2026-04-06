import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import './App.css';

type Tab = 'dashboard' | 'providers' | 'services' | 'locations' | 'shelters';

const formatEnum = (v: unknown) => {
  if (v == null) return '—';
  return (typeof v === 'string' ? v : JSON.stringify(v)).replace(/_/g, ' ');
};

const formatBool = (v: unknown) => {
  if (v == null) return '—';
  return v === 1 || v === true ? 'Yes' : 'No';
};

function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState<Tab>('dashboard');

  const toggleLanguage = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(next);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: t('nav.dashboard') },
    { key: 'providers', label: t('nav.providers') },
    { key: 'services', label: t('nav.services') },
    { key: 'locations', label: t('nav.locations') },
    { key: 'shelters', label: t('nav.shelters') },
  ];

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
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? 'tab-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {tab === 'dashboard' && <Dashboard />}

        {tab === 'providers' && (
          <DataTable
            endpoint="/api/providers"
            columns={[
              { key: 'provider_name', label: t('providers.name') },
              {
                key: 'provider_type',
                label: t('providers.type'),
                format: formatEnum,
              },
              { key: 'contact_name', label: t('providers.contact') },
              { key: 'contact_phone', label: t('providers.phone') },
              {
                key: 'is_active',
                label: t('providers.active'),
                format: formatBool,
              },
            ]}
          />
        )}

        {tab === 'services' && (
          <DataTable
            endpoint="/api/services"
            columns={[
              { key: 'service_name', label: t('services.name') },
              { key: 'provider_name', label: t('services.provider') },
              {
                key: 'sector',
                label: t('services.sector'),
                format: formatEnum,
              },
              {
                key: 'aid_type',
                label: t('services.aidType'),
                format: formatEnum,
              },
              {
                key: 'status',
                label: t('services.status'),
                format: formatEnum,
              },
            ]}
          />
        )}

        {tab === 'locations' && (
          <DataTable
            endpoint="/api/locations"
            columns={[
              {
                key: 'governorate',
                label: t('locations.governorate'),
                format: formatEnum,
              },
              { key: 'city', label: t('locations.city') },
              { key: 'district', label: t('locations.district') },
              { key: 'locality', label: t('locations.locality') },
              {
                key: 'accessibility',
                label: t('locations.accessibility'),
                format: formatEnum,
              },
            ]}
          />
        )}

        {tab === 'shelters' && (
          <DataTable
            endpoint="/api/shelters"
            columns={[
              { key: 'shelter_name', label: t('shelters.name') },
              {
                key: 'shelter_type',
                label: t('shelters.type'),
                format: formatEnum,
              },
              {
                key: 'governorate',
                label: t('shelters.governorate'),
                format: formatEnum,
              },
              { key: 'city', label: t('shelters.city') },
              { key: 'capacity_total', label: t('shelters.capacity') },
              { key: 'population_total', label: t('shelters.population') },
              {
                key: 'status',
                label: t('shelters.status'),
                format: formatEnum,
              },
            ]}
          />
        )}
      </main>
    </>
  );
}

export default App;
