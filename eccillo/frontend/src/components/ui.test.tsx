import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button, EmptyState } from "./ui";

describe("shared UI", () => {
  it("renders an accessible primary action", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Create event</Button>);
    const button = screen.getByRole("button", { name: "Create event" });
    expect(button).toHaveAttribute("type", "submit");
    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps empty states actionable", () => {
    render(<EmptyState title="No events" detail="Start with a brief." action={<Button>Start</Button>} />);
    expect(screen.getByRole("heading", { name: "No events" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
  });
});
