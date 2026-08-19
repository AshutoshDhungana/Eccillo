import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { AiNote, CapsuleButton, MetricCard, Panel, ProgressBar } from "../components/design/ds";
import { Loading } from "../components/ui";
import { agentApi } from "../api/agent";
import { planningApi } from "../api/planning";
import { useAgentConversation } from "../hooks/useAgentConversation";
import { useAgentState } from "../hooks/useAgentState";
import type { EventType } from "../types";

/* The AI setup flow from the "Eccillo Planning" design, reworked so the plan is
   built and confirmed one step at a time: the agent proposes a step, the planner
   edits it, and nothing moves forward until that step is verified and written to
   the event. There is no single end-of-flow approval any more — each step commits
   on its own, so a half-finished setup still leaves real, reviewed records. */

const STEPS = [
  { key: "details", label: "Event Details", cta: "Verify details" },
  { key: "venue", label: "Venue & Logistics", cta: "Verify venue" },
  { key: "agenda", label: "Agenda Builder", cta: "Verify agenda" },
  { key: "budget", label: "Budget & Resources", cta: "Verify budget" },
  { key: "review", label: "Review & Launch", cta: "Launch event" },
] as const;

const EVENT_TYPES: EventType[] = ["conference", "workshop", "meetup", "festival", "wedding", "hackathon", "seminar", "sports", "birthday", "other"];
const toMajor = (minor?: number | null) => (minor ? String(Math.round(minor / 100)) : "");
const toMinor = (major: string) => Math.round(Number(major || 0) * 100);
const forInput = (iso?: string | null) => (iso ? iso.slice(0, 16) : "");
const toIso = (local: string) => (local ? new Date(local).toISOString() : null);

function StepShell({ index, children, footer }: { index: number; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <section className="mx-auto flex max-w-[var(--frame-app)] flex-col gap-8 rounded-[var(--radius-card-lg)] bg-[var(--bg)] p-6 shadow-[inset_0_0_0_1px_var(--ring)] sm:p-10">
      <header className="flex flex-col gap-4 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eccillo-label-caps">AI Setup Wizard · Step {index + 2} of 6</span>
          <h1 className="eccillo-card-title text-[var(--text)]">{STEPS[index].label}</h1>
        </div>
        <ProgressBar value={((index + 2) / 6) * 100} />
      </header>
      <div className="flex flex-1 flex-col gap-6">{children}</div>
      <footer className="flex items-center justify-between border-t border-[var(--line)] pt-6">{footer}</footer>
    </section>
  );
}

function VerifiedMark() {
  return (
    <span className="inline-flex items-center gap-1.5 font-[var(--font-data)] text-[13px] font-bold text-[var(--success)]">
      <Check size={14} />Verified
    </span>
  );
}

export function EventSetupWizard() {
  const { eventId = "" } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const intro = (useLocation().state as { intro?: string } | null)?.intro;

  const [step, setStep] = useState(0);
  // ponytail: verification is per-session, not persisted. A reload re-asks for
  // confirmation of steps already written — add a server-side flag if that grates.
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const markVerified = (key: string) => setVerified((v) => ({ ...v, [key]: true }));

  const event = useQuery({ queryKey: ["event", eventId], queryFn: () => planningApi.getEvent(eventId), enabled: Boolean(eventId) });
  const agentState = useAgentState(eventId);
  const conversation = useAgentConversation(eventId, {
    intro,
    onComplete: () => {
      void client.invalidateQueries({ queryKey: ["agent-state", eventId] });
      void client.invalidateQueries({ queryKey: ["event", eventId] });
      // A planning turn re-runs vendor matching, so the shortlist behind step 2
      // is stale too — without this "Re-run search" never shows what it found.
      void client.invalidateQueries({ queryKey: ["agent-vendors", eventId] });
    },
  });

  const proposal = agentState.data;
  const busy = conversation.sending || conversation.loadingHistory;
  const current = STEPS[step];
  const isVerified = Boolean(verified[current.key]);

  // GET /agent/state always answers — with no agent activity yet it reconstructs
  // a snapshot from the bare event — so `proposal` is truthy long before it holds
  // anything. Gate the steps on the scaffolding run instead: `latestRun` stays
  // undefined until the first turn completes, and is already set by the time a
  // later turn (e.g. "Re-run search") makes `busy` true again.
  const scaffolding = busy && !conversation.latestRun;

  const advice = conversation.messages.filter((m) => m.role === "assistant" && !m.pending && !m.error).slice(-1)[0]?.content;

  // The agent asks one deterministic clarifying question when core fields are
  // missing and runs no workflow until it is answered, so the wizard has to be
  // able to answer it — otherwise the later steps stay empty for good.
  const clarifying = Boolean(conversation.latestRun?.clarifying);

  return (
    <AppShell eventId={eventId} title={event.data?.title ?? "AI event setup"}>
      {scaffolding ? (
        <Loading label="The planner is scaffolding your event…" />
      ) : (
        <StepShell
          index={step}
          footer={
            <>
              <CapsuleButton tone="muted" onClick={() => (step === 0 ? navigate("/events") : setStep(step - 1))}>
                {step === 0 ? "Save as draft" : "Back"}
              </CapsuleButton>
              <div className="flex items-center gap-4">
                {isVerified && step < STEPS.length - 1 && <VerifiedMark />}
                {isVerified && step < STEPS.length - 1 && (
                  <CapsuleButton onClick={() => setStep(step + 1)}>
                    Continue<ArrowRight size={14} />
                  </CapsuleButton>
                )}
              </div>
            </>
          }
        >
          {advice && <AiNote title="AI planner">{advice}</AiNote>}
          {clarifying && <ClarifyReply busy={busy} onSend={(t) => void conversation.send(t)} />}
          {/* Keyed on the proposal revision: the steps seed their forms once on
              mount, so remounting is what lets a fresh agent proposal land. */}
          {step === 0 && <DetailsStep key={proposal?.revision} eventId={eventId} event={event.data} proposal={proposal} verified={isVerified} onVerified={() => markVerified("details")} />}
          {step === 1 && <VenueStep eventId={eventId} verified={isVerified} onVerified={() => markVerified("venue")} onAsk={(t) => void conversation.send(t)} busy={busy} />}
          {step === 2 && <AgendaStep key={proposal?.revision} eventId={eventId} proposal={proposal} verified={isVerified} onVerified={() => markVerified("agenda")} />}
          {step === 3 && <BudgetStep key={proposal?.revision} eventId={eventId} proposal={proposal} verified={isVerified} onVerified={() => markVerified("budget")} />}
          {step === 4 && <ReviewStep eventId={eventId} verified={verified} />}
        </StepShell>
      )}
    </AppShell>
  );
}

/* ── Step 1: details ─────────────────────────────────────────────────────── */

type DetailsForm = { title: string; type: string; location: string; starts_at: string; ends_at: string; expected_attendees: string; budget: string; currency: string };

function DetailsStep({ eventId, event, proposal, verified, onVerified }: { eventId: string; event?: import("../types").Event; proposal?: import("../types/agent").StructuredEventState; verified: boolean; onVerified: () => void }) {
  const client = useQueryClient();
  const [form, setForm] = useState<DetailsForm | null>(null);
  const set = (key: keyof DetailsForm, value: string) => setForm((f) => (f ? { ...f, [key]: value } : f));

  // Seed once from the AI proposal, falling back to whatever the event already holds.
  useEffect(() => {
    if (form || (!proposal && !event)) return;
    setForm({
      title: proposal?.title || event?.title || "",
      type: proposal?.event_type || event?.type || "conference",
      location: proposal?.venue || proposal?.location || event?.location?.name || "",
      starts_at: forInput(proposal?.date || event?.starts_at),
      ends_at: forInput(proposal?.end_date || event?.ends_at),
      expected_attendees: String(proposal?.guest_count ?? event?.expected_attendees ?? ""),
      budget: toMajor(proposal?.budget ?? event?.budget_target_minor),
      currency: proposal?.currency || event?.currency || "NPR",
    });
  }, [proposal, event, form]);

  const save = useMutation({
    mutationFn: () =>
      planningApi.updateEvent(
        eventId,
        {
          title: form!.title.trim(),
          type: form!.type as EventType,
          location: form!.location.trim() ? { name: form!.location.trim() } : {},
          starts_at: toIso(form!.starts_at),
          ends_at: toIso(form!.ends_at),
          expected_attendees: Number(form!.expected_attendees || 0),
          budget_target_minor: toMinor(form!.budget),
          currency: form!.currency.toUpperCase(),
        },
        event?.revision,
      ),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["event", eventId] });
      onVerified();
    },
  });

  if (!form) return <Loading label="Reading the AI proposal…" />;

  const field = (label: string, key: keyof DetailsForm, type = "text") => (
    <label className="flex flex-col gap-2">
      <span className="font-[var(--font-data)] text-[13px] font-bold text-[var(--text2)]">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        className="focus-ring h-12 rounded-[var(--radius-specimen)] bg-[var(--cell)] px-4 font-[var(--font-data)] text-[15px] text-[var(--text)] shadow-[inset_0_0_0_1px_var(--ring)] outline-none"
      />
    </label>
  );

  return (
    <>
      <AiNote>Here is what I understood from your description. Correct anything that is wrong — nothing is saved to the event until you verify this step.</AiNote>
      <div className="grid gap-6 sm:grid-cols-2">
        {field("Event name", "title")}
        <label className="flex flex-col gap-2">
          <span className="font-[var(--font-data)] text-[13px] font-bold text-[var(--text2)]">Event type</span>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="focus-ring h-12 rounded-[var(--radius-specimen)] bg-[var(--cell)] px-4 font-[var(--font-data)] text-[15px] text-[var(--text)] shadow-[inset_0_0_0_1px_var(--ring)] outline-none"
          >
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        {field("Expected attendees", "expected_attendees", "number")}
        {field("Location", "location")}
        {field("Starts at", "starts_at", "datetime-local")}
        {field("Ends at", "ends_at", "datetime-local")}
        {field("Budget", "budget", "number")}
        {field("Currency", "currency")}
      </div>
      <CommitRow
        verified={verified}
        pending={save.isPending}
        error={save.error}
        label="Verify details & save"
        hint="Saves these fields to the event record."
        onCommit={() => save.mutate()}
      />
    </>
  );
}

/* ── Step 2: venue & logistics ───────────────────────────────────────────── */

function VenueStep({ eventId, verified, onVerified, onAsk, busy }: { eventId: string; verified: boolean; onVerified: () => void; onAsk: (text: string) => void; busy: boolean }) {
  const vendors = useQuery({ queryKey: ["agent-vendors", eventId], queryFn: () => agentApi.getVendors(eventId), enabled: Boolean(eventId) });
  const list = vendors.data?.vendors ?? [];

  // This endpoint only ever returns what the agent already shortlisted, so start
  // with all of it selected and let the planner untick — same review-and-correct
  // shape as the agenda and budget steps.
  const [picked, setPicked] = useState<string[] | null>(null);
  useEffect(() => {
    if (picked || !vendors.data) return;
    setPicked(vendors.data.vendors.map((v) => v.vendor_id));
  }, [vendors.data, picked]);
  const sel = picked ?? [];

  const commit = useMutation({ mutationFn: () => agentApi.shortlist(eventId, sel), onSuccess: onVerified });

  return (
    <>
      <AiNote action={<CapsuleButton size="sm" disabled={busy} onClick={() => onAsk("Suggest venues and vendors that fit this event.")}><Sparkles size={12} />Re-run search</CapsuleButton>}>
        Pick the venues and vendors worth pursuing. Only what you select here is shortlisted — the agent does not book or contact anyone.
      </AiNote>
      {vendors.isLoading ? (
        <Loading label="Matching venues…" />
      ) : list.length === 0 ? (
        <Panel className="p-6 font-[var(--font-data)] text-[14px] text-[var(--text2)]">No suggestions yet. Ask the planner to search, then verify this step once you have picked at least one.</Panel>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((v) => {
            const on = sel.includes(v.vendor_id);
            return (
              <button
                key={v.vendor_id}
                type="button"
                onClick={() => setPicked(on ? sel.filter((id) => id !== v.vendor_id) : [...sel, v.vendor_id])}
                className={"focus-ring flex flex-col gap-2 rounded-[var(--radius-card)] bg-[var(--cell)] p-4 text-left transition hover:opacity-[.82] " + (on ? "shadow-[inset_0_0_0_2px_var(--accent)]" : "shadow-[inset_0_0_0_1px_var(--ring)]")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-[var(--font-data)] text-[15px] font-bold text-[var(--text)]">{v.name}</span>
                  <span className="shrink-0 rounded-[var(--radius-pill)] bg-[var(--accent)] px-2 py-1 font-[var(--font-data)] text-[11px] font-bold text-[var(--onAccent)]">{Math.round(v.score * 100)}% match</span>
                </div>
                <span className="font-[var(--font-data)] text-[13px] text-[var(--text2)]">{v.category}{v.rating_avg ? ` · ${v.rating_avg.toFixed(1)}★` : ""}</span>
                {v.reasons[0] && <span className="font-[var(--font-data)] text-[12px] leading-[140%] text-[var(--text3)]">{v.reasons[0]}</span>}
                {v.price_from_minor != null && <span className="font-[var(--font-editorial)] text-[18px] text-[var(--text)]">{(v.price_from_minor / 100).toLocaleString()} {v.currency}</span>}
              </button>
            );
          })}
        </div>
      )}
      <CommitRow
        verified={verified}
        pending={commit.isPending}
        error={commit.error}
        disabled={sel.length === 0}
        label={`Verify ${sel.length || ""} selection${sel.length === 1 ? "" : "s"}`.replace("  ", " ")}
        hint="Saves the shortlist on the event."
        onCommit={() => commit.mutate()}
      />
    </>
  );
}

/* ── Step 3: agenda / timeline ───────────────────────────────────────────── */

function AgendaStep({ eventId, proposal, verified, onVerified }: { eventId: string; proposal?: import("../types/agent").StructuredEventState; verified: boolean; onVerified: () => void }) {
  const client = useQueryClient();
  const [rows, setRows] = useState<Array<{ title: string; due_at: string; keep: boolean }> | null>(null);
  useEffect(() => {
    if (rows || !proposal) return;
    setRows(proposal.timeline.map((t) => ({ title: t.title, due_at: forInput(t.due_at), keep: true })));
  }, [proposal, rows]);

  const kept = useMemo(() => (rows ?? []).filter((r) => r.keep && r.title.trim()), [rows]);
  const commit = useMutation({
    mutationFn: async () => {
      for (const [index, row] of kept.entries()) {
        await planningApi.createMilestone(eventId, { title: row.title.trim(), due_at: toIso(row.due_at), status: "pending", order: index });
      }
    },
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["milestones", eventId] });
      onVerified();
    },
  });

  if (!rows) return <Loading label="Reading the proposed agenda…" />;

  return (
    <>
      <AiNote>I drafted this schedule from your brief. Drop what you do not need and fix the dates — the kept rows become real milestones when you verify.</AiNote>
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className={"flex flex-wrap items-center gap-4 rounded-[var(--radius-specimen)] bg-[var(--cell)] p-4 shadow-[inset_0_0_0_1px_var(--ring)] " + (row.keep ? "" : "opacity-40")}>
            <input
              type="checkbox"
              checked={row.keep}
              aria-label={`Keep ${row.title}`}
              onChange={() => setRows(rows.map((r, j) => (i === j ? { ...r, keep: !r.keep } : r)))}
              className="size-4 accent-[var(--accent)]"
            />
            <input
              value={row.title}
              onChange={(e) => setRows(rows.map((r, j) => (i === j ? { ...r, title: e.target.value } : r)))}
              className="focus-ring min-w-0 flex-1 bg-transparent font-[var(--font-data)] text-[15px] font-bold text-[var(--text)] outline-none"
            />
            <input
              type="datetime-local"
              value={row.due_at}
              onChange={(e) => setRows(rows.map((r, j) => (i === j ? { ...r, due_at: e.target.value } : r)))}
              className="focus-ring rounded-[var(--radius-specimen)] bg-[var(--panel)] px-3 py-2 font-[var(--font-data)] text-[13px] text-[var(--text2)] outline-none"
            />
          </div>
        ))}
        {!rows.length && <Panel className="p-6 font-[var(--font-data)] text-[14px] text-[var(--text2)]">The planner has not proposed a timeline yet.</Panel>}
      </div>
      <CommitRow
        verified={verified}
        pending={commit.isPending}
        error={commit.error}
        disabled={!kept.length}
        label={`Verify & create ${kept.length} milestone${kept.length === 1 ? "" : "s"}`}
        hint="Writes the kept rows to the event timeline."
        onCommit={() => commit.mutate()}
      />
    </>
  );
}

/* ── Step 4: budget ──────────────────────────────────────────────────────── */

function BudgetStep({ eventId, proposal, verified, onVerified }: { eventId: string; proposal?: import("../types/agent").StructuredEventState; verified: boolean; onVerified: () => void }) {
  const client = useQueryClient();
  const [rows, setRows] = useState<Array<{ category: string; label: string; amount: string; currency: string; keep: boolean }> | null>(null);
  useEffect(() => {
    if (rows || !proposal) return;
    setRows(proposal.budget_lines.map((b) => ({ category: b.category, label: b.label, amount: toMajor(b.planned_minor), currency: b.currency || proposal.currency, keep: true })));
  }, [proposal, rows]);

  const kept = useMemo(() => (rows ?? []).filter((r) => r.keep), [rows]);
  const total = kept.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const currency = kept[0]?.currency || proposal?.currency || "NPR";

  const commit = useMutation({
    mutationFn: () =>
      planningApi.replaceBudget(
        eventId,
        kept.map((r) => ({ category: r.category, label: r.label, planned_minor: toMinor(r.amount), currency: r.currency })),
      ),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["budget", eventId] });
      onVerified();
    },
  });

  if (!rows) return <Loading label="Reading the proposed budget…" />;

  return (
    <>
      <AiNote title="AI optimisation advisory">Every line below is an estimate. Adjust the numbers you disagree with; verifying replaces the event budget with exactly what is shown here.</AiNote>
      <div className="flex flex-wrap gap-4">
        <MetricCard label="Verified total" value={`${total.toLocaleString()} ${currency}`} note={`${kept.length} of ${rows.length} lines kept`} />
        <MetricCard label="Proposed by AI" value={`${rows.reduce((s, r) => s + Number(r.amount || 0), 0).toLocaleString()} ${currency}`} note="Before your edits" />
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i} className={"flex flex-wrap items-center gap-4 rounded-[var(--radius-specimen)] bg-[var(--cell)] p-4 shadow-[inset_0_0_0_1px_var(--ring)] " + (row.keep ? "" : "opacity-40")}>
            <input
              type="checkbox"
              checked={row.keep}
              aria-label={`Keep ${row.label || row.category}`}
              onChange={() => setRows(rows.map((r, j) => (i === j ? { ...r, keep: !r.keep } : r)))}
              className="size-4 accent-[var(--accent)]"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-[var(--font-data)] text-[15px] font-bold text-[var(--text)]">{row.label || row.category}</p>
              <p className="eccillo-label-caps mt-1">{row.category}</p>
            </div>
            <input
              type="number"
              min="0"
              value={row.amount}
              onChange={(e) => setRows(rows.map((r, j) => (i === j ? { ...r, amount: e.target.value } : r)))}
              className="focus-ring w-32 rounded-[var(--radius-specimen)] bg-[var(--panel)] px-3 py-2 text-right font-[var(--font-data)] text-[15px] font-bold text-[var(--text)] outline-none"
            />
            <span className="font-[var(--font-data)] text-[13px] text-[var(--text3)]">{row.currency}</span>
          </div>
        ))}
        {!rows.length && <Panel className="p-6 font-[var(--font-data)] text-[14px] text-[var(--text2)]">The planner has not proposed a budget yet.</Panel>}
      </div>
      <CommitRow
        verified={verified}
        pending={commit.isPending}
        error={commit.error}
        disabled={!kept.length}
        label="Verify & save budget"
        hint="Replaces the event budget with the kept lines."
        onCommit={() => commit.mutate()}
      />
    </>
  );
}

/* ── Step 5: review & launch ─────────────────────────────────────────────── */

function ReviewStep({ eventId, verified }: { eventId: string; verified: Record<string, boolean> }) {
  const navigate = useNavigate();
  const done = STEPS.slice(0, 4).filter((s) => verified[s.key]);
  const readiness = Math.round((done.length / 4) * 100);
  const launch = useMutation({
    mutationFn: () => agentApi.approvePlan(eventId),
    onSuccess: () => navigate(`/events/${eventId}/planning/timeline`),
  });

  return (
    <>
      <AiNote title="Readiness check">
        {readiness === 100
          ? "Every step has been verified against a real record. You can launch."
          : "Some steps have not been verified yet. You can still launch, but the unverified parts of the plan were never written to the event."}
      </AiNote>
      <div className="flex flex-wrap gap-6">
        <Panel className="flex flex-1 flex-col gap-4 p-6">
          <span className="eccillo-card-title text-[var(--text)]">Verified steps</span>
          {STEPS.slice(0, 4).map((s) => (
            <div key={s.key} className={"flex items-center gap-3 font-[var(--font-data)] text-[14px] " + (verified[s.key] ? "text-[var(--text)]" : "text-[var(--text3)]")}>
              <span className={"flex size-5 items-center justify-center rounded-[4px] shadow-[inset_0_0_0_1px_var(--ring)] " + (verified[s.key] ? "bg-[var(--accent)] text-[var(--onAccent)]" : "")}>
                {verified[s.key] && <Check size={12} />}
              </span>
              {s.label}
            </div>
          ))}
        </Panel>
        <div className="flex w-full max-w-[320px] flex-col items-center justify-center gap-5 rounded-[var(--radius-card)] bg-[var(--cell)] p-8 shadow-[inset_0_0_0_1px_var(--ring)]">
          <span className="eccillo-card-title self-stretch text-[var(--text2)]">Readiness score</span>
          <div className="relative size-[140px] rounded-full" style={{ background: `conic-gradient(var(--success) 0 ${readiness}%, var(--panel) ${readiness}% 100%)` }}>
            <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-[var(--cell)]">
              <span className="font-[var(--font-editorial)] text-[28px] font-bold leading-none text-[var(--text)]">{readiness}%</span>
              <span className="eccillo-label-caps mt-1">Verified</span>
            </div>
          </div>
        </div>
      </div>
      {launch.error && <p role="alert" className="font-[var(--font-data)] text-[13px] text-[var(--error)]">{(launch.error as Error).message}</p>}
      <CapsuleButton className="self-start" disabled={launch.isPending} onClick={() => launch.mutate()}>
        {launch.isPending ? "Launching…" : "Launch event"}<ArrowRight size={14} />
      </CapsuleButton>
    </>
  );
}

/* ── shared controls ─────────────────────────────────────────────────────── */

/** Answer the planner's clarifying question without leaving the wizard. */
function ClarifyReply({ busy, onSend }: { busy: boolean; onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const submit = () => {
    const t = text.trim();
    if (!t || busy) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-specimen)] bg-[var(--panel)] p-4">
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        aria-label="Reply to the planner"
        placeholder="Answer the planner so it can finish scaffolding the rest…"
        className="focus-ring h-12 min-w-0 flex-1 rounded-[var(--radius-specimen)] bg-[var(--cell)] px-4 font-[var(--font-data)] text-[15px] text-[var(--text)] shadow-[inset_0_0_0_1px_var(--ring)] outline-none placeholder:text-[var(--text3)]"
      />
      <CapsuleButton size="sm" disabled={busy || !text.trim()} onClick={submit}>
        {busy ? "Thinking…" : "Reply"}
        <ArrowRight size={14} />
      </CapsuleButton>
    </div>
  );
}

function CommitRow({ verified, pending, error, disabled, label, hint, onCommit }: { verified: boolean; pending: boolean; error: unknown; disabled?: boolean; label: string; hint: string; onCommit: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-specimen)] bg-[var(--panel)] p-4">
      <span className="font-[var(--font-data)] text-[13px] text-[var(--text2)]">
        {verified ? "This step is verified and saved." : hint}
        {error instanceof Error && <em className="ml-2 not-italic text-[var(--error)]">{error.message}</em>}
      </span>
      {verified ? (
        <VerifiedMark />
      ) : (
        <CapsuleButton size="sm" disabled={pending || disabled} onClick={onCommit}>
          <Check size={14} />{pending ? "Saving…" : label}
        </CapsuleButton>
      )}
    </div>
  );
}
