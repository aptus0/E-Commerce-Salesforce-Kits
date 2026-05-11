import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';

export function SettingsPage() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Project-level configuration and environment guidance."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Frontend Environment">
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              API Base URL:
              <span className="ml-2 rounded-lg bg-slate-100 px-2 py-1 font-mono">{apiBaseUrl}</span>
            </p>
            <p>
              Configure this value in <span className="font-mono">frontend/.env</span> using
              <span className="font-mono"> VITE_API_BASE_URL</span>.
            </p>
          </div>
        </Card>

        <Card title="Salesforce Setup">
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              Salesforce credentials are stored only in the backend. Never expose Salesforce username,
              password, security token or OAuth secrets in React.
            </p>
            <p>
              Follow <span className="font-mono">docs/salesforce-object-setup.md</span> before switching
              from mock mode to Salesforce mode.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
