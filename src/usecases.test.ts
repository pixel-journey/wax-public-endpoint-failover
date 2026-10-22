import { describe, expect, it } from "vitest";
import { USE_CASES, assertUseCases } from "./usecases";

describe("use cases", () => {
  it("keeps both requests unsent", () => {
    assertUseCases();
    expect(USE_CASES).toHaveLength(2);
    for (const item of USE_CASES) {
      expect(item.request.executed).toBe(false);
      expect(item.request.url.startsWith("https://")).toBe(true);
      expect(item.transaction).toBeNull();
    }
  });
});
