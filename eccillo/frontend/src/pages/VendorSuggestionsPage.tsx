import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, ExternalLink, MapPin, Phone, Sparkles } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { agentApi } from "../api/agent";
import { planningApi } from "../api/planning";
import type { VendorSuggestion } from "../types/agent";

function money(minor: number | null, currency: string | null) {
  if (minor == null) return null;
  return (currency ?? "NPR") + " " + (minor / 100).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function VendorSuggestionsPage() {
  const { eventId = "" } = useParams();
  const event = useQuery({ queryKey: ["event", eventId], queryFn: () => planningApi.getEvent(eventId), enabled: !!eventId });
  const vendors = useQuery({ queryKey: ["agent-vendors", eventId], queryFn: () => agentApi.getVendors(eventId), enabled: !!eventId });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  // Pre-select the AI's suggestions; the user can deselect.
  useEffect(() => {
    if (vendors.data) setSelected(new Set(vendors.data.vendors.map((v) => v.vendor_id)));
  }, [vendors.data]);

  const save = useMutation({
    mutationFn: () => agentApi.shortlist(eventId, [...selected]),
    onSuccess: () => setSaved(true),
  });

  const groups = useMemo(() => {
    const map = new Map<string, VendorSuggestion[]>();
    (vendors.data?.vendors ?? []).forEach((v) => map.set(v.category, [...(map.get(v.category) ?? []), v]));
    return [...map.entries()];
  }, [vendors.data]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSaved(false);
      return next;
    });

  const list = vendors.data?.vendors ?? [];

  return (
    <AppShell eventId={eventId} title={event.data?.title ?? "Vendors"}>
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[.16em] text-white/40">
            <Sparkles size={14} /> Approved plan · Vendor suggestions
          </p>
          <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">Choose your vendors</h1>
          <p className="mt-3 max-w-lg text-white/55">
            The Copilot shortlisted these venues and vendors near your event. Pick the ones you want, then save your shortlist.
          </p>
        </header>

        {vendors.isLoading ? (
          <p className="py-16 text-center text-white/40">Loading suggestions…</p>
        ) : list.length === 0 ? (
          <div className="surface rounded-[24px] p-10 text-center">
            <p className="text-white/70">No vendor suggestions yet.</p>
            <Link to={`/events/${eventId}/copilot`} className="mt-4 inline-block text-white/80 underline underline-offset-2">
              Back to the Copilot
            </Link>
          </div>
        ) : (
          <div className="space-y-8 pb-28">
            {groups.map(([category, items]) => (
              <section key={category}>
                <h2 className="mb-3 text-sm uppercase tracking-wide text-white/45">{category}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((v) => (
                    <VendorCard key={v.vendor_id} v={v} selected={selected.has(v.vendor_id)} onToggle={() => toggle(v.vendor_id)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {list.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/85 backdrop-blur lg:pl-[300px]">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
            <span className="text-sm text-white/60">{selected.size} selected</span>
            <div className="flex items-center gap-3">
              {saved && <span className="text-sm text-emerald-300">Shortlist saved ✓</span>}
              <button
                type="button"
                disabled={selected.size === 0 || save.isPending}
                onClick={() => save.mutate()}
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-black transition disabled:opacity-40"
              >
                <Check size={16} />
                {save.isPending ? "Saving…" : "Save shortlist"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function scorePct(score: number) {
  return Math.round(Math.max(0, Math.min(1, score)) * 100);
}

function VendorCard({ v, selected, onToggle }: { v: VendorSuggestion; selected: boolean; onToggle: () => void }) {
  const price = money(v.price_from_minor, v.currency);
  const mapHref = v.latitude != null && v.longitude != null ? `https://www.openstreetmap.org/?mlat=${v.latitude}&mlon=${v.longitude}#map=16/${v.latitude}/${v.longitude}` : null;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={
        "surface w-full rounded-2xl p-4 text-left transition " +
        (selected ? "ring-2 ring-white/60" : "hover:bg-white/[0.06]")
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm text-white/90">{v.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-white/45">
            {v.rating_avg ? <span>★ {v.rating_avg.toFixed(1)}</span> : null}
            {v.review_count ? <span>({v.review_count})</span> : null}
            {price && <span>· from {price}</span>}
            {v.external_source === "osm" && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">discovered nearby</span>}
          </div>
        </div>
        <span
          className={
            "flex h-5 w-5 flex-none items-center justify-center rounded-full border " +
            (selected ? "border-white bg-white text-black" : "border-white/30 text-transparent")
          }
        >
          <Check size={13} />
        </span>
      </div>

      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-300/70" style={{ width: scorePct(v.score) + "%" }} />
      </div>

      {v.reasons.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-white/50">
          {v.reasons.slice(0, 2).map((r, i) => (
            <li key={i}>• {r}</li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/55" onClick={(e) => e.stopPropagation()}>
        {v.contact_phone && (
          <a href={`tel:${v.contact_phone}`} className="focus-ring inline-flex items-center gap-1 hover:text-white">
            <Phone size={12} /> {v.contact_phone}
          </a>
        )}
        {v.website && (
          <a href={v.website} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-1 hover:text-white">
            <ExternalLink size={12} /> Website
          </a>
        )}
        {mapHref && (
          <a href={mapHref} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-1 hover:text-white">
            <MapPin size={12} /> Map
          </a>
        )}
      </div>
    </button>
  );
}
