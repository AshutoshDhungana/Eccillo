import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { AgentRun } from "../../types/agent";

const OUTCOME: Record<string, { mark: string; className: string }> = {
  success: { mark: "✓", className: "text-emerald-300" },
  partial: { mark: "◐", className: "text-emerald-200" },
  needs_approval: { mark: "⏳", className: "text-amber-300" },
  validation_error: { mark: "!", className: "text-white/40" },
  permission_error: { mark: "⛔", className: "text-red-300" },
  retryable_error: { mark: "↻", className: "text-amber-200" },
  failure: { mark: "✗", className: "text-red-300" },
};

/** Collapsible per-skill activity + reasoning for one completed run. */
export function RunActivity({ run }: { run: AgentRun }) {
  const [open, setOpen] = useState(false);
  const steps = run.steps ?? [];
  const hasContent = steps.length > 0 || run.explanation.length > 0;
  if (!hasContent) return null;

  const label = steps.length > 0 ? `${steps.length} step${steps.length > 1 ? "s" : ""}` : "reasoning";

  return (
    <div className="px-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring inline-flex items-center gap-1 text-xs text-white/45 hover:text-white/70"
      >
        <ChevronDown size={13} className={"transition " + (open ? "rotate-180" : "")} />
        {open ? "Hide activity" : `How I did it · ${label}`}
      </button>

      {open && (
        <div className="mt-2 space-y-2 border-l border-white/10 pl-3">
          {steps.length > 0
            ? steps.map((s) => {
                const o = OUTCOME[s.outcome] ?? { mark: "•", className: "text-white/50" };
                return (
                  <div key={s.step_id} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className={o.className}>{o.mark}</span>
                      <span className="font-medium text-white/80 capitalize">{s.skill}</span>
                      {s.error && <span className="text-red-300/80">— {s.error}</span>}
                    </div>
                    {s.explanation.length > 0 && (
                      <ul className="ml-5 mt-0.5 space-y-0.5 text-white/50">
                        {s.explanation.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            : run.explanation.map((e, i) => (
                <p key={i} className="text-xs text-white/55">
                  {e}
                </p>
              ))}
        </div>
      )}
    </div>
  );
}
