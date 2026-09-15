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
    <section className={`rounded-[28px] border border-line/80 bg-white/75 p-5 shadow-[0_20px_50px_-32px_rgba(27,23,20,0.55)] backdrop-blur ${className}`}>
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
