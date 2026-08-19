import { Calendar, MapPin, Clock, Trash2, Users, Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface EventData {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  time: string;
  attendance: string;
}

interface EventCardProps {
  event?: EventData;
  variant?: "event" | "create";
  onAction?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}

export function EventCard({ event, variant = "event", onAction, onDelete, deleting = false }: EventCardProps) {
  if (variant === "create") {
    return (
      <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[var(--panel)]">
        <div className="relative h-[180px] w-full overflow-hidden">
          {event?.image && (
            <ImageWithFallback
              src={event.image}
              alt="Create a new event"
              className="size-full object-cover opacity-40"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-6">
          <h3 className="font-['Instrument_Serif:Italic',serif] text-[26px] italic text-white">
            Create New Event
          </h3>
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-white/60">
            Plan your next gathering
          </p>
          <button
            type="button"
            onClick={onAction}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-['Inter:Semi_Bold',sans-serif] text-[15px] text-black transition-transform hover:scale-[1.01]"
          >
            <Plus className="size-4" /> Create Event
          </button>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-sm">
      <div className="relative h-[180px] w-full overflow-hidden">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-['Instrument_Serif:Italic',serif] text-[26px] italic text-[#1a1a1a]">
          {event.title}
        </h3>
        <div className="flex flex-col gap-2 font-['Inter:Regular',sans-serif] text-[14px] text-[#555]">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-[#888]" /> {event.location}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-[#888]" /> {event.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-[#888]" /> {event.time}
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-[#888]" /> {event.attendance}
          </div>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="mt-2 rounded-full border border-black/10 bg-[#f5f5f5] px-6 py-3 font-['Inter:Semi_Bold',sans-serif] text-[15px] text-[#1a1a1a] transition-colors hover:bg-[#ececec]"
        >
          View Details
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-full px-6 py-3 font-['Inter:Semi_Bold',sans-serif] text-[14px] text-black/55 transition-colors hover:bg-black/5 hover:text-black disabled:opacity-50"
          >
            <Trash2 className="size-4" /> {deleting ? "Deleting…" : "Delete event"}
          </button>
        )}
      </div>
    </div>
  );
}
