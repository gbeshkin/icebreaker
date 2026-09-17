import { env } from "cloudflare:workers";

export function getDatabase() {
  if (!env.DB) throw new Error("The shared gallery is temporarily unavailable.");
  return env.DB;
}
