# Security — public endpoint failover

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Wrong `chain_id` | refused even if HTTP would be 200 |
| More than five origins | refused |
| `http://` public / `bp.json` | refused |
| Table limit 101 | refused (cap 100) |
| Alcor depth `NaN` | refused |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live health | Unit tests do not probe the network |
| TLS / cert pinning | Outside this lab |
| History capability | Unknown hosts only warn — still probe before production use |
| Secrets | No keys in request builders |

## Attack angles

1. Accepting a forked chain that returns 200 with a different id.  
2. Mixing Alcor and chain hosts so paths hit the wrong service.  
3. Treating unsent builders as proof a node answered.

## Honesty limits

Requests are built with `executed: false`. No standing SLA. [docs.wax.io](https://docs.wax.io/) · [POLICY.md](POLICY.md).
