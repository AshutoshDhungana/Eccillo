import { api } from "./client";
import type { AgentRun, AgentSession, AgentTurn, MessageAccepted, StructuredEventState, VendorSuggestion } from "../types/agent";

const base = (eventId: string) => "/events/" + eventId + "/agent";

export const agentApi = {
  createSession: (eventId: string) => api.post<AgentSession>(base(eventId) + "/sessions", {}),
  listSessions: (eventId: string) => api.get<AgentSession[]>(base(eventId) + "/sessions"),

  /** Enqueue a turn. Returns 202 with a run_id to poll. */
  sendMessage: (eventId: string, message: string, sessionId?: string) =>
    api.post<MessageAccepted>(base(eventId) + "/messages", { message, session_id: sessionId }),

  getRun: (eventId: string, runId: string) => api.get<AgentRun>(base(eventId) + "/runs/" + runId),

  /** Approve the session's pending gated actions; runs them and returns a new run_id. */
  approve: (eventId: string, sessionId: string) =>
    api.post<MessageAccepted>(base(eventId) + "/sessions/" + sessionId + "/approve", {}),

  getState: (eventId: string) => api.get<StructuredEventState>(base(eventId) + "/state"),
  transcript: (eventId: string, sessionId: string) =>
    api.get<AgentTurn[]>(base(eventId) + "/sessions/" + sessionId + "/messages"),

  /** Submit/approve the plan and advance the workflow (does not send anything). */
  approvePlan: (eventId: string) =>
    api.post<{ status: string; ai_state: string }>(base(eventId) + "/plan/approve", {}),

  /** Enriched vendor/venue suggestions (AI shortlist joined with marketplace data). */
  getVendors: (eventId: string) => api.get<{ vendors: VendorSuggestion[] }>(base(eventId) + "/vendors"),

  /** Persist selected vendors as the event shortlist (no outreach). */
  shortlist: (eventId: string, vendorIds: string[]) =>
    api.post<{ count: number; vendor_ids: string[] }>(base(eventId) + "/shortlist", { vendor_ids: vendorIds }),
};
