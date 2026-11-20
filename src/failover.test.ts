import { describe, expect, it } from "vitest";
import { WAX_MAINNET_CHAIN_ID, acceptChainInfo, firstUp } from "./failover";

describe("failover", () => {
  it("skips the first origin and stops", () => {
    const row = firstUp(
      ["https://wax.greymass.com", "https://wax.cryptolions.io", "https://api.wax.alohaeos.com"],
      new Set(["https://wax.cryptolions.io"]),
    );
    expect(row).toEqual({ ok: true, origin: "https://wax.cryptolions.io", tried: 2 });
  });

  it("refuses a list longer than five and a foreign chain id", () => {
    expect(firstUp(["https://a.example", "https://b.example", "https://c.example", "https://d.example", "https://e.example", "https://f.example"], new Set()).ok).toBe(false);
    expect(WAX_MAINNET_CHAIN_ID).toBe(
      "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
    );
    expect(acceptChainInfo({ chain_id: WAX_MAINNET_CHAIN_ID })).toEqual({ ok: true });
    expect(acceptChainInfo({ chain_id: "not-wax" }).ok).toBe(false);
  });
});
