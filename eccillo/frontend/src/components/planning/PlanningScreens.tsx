import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { planningApi } from "../../api/planning";
import type { BudgetLineItem, Event, Milestone, Risk, Task } from "../../types";
import { AiNote, CapsuleButton, Chip, MetricCard, Panel, ProgressBar, StatusBadge } from "../design/ds";
import { Loading } from "../ui";

/* The five planning screens from the "Eccillo Planning" design, wired to live
   event data. These replace the earlier hand-rolled workspace outright: same
   manual add/edit/delete affordances, laid out and tokenised as designed. */

export type Tab = "timeline" | "budget" | "tasks" | "calendar" | "risks";
export type PlanningProps = {
  eventId: string; tab: Tab; event?: Event;
  milestones: Milestone[]; tasks: Task[]; risks: Risk[];
  budget: BudgetLineItem[]; budgetSummary?: Record<string, number>;
  loading: boolean; refresh: (keys: string[]) => void;
};

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "timeline", label: "Timeline" }, { key: "budget", label: "Budget" }, { key: "tasks", label: "Tasks" },
  { key: "calendar", label: "Calendar" }, { key: "risks", label: "Risks" },
];

const money = (minor = 0, currency = "NPR") => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(minor / 100);
const shortDate = (value?: string | null) => value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value)) : "Unscheduled";
const longDate = (value?: string | null) => value ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "Unscheduled";
const pctOfStatus: Record<Task["status"], number> = { todo: 0, blocked: 25, in_progress: 50, done: 100 };

/* ── shared chrome ───────────────────────────────────────────────────────── */

/** Chip styling as a bare class, for the cases where the control is a link. */
const chipClass = (active: boolean) =>
  "focus-ring rounded-[var(--radius-pill)] px-4 py-2 font-[var(--font-data)] text-[13px] leading-none transition hover:opacity-[.82] " +
  (active ? "bg-[var(--accent)] font-bold text-[var(--onAccent)]" : "bg-[var(--cell)] text-[var(--text2)] shadow-[inset_0_0_0_1px_var(--ring)]");

const ctaClass = "focus-ring inline-flex h-[37px] shrink-0 items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--accent)] px-4 font-[var(--font-data)] text-[13px] font-bold text-[var(--onAccent)] transition hover:opacity-[.82]";

function Screen({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-7">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="eccillo-card-title text-[var(--text)]">{children}</h2>;
}

function Table({ head, children }: { head: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_var(--ring)]">
      <div className="flex min-h-[49px] items-center gap-4 border-b border-[var(--line)] bg-[var(--panel)] p-4">{head}</div>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[58px] flex-wrap items-center gap-4 border-b border-[var(--line)] bg-[var(--cell)] p-4 font-[var(--font-data)] text-[14px] text-[var(--text2)]">{children}</div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="p-10 text-center font-[var(--font-data)] text-[14px] text-[var(--text3)]">{children}</p>;
}

function AddBar({ onSubmit, pending, error, children }: { onSubmit: () => void; pending?: boolean; error?: Error | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <form className="flex flex-wrap items-center gap-3" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {children}
        <CapsuleButton size="sm" type="submit" disabled={pending}><Plus size={14} />Add</CapsuleButton>
      </form>
      {error && <p role="alert" className="font-[var(--font-data)] text-[13px] text-[var(--error)]">{error.message}</p>}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"focus-ring h-11 min-w-0 rounded-[var(--radius-specimen)] bg-[var(--cell)] px-4 font-[var(--font-data)] text-[14px] text-[var(--text)] shadow-[inset_0_0_0_1px_var(--ring)] outline-none placeholder:text-[var(--text3)] " + (props.className ?? "")} />;
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={label} className="focus-ring rounded-full p-2 text-[var(--text3)] transition hover:opacity-[.82]"><Trash2 size={16} /></button>;
}

function Donut({ slices, caption, value }: { slices: Array<{ name: string; pct: number }>; caption: string; value: string }) {
  let cursor = 0;
  const stops = slices.map((s, i) => {
    const from = cursor; cursor += s.pct;
    const alpha = [100, 64, 40, 18][Math.min(i, 3)];
    return `color-mix(in srgb, var(--dot) ${alpha}%, transparent) ${from}% ${cursor}%`;
  });
  return (
    <div className="flex w-full max-w-[380px] flex-col items-center gap-5 rounded-[var(--radius-card)] p-6 shadow-[inset_0_0_0_1px_var(--ring)]">
      <span className="eccillo-data-strong self-stretch text-[var(--text2)]">Expenditure distribution</span>
      <div className="relative size-40 rounded-full" style={{ background: `conic-gradient(${stops.join(",") || "var(--panel) 0 100%"})` }}>
        <div className="absolute inset-[26px] flex flex-col items-center justify-center gap-0.5 rounded-full bg-[var(--bg)]">
          <span className="font-[var(--font-editorial)] text-[22px] leading-none text-[var(--text)]">{value}</span>
          <span className="eccillo-label-caps">{caption}</span>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {slices.map((s, i) => (
          <div key={s.name} className="flex items-center justify-between font-[var(--font-data)] text-[13px] text-[var(--text2)]">
            <span className="flex min-w-0 items-center gap-2"><span className="size-2.5 shrink-0 rounded-full bg-[var(--dot)]" style={{ opacity: [1, .64, .4, .18][Math.min(i, 3)] }} /><span className="truncate">{s.name}</span></span>
            <span className="shrink-0 font-bold text-[var(--text)]">{s.pct.toFixed(1)}%</span>
          </div>
        ))}
        {!slices.length && <span className="font-[var(--font-data)] text-[13px] text-[var(--text3)]">No budget lines yet.</span>}
      </div>
    </div>
  );
}

/* ── entry point ─────────────────────────────────────────────────────────── */

export function PlanningScreens(props: PlanningProps) {
  const { eventId, tab, loading } = props;
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link key={t.key} to={`/events/${eventId}/planning/${t.key}`} className={chipClass(tab === t.key)}>{t.label}</Link>
          ))}
        </div>
      </div>
      {loading ? <Loading /> : (
        <>
          {tab === "timeline" && <TimelineScreen {...props} />}
          {tab === "budget" && <BudgetScreen {...props} />}
          {tab === "tasks" && <TasksScreen {...props} />}
          {tab === "calendar" && <CalendarScreen {...props} />}
          {tab === "risks" && <RisksScreen {...props} />}
        </>
      )}
    </div>
  );
}

/* ── timeline (gantt) ────────────────────────────────────────────────────── */

function TimelineScreen({ eventId, event, milestones, tasks, refresh }: PlanningProps) {
  const [title, setTitle] = useState(""); const [dueAt, setDueAt] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const add = useMutation({
    mutationFn: () => planningApi.createMilestone(eventId, { title, due_at: dueAt ? new Date(dueAt).toISOString() : null, status: "pending" }, event?.revision),
    onSuccess: () => { setTitle(""); setDueAt(""); refresh(["milestones"]); },
  });
  const remove = useMutation({ mutationFn: (id: string) => planningApi.deleteMilestone(eventId, id), onSuccess: () => refresh(["milestones"]) });

  const dated = milestones.filter((m) => m.due_at).sort((a, b) => String(a.due_at).localeCompare(String(b.due_at)));
  const start = dated.length ? new Date(dated[0].due_at!).getTime() : 0;
  const end = dated.length ? new Date(dated[dated.length - 1].due_at!).getTime() : 0;
  const span = Math.max(end - start, 1);
  const columns = 6;
  const weekLabels = Array.from({ length: columns }, (_, i) => dated.length ? shortDate(new Date(start + (span * i) / columns).toISOString()) : `W${i + 1}`);
  const atRisk = milestones.filter((m) => m.status === "at_risk");

  // Each milestone lands in exactly one week column — a calendar chip, not a spanning bar.
  const slotOf = (m: Milestone) => Math.min(columns - 1, Math.floor(((new Date(m.due_at!).getTime() - start) / span) * columns));

  return (
    <Screen>
      {atRisk.length > 0 && (
        <AiNote title="AI operations engine" action={<Link to={`/events/${eventId}/copilot`} className={ctaClass}>Resolve with AI</Link>}>
          {atRisk.length} milestone{atRisk.length === 1 ? " is" : "s are"} flagged at risk: {atRisk.map((m) => m.title).join(", ")}.
        </AiNote>
      )}

      <AddBar onSubmit={() => title.trim() && add.mutate()} pending={add.isPending} error={add.error}>
        <TextInput className="flex-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a milestone" />
        <TextInput type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
      </AddBar>

      <div className="flex flex-wrap items-center justify-between gap-3 font-[var(--font-data)] text-[13px] text-[var(--text2)]">
        <span>{milestones.length} milestone{milestones.length === 1 ? "" : "s"} · {dated.length} scheduled</span>
        <span className="flex gap-4">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[var(--dot)]" />Critical path</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 bg-[var(--dot)] [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]" />Milestone</span>
        </span>
      </div>

      <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_var(--ring)]">
        <div className="flex min-h-[49px] items-stretch border-b border-[var(--line)] bg-[var(--panel)]">
          <div className="flex w-[220px] shrink-0 items-center p-4 font-[var(--font-data)] text-[14px] font-bold text-[var(--text2)]">Operational tracks</div>
          <div className="flex flex-1">
            {weekLabels.map((w, i) => <div key={i} className="flex flex-1 items-center justify-center border-l border-[var(--line)] p-4 font-[var(--font-data)] text-[13px] font-bold text-[var(--text2)]">{w}</div>)}
          </div>
        </div>
        {dated.map((m) => {
          const open = openId === m.id;
          const owned = tasks.filter((t) => t.milestone === m.id);
          return (
            <div key={m.id} className="border-b border-[var(--line)]">
              <div className="flex min-h-20 items-stretch">
                <div className="flex w-[220px] shrink-0 flex-col justify-center gap-1 bg-[var(--panel)] p-5 font-[var(--font-data)]">
                  <span className="truncate text-[15px] font-bold text-[var(--text)]">{m.title}</span>
                  <span className="text-[12px] leading-none text-[var(--text3)]">{m.status.replace(/_/g, " ")}</span>
                </div>
                <div className="flex flex-1">
                  {weekLabels.map((_, i) => (
                    <div key={i} className="flex flex-1 items-center border-l border-[var(--line)] p-2">
                      {slotOf(m) === i && (
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : m.id)}
                          aria-expanded={open}
                          aria-label={`${m.title} — ${longDate(m.due_at)}. Show details`}
                          className={"focus-ring flex h-9 w-full items-center gap-2 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--accent)] px-3 font-[var(--font-data)] text-[12px] font-bold text-[var(--onAccent)] transition hover:opacity-[.82] " + (open ? "outline outline-2 outline-offset-2 outline-[var(--text)]" : "")}
                        >
                          <span className={"size-2 shrink-0 bg-[var(--onAccent)] " + (m.is_critical_path ? "rounded-full" : "[clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]")} />
                          <span className="truncate">{shortDate(m.due_at)}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center bg-[var(--panel)] pr-2"><DeleteButton label={`Delete ${m.title}`} onClick={() => remove.mutate(m.id)} /></div>
              </div>
              {open && (
                <div className="flex flex-col gap-2 border-t border-[var(--line)] bg-[var(--cell)] p-5 font-[var(--font-data)] text-[13px] text-[var(--text2)]">
                  <span className="text-[15px] font-bold text-[var(--text)]">{m.title}</span>
                  <span>{longDate(m.due_at)} · {m.status.replace(/_/g, " ")}{m.is_critical_path ? " · on the critical path" : ""}</span>
                  {m.description && <span className="text-[var(--text3)]">{m.description}</span>}
                  <span className="text-[var(--text3)]">{owned.length ? `${owned.filter((t) => t.status === "done").length}/${owned.length} linked tasks done` : "No linked tasks"}</span>
                </div>
              )}
            </div>
          );
        })}
        {!dated.length && <Empty>Add milestones with dates to draw the timeline.</Empty>}
      </div>

      {milestones.length > dated.length && (
        <Panel className="flex flex-col gap-3 p-5">
          <span className="eccillo-label-caps">Undated milestones</span>
          {milestones.filter((m) => !m.due_at).map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 font-[var(--font-data)] text-[14px] text-[var(--text)]">
              {m.title}<DeleteButton label={`Delete ${m.title}`} onClick={() => remove.mutate(m.id)} />
            </div>
          ))}
        </Panel>
      )}
    </Screen>
  );
}

/* ── budget ──────────────────────────────────────────────────────────────── */

function BudgetScreen({ eventId, event, budget, budgetSummary, refresh }: PlanningProps) {
  const [label, setLabel] = useState(""); const [amount, setAmount] = useState("");
  const currency = event?.currency ?? "NPR";
  const lines = budget.map((item) => ({ category: item.category, label: item.label, planned_minor: item.planned_minor, committed_minor: item.committed_minor, actual_minor: item.actual_minor, currency: item.currency }));
  const add = useMutation({
    mutationFn: () => planningApi.replaceBudget(eventId, [...lines, { category: "misc", label, planned_minor: Math.round(Number(amount || 0) * 100), currency }], event?.revision),
    onSuccess: () => { setLabel(""); setAmount(""); refresh(["budget"]); },
  });
  const remove = useMutation({ mutationFn: (id: string) => planningApi.deleteBudgetLine(eventId, id), onSuccess: () => refresh(["budget"]) });

  const planned = budgetSummary?.planned_minor ?? budget.reduce((s, b) => s + b.planned_minor, 0);
  const spent = budgetSummary?.actual_minor ?? budget.reduce((s, b) => s + b.actual_minor, 0);
  const target = event?.budget_target_minor ?? 0;
  const committed = budgetSummary?.committed_minor ?? budget.reduce((s, b) => s + b.committed_minor, 0);
  const overrun = Math.max(planned - target, 0);
  const slices = [...budget].sort((a, b) => b.planned_minor - a.planned_minor).slice(0, 4)
    .map((b) => ({ name: b.label || b.category, pct: planned ? (b.planned_minor / planned) * 100 : 0 }));

  const statusOf = (b: BudgetLineItem) => b.actual_minor >= b.planned_minor && b.planned_minor > 0
    ? { text: "Paid", tone: "neutral" } : b.committed_minor > 0
      ? { text: "Committed", tone: "warning" } : { text: "Pending", tone: "warning" };

  return (
    <Screen>
      <div className="flex flex-wrap gap-4">
        <MetricCard label="Total capital budget" value={money(target, currency)} note="Allocated threshold" />
        <MetricCard label="Planned" value={money(planned, currency)} note={target ? `${Math.round((planned / target) * 100)}% of target` : "No target set"} />
        <MetricCard label="Spent to date" value={money(spent, currency)} note={planned ? `${Math.round((spent / planned) * 100)}% of plan` : "Nothing spent"} />
        <MetricCard label="Projected overrun" value={money(overrun, currency)} note={overrun ? "Over the target" : "Within target"} />
      </div>

      <AddBar onSubmit={() => label.trim() && add.mutate()} pending={add.isPending} error={add.error}>
        <TextInput className="flex-1" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Budget item" />
        <TextInput type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Amount (${currency})`} />
      </AddBar>

      <div className="flex flex-wrap items-start gap-6">
        <div className="min-w-[320px] flex-1">
          <Table head={<>
            <span className="eccillo-label-caps flex-1">Category</span>
            <span className="eccillo-label-caps w-28">Allocated</span>
            <span className="eccillo-label-caps w-24">Spent</span>
            <span className="eccillo-label-caps w-28">Status</span>
            <span className="w-10" />
          </>}>
            {budget.map((b) => { const s = statusOf(b); return (
              <Row key={b.id}>
                <span className="min-w-0 flex-1 truncate font-bold text-[var(--text)]">{b.label || b.category}</span>
                <span className="w-28 font-bold text-[var(--text)]">{money(b.planned_minor, b.currency)}</span>
                <span className="w-24">{money(b.actual_minor, b.currency)}</span>
                <span className="w-28"><StatusBadge tone={s.tone}>{s.text}</StatusBadge></span>
                <span className="w-10"><DeleteButton label={`Delete ${b.label || b.category}`} onClick={() => remove.mutate(b.id)} /></span>
              </Row>
            ); })}
            {!budget.length && <Empty>Track the costs you expect for this event.</Empty>}
          </Table>
        </div>
        <Donut slices={slices} value={planned ? `${Math.round((committed / planned) * 100)}%` : "0%"} caption="Committed" />
      </div>
    </Screen>
  );
}

/* ── tasks ───────────────────────────────────────────────────────────────── */

const TASK_TABS = ["All tasks", "To do", "In progress", "Completed", "Blocked"] as const;

function TasksScreen({ eventId, event, tasks, milestones, refresh }: PlanningProps) {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<(typeof TASK_TABS)[number]>("All tasks");
  const add = useMutation({ mutationFn: () => planningApi.createTask(eventId, { title, status: "todo" }, event?.revision), onSuccess: () => { setTitle(""); refresh(["tasks"]); } });
  const toggle = useMutation({ mutationFn: (task: Task) => planningApi.updateTask(eventId, task.id, { status: task.status === "done" ? "todo" : "done" }, event?.revision), onSuccess: () => refresh(["tasks"]) });
  const remove = useMutation({ mutationFn: (id: string) => planningApi.deleteTask(eventId, id), onSuccess: () => refresh(["tasks"]) });

  const matchesFilter = (t: Task) =>
    filter === "All tasks" || (filter === "To do" && t.status === "todo") || (filter === "In progress" && t.status === "in_progress")
    || (filter === "Completed" && t.status === "done") || (filter === "Blocked" && t.status === "blocked");

  const groups = useMemo(() => {
    const byMilestone = new Map<string, Task[]>();
    tasks.filter(matchesFilter).forEach((t) => {
      const key = milestones.find((m) => m.id === t.milestone)?.title ?? "Unassigned work";
      byMilestone.set(key, [...(byMilestone.get(key) ?? []), t]);
    });
    return [...byMilestone.entries()];
  }, [tasks, milestones, filter]);

  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => t.status !== "done" && t.due_at && new Date(t.due_at) < new Date()).length;

  return (
    <Screen>
      <Panel className="flex flex-wrap items-center gap-x-10 gap-y-3 p-5 font-[var(--font-data)] text-[14px] font-bold text-[var(--text2)]">
        <span className="flex items-center gap-2">Total tasks<span className="text-[16px] text-[var(--text)]">{tasks.length}</span></span>
        <span className="flex items-center gap-2">Completed<span className="text-[16px] text-[var(--text)]">{done}</span></span>
        <span className="flex items-center gap-2">Overdue<span className="text-[16px] text-[var(--text)]">{overdue}</span></span>
      </Panel>

      <AddBar onSubmit={() => title.trim() && add.mutate()} pending={add.isPending} error={add.error}>
        <TextInput className="flex-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task" />
      </AddBar>

      <div className="flex flex-wrap gap-2">
        {TASK_TABS.map((t) => <Chip key={t} active={filter === t} onClick={() => setFilter(t)}>{t}</Chip>)}
      </div>

      <div className="flex flex-col gap-8">
        {groups.map(([group, items]) => (
          <div key={group} className="flex flex-col gap-4">
            <SectionTitle>{group}</SectionTitle>
            <div className="flex flex-col gap-3">
              {items.map((t) => {
                const pct = pctOfStatus[t.status];
                return (
                  <Panel key={t.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
                    <div className="flex min-w-0 flex-1 items-center gap-5">
                      <input type="checkbox" checked={t.status === "done"} onChange={() => toggle.mutate(t)} aria-label={`Mark ${t.title} complete`} className="size-[18px] shrink-0 accent-[var(--accent)]" />
                      <div className="flex min-w-0 flex-1 flex-col gap-2 font-[var(--font-data)]">
                        <span className={"truncate text-[16px] font-bold text-[var(--text)] " + (t.status === "done" ? "line-through opacity-60" : "")}>{t.title}</span>
                        <span className="flex items-center gap-3 text-[13px] leading-none text-[var(--text3)]">{longDate(t.due_at)}<span className="size-1 rounded-full bg-[var(--ring)]" />{t.status.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                    <div className="flex w-40 shrink-0 flex-col gap-1.5">
                      <span className="font-[var(--font-data)] text-[13px] font-bold text-[var(--text2)]">{pct}% complete</span>
                      <ProgressBar value={pct} />
                    </div>
                    <DeleteButton label={`Delete ${t.title}`} onClick={() => remove.mutate(t.id)} />
                  </Panel>
                );
              })}
            </div>
          </div>
        ))}
        {!groups.length && <Empty>{tasks.length ? "No tasks match this filter." : "No tasks yet."}</Empty>}
      </div>

      <Link to={`/events/${eventId}/copilot`} className="focus-ring sticky bottom-6 self-end">
        <span className="inline-flex items-center gap-2.5 rounded-[var(--radius-capsule)] bg-[var(--accent)] px-6 py-3.5 font-[var(--font-data)] text-[14px] font-bold text-[var(--onAccent)] shadow-[0_12px_24px_rgb(0_0_0/.24)] transition hover:opacity-[.82]">
          <Sparkles size={14} />Ask AI to prioritise
        </span>
      </Link>
    </Screen>
  );
}

/* ── calendar ────────────────────────────────────────────────────────────── */

function CalendarScreen({ milestones, tasks }: PlanningProps) {
  const items = useMemo(() => [
    ...milestones.filter((m) => m.due_at).map((m) => ({ title: m.title, due_at: m.due_at!, kind: "Milestone" })),
    ...tasks.filter((t) => t.due_at).map((t) => ({ title: t.title, due_at: t.due_at!, kind: "Task" })),
  ].sort((a, b) => a.due_at.localeCompare(b.due_at)), [milestones, tasks]);

  const [cursor, setCursor] = useState(() => { const d = items[0] ? new Date(items[0].due_at) : new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [selected, setSelected] = useState<string | null>(items[0]?.due_at.slice(0, 10) ?? null);

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(cursor);
  const firstWeekday = (cursor.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];
  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const onDay = (iso: string) => items.filter((i) => i.due_at.slice(0, 10) === iso);
  const agenda = selected ? onDay(selected) : [];
  const upcoming = items.filter((i) => new Date(i.due_at) >= new Date()).slice(0, 5);
  const shift = (months: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + months, 1));

  return (
    <div className="flex flex-wrap items-start gap-7">
      <div className="flex min-w-[320px] flex-1 flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="focus-ring flex size-8 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--text)]">‹</button>
            <span className="font-[var(--font-editorial)] text-[22px] leading-none text-[var(--text)]">{monthLabel}</span>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="focus-ring flex size-8 items-center justify-center rounded-full bg-[var(--panel)] text-[var(--text)]">›</button>
          </div>
          <Chip onClick={() => { const now = new Date(); setCursor(new Date(now.getFullYear(), now.getMonth(), 1)); setSelected(key(now)); }}>Today</Chip>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--cell)] shadow-[inset_0_0_0_1px_var(--ring)]">
          <div className="flex h-10 border-b border-[var(--line)] bg-[var(--panel)]">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => <div key={d} className="eccillo-label-caps flex flex-1 items-center justify-center">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="h-24 border-b border-r border-[var(--line)] bg-[var(--panel)]" />;
              const iso = key(day); const dots = onDay(iso); const isSelected = selected === iso;
              return (
                <button key={i} type="button" onClick={() => setSelected(iso)} className="focus-ring flex h-24 flex-col gap-2 border-b border-r border-[var(--line)] bg-[var(--cell)] p-2 text-left transition hover:opacity-[.82]">
                  <span className={"flex size-[22px] items-center justify-center rounded-full font-[var(--font-data)] text-[13px] " + (isSelected ? "bg-[var(--accent)] text-[var(--onAccent)]" : "text-[var(--text)]")}>{day.getDate()}</span>
                  <span className="flex gap-1.5">{dots.slice(0, 4).map((_, j) => <span key={j} className="size-1.5 rounded-full bg-[var(--dot)]" style={{ opacity: 1 - j * .2 }} />)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionTitle>Upcoming deadlines</SectionTitle>
          <div className="flex flex-col gap-2">
            {upcoming.map((i, n) => (
              <div key={n} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-specimen)] p-4 shadow-[inset_0_0_0_1px_var(--ring)] font-[var(--font-data)]">
                <span className="flex min-w-0 items-center gap-3 text-[14px] font-bold text-[var(--text)]"><span className="size-2 shrink-0 rounded-full bg-[var(--dot)]" /><span className="truncate">{i.title}</span></span>
                <span className="text-[13px] text-[var(--text3)]">{longDate(i.due_at)} · {i.kind}</span>
              </div>
            ))}
            {!upcoming.length && <Empty>Nothing scheduled ahead.</Empty>}
          </div>
        </div>
      </div>

      <Panel className="flex w-full max-w-[320px] flex-col gap-5 p-6">
        <div className="flex flex-col gap-1">
          <span className="eccillo-label-caps">Agenda for selected day</span>
          <span className="font-[var(--font-editorial)] text-[22px] leading-none text-[var(--text)]">{selected ? longDate(selected) : "No day selected"}</span>
        </div>
        <div className="flex flex-col gap-3.5">
          {agenda.map((a, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-[var(--radius-specimen)] bg-[var(--cell)] p-3 font-[var(--font-data)] shadow-[inset_0_0_0_1px_var(--ring)]">
              <span className="text-[14px] font-bold leading-[130%] text-[var(--text)]">{a.title}</span>
              <span className="self-start rounded-[4px] bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold leading-none text-[var(--onAccent)] opacity-80">{a.kind}</span>
            </div>
          ))}
          {!agenda.length && <span className="font-[var(--font-data)] text-[13px] leading-[150%] text-[var(--text3)]">Nothing scheduled for this day.</span>}
        </div>
      </Panel>
    </div>
  );
}

/* ── risks ───────────────────────────────────────────────────────────────── */

const LEVELS = ["low", "medium", "high"] as const;

function RisksScreen({ eventId, event, risks, refresh }: PlanningProps) {
  const [title, setTitle] = useState("");
  const add = useMutation({ mutationFn: () => planningApi.createRisk(eventId, { title, likelihood: "medium", impact: "medium", mitigation: "" }, event?.revision), onSuccess: () => { setTitle(""); refresh(["risks"]); } });
  const remove = useMutation({ mutationFn: (id: string) => planningApi.deleteRisk(eventId, id), onSuccess: () => refresh(["risks"]) });

  const high = risks.filter((r) => r.impact === "high" && r.likelihood === "high");
  const resolved = risks.filter((r) => r.status === "resolved");
  const mitigations = risks.filter((r) => r.mitigation);
  const opacity = { low: .35, medium: .6, high: 1 } as const;
  const heat = LEVELS.map((impact) => ({ label: impact, cells: LEVELS.map((likelihood) => risks.filter((r) => r.impact === impact && r.likelihood === likelihood).length) })).reverse();
  const peak = Math.max(1, ...heat.flatMap((row) => row.cells));

  return (
    <Screen>
      {high.length > 0 && (
        <AiNote title="AI risk analysis & mitigation engine" action={<Link to={`/events/${eventId}/copilot`} className={ctaClass}>Auto-mitigate</Link>}>
          {high.length} risk{high.length === 1 ? " is" : "s are"} both high-likelihood and high-impact. Ask the planner to draft mitigations.
        </AiNote>
      )}

      <div className="flex flex-wrap gap-4">
        <MetricCard label="Total identified risks" value={String(risks.length)} note="Across all tracks" />
        <MetricCard label="High priority" value={String(high.length)} note="Requires immediate focus" />
        <MetricCard label="Mitigated" value={String(resolved.length)} note="Closed out" />
        <MetricCard label="Open" value={String(risks.length - resolved.length)} note="Still on the risk track" />
      </div>

      <AddBar onSubmit={() => title.trim() && add.mutate()} pending={add.isPending} error={add.error}>
        <TextInput className="flex-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a risk" />
      </AddBar>

      <div className="flex flex-wrap items-start gap-6">
        <div className="min-w-[320px] flex-1">
          <Table head={<>
            <span className="eccillo-label-caps flex-1">Risk item</span>
            <span className="eccillo-label-caps w-24">Likelihood</span>
            <span className="eccillo-label-caps w-24">Impact</span>
            <span className="eccillo-label-caps w-28">Status</span>
            <span className="w-10" />
          </>}>
            {risks.map((r) => (
              <Row key={r.id}>
                <span className="min-w-0 flex-1 pr-4 font-bold text-[var(--text)]">{r.title}</span>
                <span className="flex w-24 items-center gap-1.5 text-[13px]"><span className="size-2 rounded-full bg-[var(--dot)]" style={{ opacity: opacity[r.likelihood] }} />{r.likelihood}</span>
                <span className="flex w-24 items-center gap-1.5 text-[13px]"><span className="size-2 rounded-full bg-[var(--dot)]" style={{ opacity: opacity[r.impact] }} />{r.impact}</span>
                <span className="w-28"><StatusBadge tone={r.status === "resolved" ? "success" : "warning"}>{r.status || "open"}</StatusBadge></span>
                <span className="w-10"><DeleteButton label={`Delete ${r.title}`} onClick={() => remove.mutate(r.id)} /></span>
              </Row>
            ))}
            {!risks.length && <Empty>No risks recorded yet.</Empty>}
          </Table>
        </div>

        <div className="flex w-full max-w-[380px] flex-col gap-5 rounded-[var(--radius-card)] p-6 shadow-[inset_0_0_0_1px_var(--ring)]">
          <span className="font-[var(--font-editorial)] text-[20px] leading-none text-[var(--text)]">Concentration matrix</span>
          <div className="flex flex-col gap-1">
            <div className="flex h-5 gap-1"><span className="w-10 shrink-0" />{LEVELS.map((l) => <span key={l} className="eccillo-label-caps flex-1">{l[0]}</span>)}</div>
            {heat.map((row) => (
              <div key={row.label} className="flex h-14 items-center gap-1">
                <span className="eccillo-label-caps w-10 shrink-0">{row.label.slice(0, 3)}</span>
                {row.cells.map((count, i) => (
                  <span key={i} className="flex h-14 flex-1 items-center justify-center rounded-[4px] bg-[var(--dot)] font-[var(--font-data)] text-[12px] font-bold" style={{ opacity: Math.max(count / peak, .08), color: "var(--onAccent)" }}>{count || ""}</span>
                ))}
              </div>
            ))}
          </div>
          <span className="font-[var(--font-data)] text-[12px] text-[var(--text3)]">Rows are impact, columns are likelihood.</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle>Required mitigation actions</SectionTitle>
        <div className="flex flex-col overflow-hidden rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_var(--ring)]">
          {mitigations.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--cell)] p-4 font-[var(--font-data)]">
              <span className="min-w-0 flex-1 text-[15px] font-bold text-[var(--text)]">{r.mitigation}</span>
              <span className="rounded-[var(--radius-pill)] bg-[var(--accent)] px-3 py-1 text-[12px] font-bold leading-none text-[var(--onAccent)]">{r.impact} impact</span>
            </div>
          ))}
          {!mitigations.length && <Empty>No mitigations recorded. Open a risk in the Copilot to draft one.</Empty>}
        </div>
      </div>
    </Screen>
  );
}
