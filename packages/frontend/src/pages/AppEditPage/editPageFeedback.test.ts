import { afterEach, describe, expect, it, vi } from "vitest";
import { publishedVersionMessage, waitAtLeast } from "./editPageFeedback.ts";

describe("publishedVersionMessage", () => {
  it("uses the metadata version when present", () => {
    expect(publishedVersionMessage("1.2.3", 4)).toBe("Published version 1.2.3");
  });

  it("falls back to the revision when version is empty", () => {
    expect(publishedVersionMessage("  ", 7)).toBe("Published revision 7");
    expect(publishedVersionMessage(undefined, 2)).toBe("Published revision 2");
  });
});

describe("waitAtLeast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for the remaining time when the minimum has not elapsed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    const done = waitAtLeast(1_000, 500);

    let resolved = false;
    void done.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(499);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await done;
    expect(resolved).toBe(true);
  });

  it("does not wait when the minimum has already elapsed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(2_000);
    await waitAtLeast(1_000, 500);
  });
});
