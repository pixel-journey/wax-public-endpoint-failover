# Security — public endpoint failover

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Wrong `chain_id` | refused even if HTTP would be 200 |
| More than **five** origins | refused |
| `http://` public / `bp.json` | refused |
| Table limit 101 | refused (cap **100**) |
| Alcor depth `NaN` | refused |
| Alcor path on chain host | warning (wrong family) |
| Pinned mainnet id | `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4` |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live health | Unit tests do not probe the network |
| TLS / cert pinning | Outside this lab |
| History capability | Unknown hosts only warn — still probe before production use |
| Secrets | No keys in request builders |
| Continuous SLA | Educational only — no uptime guarantee |

## Attack angles

1. Accepting a forked chain that returns 200 with a different id.  
2. Mixing Alcor and chain hosts so paths hit the wrong service.  
3. Treating unsent builders (`executed: false`) as proof a node answered.  
4. Shipping more than five failover origins without a priority policy.  
5. Using plain `http://` for public RPCs (localhost excepted in policy).

## Honesty limits

Requests are built with `executed: false`. No standing SLA.

| Sibling | Distinction |
| --- | --- |
| [msig simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) | Same pinned mainnet chain id |
| [offline queue](https://github.com/pixel-journey/wax-offline-transaction-queue) | FIFO local queue, not RPC |

[docs.wax.io](https://docs.wax.io/) · [POLICY.md](POLICY.md) · [WharfKit](https://wharfkit.com/).
