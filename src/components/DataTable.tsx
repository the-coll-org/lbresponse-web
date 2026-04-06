import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './ResponsesTable.css';

interface DataTableProps {
  endpoint: string;
}

interface ApiResult {
  data: Record<string, unknown>[];
  total: number;
  metadata?: Record<string, unknown>;
}

function DataTable({ endpoint }: DataTableProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status.toString()}`);
      const json = (await res.json()) as ApiResult;
      const data = json.data ?? [];
      setRows(data);
      setTotal(json.total ?? data.length);

      // Auto-detect columns from first row, excluding internal fields
      if (data.length > 0) {
        const keys = Object.keys(data[0]).filter((k) => !k.startsWith('_'));
        setColumns(keys);
      }

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

  const formatCell = (val: unknown): string => {
    if (val == null) return '—';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toLocaleString();
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return JSON.stringify(val);
  };

  return (
    <div className="table-wrapper">
      <div className="table-meta">{total} records</div>
      <table className="responses-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{formatCell(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
