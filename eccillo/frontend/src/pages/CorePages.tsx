import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { planningApi } from "../api/planning";
import { AppShell } from "../components/AppShell";
import { DesignedPlanningWorkspace } from "../components/DesignedPlanningWorkspace";
import { ErrorState } from "../components/ui";

const tabs = ["timeline", "budget", "tasks", "calendar", "risks"] as const;

export function PlanningPage() {
  const { eventId = "", tab = "timeline" } = useParams();
  const activeTab = tabs.includes(tab as typeof tabs[number]) ? tab as typeof tabs[number] : "timeline";
  const client = useQueryClient();
  const event = useQuery({ queryKey: ["event", eventId], queryFn: () => planningApi.getEvent(eventId) });
  const milestones = useQuery({ queryKey: ["milestones", eventId], queryFn: () => planningApi.milestones(eventId), enabled: activeTab === "timeline" || activeTab === "calendar" });
  const tasks = useQuery({ queryKey: ["tasks", eventId], queryFn: () => planningApi.tasks(eventId), enabled: activeTab === "tasks" || activeTab === "calendar" });
  const risks = useQuery({ queryKey: ["risks", eventId], queryFn: () => planningApi.risks(eventId), enabled: activeTab === "risks" });
  const budget = useQuery({ queryKey: ["budget", eventId], queryFn: () => planningApi.budget(eventId), enabled: activeTab === "budget" });
  const refresh = (keys: string[]) => { void client.invalidateQueries({ queryKey: ["event", eventId] }); keys.forEach((key) => void client.invalidateQueries({ queryKey: [key, eventId] })); };
  return <AppShell eventId={eventId}>{event.error ? <ErrorState error={event.error} onRetry={() => void event.refetch()}/> : <DesignedPlanningWorkspace eventId={eventId} tab={activeTab} event={event.data} milestones={milestones.data ?? []} tasks={tasks.data ?? []} risks={risks.data ?? []} budget={budget.data?.line_items ?? []} budgetSummary={budget.data?.summary} loading={milestones.isLoading || tasks.isLoading || risks.isLoading || budget.isLoading} refresh={refresh}/>}</AppShell>;
}
