import { describe, expect, it } from "vitest";
import { chainInfo, jobRequest } from "./request";

describe("unsent requests", () => {
  it("builds get_info and does not mark it executed", () => {
    const row = chainInfo("https://wax.greymass.com");
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request).toEqual({ method: "POST", url: "https://wax.greymass.com/v1/chain/get_info", body: {}, executed: false });
  });

  it("builds an Alcor token URL on the origin the caller passed", () => {
    const row = jobRequest("spot-ticker", "https://wax.alcor.exchange");
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.url).toBe("https://wax.alcor.exchange/api/v2/tokens/wax-eosio.token");
    expect(row.request.executed).toBe(false);
  });

  it("keeps history on the history host, not on a path mixed into the origin", () => {
    const row = jobRequest("history", "https://wax.eosusa.io");
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.url).toContain("/v2/history/get_actions");
    expect(row.request.executed).toBe(false);
  });
});
