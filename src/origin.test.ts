import { describe, expect, it } from "vitest";
import { parseOrigin } from "./origin";

describe("origin", () => {
  it("keeps a public https host and a local http host", () => {
    expect(parseOrigin("https://wax.greymass.com/")).toEqual({ ok: true, origin: "https://wax.greymass.com" });
    expect(parseOrigin("http://127.0.0.1:8888")).toEqual({ ok: true, origin: "http://127.0.0.1:8888" });
  });

  it("refuses http on the public internet, a path, and a password", () => {
    expect(parseOrigin("http://wax.greymass.com").ok).toBe(false);
    expect(parseOrigin("https://wax.greymass.com/v1/chain").ok).toBe(false);
    expect(parseOrigin("https://user:secret@wax.greymass.com").ok).toBe(false);
  });
});
