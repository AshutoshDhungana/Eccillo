import type { StructuredEventState } from "../../types/agent";

type Item = StructuredEventState["timeline"][number];

/** Lightweight, dependency-free Gantt using each milestone's day-offset. */
export function GanttTimeline({ items, eventDate }: { items: Item[]; eventDate: string | null }) {
  if (!items.length) return <p className="py-8 text-center text-sm text-white/35">No milestones yet.</p>;

  const sorted = [...items].sort((a, b) => a.offset_days - b.offset_days);
  const offsets = sorted.map((i) => i.offset_days);
  const min = Math.min(...offsets, 0);
  const max = Math.max(...offsets, 0);
  const range = Math.max(1, max - min);
  const pos = (o: number) => ((o - min) / range) * 100;

  return (
    <div>
      <div className="relative mb-3 h-4 text-[10px] text-white/40">
        <span className="absolute left-0">{sorted[0]?.due_at ?? "start"}</span>
        <span className="absolute -translate-x-1/2" style={{ left: pos(0) + "%" }}>
          {eventDate ?? "event"}
        </span>
        <span className="absolute right-0">{sorted[sorted.length - 1]?.due_at ?? "wrap"}</span>
      </div>

      <div className="space-y-1.5">
        {sorted.map((m, i) => {
          const start = pos(m.offset_days);
          const next = sorted[i + 1]?.offset_days ?? m.offset_days + Math.max(1, Math.round(range * 0.06));
          const width = Math.max(3, pos(next) - start);
          return (
            <div key={i} className="grid grid-cols-[128px_1fr] items-center gap-2">
              <span className="truncate text-xs text-white/70" title={m.title}>
                {m.title}
              </span>
              <div className="relative h-5 rounded bg-white/[0.04]">
                <div className="absolute inset-y-0 w-px bg-white/20" style={{ left: pos(0) + "%" }} title="event day" />
                <div
                  className={"absolute inset-y-[3px] rounded " + (m.critical_path ? "bg-amber-300/75" : "bg-emerald-300/55")}
                  style={{ left: start + "%", width: width + "%" }}
                  title={(m.due_at ?? "") + (m.critical_path ? " · critical path" : "")}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-4 text-[10px] text-white/40">
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded bg-amber-300/75" /> critical path
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-3 rounded bg-emerald-300/55" /> standard
        </span>
      </div>
    </div>
  );
}
