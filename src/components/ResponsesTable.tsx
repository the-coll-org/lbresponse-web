import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ResponsesTable.css';

interface Response {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: Response[];
  total: number;
}

const STATUS_LABELS: Record<Response['status'], string> = {
  pending: 'responses.status.pending',
  in_progress: 'responses.status.inProgress',
  resolved: 'responses.status.resolved',
};

const PRIORITY_LABELS: Record<Response['priority'], string> = {
  low: 'responses.priority.low',
  medium: 'responses.priority.medium',
  high: 'responses.priority.high',
  critical: 'responses.priority.critical',
};

function ResponsesTable() {
  const { t } = useTranslation();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch('/api/responses');
        if (!res.ok) {
          throw new Error(`HTTP ${String(res.status)}`);
        }
        const json = (await res.json()) as ApiResponse;
        setResponses(json.data);
        setError(null);
      } catch {
        setError(t('responses.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    void fetchResponses();
  }, [t]);

  if (loading) {
    return (
      <div className="table-skeleton">
        <div className="skeleton-header" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-row" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="table-error">{error}</div>;
  }

  if (responses.length === 0) {
    return <div className="table-empty">{t('responses.noData')}</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="responses-table">
        <thead>
          <tr>
            <th>{t('responses.columns.title')}</th>
            <th>{t('responses.columns.location')}</th>
            <th>{t('responses.columns.status')}</th>
            <th>{t('responses.columns.priority')}</th>
            <th>{t('responses.columns.date')}</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.location}</td>
              <td>
                <span className={`badge badge-status-${r.status}`}>
                  {t(STATUS_LABELS[r.status])}
                </span>
              </td>
              <td>
                <span className={`badge badge-priority-${r.priority}`}>
                  {t(PRIORITY_LABELS[r.priority])}
                </span>
              </td>
              <td className="date-cell">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResponsesTable;
