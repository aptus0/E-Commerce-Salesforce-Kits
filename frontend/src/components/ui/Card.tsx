interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      {title ? <h3 className="mb-4 text-lg font-bold text-slate-950">{title}</h3> : null}
      {children}
    </section>
  );
}
