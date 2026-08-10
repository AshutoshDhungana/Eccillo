export type JsonObject = Record<string, unknown>;

export interface Money {
  amount_minor: number;
  currency: string;
}

export type EventType =
  | "birthday" | "wedding" | "conference" | "hackathon" | "festival"
  | "workshop" | "sports" | "meetup" | "seminar" | "other";

export type EventStatus =
  | "draft" | "planning" | "published" | "live" | "completed" | "archived";

export type Source = "user" | "ai_suggested" | "template";

export interface Event {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  location: { name?: string; city?: string; country?: string };
  starts_at: string | null;
  ends_at: string | null;
  expected_attendees: number;
  budget_target_minor: number;
  currency: string;
  source: Source;
  slug: string;
  description: string;
  milestones?: Milestone[];
  tasks?: Task[];
  budget_items?: BudgetLineItem[];
  risks?: Risk[];
  created_at: string;
  revision?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  due_at: string | null;
  status: "pending" | "in_progress" | "done" | "at_risk";
  is_critical_path: boolean;
  source: Source;
  order: number;
}

export interface Task {
  id: string;
  milestone: string | null;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  due_at: string | null;
  source: Source;
}

export interface BudgetLineItem {
  id: string;
  category: string;
  label: string;
  planned_minor: number;
  committed_minor: number;
  actual_minor: number;
  currency: string;
  source: Source;
  notes?: string;
}

export interface Risk {
  id: string;
  title: string;
  description?: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
  status?: string;
  source: Source;
}

export interface Vendor {
  id: string;
  display_name: string;
  category: string;
  description: string;
  rating_avg: number;
  review_count: number;
  price_from_minor: number;
  currency: string;
  service_areas: string[];
}

export interface VendorMatch {
  vendor_id: string;
  display_name: string;
  category: string;
  match_score: number;
  rationale: string;
  factors: {
    budget: number;
    experience: number;
    availability: number;
    reviews: number;
  };
}

/** A normalized, event-aware interpretation of a sourcing request. */
export interface VendorDiscoveryIntent {
  query: string;
  category?: string | null;
  keywords?: string[];
  budget_max_minor?: number | null;
  capacity_min?: number | null;
  date?: string | null;
  service_area?: string | null;
  pricing_model?: string | null;
  source?: string;
}

export interface VendorDiscoveryFilters {
  category?: string;
  budget_max_minor?: number;
  capacity_min?: number;
  date?: string;
  service_area?: string;
  rating_min?: number;
}

export interface VendorDiscoveryFilterSpec {
  name: keyof VendorDiscoveryFilters;
  label: string;
  kind: "select" | "number" | "date" | "text";
  options?: Array<{ value: string; label: string }>;
  enabled?: boolean;
}

export interface VendorDiscoveryResult {
  vendor_id: string;
  display_name: string;
  category: string;
  description: string;
  rating_avg: number;
  review_count: number;
  price_from_minor: number;
  price_to_minor?: number;
  currency: string;
  service_areas: string[];
  response_time_mins?: number;
  match_score: number;
  factors: Record<string, number>;
  match_reasons: string[];
  availability?: "available" | "unavailable" | "unknown";
  capacity_max?: number | null;
  pricing_model?: string | null;
}

export interface VendorDiscoveryResponse {
  intent: VendorDiscoveryIntent;
  results: VendorDiscoveryResult[];
  clarifying_questions: string[];
  filter_spec: VendorDiscoveryFilterSpec[];
}

export interface SuggestedVendorNeed {
  category: string;
  title: string;
  query: string;
  reason?: string;
  evidence?: string[];
}

export interface SuggestedVendorNeedsResponse {
  suggestions: SuggestedVendorNeed[];
  popular_needs?: SuggestedVendorNeed[];
  disclaimer?: string;
}

export interface EventVendorShortlist {
  id: string;
  vendor_id: string;
  notes?: string;
  source?: string;
  created_at?: string;
  state?: "saved" | "pending_confirmation" | string;
  action_id?: string;
  vendor: Pick<Vendor, "id" | "display_name" | "category" | "price_from_minor" | "currency" | "rating_avg" | "review_count" | "service_areas">;
}

export interface RfpDraftCandidate {
  id: string;
  vendor_id: string;
  vendor?: Pick<Vendor, "id" | "display_name" | "category" | "price_from_minor" | "currency">;
  created_at?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

export interface GeneratePlanRequest {
  event_type: string;
  location: string;
  expected_attendees: number;
  budget_minor: number;
  currency: string;
  starts_at: string;
  description?: string;
  event_id?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: "organizer" | "vendor" | "sponsor" | "talent_agency";
  country?: string;
  default_currency?: string;
  kyb_status?: string;
}

export interface Membership {
  id: string;
  organization: Organization;
  user_id?: string;
  role: "owner" | "admin" | "manager" | "member" | string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  locale?: string;
  timezone?: string;
  memberships: Membership[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user?: User;
}

export interface EventBrief {
  id: string;
  initial_prompt: string;
  status: string;
  details: JsonObject;
  missing_fields?: string[];
  revisions?: JsonObject[];
}

export interface PlanArtifactRevision {
  id: string;
  payload: JsonObject;
  sequence: number;
  edit_instruction?: string;
  created_at: string;
}

export interface PlanArtifact {
  id: string;
  kind: string;
  status: string;
  current_revision?: string | null;
  revisions?: PlanArtifactRevision[];
}

export interface PlanVersion {
  id: string;
  artifacts: PlanArtifact[];
  base_event_revision?: number;
  status?: string;
  sequence?: number;
  summary?: JsonObject;
}

export interface PlanOperationsPreview {
  plan_version_id: string;
  base_event_revision: number;
  current_event_revision: number;
  requires_merge: boolean;
  operations: Array<{ id: string; action?: string; resource?: string; payload?: JsonObject }>;
  default_selected_operation_ids: string[];
}

export interface CopilotRunEvent {
  id: string;
  sequence: number;
  type: string;
  payload: JsonObject;
  emitted_at: string;
}

export interface CopilotRunEventsPage {
  run_id: string;
  events: CopilotRunEvent[];
  next_after_sequence: number;
  has_more: boolean;
}

export interface CopilotRun {
  id: string;
  status: string;
  result?: JsonObject;
  error?: string;
  events?: CopilotRunEvent[];
  jobs?: JsonObject[];
  actions?: CopilotAction[];
}

export interface AgentActivityAction {
  id: string;
  tool_name: string;
  state: string;
  policy_tier: string;
  preview?: JsonObject;
}

export interface AgentActivityStep {
  id: string;
  node_id: string;
  agent_type: string;
  title: string;
  status: string;
  rationale: string;
  actions: Array<{ tool_name?: string; state?: string }>;
  error?: JsonObject;
  started_at?: string | null;
  finished_at?: string | null;
}

export interface AgentActivityRun {
  id: string;
  intent: string;
  trigger: string;
  status: string;
  workflow_version: string;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  summary?: JsonObject;
  error?: JsonObject;
  steps: AgentActivityStep[];
  pending_approvals: AgentActivityAction[];
}

export interface AgentActivityPage {
  results: AgentActivityRun[];
  page: number;
  page_size: number;
  count: number;
  has_next: boolean;
}

export interface AutonomyPolicy {
  id: string;
  event?: string | null;
  action_type: string;
  tier: "off" | "propose_only" | "auto_safe_capped" | "full_auto";
  spend_cap_minor: number;
  rate_limit_per_hour: number;
  enabled: boolean;
  kill_switch: boolean;
}

export interface AgentMetrics {
  run_count: number;
  success_rate: number | null;
  auto_approved_count: number;
  escalated_count: number;
  average_time_to_shortlist_seconds: number | null;
  average_cost_per_run_minor: number;
}

export interface CopilotAction {
  id: string;
  tool_name: string;
  resource_domain: string;
  policy_tier: string;
  state: string;
  preview?: JsonObject;
  /** Result emitted after an approved internal action is applied. */
  output?: JsonObject;
  /** Original proposal data, returned only within the authorized event scope. */
  input?: JsonObject;
  /** A durable explanation supplied by the API when a proposed action cannot run. */
  error?: JsonObject;
  side_effects?: JsonObject;
  expected_event_revision?: number;
  requires_approval: boolean;
  approval_status?: string;
  applied?: boolean;
  run?: string | null;
  email_delivery?: {
    status: "queued" | "sent" | "failed" | string;
    attempts: number;
    last_error?: string;
    sent_at?: string | null;
    provider_message_id?: string;
  } | null;
}

export interface CopilotConversation {
  id: string;
  title: string;
  status: string;
  messages?: JsonObject[];
  runs?: CopilotRun[];
  actions?: CopilotAction[];
}

export interface Notification {
  id: string;
  title?: string;
  message?: string;
  kind?: string;
  read_at?: string | null;
  created_at: string;
}

export interface EventDocument {
  id: string;
  event?: string | null;
  kind: "contract" | "proposal" | "portfolio" | "deck" | "certificate" | "badge" | "other";
  name: string;
  storage_key: string;
  mime_type: string;
  size_bytes: number;
  version: number;
  esign_status: string;
  metadata: JsonObject;
  created_at: string;
  updated_at?: string;
}

export interface TicketType {
  id: string;
  name: string;
  price_minor: number;
  currency: string;
  quota?: number | null;
  sold_count: number;
  access_rules: JsonObject;
  sales_starts_at?: string | null;
  sales_ends_at?: string | null;
}

export interface AgendaSession {
  id: string;
  title: string;
  description: string;
  track: string;
  room: string;
  starts_at?: string | null;
  ends_at?: string | null;
  speaker_names: string[];
  capacity?: number | null;
}

export interface Volunteer {
  id: string;
  user?: string | null;
  role: string;
  shifts: JsonObject[];
  status: string;
}

export interface ExhibitorBooth {
  id: string;
  sponsor_deal?: string | null;
  booth_number: string;
  location: string;
  assets: JsonObject[];
}
