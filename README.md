# wax-public-endpoint-failover

> **Trust label:** `educational-reference`  
> **Status:** Core complete · education pass 2026-10-30

Which WAX API to call, and how a UI fails over to the next https endpoint.

Walk at most five https origins, in order, and stop at the first one marked up. A custom origin is allowed. `get_info.chain_id` must be WAX mainnet before that origin is trusted. The demo page does not call hosts by default.

```bash
npm test && npm run dev
```

[POLICY.md](./POLICY.md) · [docs/API-MAP.md](docs/API-MAP.md) · [docs/USAGE-EXAMPLES.md](docs/USAGE-EXAMPLES.md)

MIT — Pixel Journey
