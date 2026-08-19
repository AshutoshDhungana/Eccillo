export type OutreachStatus =
  | "pending"
  | "queued"
  | "sending"
  | "sent"
  | "responded"
  | "declined"
  | "no_channel"
  | "failed";

export interface Outreach {
  id: string;
  party_type: string;
  vendor_id: string;
  party_name: string;
  to_email: string;
  status: OutreachStatus;
  sent_at: string | null;
  responded_at: string | null;
  quote_minor: number | null;
  available: boolean | null;
  notes: string;
  reply_contact_name: string;
  reply_contact_email: string;
  currency: string;
  last_error: string;
}

export interface ProcurementRequest {
  id: string;
  event_id: string;
  category: string;
  title: string;
  scope: string;
  requirements: string[];
  budget_ceiling_minor: number;
  share_budget: boolean;
  currency: string;
  respond_by: string | null;
  status: "draft" | "sent" | "closed" | "cancelled";
  is_open: boolean;
  sent_at: string | null;
  created_at: string;
  counts: Partial<Record<OutreachStatus, number>>;
  total: number;
  /** Present on detail responses only. */
  outreach?: Outreach[];
  /** Present on create only — the exact text awaiting confirmation. */
  preview?: { subject: string; body: string };
}

export interface Lead extends Outreach {
  request: { id: string; title: string; category: string };
  vendor: { rating_avg: number; review_count: number; website: string; contact_phone: string } | null;
}

/** What a counterparty sees on the public reply page. */
export interface PublicRequest {
  party_name: string;
  organization: string;
  event_title: string;
  event_date: string | null;
  location: string;
  guests: number;
  category: string;
  title: string;
  scope: string;
  requirements: string[];
  currency: string;
  respond_by: string | null;
  is_open: boolean;
  already_responded: boolean;
  budget_ceiling_minor?: number;
  submitted: { can_serve: boolean; quote_minor: number | null; available: boolean | null; notes: string } | null;
}
