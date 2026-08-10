import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { AppShell } from "../components/AppShell";
import { EventCard, type EventData } from "../components/EventCard";
import imgRooftop from "../../imports/Events/f52a1f238ceddefad22fddd3127c3026aff27e60.png";
import imgSummit from "../../imports/Events/a8d9caceb9008905813da20bd52041f439198816.png";
import imgGala from "../../imports/Events/3c9eba56d5b617fcc1e90e78489c54e70d145977.png";
import imgLaunch from "../../imports/Events/dd94dc511247dea33fc76edfff818f7655ff9bf5.png";
import imgRetreat from "../../imports/Events/cdc7cdc6a10cf54dc3a653efb47a190ae828e436.png";
import imgCreate from "../../imports/Events/d0c8a19ddc8705480432066e1561acca030307ae.png";

const EVENTS: (EventData & { status: "Upcoming" | "Past" | "Drafts" })[] = [
  {
    id: "rooftop",
    title: "Summer Rooftop Soirée",
    image: imgRooftop,
    date: "Saturday, 14 June 2026",
    location: "23 West Terrace, London",
    time: "7:00 PM – 11:00 PM",
    attendance: "48 attending",
    status: "Upcoming",
  },
  {
    id: "summit",
    title: "Tech Innovation Summit",
    image: imgSummit,
    date: "Thursday, 18 June 2026",
    location: "Royal Exhibition Hall, London",
    time: "9:00 AM – 5:00 PM",
    attendance: "350 attending",
    status: "Upcoming",
  },
  {
    id: "gala",
    title: "Annual Gala Dinner",
    image: imgGala,
    date: "Friday, 20 June 2026",
    location: "The Savoy, Grand Ballroom",
    time: "6:30 PM – 11:30 PM",
    attendance: "180 attending",
    status: "Upcoming",
  },
  {
    id: "launch",
    title: "Product Launch Party",
    image: imgLaunch,
    date: "Tuesday, 23 June 2026",
    location: "Silicon Docks Terrace, Dublin",
    time: "7:00 PM – 10:00 PM",
    attendance: "95 attending",
    status: "Drafts",
  },
  {
    id: "retreat",
    title: "Corporate Retreat",
    image: imgRetreat,
    date: "14 – 17 July 2026",
    location: "Aman Resorts, Swiss Alps",
    time: "All Day Event",
    attendance: "42 attending",
    status: "Past",
  },
];

const TABS = [
  { label: "All Events", count: 12, key: "All" },
  { label: "Upcoming", count: 6, key: "Upcoming" },
  { label: "Past", count: 4, key: "Past" },
  { label: "Drafts", count: 2, key: "Drafts" },
] as const;

export default function Events() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = EVENTS.filter((e) => {
    const matchesTab = activeTab === "All" || e.status === activeTab;
    const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <AppShell active="Events">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-['Instrument_Serif:Italic',serif] text-[40px] italic text-white">
              Events
            </h1>
            <p className="mt-1 font-['Helvetica_Now_Display:Regular',sans-serif] text-[15px] text-white/60">
              Create and manage your entire event operations
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4">
              <Search className="size-4 text-white/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full bg-transparent font-['Inter:Regular',sans-serif] text-[14px] text-white outline-none placeholder:text-white/40 sm:w-[220px]"
              />
            </div>
            <button
              type="button"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 font-['Inter:Semi_Bold',sans-serif] text-[14px] text-black transition-transform hover:scale-[1.02]"
            >
              <Plus className="size-4" /> Create New Event
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-['Inter:Semi_Bold',sans-serif] text-[13px] transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/70 hover:bg-white/10"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 text-[11px] ${
                  activeTab === tab.key ? "bg-black/10" : "bg-white/10"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <EventCard
            variant="create"
            event={{
              id: "create",
              title: "",
              image: imgCreate,
              date: "",
              location: "",
              time: "",
              attendance: "",
            }}
          />
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
