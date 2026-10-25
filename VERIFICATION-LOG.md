# Verification log

**Trust label:** educational-reference  
**Updated:** 2026-10-23

| Claim | Evidence | State |
| --- | --- | --- |
| https origin rules, including a refused password | `src/origin.test.ts` | verified (unit) |
| Second origin is chosen when the first is down. A sixth origin is refused | `src/failover.test.ts` | verified (unit) |
| WAX mainnet chain id is required | `src/failover.test.ts` | verified (unit) |
| Balance is chain, history is Hyperion, a ticker doc is Alcor, producer health builds no node path | `src/choose.test.ts` | verified (unit) |
| `get_info` and the Alcor token URL are built with `executed: false` | `src/request.test.ts`, `src/usecases.test.ts` | verified (unit) |
| `POST https://wax.greymass.com/v1/chain/get_info` | HTTP 200, chain id `1064487b…a5a4` | smoke, 2026-10-23, not a promise |
| `POST https://wax.cryptolions.io/v1/chain/get_info` | HTTP 200, same chain id | smoke, 2026-10-23 |
| `POST https://api.wax.alohaeos.com/v1/chain/get_info` | HTTP 200, same chain id | smoke, 2026-10-23 |
| `GET https://wax.alcor.exchange/api/v2/tokens/wax-eosio.token` | HTTP 200 | smoke, 2026-10-23 |
| `https://status.wax.io/` | HTTP 200 | smoke, 2026-10-23. blokcrafters is a listed component, not a host stored here |
| Guessed `wax.blokcrafters.io` names | did not resolve | not an endpoint |
| `https://wax.validationcore.io/reports/nodes/api` | timed out after 20s | untested as a dependency |

## 2026-10-25 usage examples

| Claim | Evidence | State |
| --- | --- | --- |
| Table limit, Alcor ticker lowercase, Light API path, wax.json, one-second gap | `src/examples.test.ts` | verified (unit). No host is called |
| `POST https://wax.greymass.com/v1/chain/get_info` | HTTP 200, chain id `1064487b…a5a4`, head `462916620` | smoke, 2026-10-25 |
| `POST https://wax.cryptolions.io/v1/chain/get_info` | HTTP 200 | smoke, 2026-10-25 |
| `POST https://api.wax.alohaeos.com/v1/chain/get_info` | HTTP 200 | smoke, 2026-10-25 |
| `GET https://wax.alcor.exchange/api/v2/tokens/wax-eosio.token` | HTTP 200 | smoke, 2026-10-25 |
| `GET https://wax.alcor.exchange/api/v2/tickers?hide_scam=true` | HTTP 200, first `ticker_id` was lowercase `symbol-contract_symbol-contract` | smoke, 2026-10-25 |
| `GET https://wax.alcor.exchange/api/v2/tickers/cr-tarukofficer_wax-eosio.token/orderbook?depth=1` | HTTP 200, keys `ticker_id`, `bids`, `asks` | smoke, 2026-10-25. An uppercase guess of the same idea returned 404 |
| `GET https://wax.api.atomicassets.io/atomicassets/v1/assets?collection_name=pixeljourney&page=1&limit=1` | HTTP 200 | smoke, 2026-10-25 |
| `GET https://lightapi.eosamsterdam.net/api/status` | HTTP 200, body `OK` | smoke, 2026-10-25 |
| `GET https://lightapi.eosamsterdam.net/api/balances/wax/eosio` | HTTP 200, `chain.network` was `wax` | smoke, 2026-10-25 |
| `GET https://lightapi.eosamsterdam.net/api/sync/wax` | HTTP 200, body `0 OK` | smoke, 2026-10-25 |
| `https://wax.light-api.eosamsterdam.net` | did not resolve | not an endpoint |
| `https://api.light.xeos.me` | TLS certificate expired | not used |
| `GET https://wax.eosrio.io/v2/health` | HTTP 200, Hyperion 3.5.0 | smoke, 2026-10-25. This does not mean history is served |
| `GET https://wax.eosrio.io/v2/history/get_actions?account=eosio&limit=1` | HTTP 404, `Route GET:/v2/ not found` | smoke, 2026-10-25 |
| `GET https://wax.greymass.com/v2/history/get_actions?account=eosio&limit=1` | HTTP 404 | smoke, 2026-10-25. Chain preset, not history |
| `GET https://wax.cryptolions.io/v2/history/get_actions` and Aloha the same path | HTTP 403 | smoke, 2026-10-25 |
| `GET https://wax.eosphere.io/v2/history/get_actions?account=eosio&limit=1` | HTTP 200 | smoke, 2026-10-25. `get_info` on the same origin returned the WAX mainnet chain id |
| `GET https://api.waxsweden.org/v2/history/get_actions?account=eosio&limit=1` | HTTP 503 | smoke, 2026-10-25 |
