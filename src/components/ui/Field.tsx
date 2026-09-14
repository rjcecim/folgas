import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-mute">{label}</span>
      {children}
      {error ? <span className="block text-sm text-rose-700">{error}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-2xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none ring-terra/30 focus:ring-2";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={controlClass} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={controlClass} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} min-h-24`} {...props} />;
}
