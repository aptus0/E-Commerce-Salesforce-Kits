interface StatusBadgeProps {
  value: string;
}

const positive = ['SUCCESS', 'Paid', 'Delivered', 'Active', 'VIP', 'Approved', 'Completed'];
const warning = ['WARNING', 'Pending', 'Preparing', 'Requested', 'At Risk', 'Draft'];
const negative = ['FAILED', 'Failed', 'Cancelled', 'Returned', 'Rejected', 'Lost', 'Refunded'];

export function StatusBadge({ value }: StatusBadgeProps) {
  const className = positive.includes(value)
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    : warning.includes(value)
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : negative.includes(value)
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}>
      {value}
    </span>
  );
}
