import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { DataState } from '../components/ui/DataState';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAsyncData } from '../hooks/useAsyncData';
import { getSyncLogs, testSalesforceConnection } from '../services/commerceApi';
import { formatDate } from '../utils/format';

export function SyncCenterPage() {
  const { data, loading, error, reload } = useAsyncData(getSyncLogs);
  const [testResult, setTestResult] = useState<string | null>(null);

  async function handleTestConnection() {
    setTestResult('Testing connection...');

    try {
      const result = await testSalesforceConnection();
      setTestResult(result.message);
      await reload();
    } catch (err) {
      setTestResult(err instanceof Error ? err.message : 'Connection test failed');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Integration"
        title="Salesforce Sync Center"
        description="Monitor API health, Salesforce sync status and integration logs."
      />

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold">Connection Test</h3>
            <p className="text-sm text-slate-500">
              Checks whether the backend repository is healthy.
            </p>
            {testResult ? <p className="mt-2 text-sm font-semibold">{testResult}</p> : null}
          </div>
          <button
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            onClick={() => void handleTestConnection()}
          >
            Test Connection
          </button>
        </div>
      </div>

      <Card title="Sync Logs">
        <DataState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-3">Source</th>
                  <th>Operation</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Record</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 font-semibold">{log.sourceSystem}</td>
                    <td>{log.operationType}</td>
                    <td>
                      <StatusBadge value={log.status} />
                    </td>
                    <td>{log.message}</td>
                    <td>{log.recordId ?? '-'}</td>
                    <td>{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataState>
      </Card>
    </>
  );
}
