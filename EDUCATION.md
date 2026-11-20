# Education — the next https origin, then stop

> **Rung:** `npm test` passes (16). Requests are built and not sent.  
> **The test is the rule.** The WAX mainnet chain id below matched `get_info` on `wax.greymass.com` on 2026-11-20. The same string is pinned in [wax-multi-sig-proposal-builder-and-simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator).

Official: [docs.wax.io](https://docs.wax.io/) · policy: [POLICY.md](POLICY.md).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Accept only the pinned mainnet chain id |
| Intermediate | Explain first-up, five-origin cap, waitMs boundary |
| Masterclass | Separate chain, history, and Alcor host families |

---

## Beginner — one scene

| Call | Locked result |
| --- | --- |
| `WAX_MAINNET_CHAIN_ID` | `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4` |
| `acceptChainInfo` with that id | ok |
| any other `chain_id` | not ok. HTTP 200 from the wrong chain is still the wrong chain. |
| `firstUp` of three origins, only the second marked up | origin `https://wax.cryptolions.io`, `tried` `2` |
| six origins | not ok. The list stops at five. |
| `waitMs(1000, 1200, 1000)` | `800` |
| `waitMs(1000, 2000, 1000)` | `0`. The exact boundary is ready. |

```bash
npm test
```

---

## Intermediate — shapes and families

| Call | Locked result |
| --- | --- |
| chain `get_info` example | `GET https://wax.greymass.com/v1/chain/get_info`, not executed |
| a table limit of `101` | not ok. The example cap is 100. |
| history on `wax.eosphere.io` | the actions URL contains `limit=1` and has no warning |
| a history origin that is not the known list | a warning that tells you to probe history |
| Alcor order book depth `fix` | not ok |
| an Alcor path on a chain host | a warning that the host is wrong |
| `https://guild.example/wax.json` | ok |
| `bp.json` or `http://` | not ok |

`get_info` is built. This file does not call it. Trust a body only after its `chain_id` matches the string above.

---

## Masterclass

### Common mistakes

1. Trusting HTTP 200 without checking `chain_id`.  
2. Putting more than five origins in the failover list.  
3. Calling Alcor paths on a chain RPC host.  
4. Using `http://` for public RPCs (localhost excepted in policy).  
5. Claiming a continuous uptime SLA from educational unit tests.

### Exercises

1. Wrong chain id, status 200 — accept? (No.)  
2. `waitMs` when elapsed equals timeout — remaining? (`0`.)  
3. Does this lab send `get_info`? (No.)

---

## What this course will not teach

- Live probing of every guild endpoint
- Private keys or signing
- That the first origin is always healthy in production
