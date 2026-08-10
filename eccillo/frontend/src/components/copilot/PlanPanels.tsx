import { useState } from "react";
import { AlertTriangle, Calendar, CalendarDays, CheckSquare, LayoutList, Store, Wallet } from "lucide-react";
import { useAgentState } from "../../hooks/useAgentState";
import type { StructuredEventState, StructuredVendorRef } from "../../types/agent";
import { GanttTimeline } from "./GanttTimeline";
import { CalendarView } from "./CalendarView";

type TabKey = "overview" | "timeline" | "calendar" | "budget" | "vendors" | "tasks" | "risks";
const TABS: Array<{ key: TabKey; label: string; icon: typeof LayoutList }> = [
  { key: "overview", label: "Overview", icon: LayoutList },
  { key: "timeline", label: "Timeline", icon: CalendarDays },
  { key: "calendar", label: "Calendar", icon: Calendar },
  { key: "budget", label: "Budget", icon: Wallet },
  { key: "vendors", label: "Vendors", icon: Store },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "risks", label: "Risks", icon: AlertTriangle },
];

function money(minor: number, currency: string) {
  return currency + " " + (minor / 100).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function PlanPanels({ eventId }: { eventId: string }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const state = useAgentState(eventId);
  const s = state.data;

  const count: Record<TabKey, number> = {
    overview: 0,
    timeline: s?.timeline.length ?? 0,
    calendar: 0,
    budget: s?.budget_lines.length ?? 0,
    vendors: s?.vendors.length ?? 0,
    tasks: s?.tasks.length ?? 0,
    risks: s?.risks.length ?? 0,
  };

  return (
    <aside className="surface flex h-[calc(100vh-150px)] flex-col rounded-[24px] p-4">
      <div className="mb-3 flex flex-wrap gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              "focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition " +
              (tab === key ? "bg-white text-black" : "text-white/60 hover:bg-white/10")
            }
          >
            <Icon size={13} />
            {label}
            {count[key] > 0 && <span className="opacity-60">{count[key]}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {!s ? (
          <p className="py-10 text-center text-sm text-white/40">{state.isLoading ? "Loading plan…" : "No plan yet — start chatting."}</p>
        ) : (
          <>
            {tab === "overview" && <Overview s={s} />}
            {tab === "timeline" && <GanttTimeline items={s.timeline} eventDate={s.date} />}
            {tab === "calendar" && <CalendarView s={s} />}
            {tab === "budget" && <Budget s={s} />}
            {tab === "vendors" && <Vendors s={s} />}
            {tab === "tasks" && <Tasks s={s} />}
            {tab === "risks" && <Risks s={s} />}
          </>
        )}
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="text-white/90">{value}</span>
    </div>
  );
}

function Overview({ s }: { s: StructuredEventState }) {
  return (
    <div>
      <Row label="Type" value={s.event_type ?? "—"} />
      <Row label="Date" value={s.date ?? "—"} />
      <Row label="Guests" value={s.guest_count ? String(s.guest_count) : "—"} />
      <Row label="Budget" value={s.budget ? money(s.budget, s.currency) : "—"} />
      <Row label="Location" value={s.location ?? s.venue ?? "—"} />
      <Row label="Stage" value={s.status.replace(/_/g, " ")} />
      {s.notes.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Notes</p>
          <ul className="space-y-1 text-sm text-white/70">
            {s.notes.map((n, i) => (
              <li key={i}>• {n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-white/35">{text}</p>;
}

function Budget({ s }: { s: StructuredEventState }) {
  if (!s.budget_lines.length) return <Empty text="No budget allocated yet." />;
  const total = s.budget_lines.reduce((a, b) => a + b.planned_minor, 0);
  return (
    <div>
      <ul className="space-y-1.5">
        {s.budget_lines.map((b, i) => (
          <li key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-sm">
            <span className="capitalize text-white/80">{b.label || b.category}</span>
            <span className="text-white/90">{money(b.planned_minor, b.currency)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm">
        <span className="text-white/45">Total</span>
        <span className="font-medium text-white">{money(total, s.currency)}</span>
      </div>
    </div>
  );
}

function scorePct(score: number) {
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}

/** Phase C — explainable supplier card (curated or OSM-discovered). */
function SupplierCard({ v }: { v: StructuredVendorRef }) {
  return (
    <li className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-white/90">{v.name}</p>
          <p className="text-xs capitalize text-white/45">{v.category}</p>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">{scorePct(v.score)}%</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-300/70" style={{ width: scorePct(v.score) + "%" }} />
      </div>
      {v.reasons.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-white/50">
          {v.reasons.slice(0, 3).map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Vendors({ s }: { s: StructuredEventState }) {
  if (!s.vendors.length) return <Empty text="No vendors shortlisted yet." />;
  return (
    <ul className="space-y-2">
      {s.vendors.map((v, i) => (
        <SupplierCard key={v.vendor_id || i} v={v} />
      ))}
    </ul>
  );
}

function Tasks({ s }: { s: StructuredEventState }) {
  if (!s.tasks.length) return <Empty text="No tasks yet." />;
  return (
    <ul className="space-y-1.5">
      {s.tasks.map((t, i) => (
        <li key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-sm">
          <span className="text-white/80">{t.title}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize text-white/55">{t.status.replace(/_/g, " ")}</span>
        </li>
      ))}
    </ul>
  );
}

function Risks({ s }: { s: StructuredEventState }) {
  if (!s.risks.length) return <Empty text="No risks flagged." />;
  return (
    <ul className="space-y-2">
      {s.risks.map((r, i) => {
        const risk = r as { title?: string; likelihood?: string; impact?: string; mitigation?: string };
        return (
          <li key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-sm">
            <p className="text-white/90">{risk.title ?? "Risk"}</p>
            <div className="mt-1 flex gap-2 text-xs text-white/45">
              {risk.likelihood && <span>likelihood: {risk.likelihood}</span>}
              {risk.impact && <span>· impact: {risk.impact}</span>}
            </div>
            {risk.mitigation && <p className="mt-1 text-xs text-white/55">{risk.mitigation}</p>}
          </li>
        );
      })}
    </ul>
  );
}
