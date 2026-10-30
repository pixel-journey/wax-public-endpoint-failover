"use client";

const LINKS = [
  {
    href: "https://github.com/pixel-journey/px-wax-lib",
    label: "px-wax-lib",
    why: "Shared Atomic / Hyperion / Alcor helpers",
  },
  {
    href: "https://github.com/pixel-journey/wax-account-permission-auditor",
    label: "Permission auditor",
    why: "Uses multi-RPC get_account",
  },
  {
    href: "https://github.com/pixel-journey/wax-offline-transaction-queue",
    label: "Offline transaction queue",
    why: "Optional get_info probe",
  },
  {
    href: "https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions",
    label: "Session keys",
    why: "WharfKit + chain RPC",
  },
] as const;

export function RelatedBlueprints() {
  return (
    <section style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.85 }}>
      <p style={{ letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
        Related blueprints
      </p>
      <ul style={{ paddingLeft: "1.2rem" }}>
        {LINKS.map((l) => (
          <li key={l.href} style={{ marginBottom: "0.5rem" }}>
            <a href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
            <div style={{ opacity: 0.65 }}>{l.why}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
