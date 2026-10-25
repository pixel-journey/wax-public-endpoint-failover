/**
 * Unsent usage examples for the public WAX read APIs.
 * Nothing in this file opens a socket.
 */

import { parseOrigin } from "./origin";

export const WAX_MAINNET_CHAIN_ID = "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4";

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;
const TICKER = /^[a-z0-9]{1,7}-[a-z1-5.]{1,12}_[a-z0-9]{1,7}-[a-z1-5.]{1,12}$/;

export type ExampleId =
  | "chain-info"
  | "chain-balance"
  | "chain-account"
  | "chain-table"
  | "chain-abi"
  | "hyperion-actions"
  | "atomic-assets"
  | "atomic-sales"
  | "alcor-tickers"
  | "alcor-orderbook"
  | "alcor-amm-pairs"
  | "light-balances"
  | "light-account"
  | "light-status";

export type Unsent = {
  method: "GET" | "POST";
  url: string;
  body?: Record<string, unknown>;
  executed: false;
  family: "chain" | "hyperion" | "atomic" | "alcor" | "light";
  doc: string;
  why: string;
  warning?: string;
};

export type DirectoryPage = { title: string; url: string };

const DOCS = {
  chain: "https://docs.wax.io/apis/chain-api.htm",
  hyperion: "https://hyperion.docs.eosrio.io/api/v2/",
  atomic: "https://docs.wax.io/apis/atomic-api.htm",
  alcor: "https://docs.alcor.exchange/api/market-data",
  light: "https://github.com/cc32d9/eosio_light_api#http-api",
} as const;

export function clampLimit(limit: number, max: number): { ok: true; limit: number } | { ok: false; reason: string } {
  if (!Number.isInteger(limit) || limit < 1) return { ok: false, reason: "limit must be a positive integer" };
  if (limit > max) return { ok: false, reason: `limit must be at most ${max}` };
  return { ok: true, limit };
}

/** Milliseconds to wait so a UI does not hit the same family again inside `gapMs`. */
export function waitMs(previousAt: number, now: number, gapMs = 1000): number {
  if (!Number.isFinite(previousAt) || !Number.isFinite(now) || !Number.isFinite(gapMs) || gapMs <= 0) return 0;
  const elapsed = now - previousAt;
  if (elapsed >= gapMs) return 0;
  return gapMs - elapsed;
}

function hostOf(origin: string): string {
  return new URL(origin).host;
}

function warnUnless(origin: string, needle: string, warning: string): string | undefined {
  return hostOf(origin).includes(needle) ? undefined : warning;
}

function historyWarning(origin: string): string | undefined {
  const host = hostOf(origin);
  if (host === "wax.eosrio.io") {
    return "Probe history on its own list. This host answered /v2/health on 2026-10-25 and returned 404 for get_actions.";
  }
  if (host === "wax.greymass.com" || host === "wax.cryptolions.io" || host === "api.wax.alohaeos.com") {
    return "Probe history on its own list. This host is a chain preset here, not a history preset.";
  }
  return undefined;
}

export function waxJsonUrl(input: string): { ok: true; url: string } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { ok: false, reason: "wax.json must be an https URL" };
  }
  if (url.protocol !== "https:") return { ok: false, reason: "wax.json must be https" };
  if (url.username || url.password) return { ok: false, reason: "wax.json must not include a password" };
  if (url.search || url.hash) return { ok: false, reason: "wax.json must not include a query or hash" };
  if (!url.pathname.endsWith("/wax.json")) return { ok: false, reason: "mainnet producer info is wax.json, not bp.json" };
  return { ok: true, url: url.toString() };
}

export const PRODUCER_PAGES: readonly DirectoryPage[] = [
  { title: "EOS Nation scorecard", url: "https://validate.eosnation.io/wax/producers/" },
  { title: "Validationcore API nodes", url: "https://wax.validationcore.io/reports/nodes/api" },
  { title: "WAX status, including blokcrafters", url: "https://status.wax.io/" },
  { title: "How a guild publishes wax.json", url: "https://docs.wax.io/operate/wax-bp/bp-json" },
];

type Args = {
  account?: string;
  code?: string;
  table?: string;
  limit?: number;
  ticker?: string;
  depth?: number;
};

export function buildExample(id: ExampleId, origin: string, args: Args = {}): { ok: false; reason: string } | { ok: true; request: Unsent } {
  const parsed = parseOrigin(origin);
  if (!parsed.ok) return parsed;
  const base = parsed.origin;
  const account = args.account ?? "eosio";
  if (id !== "chain-info" && id !== "light-status" && id !== "alcor-tickers" && id !== "alcor-amm-pairs" && id !== "alcor-orderbook") {
    if (!NAME.test(account)) return { ok: false, reason: "account must be an Antelope name" };
  }

  if (id === "chain-info") {
    return ok({
      method: "POST",
      url: `${base}/v1/chain/get_info`,
      body: {},
      family: "chain",
      doc: DOCS.chain,
      why: "Confirm chain_id before any other call. HTTP 200 from the wrong chain is still the wrong chain.",
    });
  }
  if (id === "chain-balance") {
    return ok({
      method: "POST",
      url: `${base}/v1/chain/get_currency_balance`,
      body: { code: "eosio.token", account, symbol: "WAX" },
      family: "chain",
      doc: DOCS.chain,
      why: "A liquid WAX balance is a chain table read. Do not ask Hyperion or Alcor for it.",
    });
  }
  if (id === "chain-account") {
    return ok({
      method: "POST",
      url: `${base}/v1/chain/get_account`,
      body: { account_name: account },
      family: "chain",
      doc: DOCS.chain,
      why: "CPU, NET, RAM, and permissions live on the account. This is not a producer health score.",
    });
  }
  if (id === "chain-table") {
    const code = args.code ?? "eosio.token";
    const table = args.table ?? "accounts";
    if (!NAME.test(code) || !NAME.test(table)) return { ok: false, reason: "code and table must be Antelope names" };
    const limit = clampLimit(args.limit ?? 20, 100);
    if (!limit.ok) return limit;
    return ok({
      method: "POST",
      url: `${base}/v1/chain/get_table_rows`,
      body: { json: true, code, scope: account, table, limit: limit.limit },
      family: "chain",
      doc: DOCS.chain,
      why: "Always send a limit. A missing limit is how a public node gets asked for a whole table.",
    });
  }
  if (id === "chain-abi") {
    const code = args.code ?? "eosio.token";
    if (!NAME.test(code)) return { ok: false, reason: "code must be an Antelope name" };
    return ok({
      method: "POST",
      url: `${base}/v1/chain/get_abi`,
      body: { account_name: code },
      family: "chain",
      doc: DOCS.chain,
      why: "Read an ABI once and cache it by account name. Do not refetch it on every review click.",
    });
  }
  if (id === "hyperion-actions") {
    const limit = clampLimit(args.limit ?? 20, 100);
    if (!limit.ok) return limit;
    const url = new URL("/v2/history/get_actions", `${base}/`);
    url.searchParams.set("account", account);
    url.searchParams.set("filter", "eosio.token:transfer");
    url.searchParams.set("limit", String(limit.limit));
    url.searchParams.set("sort", "desc");
    return ok({
      method: "GET",
      url: url.toString(),
      family: "hyperion",
      doc: DOCS.hyperion,
      why: "Action history is Hyperion. A chain host that answers get_info often does not serve this path.",
      warning: historyWarning(base),
    });
  }
  if (id === "atomic-assets") {
    const limit = clampLimit(args.limit ?? 20, 100);
    if (!limit.ok) return limit;
    const url = new URL("/atomicassets/v1/assets", `${base}/`);
    url.searchParams.set("owner", account);
    url.searchParams.set("collection_name", "pixeljourney");
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", String(limit.limit));
    return ok({
      method: "GET",
      url: url.toString(),
      family: "atomic",
      doc: DOCS.atomic,
      why: "NFT inventory is AtomicAssets. Do not scan the atomicassets contract tables for a collection.",
    });
  }
  if (id === "atomic-sales") {
    const limit = clampLimit(args.limit ?? 20, 100);
    if (!limit.ok) return limit;
    const url = new URL("/atomicmarket/v1/sales", `${base}/`);
    url.searchParams.set("seller", account);
    url.searchParams.set("state", "1");
    url.searchParams.set("symbol", "WAX");
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", String(limit.limit));
    return ok({
      method: "GET",
      url: url.toString(),
      family: "atomic",
      doc: DOCS.atomic,
      why: "AtomicMarket sales are not the Alcor spot book.",
    });
  }
  if (id === "alcor-tickers") {
    const url = new URL("/api/v2/tickers", `${base}/`);
    url.searchParams.set("hide_scam", "true");
    return ok({
      method: "GET",
      url: url.toString(),
      family: "alcor",
      doc: DOCS.alcor,
      why: "Spot tickers are Alcor's HTTP API. The WAX host is wax.alcor.exchange. A 429 means back off, not retry instantly.",
      warning: warnUnless(base, "alcor", "A guild chain RPC is the wrong host for this path."),
    });
  }
  if (id === "alcor-orderbook") {
    const ticker = (args.ticker ?? "cr-tarukofficer_wax-eosio.token").toLowerCase();
    if (!TICKER.test(ticker)) return { ok: false, reason: "ticker_id looks like wax-eosio.token_tlm-alien.worlds, lowercase" };
    const depth = clampLimit(args.depth ?? 50, 300);
    if (!depth.ok) return { ok: false, reason: depth.reason.replace("limit", "depth") };
    const url = new URL(`/api/v2/tickers/${ticker}/orderbook`, `${base}/`);
    url.searchParams.set("depth", String(depth.limit));
    return ok({
      method: "GET",
      url: url.toString(),
      family: "alcor",
      doc: DOCS.alcor,
      why: "Order book depth defaults to 300 in the Alcor docs. Ask for less unless the screen needs the whole book.",
      warning: warnUnless(base, "alcor", "A guild chain RPC is the wrong host for this path."),
    });
  }
  if (id === "alcor-amm-pairs") {
    const url = new URL("/api/v2/amm/pairs", `${base}/`);
    url.searchParams.set("hide_scam", "true");
    return ok({
      method: "GET",
      url: url.toString(),
      family: "alcor",
      doc: DOCS.alcor,
      why: "AMM pools are swap.alcor. Spot orders are alcordexmain. This path is the pool list, not a chain table.",
      warning: warnUnless(base, "alcor", "A guild chain RPC is the wrong host for this path."),
    });
  }
  if (id === "light-balances") {
    return ok({
      method: "GET",
      url: `${base}/api/balances/wax/${account}`,
      family: "light",
      doc: DOCS.light,
      why: "Light API can return every token balance in one GET. It is not action history and it is not on the chain RPC path.",
      warning: warnUnless(base, "light", "Do not prefix this path onto a chain RPC."),
    });
  }
  if (id === "light-account") {
    return ok({
      method: "GET",
      url: `${base}/api/account/wax/${account}`,
      family: "light",
      doc: DOCS.light,
      why: "One account payload: balances, resources, and auth. Still not a substitute for Hyperion.",
      warning: warnUnless(base, "light", "Do not prefix this path onto a chain RPC."),
    });
  }
  return ok({
    method: "GET",
    url: `${base}/api/status`,
    family: "light",
    doc: DOCS.light,
    why: "The Light API README says /api/status is OK or OUT_OF_SYNC, and 503 when any network it tracks is behind. That is this host, not a block producer.",
    warning: warnUnless(base, "light", "Do not prefix this path onto a chain RPC."),
  });
}

function ok(row: Omit<Unsent, "executed">): { ok: true; request: Unsent } {
  return { ok: true, request: { ...row, executed: false } };
}
