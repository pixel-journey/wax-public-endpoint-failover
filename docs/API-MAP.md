# Which API, and when

Public WAX hosts move. A guild that answers today can stop producing, rotate a hostname, or take a node down for a short window. A page that stores one host in the source and has no other choice goes blank. A page that calls every guild at once on load is how public endpoints get overloaded.

## One family per question

| Question | Family | Documented path | Do not use |
| --- | --- | --- | --- |
| WAX balance, account, table row, push a signed transaction | Chain API | `POST /v1/chain/...` | Hyperion, Alcor, or a full-collection table scan |
| Action history | Hyperion | `GET /v2/history/get_actions` | The old nodeos history plugin. It is not the Chain API. A chain host may not serve `/v2`. |
| NFT inventory | AtomicAssets | `GET /atomicassets/v1/assets` | `get_table_rows` across every asset |
| NFT sales | AtomicMarket | `GET /atomicmarket/v1/sales` | The Alcor spot book. They are different markets. |
| Spot ticker, pairs, order book | Alcor | `https://wax.alcor.exchange/api/v2/...` | Chain state. Alcor documents WAX, EOS, Telos, and XPR on different hosts. `https://alcor.exchange/api/...` redirects to WAX. Call the chain host. On WAX the spot contract in those docs is `alcordexmain` and the AMM contract is `swap.alcor`. |
| Is this guild healthy? | A directory, not your failover loop | EOS Nation scorecard, Validationcore, status.wax.io | `get_info` on every producer. That only says one node answered. |

Light API is a separate, smaller read API. The WAX docs point at [eosio_light_api](https://github.com/cc32d9/eosio_light_api#http-api). It is not a substitute for Hyperion when you need action history.

## Failover rules this repo tests

1. The user can reorder the list and can type a custom origin.
2. Public origins must be `https`, with no path, query, hash, or password. `http` is only allowed for `localhost` or `127.0.0.1`, so a local nodeos still works.
3. At most five origins. Walk them in order. Stop at the first success. Do not fire the rest.
4. HTTP 200 is not enough. `get_info.chain_id` must be WAX mainnet: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`. An EOS node that answers is the wrong chain.
5. Keep a separate list per family. The host that served `get_info` may not serve Hyperion or AtomicAssets.

## Blokcrafters

[status.wax.io](https://status.wax.io/) lists **blokcrafters** as one WAX mainnet public API node. Guessed hostnames (`wax.blokcrafters.io` and two variants) did not resolve on 2026-10-23, so this repo does not invent one. The current URL belongs on [Validationcore's API report](https://wax.validationcore.io/reports/nodes/api) or in that guild's `wax.json`. The file format is [documented by WAX](https://docs.wax.io/operate/wax-bp/bp-json) and specified in [eosrio/bp-info-standard](https://github.com/eosrio/bp-info-standard). The scorecard that checks API, Hyperion, Atomic, p2p, and bp.json is [validate.eosnation.io/wax/producers](https://validate.eosnation.io/wax/producers/).

WAX's own service page says public availability changes and points discovery at Validationcore: [WAX API services](https://docs.wax.io/build/wax-api-services/).

## What was called once

On 2026-10-23, `POST /v1/chain/get_info` with `{}` returned 200 and that chain id from:

- `https://wax.greymass.com`
- `https://wax.cryptolions.io`
- `https://api.wax.alohaeos.com`

`GET https://wax.alcor.exchange/api/v2/tokens/wax-eosio.token` returned 200. Those four calls are a smoke test, not a promise the hosts stay up. The Validationcore report page timed out from this session, which is itself a reason not to make one directory a single point of failure.

## Docs

- [WAX API reference](https://docs.wax.io/build/api-reference/)
- [Chain API](https://docs.wax.io/apis/chain-api.htm)
- [Hyperion v2](https://hyperion.docs.eosrio.io/api/v2/) and the [WAX Hyperion note](https://docs.wax.io/build/api-reference/hyperion-history-api)
- [AtomicAssets API](https://docs.wax.io/apis/atomic-api.htm)
- [Alcor API](https://docs.alcor.exchange/api) and [market data](https://docs.alcor.exchange/api/market-data)

## Usage examples

Concrete unsent requests, the Light API paths, the Alcor `ticker_id` shape, and the 2026-10-25 note that `/v2/health` is not `get_actions`, are in [USAGE-EXAMPLES.md](USAGE-EXAMPLES.md). The builder is `src/examples.ts`.

