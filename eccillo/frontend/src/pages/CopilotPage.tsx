import { useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "../components/AppShell";
import { CopilotPane } from "../components/copilot/CopilotPane";
import { PlanPanels } from "../components/copilot/PlanPanels";
import { planningApi } from "../api/planning";

export function CopilotPage() {
  const { eventId = "" } = useParams();
  const location = useLocation();
  const intro = (location.state as { intro?: string } | null)?.intro;
  const client = useQueryClient();
  const event = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => planningApi.getEvent(eventId),
    enabled: Boolean(eventId),
  });

  return (
    <AppShell eventId={eventId} title={event.data?.title ?? "Copilot"}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <CopilotPane
          eventId={eventId}
          intro={intro}
          onRunComplete={() => {
            // Keep the plan panels + event view fresh as the agent edits state.
            void client.invalidateQueries({ queryKey: ["agent-state", eventId] });
            void client.invalidateQueries({ queryKey: ["event", eventId] });
          }}
        />
        <PlanPanels eventId={eventId} />
      </div>
    </AppShell>
  );
}
