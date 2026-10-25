import { describe, expect, it } from "vitest";
import { buildExample, clampLimit, PRODUCER_PAGES, waitMs, waxJsonUrl } from "./examples";

describe("usage examples", () => {
  it("builds get_info unsent and keeps the chain id constant in the docs module", () => {
    const row = buildExample("chain-info", "https://wax.greymass.com");
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.executed).toBe(false);
    expect(row.request.url).toBe("https://wax.greymass.com/v1/chain/get_info");
    expect(row.request.body).toEqual({});
  });

  it("caps table reads at 100 rows", () => {
    expect(clampLimit(0, 100).ok).toBe(false);
    expect(clampLimit(101, 100).ok).toBe(false);
    const row = buildExample("chain-table", "https://wax.greymass.com", { account: "eosio", limit: 100 });
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.body).toMatchObject({ code: "eosio.token", scope: "eosio", table: "accounts", limit: 100, json: true });
    expect(buildExample("chain-table", "https://wax.greymass.com", { limit: 101 }).ok).toBe(false);
  });

  it("puts history on the history origin and refuses a huge page", () => {
    const row = buildExample("hyperion-actions", "https://wax.eosphere.io", { account: "eosio", limit: 1 });
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.url).toContain("https://wax.eosphere.io/v2/history/get_actions");
    expect(row.request.url).toContain("limit=1");
    expect(row.request.warning).toBeUndefined();
    const other = buildExample("hyperion-actions", "https://wax.greymass.com", { account: "eosio" });
    expect(other.ok).toBe(true);
    if (!other.ok) return;
    expect(other.request.warning).toMatch(/Probe history/);
  });

  it("lowercases an Alcor ticker and keeps depth at or under 300", () => {
    const row = buildExample("alcor-orderbook", "https://wax.alcor.exchange", {
      ticker: "CR-tarukofficer_WAX-eosio.token",
      depth: 1,
    });
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.url).toBe("https://wax.alcor.exchange/api/v2/tickers/cr-tarukofficer_wax-eosio.token/orderbook?depth=1");
    expect(buildExample("alcor-orderbook", "https://wax.alcor.exchange", { depth: 301 }).ok).toBe(false);
    const chainHost = buildExample("alcor-tickers", "https://wax.greymass.com");
    expect(chainHost.ok).toBe(true);
    if (!chainHost.ok) return;
    expect(chainHost.request.warning).toMatch(/wrong host/);
  });

  it("builds Light API paths with the wax network segment", () => {
    const row = buildExample("light-balances", "https://lightapi.eosamsterdam.net", { account: "eosio" });
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.url).toBe("https://lightapi.eosamsterdam.net/api/balances/wax/eosio");
    expect(row.request.method).toBe("GET");
    expect(row.request.executed).toBe(false);
    const status = buildExample("light-status", "https://lightapi.eosamsterdam.net");
    expect(status.ok).toBe(true);
    if (!status.ok) return;
    expect(status.request.url).toBe("https://lightapi.eosamsterdam.net/api/status");
  });

  it("waits out a one second gap and accepts only a mainnet wax.json URL", () => {
    expect(waitMs(1_000, 1_200, 1_000)).toBe(800);
    expect(waitMs(1_000, 2_000, 1_000)).toBe(0);
    expect(waxJsonUrl("https://guild.example/wax.json")).toEqual({ ok: true, url: "https://guild.example/wax.json" });
    expect(waxJsonUrl("https://guild.example/bp.json").ok).toBe(false);
    expect(waxJsonUrl("http://guild.example/wax.json").ok).toBe(false);
    expect(PRODUCER_PAGES.map((page) => page.url)).toContain("https://status.wax.io/");
  });

  it("caches an ABI read as a single unsent get_abi", () => {
    const row = buildExample("chain-abi", "https://wax.greymass.com", { code: "eosio.token" });
    expect(row.ok).toBe(true);
    if (!row.ok) return;
    expect(row.request.body).toEqual({ account_name: "eosio.token" });
    expect(row.request.why).toMatch(/cache/i);
  });
});
