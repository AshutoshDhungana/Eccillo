// Types for the Phase 3 AI agent Conversation API.
// Kept separate from the legacy Copilot types in ./index.ts.

export type AgentState =
  | "draft"
  | "collecting_information"
  | "planning"
  | "review"
  | "approval"
  | "booking"
  | "execution"
  | "live"
  | "completed"
  | "archived";

export type RunStatus = "queued" | "running" | "completed" | "failed";

export interface PendingApproval {
  skill: string;
  inputs: Record<string, unknown>;
  reason: string;
}

export interface AgentSession {
  id: string;
  event: string;
  organization: string;
  user: string | null;
  pending_approvals: PendingApproval[];
  created_at: string;
}

export interface AgentTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  run: string | null;
  created_at: string;
}

export interface AgentRunStep {
  step_id: string;
  skill: string;
  outcome: string;
  data: Record<string, unknown>;
  explanation: string[];
  error: string;
  order: number;
}

export interface AgentPlanStep {
  id: string;
  skill: string;
  depends_on: string[];
  reason: string;
}

export interface AgentRun {
  id: string;
  session: string;
  event: string;
  status: RunStatus;
  user_text: string;
  intent: string;
  ai_state: AgentState | string;
  message: string;
  clarifying: boolean;
  missing_fields: string[];
  plan: { goal?: string; steps?: AgentPlanStep[] } | Record<string, never>;
  explanation: string[];
  pending_approvals: PendingApproval[];
  observability: Record<string, unknown>;
  error: string;
  steps: AgentRunStep[];
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}

/** 202 response from POST /agent/messages and /approve. */
export interface MessageAccepted {
  run_id: string;
  session_id: string;
  status: RunStatus;
}

/** Enriched vendor suggestion (from GET /agent/vendors). */
export interface VendorSuggestion {
  vendor_id: string;
  name: string;
  category: string;
  score: number;
  reasons: string[];
  status: string;
  price_from_minor: number | null;
  currency: string | null;
  rating_avg: number | null;
  review_count: number | null;
  contact_phone: string;
  website: string;
  latitude: number | null;
  longitude: number | null;
  external_source: string;
  service_areas: string[];
}

/** Snapshot returned by GET /agent/state (the StructuredEvent). */
export interface StructuredVendorRef {
  vendor_id: string;
  name: string;
  category: string;
  score: number;
  reasons: string[];
  status: string;
}

export interface StructuredEventState {
  event_id: string;
  event_type: string | null;
  title: string | null;
  description: string;
  budget: number | null;
  currency: string;
  date: string | null;
  end_date: string | null;
  guest_count: number | null;
  venue: string | null;
  location: string | null;
  requirements: string[];
  timeline: Array<{ title: string; due_at: string | null; critical_path: boolean; offset_days: number; source: string }>;
  budget_lines: Array<{ category: string; label: string; planned_minor: number; currency: string; source: string }>;
  vendors: StructuredVendorRef[];
  tasks: Array<{ title: string; status: string; due_at: string | null; source: string }>;
  guests: Array<{ label: string; count: number; channel: string }>;
  risks: Array<Record<string, unknown>>;
  notes: string[];
  status: AgentState | string;
  revision: number;
}
