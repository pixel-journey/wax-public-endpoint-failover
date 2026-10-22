"use client";

import { READING } from "./choose";
import { USE_CASES } from "./usecases";

export function Cases() {
  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.2rem 3rem", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h2>Queries, not sent</h2>
      {USE_CASES.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
          <p>
            <code>{item.request.method}</code> {item.request.url}
          </p>
        </article>
      ))}
      <h2>Where to read</h2>
      <ul>
        {READING.map((item) => (
          <li key={item.url}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
