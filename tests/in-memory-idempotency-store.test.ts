import { describe, expect, it, vi } from "vitest";
import { InMemoryIdempotencyStore } from "../src/application/services/in-memory-idempotency-store";

describe("InMemoryIdempotencyStore", () => {
  it("marks first message as new and duplicates as seen", () => {
    const store = new InMemoryIdempotencyStore(1000);

    expect(store.markIfNew("wamid.1")).toBe(true);
    expect(store.markIfNew("wamid.1")).toBe(false);
  });

  it("expires seen ids after TTL", () => {
    vi.useFakeTimers();
    const store = new InMemoryIdempotencyStore(1000);

    expect(store.markIfNew("wamid.1")).toBe(true);
    expect(store.markIfNew("wamid.1")).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(store.markIfNew("wamid.1")).toBe(true);

    vi.useRealTimers();
  });
});
