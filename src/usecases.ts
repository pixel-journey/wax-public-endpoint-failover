import { firstUp } from "./failover";
import { chainInfo, jobRequest } from "./request";
import type { HttpRequest } from "./request";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: null;
};

const picked = firstUp(
  ["https://wax.greymass.com", "https://wax.cryptolions.io"],
  new Set(["https://wax.cryptolions.io"]),
);
if (!picked.ok) throw new Error(picked.reason);
const origin = picked.origin;
const tried = picked.tried;
const info = chainInfo(origin);
const ticker = jobRequest("spot-ticker", "https://wax.alcor.exchange");
if (!info.ok) throw new Error(info.reason);
if (!ticker.ok) throw new Error(ticker.reason);
const infoRequest = info.request;
const tickerRequest = ticker.request;

export const USE_CASES: UseCase[] = [
  {
    title: "The second chain origin, after the first is marked down",
    detail: `Tried ${tried}. get_info is built and not sent. A UI must still check chain_id before it trusts the body.`,
    request: infoRequest,
    transaction: null,
  },
  {
    title: "An Alcor token is not a chain call",
    detail: "wax-eosio.token on the documented Alcor host. Not sent. A guild RPC cannot replace this path.",
    request: tickerRequest,
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (origin !== "https://wax.cryptolions.io") throw new Error("failover");
  if (infoRequest.executed !== false || tickerRequest.executed !== false) throw new Error("sent");
}
