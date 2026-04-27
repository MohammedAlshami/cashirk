/**
 * Copies ELEVENLABS_* from `.env.local` → `.dev.vars`.
 * Cloudflare Workers (local dev) reads `.dev.vars`; Vite does not inject `.env.local` into the Worker.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseEnvFile(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

const envPath = path.join(root, ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local");
  process.exit(1);
}

const env = parseEnvFile(fs.readFileSync(envPath, "utf8"));
const key = env.ELEVENLABS_API_KEY;
const agentId = env.ELEVENLABS_AGENT_ID?.trim();

if (!key || !agentId) {
  console.error("Need ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID in .env.local");
  process.exit(1);
}

fs.writeFileSync(
  path.join(root, ".dev.vars"),
  `ELEVENLABS_API_KEY=${key}\nELEVENLABS_AGENT_ID=${agentId}\n`,
);
console.log("Wrote .dev.vars from .env.local");
