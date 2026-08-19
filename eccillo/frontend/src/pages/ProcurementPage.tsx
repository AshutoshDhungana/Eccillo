import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check, Mail, Send, Store } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { procurementApi } from "../api/procurement";
import { planningApi } from "../api/planning";
import type { Outreach, ProcurementRequest } from "../types/procurement";

function money(minor: number | null | undefined, currency: string) {
  if (minor == null) return "—";
  return currency + " " + (minor / 100).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Ready to send",
  queued: "Queued",
  sending: "Sending",
  sent: "Awaiting reply",
  responded: "Quoted",
  declined: "Declined",
  no_channel: "No email on file",
  failed: "Delivery failed",
};

function statusTone(status: string) {
  if (status === "responded") return "text-emerald-300";
  if (status === "declined" || status === "failed") return "text-rose-300";
  if (status === "no_channel") return "text-amber-300";
  return "text-white/45";
}

export function ProcurementPage() {
  const { eventId = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const focused = params.get("request");
  const queryClient = useQueryClient();

  const event = useQuery({ queryKey: ["event", eventId], queryFn: () => planningApi.getEvent(eventId), enabled: !!eventId });
  const requests = useQuery({
    queryKey: ["procurement-requests", eventId],
    queryFn: () => procurementApi.listRequests(eventId),
    enabled: !!eventId,
  });
  const detail = useQuery({
    queryKey: ["procurement-request", eventId, focused],
    queryFn: () => procurementApi.getRequest(eventId, focused as string),
    enabled: !!eventId && !!focused,
  });
  const leads = useQuery({
    queryKey: ["procurement-leads", eventId],
    queryFn: () => procurementApi.leads(eventId),
    enabled: !!eventId,
  });

  const list = requests.data?.requests ?? [];
  const draft = detail.data && detail.data.status === "draft" ? detail.data : null;

  return (
    <AppShell eventId={eventId} title={event.data?.title ?? "Procurement"}>
      <div className="mx-auto max-w-4xl space-y-10">
        {draft ? (
          <ReviewAndSend
            eventId={eventId}
            request={draft}
            onSent={() => {
              void queryClient.invalidateQueries({ queryKey: ["procurement-requests", eventId] });
              void queryClient.invalidateQueries({ queryKey: ["agent-vendors", eventId] });
            }}
          />
        ) : (
          <header>
            <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[.16em] text-white/40">
              <Mail size={14} /> Procurement
            </p>
            <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">Requests &amp; leads</h1>
            <p className="mt-3 max-w-lg text-white/55">
              Every quote request you have sent, and every reply that has come back.
            </p>
          </header>
        )}

        {(leads.data?.leads.length ?? 0) > 0 && (
          <section>
            <h2 className="mb-3 text-sm uppercase tracking-wide text-white/45">
              Leads · {leads.data?.leads.length}
            </h2>
            <div className="surface overflow-x-auto rounded-[20px]">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-white/40">
                  <tr>
                    <th className="px-4 py-3 font-normal">Vendor</th>
                    <th className="px-4 py-3 font-normal">For</th>
                    <th className="px-4 py-3 font-normal">Quote</th>
                    <th className="px-4 py-3 font-normal">Available</th>
                    <th className="px-4 py-3 font-normal">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.data?.leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-white/10">
                      <td className="px-4 py-3">
                        <p className="text-white/90">{lead.party_name}</p>
                        {lead.notes && <p className="mt-0.5 max-w-xs text-xs text-white/45">{lead.notes}</p>}
                      </td>
                      <td className="px-4 py-3 text-white/55">{lead.request.category}</td>
                      <td className="px-4 py-3 text-emerald-300">{money(lead.quote_minor, lead.currency)}</td>
                      <td className="px-4 py-3 text-white/55">{lead.available ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-white/55">
                        {lead.reply_contact_email || lead.vendor?.contact_phone || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-white/45">Requests</h2>
          {requests.isLoading ? (
            <p className="py-10 text-center text-white/40">Loading…</p>
          ) : list.length === 0 ? (
            <div className="surface rounded-[24px] p-10 text-center">
              <p className="text-white/70">You have not requested any quotes yet.</p>
              <Link
                to={`/events/${eventId}/vendors`}
                className="mt-4 inline-flex items-center gap-2 text-white/80 underline underline-offset-2"
              >
                <Store size={15} /> Choose vendors to approach
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {list.map((req) => (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => setParams(req.id === focused ? {} : { request: req.id })}
                  className={
                    "surface w-full rounded-2xl p-4 text-left transition " +
                    (req.id === focused ? "ring-2 ring-white/60" : "hover:bg-white/[0.06]")
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-white/90">{req.title}</p>
                    <span className="text-xs text-white/45">
                      {req.status === "draft" ? "Draft" : `${req.counts.responded ?? 0} of ${req.total} replied`}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/45">
                    {req.category} · {req.total} contacted
                    {req.respond_by ? ` · reply by ${new Date(req.respond_by).toLocaleDateString()}` : ""}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {detail.data && detail.data.status !== "draft" && (
          <section>
            <h2 className="mb-3 text-sm uppercase tracking-wide text-white/45">{detail.data.title}</h2>
            <div className="space-y-2">
              {(detail.data.outreach ?? []).map((row) => (
                <OutreachRow key={row.id} row={row} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function OutreachRow({ row }: { row: Outreach }) {
  return (
    <div className="surface flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm text-white/90">{row.party_name}</p>
        <p className="text-xs text-white/40">{row.to_email || "no email on file"}</p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        {row.quote_minor != null && <span className="text-emerald-300">{money(row.quote_minor, row.currency)}</span>}
        <span className={"text-xs " + statusTone(row.status)}>{STATUS_LABEL[row.status] ?? row.status}</span>
      </div>
    </div>
  );
}

function ReviewAndSend({
  eventId,
  request,
  onSent,
}: {
  eventId: string;
  request: ProcurementRequest;
  onSent: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const rows = request.outreach ?? [];
  const reachable = rows.filter((r) => r.status === "pending");
  const skipped = rows.filter((r) => r.status === "no_channel");

  const send = useMutation({
    mutationFn: () => procurementApi.send(eventId, request.id),
    onSuccess: () => {
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ["procurement-request", eventId, request.id] });
      void queryClient.invalidateQueries({ queryKey: ["procurement-leads", eventId] });
      onSent();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <section>
      <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[.16em] text-white/40">
        <Mail size={14} /> Review before sending
      </p>
      <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">{request.title}</h1>
      <p className="mt-3 max-w-lg text-white/55">
        This is the exact message each vendor receives. Nothing has been sent yet.
      </p>

      <div className="surface mt-6 space-y-1 rounded-[20px] p-4">
        {reachable.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-white/85">{r.party_name}</span>
            <span className="flex items-center gap-2 text-xs text-white/45">
              {r.to_email} <Check size={14} className="text-emerald-300" />
            </span>
          </div>
        ))}
        {skipped.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-white/40">{r.party_name}</span>
            <span className="flex items-center gap-2 text-xs text-amber-300">
              no email on file <AlertTriangle size={14} />
            </span>
          </div>
        ))}
      </div>

      {request.preview && (
        <div className="surface mt-3 rounded-[20px] p-4">
          <p className="text-sm text-white/85">{request.preview.subject}</p>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-white/55">
            {request.preview.body}
          </pre>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

      <button
        type="button"
        disabled={reachable.length === 0 || send.isPending}
        onClick={() => send.mutate()}
        className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-black transition disabled:opacity-40"
      >
        <Send size={16} />
        {send.isPending ? "Sending…" : `Send ${reachable.length} request${reachable.length === 1 ? "" : "s"}`}
      </button>
    </section>
  );
}
