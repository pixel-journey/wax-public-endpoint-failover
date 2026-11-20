# Education — the next https origin, then stop

> **Rung:** `npm test` passes (16). Requests are built and not sent.  
> **The test is the rule.** The WAX mainnet chain id below matched `get_info` on `wax.greymass.com` on 2026-11-20. The same string is pinned in [wax-multi-sig-proposal-builder-and-simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator).

## Predict, then run

| Call | Locked result |
| --- | --- |
| `WAX_MAINNET_CHAIN_ID` | `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4` |
| `acceptChainInfo` with that id | ok |
| any other `chain_id` | not ok. HTTP 200 from the wrong chain is still the wrong chain. |
| `firstUp` of three origins, only the second marked up | origin `https://wax.cryptolions.io`, `tried` `2` |
| six origins | not ok. The list stops at five. |
| `waitMs(1000, 1200, 1000)` | `800` |
| `waitMs(1000, 2000, 1000)` | `0`. The exact boundary is ready. |
| chain `get_info` example | `GET https://wax.greymass.com/v1/chain/get_info`, not executed |
| a table limit of `101` | not ok. The example cap is 100. |
| history on `wax.eosphere.io` | the actions URL contains `limit=1` and has no warning |
| a history origin that is not the known list | a warning that tells you to probe history |
| Alcor order book depth `301` | not ok |
| an Alcor path on a chain host | a warning that the host is wrong |
| `https://guild.example/wax.json` | ok |
| `bp.json` or `http://` | not ok |

`get_info` is built. This file does not call it. Trust a body only after its `chain_id` matches the string above.
