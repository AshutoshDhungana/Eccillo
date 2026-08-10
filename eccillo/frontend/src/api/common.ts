import { api } from "./client";
import type { Notification } from "../types";

export const commonApi = {
  createApproval: (body: Record<string, unknown>) => api.post("/approvals", body),
  decideApproval: (chainId: string, body: { decision: "approve" | "reject"; comment?: string }) =>
    api.post("/approvals/" + chainId + "/decide", body),
  notifications: () => api.get<Notification[]>("/notifications"),
  sendNotification: (body: Record<string, unknown>) => api.post<Notification>("/notifications", body),
};
