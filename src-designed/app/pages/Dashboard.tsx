import { CalendarDays, Users, DollarSign, TrendingUp } from "lucide-react";
import { AppShell } from "../components/AppShell";

const STATS = [
  { label: "Active Events", value: "12", icon: CalendarDays, delta: "+3 this month" },
  { label: "Total Attendees", value: "4,820", icon: Users, delta: "+12% vs last month" },
  { label: "Revenue", value: "$182k", icon: DollarSign, delta: "+8% vs last month" },
  { label: "Avg. ROI", value: "3.4x", icon: TrendingUp, delta: "+0.6x vs last month" },
];

export default function Dashboard() {
  return (
    <AppShell active="Dashboard">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8">
        <h1 className="font-['Instrument_Serif:Italic',serif] text-[40px] italic text-white">
          Welcome back
        </h1>
        <p className="mt-2 font-['Helvetica_Now_Display:Regular',sans-serif] text-[15px] text-white/60">
          Here's what's happening across your events today.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-[20px] border border-white/10 bg-[#141414] p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="font-['Helvetica_Now_Display:Regular',sans-serif] text-[14px] text-white/50">
                    {stat.label}
                  </p>
                  <Icon className="size-5 text-white/40" />
                </div>
                <p className="mt-4 font-['Helvetica_Now_Display:Bold',sans-serif] text-[34px] text-white">
                  {stat.value}
                </p>
                <p className="mt-1 font-['Inter:Regular',sans-serif] text-[13px] text-emerald-400">
                  {stat.delta}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-[20px] border border-white/10 bg-[#141414] p-6 lg:col-span-2">
            <h2 className="font-['Helvetica_Now_Display:Medium',sans-serif] text-[18px] text-white">
              Upcoming Milestones
            </h2>
            <div className="mt-4 flex flex-col divide-y divide-white/10">
              {[
                ["Summer Rooftop Soirée", "Venue walkthrough", "In 2 days"],
                ["Tech Innovation Summit", "Speaker confirmations due", "In 5 days"],
                ["Annual Gala Dinner", "Catering final headcount", "In 1 week"],
              ].map(([event, task, when]) => (
                <div
                  key={event}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-['Inter:Semi_Bold',sans-serif] text-[15px] text-white">
                      {event}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[13px] text-white/50">
                      {task}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 font-['Inter:Regular',sans-serif] text-[12px] text-white/70">
                    {when}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-[#141414] p-6">
            <h2 className="font-['Helvetica_Now_Display:Medium',sans-serif] text-[18px] text-white">
              Quick Actions
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {["Create New Event", "Invite Team Member", "Add Vendor", "View Reports"].map(
                (action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-left font-['Inter:Regular',sans-serif] text-[14px] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {action}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
