import { render, screen, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PlanningScreens, type PlanningProps, type Tab } from "./PlanningScreens";
import type { Risk, Task } from "../../types";

const risk = (id: string, likelihood: Risk["likelihood"], impact: Risk["impact"]): Risk =>
  ({ id, title: `Risk ${id}`, likelihood, impact, mitigation: "", source: "user" });
const task = (id: string, status: Task["status"]): Task =>
  ({ id, milestone: null, title: `Task ${id}`, status, due_at: null, source: "user" });

function renderScreen(tab: Tab, overrides: Partial<PlanningProps>) {
  const props: PlanningProps = {
    eventId: "e1", tab, milestones: [], tasks: [], risks: [], budget: [],
    loading: false, refresh: () => {}, ...overrides,
  };
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter><PlanningScreens {...props} /></MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("planning screens", () => {
  it("counts risks into the likelihood × impact matrix", () => {
    // Two high/high, one low/low — the matrix must show them in separate cells.
    renderScreen("risks", { risks: [risk("a", "high", "high"), risk("b", "high", "high"), risk("c", "low", "low")] });
    expect(screen.getByText("Total identified risks").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("High priority").nextSibling).toHaveTextContent("2");
    // Matrix cells carry their own count, so both populated buckets are labelled.
    const matrix = screen.getByText("Concentration matrix").parentElement!;
    expect(within(matrix).getAllByText("2")).toHaveLength(1);
    expect(within(matrix).getAllByText("1")).toHaveLength(1);
  });

  it("derives task completion from status", () => {
    renderScreen("tasks", { tasks: [task("a", "done"), task("b", "in_progress"), task("c", "todo")] });
    expect(screen.getByText("100% complete")).toBeInTheDocument();
    expect(screen.getByText("50% complete")).toBeInTheDocument();
    expect(screen.getByText("0% complete")).toBeInTheDocument();
  });
});
