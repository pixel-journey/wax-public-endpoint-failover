/**
 * An origin a user typed, or one this repo lists as an example.
 * This file does not call the network.
 */

const LOCAL = new Set(["localhost", "127.0.0.1"]);

export function parseOrigin(input: string): { ok: false; reason: string } | { ok: true; origin: string } {
  const text = input.trim();
  if (text.length < 1 || text.length > 120) return { ok: false, reason: "origin must be 1 to 120 characters" };
  if (text.includes("@")) return { ok: false, reason: "credentials in the origin are refused" };
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return { ok: false, reason: "origin must be a URL" };
  }
  const local = LOCAL.has(url.hostname);
  if (url.protocol === "http:" && !local) return { ok: false, reason: "public origins must be https" };
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) return { ok: false, reason: "protocol must be https, or http on localhost" };
  if (url.username || url.password) return { ok: false, reason: "credentials in the origin are refused" };
  if (url.search || url.hash) return { ok: false, reason: "origin must not have a query or a hash" };
  if (url.pathname !== "/" && url.pathname !== "") return { ok: false, reason: "origin must not have a path" };
  if (!url.hostname) return { ok: false, reason: "origin needs a host" };
  const port = url.port ? `:${url.port}` : "";
  return { ok: true, origin: `${url.protocol}//${url.hostname.toLowerCase()}${port}` };
}
