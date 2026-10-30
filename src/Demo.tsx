"use client";

import { useState } from "react";
import { RelatedBlueprints } from "./RelatedBlueprints";
import { chooseApi, type Job } from "./choose";
import { buildExample, PRODUCER_PAGES, type ExampleId, waitMs } from "./examples";
import { firstUp } from "./failover";
import { FAILOVER_MYTHS } from "./myths";
import { parseOrigin } from "./origin";

const PRESETS = ["https://wax.greymass.com", "https://wax.cryptolions.io", "https://api.wax.alohaeos.com"];
const SAMPLES: { id: ExampleId; origin: string; ticker?: string }[] = [
  { id: "chain-balance", origin: "https://wax.greymass.com" },
  { id: "hyperion-actions", origin: "https://wax.eosphere.io" },
  { id: "atomic-assets", origin: "https://wax.api.atomicassets.io" },
  { id: "alcor-orderbook", origin: "https://wax.alcor.exchange", ticker: "cr-tarukofficer_wax-eosio.token" },
  { id: "light-balances", origin: "https://lightapi.eosamsterdam.net" },
];
const JOBS: Job[] = ["balance", "account", "history", "nft", "sale", "spot-ticker", "producer-health"];

export function Demo() {
  const [custom, setCustom] = useState("");
  const [down, setDown] = useState(0);
  const [job, setJob] = useState<Job>("balance");
  const parsed = custom.trim() ? parseOrigin(custom) : null;
  const order = parsed && parsed.ok ? [...PRESETS, parsed.origin] : PRESETS;
  const up = new Set(order.filter((_, index) => index !== down));
  const picked = firstUp(order, up);
  const choice = chooseApi(job);

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>Which WAX API, and the next endpoint</h1>
      <p className="lede">
        Walk at most five https origins, in order, and stop at the first one you marked up. Then check the body's chain id
        before you trust it. This page does not call them.
      </p>

      <section style={{ marginBottom: "1.5rem", padding: "1rem", border: "1px solid #a855f744", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Myths vs reality</h2>
        {FAILOVER_MYTHS.map((m) => (
          <div key={m.myth} style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>
              <strong>Myth:</strong> {m.myth}
            </p>
            <p style={{ margin: "0.25rem 0 0" }}>
              <strong>Reality:</strong> {m.reality}
            </p>
          </div>
        ))}
      </section>

      <label>
        Custom origin
        <input value={custom} onChange={(event) => setCustom(event.target.value)} placeholder="https://your-node.example" style={{ display: "block", width: "100%", margin: "0.4rem 0 1rem" }} />
      </label>
      {parsed && !parsed.ok ? <p>{parsed.reason}</p> : null}
      <p>Marked down: preset {down + 1}. The list is not tried all at once.</p>
      <p>
        {PRESETS.map((origin, index) => (
          <button key={origin} type="button" onClick={() => setDown(index)} style={{ marginRight: "0.5rem" }}>
            {index === down ? "down" : "up"} {origin.replace("https://", "")}
          </button>
        ))}
      </p>
      {picked.ok ? <p>Use {picked.origin}. Tried {picked.tried}.</p> : <p>{picked.reason}</p>}
      <label>
        Job
        <select value={job} onChange={(event) => setJob(event.target.value as Job)} style={{ display: "block", margin: "0.4rem 0 1rem" }}>
          {JOBS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <p>
        {choice.family}. {choice.method === "NONE" ? "No node path." : `${choice.method} ${choice.path}`} {choice.not}
      </p>
      <p>
        <a href={choice.doc}>Documentation for this job</a>
      </p>
      <h2>Unsent examples</h2>
      <p>Same shapes as the tests. Nothing here is fetched. If the last call in a family was 200 ms ago, wait {waitMs(0, 200)} ms.</p>
      <ul>
        {SAMPLES.map((sample) => {
          const built = buildExample(sample.id, sample.origin, { account: "eosio", ticker: sample.ticker, depth: 1, limit: 1 });
          return (
            <li key={sample.id}>
              {built.ok ? (
                <>
                  <code>{built.request.method}</code> {built.request.url}
                  {built.request.warning ? <span> — {built.request.warning}</span> : null}
                </>
              ) : (
                built.reason
              )}
            </li>
          );
        })}
      </ul>
      <h2>Producer health is a directory</h2>
      <ul>
        {PRODUCER_PAGES.map((page) => (
          <li key={page.url}>
            <a href={page.url}>{page.title}</a>
          </li>
        ))}
      </ul>

      <RelatedBlueprints />
    </main>
  );
}
