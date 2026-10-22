/**
 * Which public API answers which question.
 * Paths are the documented ones. This file does not call them.
 */

export type Job = "balance" | "account" | "history" | "nft" | "sale" | "spot-ticker" | "producer-health";

export type Choice = {
  family: "chain" | "hyperion" | "atomic" | "alcor" | "directory";
  method: "GET" | "POST" | "NONE";
  path: string;
  doc: string;
  not: string;
};

export function chooseApi(job: Job): Choice {
  switch (job) {
    case "balance":
      return { family: "chain", method: "POST", path: "/v1/chain/get_currency_balance", doc: "https://docs.wax.io/apis/chain-api.htm", not: "Not Hyperion, not Alcor, and not a table scan." };
    case "account":
      return { family: "chain", method: "POST", path: "/v1/chain/get_account", doc: "https://docs.wax.io/apis/chain-api.htm", not: "Not a block producer score. get_info only proves this node answered." };
    case "history":
      return { family: "hyperion", method: "GET", path: "/v2/history/get_actions", doc: "https://hyperion.docs.eosrio.io/api/v2/", not: "Not the removed nodeos history plugin. A chain RPC host may not serve this path." };
    case "nft":
      return { family: "atomic", method: "GET", path: "/atomicassets/v1/assets", doc: "https://docs.wax.io/apis/atomic-api.htm", not: "Not get_table_rows over a whole collection, and not an Alcor ticker." };
    case "sale":
      return { family: "atomic", method: "GET", path: "/atomicmarket/v1/sales", doc: "https://docs.wax.io/apis/atomic-api.htm", not: "Not the Alcor spot book. AtomicMarket and Alcor are different markets." };
    case "spot-ticker":
      return { family: "alcor", method: "GET", path: "/api/v2/tickers", doc: "https://docs.alcor.exchange/api", not: "Not chain state. wax.alcor.exchange is the documented WAX host. A redirect from alcor.exchange is not a second API." };
    case "producer-health":
      return { family: "directory", method: "NONE", path: "", doc: "https://validate.eosnation.io/wax/producers/", not: "Not a loop over every guild. Blokcrafters is a name on the WAX status page, not a host this repo guessed." };
  }
}

export const READING = [
  { title: "WAX API reference", url: "https://docs.wax.io/build/api-reference/" },
  { title: "Chain API", url: "https://docs.wax.io/apis/chain-api.htm" },
  { title: "Hyperion v2", url: "https://hyperion.docs.eosrio.io/api/v2/" },
  { title: "WAX note on Hyperion", url: "https://docs.wax.io/build/api-reference/hyperion-history-api" },
  { title: "AtomicAssets and AtomicMarket", url: "https://docs.wax.io/apis/atomic-api.htm" },
  { title: "Light API", url: "https://github.com/cc32d9/eosio_light_api#http-api" },
  { title: "Alcor API", url: "https://docs.alcor.exchange/api" },
  { title: "Alcor market data", url: "https://docs.alcor.exchange/api/market-data" },
  { title: "Public endpoint discovery", url: "https://docs.wax.io/build/wax-api-services/" },
  { title: "Validationcore API report", url: "https://wax.validationcore.io/reports/nodes/api" },
  { title: "EOS Nation bp.json scorecard", url: "https://validate.eosnation.io/wax/producers/" },
  { title: "bp.json", url: "https://docs.wax.io/operate/wax-bp/bp-json" },
  { title: "bp.json standard", url: "https://github.com/eosrio/bp-info-standard" },
  { title: "WAX status, including blokcrafters", url: "https://status.wax.io/" },
] as const;
