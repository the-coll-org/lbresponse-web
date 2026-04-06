import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardData {
  visuals: number;
  rows: number;
  pages: string[];
}

function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<DashboardData>;
      })
      .then((json) => setData(json))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <div className="table-error">{t('common.fetchError')}</div>;
  }

  if (!data) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <div className="dashboard-card-value">{data.visuals}</div>
        <div className="dashboard-card-label">{t('dashboard.visuals')}</div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card-value">{data.rows}</div>
        <div className="dashboard-card-label">{t('dashboard.totalRows')}</div>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card-value">{data.pages.length}</div>
        <div className="dashboard-card-label">{t('dashboard.pages')}</div>
      </div>
    </div>
  );
}

export default Dashboard;
