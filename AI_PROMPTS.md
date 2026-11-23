# AI handoff — public endpoint failover

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Network API context |
| [msig simulator](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) | Same pinned mainnet chain id |
| [@wharfkit/session](https://www.npmjs.com/package/@wharfkit/session) | Host that later hits nodes |

## Non-negotiables

1. WAX mainnet chain id: `1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4`.
2. Failover list ≤ **5**; first origin marked up wins.
3. `waitMs`: remaining time floors at 0 at the exact boundary.
4. Public origins must be **https**; `bp.json` refused.
5. Builders are **unsent** (`executed: false`). Trust a body only after `chain_id` matches.
6. Chain-id pin is WAX-shaped here; other chains need their own id. Failover *pattern* ports.

## Prompt seeds

- "List ≤5 https origins; first up wins."
- "Response chain_id mismatch — trust the body?"
- "Refuse bp.json as a public origin."
- "Wire SessionKit to the winning origin without broadcasting in tests."

## Do not

- Accept http public origins.
- Trust get_info without chain_id match.
- Auto-execute builders from the failover list.
