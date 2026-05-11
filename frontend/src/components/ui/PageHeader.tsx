interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="mb-1 text-sm font-semibold text-slate-500">{eyebrow}</p> : null}
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">{description}</p>
    </div>
  );
}
