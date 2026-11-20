# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Network API context |
| [POLICY.md](POLICY.md) | In / out of scope |
| [msig simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) | Same pinned mainnet chain id |

## Product facts locked by tests

- WAX mainnet chain id: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4` (checked against `wax.greymass.com` `get_info` on 2026-11-20).
- Failover list ≤ **5**; first origin marked up wins.
- `waitMs`: remaining time floors at 0 at the exact boundary.
- Example table limit cap **100**.
- Public origins must be **https**; `bp.json` refused.
- Builders are **unsent** (`executed: false`). Trust a body only after `chain_id` matches.
