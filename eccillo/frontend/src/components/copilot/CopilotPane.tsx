import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { useAgentConversation, type ChatMessage } from "../../hooks/useAgentConversation";
import { useAgentState } from "../../hooks/useAgentState";
import { agentApi } from "../../api/agent";
import { RunActivity } from "./RunActivity";
import type { AgentRun } from "../../types/agent";

const STAGES: Array<{ key: string; label: string }> = [
  { key: "collecting_information", label: "Info" },
  { key: "planning", label: "Planning" },
  { key: "review", label: "Review" },
  { key: "approval", label: "Approval" },
  { key: "booking", label: "Booking" },
];

const SUGGESTIONS = [
  "Plan a 200-person tech conference on 2026-09-15 in Kathmandu, budget 5,000,000, call it DevWeek",
  "Help me organize a wedding for 150 guests next spring",
  "I need to set up a 2-day hackathon",
];

export function CopilotPane({
  eventId,
  onRunComplete,
  intro,
}: {
  eventId: string;
  onRunComplete?: (run: AgentRun) => void;
  intro?: string;
}) {
  const { messages, sending, loadingHistory, latestRun, send, approve } = useAgentConversation(eventId, {
    onComplete: onRunComplete,
    intro,
  });
  const stateQuery = useAgentState(eventId);
  const aiState = stateQuery.data?.status ?? latestRun?.ai_state;
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    void send(text);
  };

  return (
    <div className="flex h-[calc(100vh-150px)] flex-col">
      <StageStrip current={aiState} />

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-6 pr-1">
        {loadingHistory && messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/40">Restoring your conversation…</p>
        ) : messages.length === 0 ? (
          <EmptyPrompt onPick={(s) => void send(s)} disabled={sending} />
        ) : (
          messages.map((m) => <Bubble key={m.id} message={m} onApprove={approve} approving={sending} />)
        )}
      </div>

      {aiState === "review" && <PlanReadyBar eventId={eventId} />}
      <QuickActions state={aiState} onPick={(t) => void send(t)} disabled={sending} />

      <div className="border-t border-white/10 pt-4">
        <div className="frosted flex items-end gap-2 rounded-[24px] border border-white/20 p-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Tell the planner what you need…"
            className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-4 py-2.5 text-white outline-none placeholder:text-white/40"
          />
          <button
            type="button"
            onClick={submit}
            disabled={sending || !draft.trim()}
            aria-label="Send"
            className="focus-ring mb-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-2 px-2 text-xs text-white/40">Enter to send · Shift+Enter for a new line</p>
      </div>
    </div>
  );
}

// Refinement suggestions only — approving the plan is a distinct CTA (PlanReadyBar).
const NEXT_ACTIONS: Record<string, string[]> = {
  review: ["Adjust the budget", "Refine the timeline", "Recommend more vendors", "Summarize the plan"],
  planning: ["Summarize the plan"],
  approval: ["Summarize the plan"],
};

function QuickActions({ state, onPick, disabled }: { state?: string; onPick: (t: string) => void; disabled: boolean }) {
  const actions = state ? NEXT_ACTIONS[state] : undefined;
  if (!actions || !actions.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 pb-3">
      {actions.map((a) => (
        <button
          key={a}
          type="button"
          disabled={disabled}
          onClick={() => onPick(a)}
          className="focus-ring rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/10 disabled:opacity-40"
        >
          {a}
        </button>
      ))}
    </div>
  );
}

/** Plan-ready CTA: submit/approve the plan, then go to vendor suggestions (no email). */
function PlanReadyBar({ eventId }: { eventId: string }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      await agentApi.approvePlan(eventId);
    } catch {
      /* proceed anyway — suggestions are available from the saved plan */
    }
    navigate("/events/" + eventId + "/vendors");
  };
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3">
      <div className="text-sm text-emerald-100">
        Your plan is ready. Approve it to choose vendors.
      </div>
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="focus-ring inline-flex flex-none items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black transition disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Approve & choose vendors"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function StageStrip({ current }: { current?: string }) {
  const activeIndex = STAGES.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-1.5 border-b border-white/10 pb-4">
      <Sparkles size={15} className="mr-1 text-white/50" />
      {STAGES.map((s, i) => {
        const done = activeIndex >= 0 && i < activeIndex;
        const active = i === activeIndex;
        return (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className={
                "rounded-full px-2.5 py-1 text-xs transition " +
                (active ? "bg-white text-black" : done ? "bg-white/15 text-white/80" : "text-white/35")
              }
            >
              {s.label}
            </span>
            {i < STAGES.length - 1 && <span className="text-white/20">›</span>}
          </div>
        );
      })}
    </div>
  );
}

function EmptyPrompt({ onPick, disabled }: { onPick: (s: string) => void; disabled: boolean }) {
  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
        <Sparkles size={22} className="text-white" />
      </div>
      <h2 className="font-editorial text-3xl">Plan with your Copilot</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
        Describe your event in plain language. I'll ask what I need, then build the timeline, budget, vendors, and tasks for you.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s)}
            className="focus-ring surface rounded-2xl px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message, onApprove, approving }: { message: ChatMessage; onApprove: () => void; approving: boolean }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[20px] rounded-br-md bg-white px-4 py-3 text-sm text-black">{message.content}</div>
      </div>
    );
  }
  const run = message.run;
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-3">
        <div className={"surface rounded-[20px] rounded-bl-md px-4 py-3 text-sm " + (message.error ? "text-red-300" : "text-white/90")}>
          {message.pending ? <Thinking /> : <p className="whitespace-pre-wrap">{message.content}</p>}
        </div>

        {run && !message.pending && (
          <>
            {run.clarifying && run.missing_fields.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-1">
                {run.missing_fields.map((f) => (
                  <span key={f} className="rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
            {run.pending_approvals.length > 0 && (
              <ApprovalCard reasons={run.pending_approvals.map((a) => a.reason)} onApprove={onApprove} approving={approving} />
            )}
            <RunActivity run={run} />
          </>
        )}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <span className="inline-flex items-center gap-1 text-white/60">
      Planning
      <span className="inline-flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </span>
    </span>
  );
}

function ApprovalCard({ reasons, onApprove, approving }: { reasons: string[]; onApprove: () => void; approving: boolean }) {
  return (
    <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-amber-200">
        <AlertTriangle size={16} />
        Needs your approval
      </div>
      <ul className="mb-3 space-y-1 text-xs text-white/70">
        {reasons.map((r, i) => (
          <li key={i}>• {r}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onApprove}
        disabled={approving}
        className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-black transition disabled:opacity-50"
      >
        <CheckCircle2 size={16} />
        {approving ? "Working…" : "Approve & continue"}
      </button>
    </div>
  );
}
