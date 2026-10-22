"use client";

import { useState } from "react";
import { chooseApi, type Job } from "./choose";
import { firstUp } from "./failover";
import { parseOrigin } from "./origin";

const PRESETS = ["https://wax.greymass.com", "https://wax.cryptolions.io", "https://api.wax.alohaeos.com"];
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
      <p className="kicker">Educational reference</p>
      <h1>Which WAX API, and the next endpoint</h1>
      <p className="lede">
        Walk at most five https origins, in order, and stop at the first one you marked up. Then check the body's chain id
        before you trust it. This page does not call them.
      </p>
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
    </main>
  );
}
