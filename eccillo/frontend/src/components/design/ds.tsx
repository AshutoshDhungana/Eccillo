/* Primitives from the Eccillo design system ("Eccillo Planning" design project).
   They paint with the surface aliases in designed/styles/eccillo-tokens.css, so a
   single [data-theme] switch flips every screen built out of them. */
import { Sparkles } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function CapsuleButton({
  tone = "primary",
  size = "md",
  full,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "muted"; size?: "sm" | "md"; full?: boolean }) {
  const skin =
    tone === "primary"
      ? "bg-[var(--accent)] text-[var(--onAccent)]"
      : "bg-[var(--cell)] text-[var(--text2)] shadow-[inset_0_0_0_1px_var(--ring)]";
  return (
    <button
      type="button"
      {...props}
      className={
        "focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-[var(--font-data)] font-bold transition hover:opacity-[.82] disabled:opacity-40 " +
        (size === "sm" ? "h-[37px] px-4 text-[13px] " : "h-[53px] px-6 text-[14px] ") +
        (full ? "w-full " : "") +
        skin +
        " " +
        className
      }
    />
  );
}

export function Chip({ active, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={
        "focus-ring rounded-[var(--radius-pill)] px-4 py-2 font-[var(--font-data)] text-[13px] leading-none transition hover:opacity-[.82] " +
        (active
          ? "bg-[var(--accent)] font-bold text-[var(--onAccent)]"
          : "bg-[var(--cell)] text-[var(--text2)] shadow-[inset_0_0_0_1px_var(--ring)]") +
        " " +
        className
      }
    />
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={"rounded-[var(--radius-card)] bg-[var(--panel)] shadow-[inset_0_0_0_1px_var(--ring)] " + className}>
      {children}
    </section>
  );
}

export function MetricCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex min-h-[150px] flex-1 flex-col justify-center gap-3 rounded-[var(--radius-card)] bg-[var(--panel)] p-6 shadow-[inset_0_0_0_1px_var(--ring)]">
      <span className="eccillo-label-caps">{label}</span>
      <span className="font-[var(--font-editorial)] text-[32px] leading-none text-[var(--text)]">{value}</span>
      {note && <span className="font-[var(--font-data)] text-[13px] leading-none text-[var(--text2)]">{note}</span>}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  neutral: "text-[var(--text2)]",
  success: "text-[var(--success)]",
  warning: "text-[var(--warning)]",
  error: "text-[var(--error)]",
};

export function StatusBadge({ tone = "neutral", children }: { tone?: keyof typeof badgeTones | string; children: ReactNode }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-1 font-[var(--font-data)] text-[11px] font-bold uppercase leading-none shadow-[inset_0_0_0_1px_var(--ring)] " +
        (badgeTones[tone] ?? badgeTones.neutral)
      }
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--panel)]">
      <div className="h-1 rounded-[var(--radius-pill)] bg-[var(--accent)] transition-[width]" style={{ width: Math.max(0, Math.min(100, value)) + "%" }} />
    </div>
  );
}

/** The AI advisory strip used across the planning screens and the setup wizard. */
export function AiNote({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Panel className="flex items-center gap-4 p-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--accent)]">
        <Sparkles size={16} className="text-[var(--onAccent)]" />
      </span>
      <div className="flex flex-1 flex-col gap-1.5 font-[var(--font-data)]">
        {title && <span className="text-[14px] font-bold leading-none text-[var(--text)]">{title}</span>}
        <span className="text-[14px] leading-[140%] text-[var(--text2)]">{children}</span>
      </div>
      {action}
    </Panel>
  );
}
