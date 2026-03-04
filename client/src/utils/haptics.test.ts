import { describe, it, expect, vi } from "vitest";
import { vibrate } from "./haptics";

describe("vibrate", () => {
  it("calls navigator.vibrate when available", () => {
    // Mock navigator.vibrate
    navigator.vibrate = vi.fn();
    vibrate();
    expect(navigator.vibrate).toHaveBeenCalledWith(10);
  });

  it("does nothing when navigator.vibrate is not available", () => {
    // Simulate unsupported browser (iOS)
    navigator.vibrate = undefined as any;
    expect(() => vibrate()).not.toThrow();
  });
});
