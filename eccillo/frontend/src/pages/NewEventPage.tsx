import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { planningApi } from "../api/planning";
import type { Event } from "../types";
import { AppShell } from "../components/AppShell";
import { Button, Card, Field, Input, PageHeader, Textarea } from "../components/ui";

const eventTypes = ["conference", "workshop", "meetup", "festival", "wedding", "other"];

export function NewEventPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", type: "conference", location: "", starts_at: "", ends_at: "", expected_attendees: "", budget_target_minor: "", currency: "NPR", description: "" });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const create = useMutation({
    mutationFn: () => planningApi.createEvent({
      title: form.title.trim(), type: form.type as Event["type"], description: form.description.trim(), currency: form.currency.toUpperCase(),
      location: form.location.trim() ? { name: form.location.trim() } : {},
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      expected_attendees: Number(form.expected_attendees || 0), budget_target_minor: Number(form.budget_target_minor || 0),
    }),
    onSuccess: (event) => navigate(`/events/${event.id}/planning/timeline`),
  });

  return <AppShell><div className="mx-auto max-w-3xl"><PageHeader eyebrow="New event" title="Start with the essentials" /><Card><form className="space-y-5" onSubmit={(event) => { event.preventDefault(); create.mutate(); }}>
    <Field label="Event name"><Input value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Annual community meetup" required /></Field>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Event type"><select className="focus-ring h-12 w-full rounded-full border border-black/15 bg-white px-5 outline-none" value={form.type} onChange={(event) => update("type", event.target.value)}>{eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></Field><Field label="Location"><Input value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Kathmandu" /></Field><Field label="Starts at"><Input type="datetime-local" value={form.starts_at} onChange={(event) => update("starts_at", event.target.value)} /></Field><Field label="Ends at"><Input type="datetime-local" value={form.ends_at} onChange={(event) => update("ends_at", event.target.value)} /></Field><Field label="Expected attendees"><Input type="number" min="0" value={form.expected_attendees} onChange={(event) => update("expected_attendees", event.target.value)} /></Field><Field label="Budget (minor units)"><Input type="number" min="0" value={form.budget_target_minor} onChange={(event) => update("budget_target_minor", event.target.value)} /></Field></div>
    <Field label="Currency"><Input maxLength={3} value={form.currency} onChange={(event) => update("currency", event.target.value)} /></Field><Field label="Description"><Textarea value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Purpose, audience, and key notes for your team." /></Field>
    {create.error && <p role="alert" className="text-sm text-red-700">{create.error.message}</p>}<div className="flex justify-end"><Button disabled={create.isPending}>{create.isPending ? "Creating…" : "Create event"}</Button></div>
  </form></Card></div></AppShell>;
}
