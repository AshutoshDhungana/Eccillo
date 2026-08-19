import { api } from "./client";
import type { Lead, ProcurementRequest, PublicRequest } from "../types/procurement";

const base = (eventId: string) => "/events/" + eventId + "/procurement";

export interface CreateRequestInput {
  category: string;
  /** Omit to fall back to the event's saved vendor shortlist. */
  vendor_ids?: string[];
  title?: string;
  scope?: string;
  requirements?: string[];
  budget_ceiling_minor?: number;
  share_budget?: boolean;
  respond_by?: string;
}

export const procurementApi = {
  listRequests: (eventId: string) => api.get<{ requests: ProcurementRequest[] }>(base(eventId) + "/requests"),

  /** Draft a request from a selection. Sends nothing — returns the preview to confirm. */
  createRequest: (eventId: string, input: CreateRequestInput) =>
    api.post<ProcurementRequest>(base(eventId) + "/requests", input),

  getRequest: (eventId: string, requestId: string) =>
    api.get<ProcurementRequest>(base(eventId) + "/requests/" + requestId),

  /** The one confirmation. Everything after this happens on its own. */
  send: (eventId: string, requestId: string) =>
    api.post<ProcurementRequest>(base(eventId) + "/requests/" + requestId + "/send", {}),

  leads: (eventId: string) => api.get<{ leads: Lead[] }>(base(eventId) + "/leads"),
};

/** The counterparty side: no account, no token, just the emailed link. */
export const respondApi = {
  get: (token: string) => api.get<PublicRequest>("/procurement/respond/" + token, { auth: false }),
  submit: (
    token: string,
    body: { can_serve: boolean; quote_minor?: number; available?: boolean; notes?: string; contact_name?: string; contact_email?: string },
  ) => api.post<{ status: string; party_name: string }>("/procurement/respond/" + token, body, { auth: false }),
};
