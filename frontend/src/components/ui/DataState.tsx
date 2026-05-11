interface DataStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export function DataState({ loading, error, children }: DataStateProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-soft">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-soft">
        {error}
      </div>
    );
  }

  return <>{children}</>;
}
