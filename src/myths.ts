export const FAILOVER_MYTHS = [
  {
    myth: "One public RPC is enough for production",
    reality:
      "Public endpoints go down or rate-limit. Walk a short ordered list and stop at the first healthy origin.",
  },
  {
    myth: "Any HTTPS host that answers is WAX mainnet",
    reality:
      "Check get_info.chain_id against the known WAX mainnet id before trusting balances or broadcasts.",
  },
  {
    myth: "Hyperion, Atomic, and Chain RPC are interchangeable",
    reality:
      "Different jobs need different families. See chooseApi and docs/API-MAP.md.",
  },
] as const;
