import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './ResponsesTable.css';

interface DataTableProps {
  endpoint: string;
  columns: { key: string; label: string; format?: (v: unknown) => string }[];
}

interface ApiResult {
  data: Record<string, unknown>[];
  total: number;
}

function DataTable({ endpoint, columns }: DataTableProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status.toString()}`);
      const json = (await res.json()) as ApiResult;
      setRows(json.data);
      setTotal(json.total);
      setError(null);
    } catch {
      setError(t('common.fetchError'));
    } finally {
      setLoading(false);
    }
  }, [endpoint, t]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

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

  if (rows.length === 0) {
    return <div className="table-empty">{t('common.noData')}</div>;
  }

  return (
    <div className="table-wrapper">
      <div className="table-meta">{total} records</div>
      <table className="responses-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => {
                const val = row[col.key];
                const display = col.format
                  ? col.format(val)
                  : val != null
                    ? typeof val === 'string'
                      ? val
                      : JSON.stringify(val)
                    : '—';
                return <td key={col.key}>{display}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
