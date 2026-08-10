import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StructuredEventState } from "../../types/agent";

type DayItem = { title: string; kind: "milestone" | "task" };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pad = (n: number) => String(n).padStart(2, "0");

export function CalendarView({ s }: { s: StructuredEventState }) {
  const byDate = useMemo(() => {
    const map = new Map<string, DayItem[]>();
    const add = (d: string | null, item: DayItem) => {
      if (!d) return;
      const key = d.slice(0, 10);
      map.set(key, [...(map.get(key) ?? []), item]);
    };
    s.timeline.forEach((m) => add(m.due_at, { title: m.title, kind: "milestone" }));
    s.tasks.forEach((t) => add(t.due_at, { title: t.title, kind: "task" }));
    return map;
  }, [s.timeline, s.tasks]);

  const initial = s.date ?? [...byDate.keys()].sort()[0] ?? new Date().toISOString().slice(0, 10);
  const [ip, imp] = initial.split("-").map(Number);
  const [cursor, setCursor] = useState({ y: ip || 2026, m: (imp || 1) - 1 });

  const firstWeekday = new Date(cursor.y, cursor.m, 1).getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const step = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };
  const eventDay = s.date && s.date.startsWith(`${cursor.y}-${pad(cursor.m + 1)}`) ? Number(s.date.slice(8, 10)) : null;

  if (byDate.size === 0) return <p className="py-8 text-center text-sm text-white/35">No dated milestones or tasks yet.</p>;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-white/80">
          {MONTHS[cursor.m]} {cursor.y}
        </span>
        <div className="flex gap-1">
          <button type="button" onClick={() => step(-1)} aria-label="Previous month" className="focus-ring rounded-full p-1 text-white/60 hover:bg-white/10">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next month" className="focus-ring rounded-full p-1 text-white/60 hover:bg-white/10">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-white/40">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const key = `${cursor.y}-${pad(cursor.m + 1)}-${pad(day)}`;
          const items = byDate.get(key) ?? [];
          const isEvent = day === eventDay;
          return (
            <div
              key={i}
              className={
                "min-h-[52px] rounded-lg border p-1 text-left " +
                (isEvent ? "border-amber-300/40 bg-amber-300/10" : "border-white/5 bg-white/[0.02]")
              }
            >
              <div className="text-[10px] text-white/45">{day}</div>
              <div className="mt-0.5 space-y-0.5">
                {items.slice(0, 2).map((it, j) => (
                  <div
                    key={j}
                    title={it.title}
                    className={
                      "truncate rounded px-1 text-[9px] leading-tight " +
                      (it.kind === "milestone" ? "bg-emerald-300/20 text-emerald-100" : "bg-white/10 text-white/70")
                    }
                  >
                    {it.title}
                  </div>
                ))}
                {items.length > 2 && <div className="text-[9px] text-white/40">+{items.length - 2}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
