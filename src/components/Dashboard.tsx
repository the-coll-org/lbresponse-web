import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardData {
  providers: number;
  services: number;
  locations: number;
  shelters: number;
  service_availability: number;
  shelter_needs: number;
  aid_matches: number;
}

function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<{ data: DashboardData }>;
      })
      .then((json) => setData(json.data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <div className="table-error">{t('common.fetchError')}</div>;
  }

  if (!data) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  const cards = [
    { label: t('nav.providers'), value: data.providers, icon: '🏢' },
    { label: t('nav.services'), value: data.services, icon: '⚙️' },
    { label: t('nav.locations'), value: data.locations, icon: '📍' },
    { label: t('nav.shelters'), value: data.shelters, icon: '🏠' },
    {
      label: t('nav.availability'),
      value: data.service_availability,
      icon: '✓',
    },
    { label: t('nav.needs'), value: data.shelter_needs, icon: '🔴' },
    { label: t('nav.matches'), value: data.aid_matches, icon: '🤝' },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <div key={card.label} className="dashboard-card">
          <div className="dashboard-card-icon">{card.icon}</div>
          <div className="dashboard-card-value">{card.value}</div>
          <div className="dashboard-card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
