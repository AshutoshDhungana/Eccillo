import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventSetupWizard } from "./EventSetupWizard";
import { planningApi } from "../api/planning";
import type { AgentRun, StructuredEventState } from "../types/agent";

/* The wizard's whole job is to hand the AI's proposal to a human for checking.
   GET /agent/state always answers — with no agent activity it reconstructs a
   snapshot from the bare event — so the wizard must not read it as "the
   proposal is ready", or the planner lands on a blank form and retypes the
   brief by hand. These cover that gate and the reseed that follows it. */

const EMPTY: StructuredEventState = {
  event_id: "e1", event_type: "other", title: "New event", description: "",
  budget: null, currency: "NPR", date: null, end_date: null, guest_count: null,
  venue: null, location: null, requirements: [], timeline: [], budget_lines: [],
  vendors: [], tasks: [], guests: [], risks: [], notes: [],
  status: "collecting_information", revision: 0,
};

const SCAFFOLDED: StructuredEventState = {
  ...EMPTY,
  title: "DevWeek", event_type: "conference", guest_count: 200,
  date: "2026-09-15T09:00:00Z", budget: 500_000_000, venue: "Kathmandu",
  status: "review", revision: 4,
};

const run = (over: Partial<AgentRun> = {}): AgentRun => ({
  id: "r1", session: "s1", event: "e1", status: "completed", user_text: "",
  intent: "plan_event", ai_state: "review", message: "Here's the plan.",
  clarifying: false, missing_fields: [], plan: {}, explanation: [],
  pending_approvals: [], observability: {}, error: "", steps: [],
  created_at: "", started_at: null, finished_at: null, ...over,
});

const { agentApi } = vi.hoisted(() => ({
  agentApi: {
    listSessions: vi.fn(), sendMessage: vi.fn(), getRun: vi.fn(),
    getState: vi.fn(), transcript: vi.fn(), getVendors: vi.fn(),
    shortlist: vi.fn(), approvePlan: vi.fn(), createSession: vi.fn(), approve: vi.fn(),
  },
}));
vi.mock("../api/agent", () => ({ agentApi }));
// Page chrome only; it needs auth context and has nothing to do with the gate.
vi.mock("../components/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("../api/planning", () => ({
  planningApi: {
    getEvent: vi.fn(async () => ({ id: "e1", title: "New event", type: "other", revision: 1 })),
    updateEvent: vi.fn(async () => ({ id: "e1", revision: 2 })),
  },
}));

/** A run the test finishes by hand — the agent takes seconds in production, and
 *  that gap after the snapshot lands is exactly where the wizard used to leak an
 *  empty form. Instant mocks close the gap and hide the bug. */
function deferredRun() {
  let release!: (r: AgentRun) => void;
  const finished = new Promise<AgentRun>((resolve) => { release = resolve; });
  agentApi.getRun.mockReturnValue(finished);
  return (over?: Partial<AgentRun>) => release(run(over));
}

function renderWizard(intro = "A 200-person tech conference in Kathmandu") {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[{ pathname: "/events/e1/setup", state: { intro } }]}>
        <Routes><Route path="/events/:eventId/setup" element={<EventSetupWizard />} /></Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AI setup wizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    agentApi.listSessions.mockResolvedValue([]); // fresh event → the intro gets sent
    agentApi.sendMessage.mockResolvedValue({ run_id: "r1", session_id: "s1", status: "queued" });
    agentApi.getVendors.mockResolvedValue({ vendors: [] });
  });

  it("keeps waiting after the empty snapshot lands, until the run finishes", async () => {
    agentApi.getState.mockResolvedValue(EMPTY);
    const finish = deferredRun();

    renderWizard();

    // The pre-agent snapshot has been read and is sitting in the cache...
    await waitFor(() => expect(agentApi.getState).toHaveBeenCalled());
    // ...and it must not be mistaken for a proposal: no form, still scaffolding.
    expect(screen.getByText(/scaffolding your event/i)).toBeInTheDocument();
    expect(screen.queryByText("Verify details & save")).toBeNull();
    expect(screen.queryByDisplayValue("New event")).toBeNull();

    finish();
    await waitFor(() => expect(screen.queryByText(/scaffolding your event/i)).toBeNull());
  });

  it("prefills the details form from the proposal the run produced", async () => {
    // First read is the pre-agent reconstruction; the invalidation after the run
    // picks up the real proposal. Seeding must follow the second one.
    agentApi.getState.mockResolvedValueOnce(EMPTY).mockResolvedValue(SCAFFOLDED);
    const finish = deferredRun();

    renderWizard();
    await waitFor(() => expect(agentApi.getState).toHaveBeenCalled());
    finish();

    expect(await screen.findByDisplayValue("DevWeek")).toBeInTheDocument();
    expect(screen.getByDisplayValue("200")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Kathmandu")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000000")).toBeInTheDocument(); // minor → major
    expect(screen.getByText("Verify details & save")).toBeInTheDocument();
    // The stale reconstruction must not survive anywhere in the form.
    expect(screen.queryByDisplayValue("New event")).toBeNull();
  });

  it("offers a reply when the agent asks for a missing field", async () => {
    // A clarifying turn runs no workflow, so without an input here the later
    // steps could never be filled.
    agentApi.getState.mockResolvedValue(EMPTY);
    const finish = deferredRun();

    renderWizard();
    finish({ clarifying: true, missing_fields: ["budget"], message: "What's the budget?" });

    expect(await screen.findByLabelText("Reply to the planner")).toBeInTheDocument();
    expect(screen.getByText("Reply")).toBeInTheDocument();
  });

  it("hides the reply box once the agent stops clarifying", async () => {
    agentApi.getState.mockResolvedValueOnce(EMPTY).mockResolvedValue(SCAFFOLDED);
    const finish = deferredRun();

    renderWizard();
    finish();

    await screen.findByDisplayValue("DevWeek");
    expect(screen.queryByLabelText("Reply to the planner")).toBeNull();
  });

  it("fills the form from the reply to a clarifying question", async () => {
    // The path a brief with no budget takes: the first turn only asks a question,
    // so the steps are already mounted against an empty proposal when the real
    // one lands. Seeding once on mount is not enough here.
    agentApi.getState.mockResolvedValueOnce(EMPTY).mockResolvedValueOnce(EMPTY).mockResolvedValue(SCAFFOLDED);
    let finish = deferredRun();

    renderWizard();
    finish({ clarifying: true, missing_fields: ["budget"], message: "What's the budget?" });

    // Question answered against a form that is still showing the bare event.
    const reply = await screen.findByLabelText("Reply to the planner");
    expect(screen.getByDisplayValue("New event")).toBeInTheDocument();

    finish = deferredRun(); // the reply kicks off a second run
    fireEvent.change(reply, { target: { value: "5,000,000 NPR" } });
    fireEvent.click(screen.getByText("Reply"));
    await waitFor(() => expect(agentApi.sendMessage).toHaveBeenCalledTimes(2));
    finish();

    expect(await screen.findByDisplayValue("DevWeek")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000000")).toBeInTheDocument();
    expect(screen.queryByLabelText("Reply to the planner")).toBeNull();
  });

  it("preselects the agent's vendor shortlist for review", async () => {
    // Everything /agent/vendors returns is already the agent's pick, so the
    // planner unticks rather than re-picking from scratch.
    agentApi.getState.mockResolvedValueOnce(EMPTY).mockResolvedValue(SCAFFOLDED);
    agentApi.getVendors.mockResolvedValue({
      vendors: [
        { vendor_id: "v1", name: "Hotel Annapurna", category: "venue", score: 0.9, reasons: ["Capacity fits"], status: "shortlisted", price_from_minor: null, currency: null, rating_avg: null, review_count: null, contact_phone: "", website: "", latitude: null, longitude: null, external_source: "", service_areas: [] },
        { vendor_id: "v2", name: "Everest Catering", category: "catering", score: 0.8, reasons: ["Within budget"], status: "shortlisted", price_from_minor: null, currency: null, rating_avg: null, review_count: null, contact_phone: "", website: "", latitude: null, longitude: null, external_source: "", service_areas: [] },
      ],
    });
    agentApi.shortlist.mockResolvedValue({ count: 2, vendor_ids: ["v1", "v2"] });
    const finish = deferredRun();

    renderWizard();
    finish();

    // Wait for the proposal to land before clicking: the revision key remounts
    // the step, and a click on the pre-remount button never reaches React.
    await screen.findByDisplayValue("DevWeek");
    fireEvent.click(screen.getByText("Verify details & save"));
    await waitFor(() => expect(planningApi.updateEvent).toHaveBeenCalled());
    fireEvent.click(await screen.findByText("Continue"));

    // Both arrive already selected — the commit button reflects the full count.
    expect(await screen.findByText("Verify 2 selections")).toBeInTheDocument();
  });
});
