import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  helper?: string;
}

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-3 text-3xl font-bold text-slate-950">{value}</div>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </div>
  );
}
