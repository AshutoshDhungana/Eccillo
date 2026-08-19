import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CalendarDays, Check, MapPin, Users } from "lucide-react";
import { Logo } from "../designed/app/components/Logo";
import { respondApi } from "../api/procurement";

/**
 * The counterparty's page. Reached only from the emailed link — no account, no
 * sign-in — so it renders standalone rather than inside the organizer shell.
 */
export function RespondPage() {
  const { token = "" } = useParams();
  const request = useQuery({
    queryKey: ["respond", token],
    queryFn: () => respondApi.get(token),
    enabled: !!token,
    retry: false,
  });

  const [canServe, setCanServe] = useState(true);
  const [quote, setQuote] = useState("");
  const [available, setAvailable] = useState(true);
  const [notes, setNotes] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: () =>
      respondApi.submit(token, {
        can_serve: canServe,
        quote_minor: canServe ? Math.round(Number(quote) * 100) : undefined,
        available: canServe ? available : false,
        notes,
        contact_name: contactName,
        contact_email: contactEmail,
      }),
    onError: (e: Error) => setError(e.message),
    onSuccess: () => setError(null),
  });

  if (request.isLoading) {
    return <Shell><p className="text-white/50">Loading…</p></Shell>;
  }
  if (request.isError || !request.data) {
    return (
      <Shell>
        <h1 className="font-editorial text-3xl">This link is not valid</h1>
        <p className="mt-3 text-white/55">
          It may have expired or been withdrawn. Reply to the original email and we will send a new one.
        </p>
      </Shell>
    );
  }

  const r = request.data;

  if (submit.isSuccess) {
    return (
      <Shell>
        <div className="flex items-center gap-2 text-emerald-300">
          <Check size={20} /> <span className="text-sm uppercase tracking-[.16em]">Received</span>
        </div>
        <h1 className="mt-3 font-editorial text-3xl">Thank you, {r.party_name}.</h1>
        <p className="mt-3 text-white/55">
          {r.organization} has your response for {r.event_title}. They will be in touch directly.
        </p>
      </Shell>
    );
  }

  if (!r.is_open) {
    return (
      <Shell>
        <h1 className="font-editorial text-3xl">This request has closed</h1>
        <p className="mt-3 text-white/55">
          {r.organization} is no longer accepting quotes for {r.event_title}.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="mb-2 text-xs uppercase tracking-[.16em] text-white/40">{r.organization} · {r.category}</p>
      <h1 className="font-editorial text-3xl leading-tight sm:text-4xl">{r.event_title}</h1>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
        {r.event_date && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} /> {new Date(r.event_date).toLocaleDateString()}
          </span>
        )}
        {r.location && (
          <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {r.location}</span>
        )}
        {r.guests > 0 && (
          <span className="inline-flex items-center gap-1.5"><Users size={15} /> approx. {r.guests} guests</span>
        )}
      </div>

      {r.scope && <p className="mt-5 whitespace-pre-wrap text-white/70">{r.scope}</p>}

      {r.requirements.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm text-white/55">
          {r.requirements.map((item, i) => <li key={i}>• {item}</li>)}
        </ul>
      )}

      {r.budget_ceiling_minor != null && (
        <p className="mt-4 text-sm text-white/45">
          Budget up to {r.currency} {(r.budget_ceiling_minor / 100).toLocaleString()}
        </p>
      )}

      {r.already_responded && (
        <p className="mt-6 rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-white/60">
          You have already replied. Submitting again replaces your previous answer.
        </p>
      )}

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate();
        }}
      >
        <fieldset>
          <legend className="text-sm text-white/70">Can you take this on?</legend>
          <div className="mt-2 flex gap-2">
            <Choice active={canServe} onClick={() => setCanServe(true)}>Yes</Choice>
            <Choice active={!canServe} onClick={() => setCanServe(false)}>No</Choice>
          </div>
        </fieldset>

        {canServe && (
          <>
            <label className="block">
              <span className="text-sm text-white/70">Your quote ({r.currency})</span>
              <input
                type="number"
                min={0}
                step="1"
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-white"
              />
            </label>

            <fieldset>
              <legend className="text-sm text-white/70">
                Available on {r.event_date ? new Date(r.event_date).toLocaleDateString() : "the event date"}?
              </legend>
              <div className="mt-2 flex gap-2">
                <Choice active={available} onClick={() => setAvailable(true)}>Yes</Choice>
                <Choice active={!available} onClick={() => setAvailable(false)}>No</Choice>
              </div>
            </fieldset>
          </>
        )}

        <label className="block">
          <span className="text-sm text-white/70">Anything we should know? (optional)</span>
          <textarea
            rows={3}
            maxLength={2000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-white"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-white/70">Your name (optional)</span>
            <input
              value={contactName}
              maxLength={120}
              onChange={(e) => setContactName(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-white"
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/70">Best email to reply to (optional)</span>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-white"
            />
          </label>
        </div>

        {error && <p className="text-sm text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={submit.isPending}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-black transition disabled:opacity-40"
        >
          {submit.isPending ? "Sending…" : "Send my response"}
        </button>
      </form>
    </Shell>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "focus-ring rounded-full px-4 py-1.5 text-sm transition " +
        (active ? "bg-white text-black" : "border border-white/20 text-white/70 hover:bg-white/10")
      }
    >
      {children}
    </button>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex h-[72px] items-center border-b border-white/10 px-4 sm:px-8">
        <Logo textClassName="text-white" markSize={26} className="text-white" />
      </header>
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-8">{children}</main>
    </div>
  );
}
