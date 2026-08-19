import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { THEME_KEY, readTheme, useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("defaults to dark when nothing is saved and the OS has no light preference", () => {
    expect(readTheme()).toBe("dark");
  });

  it("restores a saved choice over the default", () => {
    localStorage.setItem(THEME_KEY, "light");
    expect(readTheme()).toBe("light");
  });

  it("toggles, paints the root attribute, and persists the choice", () => {
    const { result } = renderHook(() => useTheme());
    expect(document.documentElement.dataset.theme).toBe("dark");

    act(() => result.current.toggle());
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_KEY)).toBe("light");

    act(() => result.current.toggle());
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});
