import type { ReactNode } from "react";

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-3xl border border-line bg-white/90 p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          {title ? <h2 className="font-serif text-xl text-ink">{title}</h2> : <span />}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
