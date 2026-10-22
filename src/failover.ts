/**
 * Walk a short list in order. Stop at the first origin the caller marked up.
 * This file does not call the network. Callers must not fan out in parallel.
 */

import { parseOrigin } from "./origin";

export const WAX_MAINNET_CHAIN_ID = "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4";

export function acceptChainInfo(body: { chain_id?: unknown }): { ok: false; reason: string } | { ok: true } {
  if (body.chain_id !== WAX_MAINNET_CHAIN_ID) return { ok: false, reason: "chain_id is not WAX mainnet" };
  return { ok: true };
}

export function firstUp(order: readonly string[], up: ReadonlySet<string>): { ok: false; reason: string } | { ok: true; origin: string; tried: number } {
  if (order.length < 1 || order.length > 5) return { ok: false, reason: "pass 1 to 5 origins" };
  const seen = new Set<string>();
  const origins: string[] = [];
  for (const raw of order) {
    const parsed = parseOrigin(raw);
    if (!parsed.ok) return parsed;
    if (seen.has(parsed.origin)) return { ok: false, reason: "origins must be unique" };
    seen.add(parsed.origin);
    origins.push(parsed.origin);
  }
  for (let i = 0; i < origins.length; i++) {
    if (up.has(origins[i])) return { ok: true, origin: origins[i], tried: i + 1 };
  }
  return { ok: false, reason: "every origin in the list was down" };
}
