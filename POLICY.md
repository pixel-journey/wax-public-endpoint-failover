# Policy — public endpoint failover

**Trust label:** `educational-reference`  
**Updated:** 2026-10-30

## In scope

- Pure origin parse (https; http only on localhost)
- Failover list ≤5; first “up” origin wins
- Chain-id gate before trusting a chain RPC origin (WAX mainnet)
- Job → API family mapping (Chain, Hyperion, Atomic, Alcor, Light API, directories)
- Unsent request shapes for education (`executed: false`)

## Out of scope

- The demo page does **not** call remote hosts by default
- No standing uptime SLA for third-party RPCs
- No private keys, signing, or wallet plugins

## Rules

- Unit tests never require network
- Smokes in VERIFICATION-LOG are historical, not a continuous claim
