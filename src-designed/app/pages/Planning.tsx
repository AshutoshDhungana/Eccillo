import { useParams, Navigate } from "react-router";
import { AppShell } from "../components/AppShell";
import PlanningTimeline from "../../imports/PlanningTimeline";
import PlanningBudget from "../../imports/PlanningBudget";
import PlanningTasks from "../../imports/PlanningTasks";
import PlanningCalendar from "../../imports/PlanningCalendar";
import PlanningRisks from "../../imports/PlanningRisks";

const TABS = [
  { key: "timeline", label: "Timeline", heading: "Timeline Strategy", Component: PlanningTimeline },
  { key: "budget", label: "Budget", heading: "Operational Capital & Budget", Component: PlanningBudget },
  { key: "tasks", label: "Tasks", heading: "Task Management Core", Component: PlanningTasks },
  { key: "calendar", label: "Calendar", heading: "Operational Timeline Calendar", Component: PlanningCalendar },
  { key: "risks", label: "Risks", heading: "Risk Strategy & Safeguards", Component: PlanningRisks },
] as const;

export default function Planning() {
  const { tab } = useParams();

  const active = TABS.find((t) => t.key === tab);
  if (!active) return <Navigate to="/planning/timeline" replace />;

  const ActiveComponent = active.Component;

  return (
    <AppShell active={active.label} title={active.heading}>
      <div className="relative h-full min-h-[720px] w-full bg-white">
        <ActiveComponent />
      </div>
    </AppShell>
  );
}
