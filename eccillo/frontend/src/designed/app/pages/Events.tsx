import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { EventCard, type EventData } from "../components/EventCard";
import { ConfirmDialog } from "../../../components/ui";
import { planningApi } from "../../../api/planning";
import imgRooftop from "../../imports/Events/f52a1f238ceddefad22fddd3127c3026aff27e60.png";
import imgSummit from "../../imports/Events/a8d9caceb9008905813da20bd52041f439198816.png";
import imgGala from "../../imports/Events/3c9eba56d5b617fcc1e90e78489c54e70d145977.png";
import imgLaunch from "../../imports/Events/dd94dc511247dea33fc76edfff818f7655ff9bf5.png";
import imgRetreat from "../../imports/Events/cdc7cdc6a10cf54dc3a653efb47a190ae828e436.png";
import imgCreate from "../../imports/Events/d0c8a19ddc8705480432066e1561acca030307ae.png";

const IMAGES = [imgRooftop, imgSummit, imgGala, imgLaunch, imgRetreat];
const TABS = ["All", "Upcoming", "Past", "Drafts"] as const;
type Tab = typeof TABS[number];
type DisplayEvent = EventData & { status: Exclude<Tab, "All">; revision?: number };

function displayStatus(endsAt: string | null, status: string): DisplayEvent["status"] {
  if (status === "draft") return "Drafts";
  if (status === "completed" || (endsAt && new Date(endsAt).getTime() < Date.now())) return "Past";
  return "Upcoming";
}

export default function Events() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [eventToDelete, setEventToDelete] = useState<DisplayEvent>();
  const client = useQueryClient();
  const events = useQuery({ queryKey: ["events"], queryFn: planningApi.listEvents });
  const remove = useMutation({
    mutationFn: (event: DisplayEvent) => planningApi.deleteEvent(event.id, event.revision),
    onSuccess: () => {
      setEventToDelete(undefined);
      void client.invalidateQueries({ queryKey: ["events"] });
    },
  });
  const displayed = useMemo<DisplayEvent[]>(() => (events.data ?? []).map((event, index) => ({
    id: event.id,
    title: event.title,
    image: IMAGES[index % IMAGES.length],
    date: event.starts_at ? new Date(event.starts_at).toLocaleDateString(undefined, { dateStyle: "full" }) : "Date to be announced",
    location: event.location?.name || event.location?.city || "Location to be announced",
    time: event.starts_at ? new Date(event.starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Time to be announced",
    attendance: String(event.expected_attendees || 0) + " expected",
    status: displayStatus(event.ends_at, event.status),
    revision: event.revision,
  })), [events.data]);
  const filtered = displayed.filter((event) => (activeTab === "All" || event.status === activeTab) && event.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell active="Events">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-['Instrument_Serif:Italic',serif] text-[40px] italic text-white">Events</h1>
            <p className="mt-1 font-['Helvetica_Now_Display:Regular',sans-serif] text-[15px] text-white/60">Create and manage your entire event operations</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4">
              <Search className="size-4 text-white/50" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events..." className="w-full bg-transparent font-['Inter:Regular',sans-serif] text-[14px] text-white outline-none placeholder:text-white/40 sm:w-[220px]" />
            </div>
            <button type="button" onClick={() => navigate("/events/new")} className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 font-['Inter:Semi_Bold',sans-serif] text-[14px] text-black transition-transform hover:scale-[1.02]"><Plus className="size-4" /> Create New Event</button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={"flex items-center gap-2 rounded-full px-4 py-2 font-['Inter:Semi_Bold',sans-serif] text-[13px] transition-colors " + (activeTab === tab ? "bg-white text-black" : "border border-white/15 text-white/70 hover:bg-white/10")}>
              {tab === "All" ? "All Events" : tab}<span className={"rounded-full px-1.5 text-[11px] " + (activeTab === tab ? "bg-black/10" : "bg-white/10")}>{tab === "All" ? displayed.length : displayed.filter((event) => event.status === tab).length}</span>
            </button>
          ))}
        </div>
        {events.isLoading ? <p className="py-16 text-center font-['Inter:Regular',sans-serif] text-white/60">Loading events...</p> : events.error ? <p className="py-16 text-center font-['Inter:Regular',sans-serif] text-white">Unable to load events: {events.error.message}</p> : <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <EventCard variant="create" event={{ id: "create", title: "", image: imgCreate, date: "", location: "", time: "", attendance: "" }} onAction={() => navigate("/events/new")} />
          {filtered.map((event) => <EventCard key={event.id} event={event} onAction={() => navigate("/events/" + event.id + "/planning/timeline")} onDelete={() => setEventToDelete(event)} deleting={remove.isPending && remove.variables?.id === event.id} />)}
        </div>}
      </div>
      <ConfirmDialog
        open={Boolean(eventToDelete)}
        title="Delete this event?"
        detail={eventToDelete ? `“${eventToDelete.title}” and its planning data will be permanently removed.` : ""}
        confirmLabel="Delete event"
        pending={remove.isPending}
        error={remove.error?.message}
        onCancel={() => !remove.isPending && setEventToDelete(undefined)}
        onConfirm={() => eventToDelete && remove.mutate(eventToDelete)}
      />
    </AppShell>
  );
}
