/**
 * One unsent request on an origin the caller already chose.
 */

import { chooseApi, type Job } from "./choose";
import { parseOrigin } from "./origin";

export type HttpRequest = { method: "GET" | "POST"; url: string; body?: Record<string, unknown>; executed: false };

const NAME = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z1-5.]{1,12}$/;

export function chainInfo(origin: string): { ok: false; reason: string } | { ok: true; request: HttpRequest } {
  const parsed = parseOrigin(origin);
  if (!parsed.ok) return parsed;
  return { ok: true, request: { method: "POST", url: `${parsed.origin}/v1/chain/get_info`, body: {}, executed: false } };
}

export function jobRequest(job: Exclude<Job, "producer-health">, origin: string, account = "alice"): { ok: false; reason: string } | { ok: true; request: HttpRequest } {
  const parsed = parseOrigin(origin);
  if (!parsed.ok) return parsed;
  if (!NAME.test(account)) return { ok: false, reason: "account must be an Antelope name" };
  const choice = chooseApi(job);
  if (choice.method === "NONE") return { ok: false, reason: "this job does not build a node request" };
  if (job === "balance") {
    return { ok: true, request: { method: "POST", url: `${parsed.origin}${choice.path}`, body: { code: "eosio.token", account, symbol: "WAX" }, executed: false } };
  }
  if (job === "account") {
    return { ok: true, request: { method: "POST", url: `${parsed.origin}${choice.path}`, body: { account_name: account }, executed: false } };
  }
  if (job === "history") {
    const url = new URL(choice.path, `${parsed.origin}/`);
    url.searchParams.set("account", account);
    url.searchParams.set("filter", "eosio.token:transfer");
    url.searchParams.set("limit", "20");
    url.searchParams.set("sort", "desc");
    return { ok: true, request: { method: "GET", url: url.toString(), executed: false } };
  }
  if (job === "nft") {
    const url = new URL(choice.path, `${parsed.origin}/`);
    url.searchParams.set("owner", account);
    url.searchParams.set("collection_name", "pixeljourney");
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "20");
    return { ok: true, request: { method: "GET", url: url.toString(), executed: false } };
  }
  if (job === "sale") {
    const url = new URL(choice.path, `${parsed.origin}/`);
    url.searchParams.set("seller", account);
    url.searchParams.set("state", "1");
    url.searchParams.set("symbol", "WAX");
    url.searchParams.set("page", "1");
    url.searchParams.set("limit", "20");
    return { ok: true, request: { method: "GET", url: url.toString(), executed: false } };
  }
  return { ok: true, request: { method: "GET", url: `${parsed.origin}/api/v2/tokens/wax-eosio.token`, executed: false } };
}
