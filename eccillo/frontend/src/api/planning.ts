import { api } from "./client";
import type { BudgetLineItem, Event, Milestone, Risk, Task } from "../types";

type EventWrite = Partial<Event> & { organization_id?: string };

export const planningApi = {
  listEvents: () => api.get<Event[]>("/events"),
  createEvent: (body: EventWrite) => api.post<Event>("/events", body),
  getEvent: (eventId: string) => api.get<Event>("/events/" + eventId),
  getEventBySlug: (slug: string) => api.get<Event>("/events/slug/" + slug, { auth: false }),
  updateEvent: (eventId: string, body: EventWrite, revision?: number) =>
    api.patch<Event>("/events/" + eventId, body, { eventRevision: revision }),
  deleteEvent: (eventId: string, revision?: number) => api.delete<void>("/events/" + eventId, { eventRevision: revision }),
  templates: () => api.get<Record<string, unknown>[]>("/event-templates"),

  milestones: (eventId: string) => api.get<Milestone[]>("/events/" + eventId + "/milestones"),
  createMilestone: (eventId: string, body: Partial<Milestone>, revision?: number) =>
    api.post<Milestone>("/events/" + eventId + "/milestones", body, { eventRevision: revision }),
  updateMilestone: (eventId: string, itemId: string, body: Partial<Milestone>, revision?: number) =>
    api.patch<Milestone>("/events/" + eventId + "/milestones/" + itemId, body, { eventRevision: revision }),
  deleteMilestone: (eventId: string, itemId: string) => api.delete<void>("/events/" + eventId + "/milestones/" + itemId),

  tasks: (eventId: string) => api.get<Task[]>("/events/" + eventId + "/tasks"),
  createTask: (eventId: string, body: Partial<Task>, revision?: number) =>
    api.post<Task>("/events/" + eventId + "/tasks", body, { eventRevision: revision }),
  updateTask: (eventId: string, itemId: string, body: Partial<Task>, revision?: number) =>
    api.patch<Task>("/events/" + eventId + "/tasks/" + itemId, body, { eventRevision: revision }),
  deleteTask: (eventId: string, itemId: string) => api.delete<void>("/events/" + eventId + "/tasks/" + itemId),

  risks: (eventId: string) => api.get<Risk[]>("/events/" + eventId + "/risks"),
  createRisk: (eventId: string, body: Partial<Risk>, revision?: number) =>
    api.post<Risk>("/events/" + eventId + "/risks", body, { eventRevision: revision }),
  updateRisk: (eventId: string, itemId: string, body: Partial<Risk>, revision?: number) =>
    api.patch<Risk>("/events/" + eventId + "/risks/" + itemId, body, { eventRevision: revision }),
  deleteRisk: (eventId: string, itemId: string) => api.delete<void>("/events/" + eventId + "/risks/" + itemId),

  budget: (eventId: string) => api.get<{ summary: Record<string, number>; line_items: BudgetLineItem[] }>("/events/" + eventId + "/budget"),
  replaceBudget: (eventId: string, lineItems: Partial<BudgetLineItem>[], revision?: number) =>
    api.put<{ summary: Record<string, number>; line_items: BudgetLineItem[] }>("/events/" + eventId + "/budget", { line_items: lineItems }, { eventRevision: revision }),
  updateBudgetLine: (eventId: string, itemId: string, body: Partial<BudgetLineItem>, revision?: number) =>
    api.patch<BudgetLineItem>("/events/" + eventId + "/budget/line-items/" + itemId, body, { eventRevision: revision }),
  deleteBudgetLine: (eventId: string, itemId: string) => api.delete<void>("/events/" + eventId + "/budget/line-items/" + itemId),
  seating: (eventId: string) => api.get<Record<string, unknown>>("/events/" + eventId + "/seating"),
  saveSeating: (eventId: string, body: Record<string, unknown>, revision?: number) =>
    api.put("/events/" + eventId + "/seating", body, { eventRevision: revision }),
  googleCalendarStatus: (eventId: string) => api.get<{ configured: boolean; links: number; failed: number; last_synced_at?: string }>("/events/" + eventId + "/calendar/google/status"),
  syncGoogleCalendar: (eventId: string) => api.post<{ configured: boolean; synced: number; unchanged: number; skipped: number }>("/events/" + eventId + "/calendar/google/sync", {}),
  comments: (eventId: string) => api.get<Record<string, unknown>[]>("/events/" + eventId + "/comments"),
  createComment: (eventId: string, body: Record<string, unknown>) => api.post("/events/" + eventId + "/comments", body),

};
