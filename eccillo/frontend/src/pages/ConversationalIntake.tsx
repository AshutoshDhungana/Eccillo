import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { CapsuleButton, Chip, ProgressBar } from "../components/design/ds";
import { planningApi } from "../api/planning";

/* Step 1 of the AI setup flow: the brief. Everything after this is scaffolded by
   the agent and verified one step at a time in EventSetupWizard. */

const TEMPLATES = [
  "Corporate conference",
  "Product launch event",
  "Annual company retreat",
  "Charity fundraiser gala",
];

const EXAMPLES = [
  "A 200-person tech conference on 2026-09-15 in Kathmandu, budget 5,000,000, called DevWeek",
  "A wedding for 150 guests in Pokhara next spring",
  "A 2-day hackathon for 300 students with prizes and catering",
];

export function ConversationalIntake() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const create = useMutation({
    // Create a bare draft event; the agent fleshes it out from the description.
    mutationFn: (text: string) => planningApi.createEvent({ title: "New event", type: "other" }).then((event) => ({ event, text })),
    onSuccess: ({ event, text }) => navigate("/events/" + event.id + "/setup", { state: { intro: text } }),
  });

  const submit = () => {
    const text = prompt.trim();
    if (text && !create.isPending) create.mutate(text);
  };

  return (
    <AppShell title="New event">
      <section className="mx-auto flex max-w-[var(--frame-app)] flex-col gap-8 rounded-[var(--radius-card-lg)] bg-[var(--bg)] p-6 shadow-[inset_0_0_0_1px_var(--ring)] sm:p-10">
        <header className="flex flex-col gap-4 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eccillo-label-caps">AI Setup Wizard · Step 1 of 6</span>
            <h1 className="eccillo-card-title text-[var(--text)]">Get started</h1>
          </div>
          <ProgressBar value={100 / 6} />
        </header>

        <div className="flex gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
            <Sparkles size={16} className="text-[var(--onAccent)]" />
          </span>
          <p className="flex-1 rounded-[4px_16px_16px_16px] bg-[var(--panel)] p-5 font-[var(--font-data)] text-[16px] leading-6 text-[var(--text)]">
            Tell me what you're planning in plain English. I'll scaffold the details, venue, agenda and budget — and we'll confirm each of them together, one step at a time, before anything is saved.
          </p>
        </div>

        <textarea
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder='Type or paste your event description here. E.g. "We need a 3-day corporate conference for 500 attendees with breakout sessions, catering, and AV coordination…"'
          className="focus-ring min-h-[150px] resize-none rounded-[var(--radius-card)] bg-[var(--cell)] p-6 font-[var(--font-data)] text-[16px] leading-[26px] text-[var(--text)] shadow-[inset_0_0_0_2px_var(--accent)] outline-none placeholder:text-[var(--text3)]"
        />

        <div className="flex flex-col gap-3">
          <span className="eccillo-label-caps">Or select a popular template</span>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((label) => (
              <Chip key={label} onClick={() => setPrompt(`Plan a ${label.toLowerCase()} for 500 attendees across 3 days.`)}>
                {label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="focus-ring rounded-[var(--radius-specimen)] bg-[var(--panel)] px-4 py-3 text-left font-[var(--font-data)] text-[13px] text-[var(--text2)] transition hover:opacity-[.82]"
            >
              {ex}
            </button>
          ))}
        </div>

        {create.isError && (
          <p role="alert" className="font-[var(--font-data)] text-[13px] text-[var(--error)]">
            {create.error instanceof Error ? create.error.message : "Could not start. Please try again."}
          </p>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
          <Link to="/events/new/manual" className="focus-ring font-[var(--font-data)] text-[13px] text-[var(--text2)] underline underline-offset-4">
            Prefer a form? Create manually
          </Link>
          <CapsuleButton onClick={submit} disabled={!prompt.trim() || create.isPending}>
            {create.isPending ? "Scaffolding…" : "Scaffold with AI"}
            <ArrowRight size={14} />
          </CapsuleButton>
        </footer>
      </section>
    </AppShell>
  );
}
