import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const base = "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition disabled:opacity-50";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" }) {
  const style = variant === "primary"
    ? "border border-white/20 bg-[var(--panel)] text-white hover:bg-[var(--btnGhost)]"
    : variant === "secondary"
      ? "border border-white/20 bg-[var(--panel)] text-white/80 hover:bg-[var(--btnGhost)]"
      : "text-white/64 hover:bg-white/10";
  return <button type="submit" className={base + " " + style + " " + className} {...props} />;
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/75">
      <span>{label}</span>
      {children}
      {error && <span className="text-xs text-white/80">{error}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"frosted focus-ring h-12 w-full rounded-full border border-white/20 px-5 text-white shadow-sm outline-none placeholder:text-white/40 " + (props.className ?? "")} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={"frosted focus-ring min-h-28 w-full rounded-[28px] border border-white/20 px-5 py-4 text-white shadow-sm outline-none placeholder:text-white/40 " + (props.className ?? "")} />;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={"surface rounded-[28px] p-5 sm:p-7 " + className}>{children}</section>;
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && <p className="mb-2 text-xs uppercase tracking-[.16em] text-black/48">{eyebrow}</p>}
          <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">{title}</h1>
        </div>
        {children}
      </header>
    </>
  );
}

export function Status({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/64">{children}</span>;
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return <div className="py-20 text-center text-white/55">{label}</div>;
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : "Something went wrong.";
  return <Card className="text-center"><p>{message}</p>{onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}>Try again</Button>}</Card>;
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <Card className="py-14 text-center"><h2 className="font-editorial text-3xl">{title}</h2><p className="mx-auto mt-3 max-w-md text-black/64">{detail}</p>{action && <div className="mt-6">{action}</div>}</Card>;
}

export function ConfirmDialog({ open, title, detail, confirmLabel, pending, error, onCancel, onConfirm }: { open: boolean; title: string; detail: string; confirmLabel: string; pending?: boolean; error?: string; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="presentation"><button type="button" className="absolute inset-0 bg-black/55" aria-label="Close confirmation" onClick={onCancel} /><section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" className="surface relative w-full max-w-md rounded-[28px] p-6"><h2 id="confirm-title" className="font-editorial text-3xl">{title}</h2><p className="mt-3 text-sm text-black/64">{detail}</p>{error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" className="focus-ring rounded-full border border-black/15 bg-white px-5 py-3 text-sm" disabled={pending} onClick={onCancel}>Cancel</button><button type="button" className="focus-ring rounded-full bg-black px-5 py-3 text-sm text-white" disabled={pending} onClick={onConfirm}>{pending ? "Deleting…" : confirmLabel}</button></div></section></div>;
}
