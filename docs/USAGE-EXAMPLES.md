# Usage examples

These are the requests `src/examples.ts` builds. The tests assert the URL and set `executed: false`. They do not send them. A smoke on 2026-10-25 is in `VERIFICATION-LOG.md`. A host that answered that day can be down tomorrow. The UI should keep a short list the user can reorder, plus a custom origin.

WAX mainnet `chain_id` is `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`.

## When to use which

| You need | Call this | Do not |
| --- | --- | --- |
| Prove the node is WAX | `POST /v1/chain/get_info` | Trust the hostname |
| WAX balance | `POST /v1/chain/get_currency_balance` | Hyperion or Alcor |
| CPU, NET, RAM, keys | `POST /v1/chain/get_account` | A producer scorecard |
| A few rows of one table | `POST /v1/chain/get_table_rows` with `limit` | Omit `limit` |
| Action names, once | `POST /v1/chain/get_abi`, then cache | Refetch on every click |
| Transfer history | `GET /v2/history/get_actions` on a **history** host | Assume the chain host serves `/v2` |
| NFTs | `GET /atomicassets/v1/assets` | `get_table_rows` on `atomicassets` |
| NFT sales | `GET /atomicmarket/v1/sales` | The Alcor book |
| Spot markets | `GET https://wax.alcor.exchange/api/v2/tickers` | A guild RPC |
| One order book | `GET /api/v2/tickers/<ticker_id>/orderbook?depth=` | Depth 300 on a timer |
| AMM pools | `GET /api/v2/amm/pairs` | `alcordexmain` tables for pool math. Spot is `alcordexmain`. Pools are `swap.alcor` |
| All token balances in one read | Light API `GET /api/balances/wax/<account>` | Pretend it is history |
| Is this guild up? | EOS Nation, Validationcore, status.wax.io, that guild's `wax.json` | `get_info` on every producer |

Docs: [Chain API](https://docs.wax.io/apis/chain-api.htm), [Hyperion v2](https://hyperion.docs.eosrio.io/api/v2/), [Atomic](https://docs.wax.io/apis/atomic-api.htm), [Alcor market data](https://docs.alcor.exchange/api/market-data), [Light API](https://github.com/cc32d9/eosio_light_api#http-api), [WAX API reference](https://docs.wax.io/build/api-reference/) (this is where Light API is listed next to Chain, Atomic, and Hyperion).

## Chain

```http
POST https://wax.greymass.com/v1/chain/get_info
{}
```

```http
POST https://wax.greymass.com/v1/chain/get_currency_balance
{"code":"eosio.token","account":"eosio","symbol":"WAX"}
```

```http
POST https://wax.greymass.com/v1/chain/get_table_rows
{"json":true,"code":"eosio.token","scope":"eosio","table":"accounts","limit":20}
```

`limit` above 100 is refused by the example builder. One in-flight call per family. If the last one was 200 ms ago and the gap is 1 s, wait the other 800 ms. If it fails, try the next origin in that family's list. Do not wake the other families.

## Hyperion

On 2026-10-25 `https://wax.eosrio.io/v2/health` returned 200 and `GET /v2/history/get_actions` on that same host returned 404. Greymass returned 404 for history. Cryptolions and Aloha returned 403. `https://wax.eosphere.io/v2/history/get_actions?account=eosio&limit=1` returned 200, and `get_info` on that origin was WAX mainnet.

Keep a history list that is not the chain list. A custom history origin is allowed. Check `chain_id` on that origin before you trust the actions.

```http
GET https://wax.eosphere.io/v2/history/get_actions?account=eosio&filter=eosio.token:transfer&limit=20&sort=desc
```

## AtomicAssets and AtomicMarket

The catalog's recorded Atomic host is not a chain RPC.

```http
GET https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=eosio&collection_name=pixeljourney&page=1&limit=20
```

```http
GET https://wax.api.atomicassets.io/atomicmarket/v1/sales?seller=eosio&state=1&symbol=WAX&page=1&limit=20
```

Page forward. Do not raise `limit` to pull a collection.

## Alcor

Base URL on WAX: `https://wax.alcor.exchange/api/`. `https://alcor.exchange/api/` redirects to WAX, so call the chain host. HTTP 429 means you are over the per-IP limit. Wait. Do not fan out.

`ticker_id` is lowercase `symbol-contract_symbol-contract`. An uppercase guess 404'd. This one returned 200:

```http
GET https://wax.alcor.exchange/api/v2/tickers?hide_scam=true
GET https://wax.alcor.exchange/api/v2/tickers/cr-tarukofficer_wax-eosio.token/orderbook?depth=1
GET https://wax.alcor.exchange/api/v2/amm/pairs?hide_scam=true
```

The documented default depth is 300. The example default is 50. Depth above 300 is refused here.

Placing an order is not this API. It is a signed transaction to `alcordexmain` (spot) or `swap.alcor` (AMM), sent to a chain node.

## Light API

WAX docs describe Light API as a lighter read API and point at [eosio_light_api](https://github.com/cc32d9/eosio_light_api#http-api). It is not one universal standard. Paths from that README, with `CHAIN` set to `wax`:

```http
GET https://lightapi.eosamsterdam.net/api/status
GET https://lightapi.eosamsterdam.net/api/balances/wax/eosio
GET https://lightapi.eosamsterdam.net/api/account/wax/eosio
GET https://lightapi.eosamsterdam.net/api/sync/wax
```

`/api/status` is `OK`, or `OUT_OF_SYNC` with HTTP 503, for that Light API process. It is not a block producer score. `https://wax.light-api.eosamsterdam.net` did not resolve. `https://api.light.xeos.me` had an expired certificate and is not a preset.

## Producer health

Do not loop `get_info` across the producer schedule.

- [EOS Nation scorecard](https://validate.eosnation.io/wax/producers/) checks API, Hyperion, Atomic, p2p, and the info file.
- [Validationcore API report](https://wax.validationcore.io/reports/nodes/api). It timed out on 2026-10-23. Treat it as a directory, not a dependency of the page.
- [status.wax.io](https://status.wax.io/) lists blokcrafters as a component. Guessed `wax.blokcrafters.io` names did not resolve, so none is stored.
- A guild publishes `https://<their-site>/wax.json` for mainnet, not `bp.json`. The example builder accepts only `https` URLs whose path ends in `/wax.json`. Format: [WAX bp.json](https://docs.wax.io/operate/wax-bp/bp-json) and [eosrio/bp-info-standard](https://github.com/eosrio/bp-info-standard).

## Custom origin

Public `https` only, no userinfo, path, query, or hash. `http` is only for localhost. At most five origins in a list. Stop at the first success. A user-typed origin is how a page survives a guild rotating or leaving the schedule.
