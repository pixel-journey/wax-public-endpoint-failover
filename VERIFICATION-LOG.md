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
