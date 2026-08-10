import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { planningApi } from "../api/planning";

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
    onSuccess: ({ event, text }) => navigate("/events/" + event.id + "/copilot", { state: { intro: text } }),
  });

  const submit = () => {
    const text = prompt.trim();
    if (text && !create.isPending) create.mutate(text);
  };

  return (
    <AppShell title="New event">
      <div className="mx-auto max-w-2xl pt-6 sm:pt-16">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Sparkles size={26} className="text-white" />
          </div>
          <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">Describe your event</h1>
          <p className="mx-auto mt-4 max-w-lg text-white/60">
            Tell the Copilot what you're planning — in a sentence or a paragraph. It'll ask for anything it needs, then build the whole plan with you.
          </p>
        </div>

        <div className="frosted mt-8 rounded-[28px] border border-white/20 p-3">
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
            rows={4}
            placeholder="e.g. Plan a 200-person conference in Kathmandu on Sept 15, budget 5,000,000…"
            className="min-h-32 w-full resize-none bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40"
          />
          <div className="flex items-center justify-between gap-3 px-2 pb-1">
            <span className="text-xs text-white/40">⌘/Ctrl + Enter</span>
            <button
              type="button"
              onClick={submit}
              disabled={!prompt.trim() || create.isPending}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-black transition disabled:opacity-40"
            >
              <Sparkles size={16} />
              {create.isPending ? "Starting…" : "Start planning"}
            </button>
          </div>
        </div>

        {create.isError && (
          <p className="mt-3 text-center text-sm text-red-300">
            {create.error instanceof Error ? create.error.message : "Could not start. Please try again."}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="focus-ring surface rounded-2xl px-4 py-3 text-left text-sm text-white/80 transition hover:bg-white/10"
            >
              {ex}
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/45">
          Prefer a form?{" "}
          <Link to="/events/new/manual" className="focus-ring text-white/80 underline underline-offset-2">
            Create manually
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
