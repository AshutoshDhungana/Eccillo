import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { planningApi } from "../api/planning";
import { AppShell } from "../components/AppShell";
import { PlanningScreens, type Tab } from "../components/planning/PlanningScreens";
import { ErrorState } from "../components/ui";

const tabs: Tab[] = ["timeline", "budget", "tasks", "calendar", "risks"];
const titles: Record<Tab, string> = {
  timeline: "Timeline strategy", budget: "Operational capital & budget", tasks: "Task management core",
  calendar: "Operational timeline calendar", risks: "Risk strategy & safeguards",
};

export function PlanningPage() {
  const { eventId = "", tab = "timeline" } = useParams();
  const activeTab = tabs.includes(tab as Tab) ? (tab as Tab) : "timeline";
  const client = useQueryClient();
  const enabled = Boolean(eventId);

  // Every screen reads across records (tasks group by milestone, the calendar
  // merges both), so the whole plan is fetched rather than one tab's slice.
  const event = useQuery({ queryKey: ["event", eventId], queryFn: () => planningApi.getEvent(eventId), enabled });
  const milestones = useQuery({ queryKey: ["milestones", eventId], queryFn: () => planningApi.milestones(eventId), enabled });
  const tasks = useQuery({ queryKey: ["tasks", eventId], queryFn: () => planningApi.tasks(eventId), enabled });
  const risks = useQuery({ queryKey: ["risks", eventId], queryFn: () => planningApi.risks(eventId), enabled });
  const budget = useQuery({ queryKey: ["budget", eventId], queryFn: () => planningApi.budget(eventId), enabled });

  const refresh = (keys: string[]) => {
    void client.invalidateQueries({ queryKey: ["event", eventId] });
    keys.forEach((key) => void client.invalidateQueries({ queryKey: [key, eventId] }));
  };

  return (
    <AppShell eventId={eventId} title={event.data?.title ? `${event.data.title} · ${titles[activeTab]}` : titles[activeTab]}>
      {event.error ? (
        <ErrorState error={event.error} onRetry={() => void event.refetch()} />
      ) : (
        <PlanningScreens
          eventId={eventId}
          tab={activeTab}
          event={event.data}
          milestones={milestones.data ?? []}
          tasks={tasks.data ?? []}
          risks={risks.data ?? []}
          budget={budget.data?.line_items ?? []}
          budgetSummary={budget.data?.summary}
          loading={milestones.isLoading || tasks.isLoading || risks.isLoading || budget.isLoading}
          refresh={refresh}
        />
      )}
    </AppShell>
  );
}
