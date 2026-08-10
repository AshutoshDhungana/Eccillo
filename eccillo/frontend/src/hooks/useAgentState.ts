import { useQuery } from "@tanstack/react-query";
import { agentApi } from "../api/agent";

/** Live snapshot of the structured event the agent maintains (GET /agent/state). */
export function useAgentState(eventId: string) {
  return useQuery({
    queryKey: ["agent-state", eventId],
    queryFn: () => agentApi.getState(eventId),
    enabled: Boolean(eventId),
  });
}
