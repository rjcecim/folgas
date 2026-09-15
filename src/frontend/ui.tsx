import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type Tone = "primary" | "quiet" | "ghost" | "danger";

const tones: Record<Tone, string> = {
  primary: "bg-accent text-white hover:bg-blue-600",
  quiet: "bg-white text-ink ring-1 ring-hair hover:bg-well",
  ghost: "bg-transparent text-soft hover:bg-well hover:text-ink",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

export function Btn({
  tone = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    />
  );
}

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
      <span className="text-sm text-soft">{label}</span>
      {children}
      {error ? <span className="block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

const box =
  "w-full rounded-2xl border-0 bg-white px-3 py-2.5 text-sm text-ink outline-none ring-1 ring-hair transition placeholder:text-soft/70 focus:ring-accent";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={box} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={box} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${box} min-h-28`} {...props} />;
}

export function Sheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-3 sm:items-center">
      <button type="button" className="absolute inset-0" aria-label="Fechar" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-panel p-6 shadow-2xl ring-1 ring-hair">
        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <Btn tone="ghost" onClick={onClose}>
            Fechar
          </Btn>
        </div>
        {children}
      </div>
    </div>
  );
}
