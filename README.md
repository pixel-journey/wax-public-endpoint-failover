# Which WAX API, and the next endpoint

**Trust label:** `educational-reference`  
**Catalog:** [wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

Walk at most five https origins, in order, and stop at the first one marked up. A custom origin is allowed. `get_info.chain_id` must be WAX mainnet before that origin is trusted. The page does not call a host.

The longer map of Chain, Hyperion, AtomicAssets, AtomicMarket, Alcor, Light API, and block-producer directories is [docs/API-MAP.md](docs/API-MAP.md).

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `src/origin.ts` | https origin, or http only on localhost. No password, no path |
| `src/failover.ts` | First success in a list of at most five. Chain id check |
| `src/choose.ts` | Which family answers which question, with the doc URL |
| `src/request.ts` | The matching HTTP request, `executed: false` |
| `src/examples.ts` | Unsent usage examples: table rows, ABI, Hyperion, Atomic, Alcor book, Light API, wax.json |
| `src/Demo.tsx` | Presets, a custom field, a simulated down host, and the example URLs |
| `docs/API-MAP.md` | When to use each API, and where the docs are |
| `docs/USAGE-EXAMPLES.md` | The same requests, written out, including what not to call |

`npm test` runs the rules. `npm run dev` opens the page.

## Queries

The unit tests do not call a host. Smokes on 2026-10-23 and 2026-10-25 are written in `VERIFICATION-LOG.md` and are not a standing claim that those hosts answer.
