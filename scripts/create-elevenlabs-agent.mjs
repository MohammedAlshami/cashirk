/**
 * Creates a ConvAI agent via ElevenLabs API and writes ELEVENLABS_AGENT_ID to .env.local.
 * Docs: https://elevenlabs.io/docs/eleven-agents/quickstart
 *
 * Usage: npm run elevenlabs:create-agent
 *        npm run elevenlabs:create-agent -- --force   (create even if agent id already set)
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

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

function loadEnvLocal() {
  const p = path.join(root, ".env.local");
  if (!fs.existsSync(p)) return {};
  return parseEnvFile(fs.readFileSync(p, "utf8"));
}

function upsertEnvLocal(key, value) {
  const p = path.join(root, ".env.local");
  let txt = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
  const lines = txt.split(/\r?\n/);
  let found = false;
  const next = lines.map((line) => {
    const t = line.trim();
    if (t.startsWith(`${key}=`) || t.startsWith(`${key} =`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  if (!found) {
    if (next.length && next[next.length - 1] !== "") next.push("");
    next.push(`${key}=${value}`);
  }
  fs.writeFileSync(p, next.join("\n").replace(/\n+$/, "\n"));
}

/** Cloudflare Workers dev reads `.dev.vars`, not `.env.local`. Keep API route secrets in sync. */
function syncDevVarsFromEnvLocal() {
  const env = loadEnvLocal();
  const key = env.ELEVENLABS_API_KEY;
  const agentId = env.ELEVENLABS_AGENT_ID?.trim();
  if (!key || !agentId) return;
  const devVarsPath = path.join(root, ".dev.vars");
  const body = `ELEVENLABS_API_KEY=${key}\nELEVENLABS_AGENT_ID=${agentId}\n`;
  fs.writeFileSync(devVarsPath, body, "utf8");
  console.log("Updated .dev.vars (for `vite dev` / Workers local env)");
}

const force = process.argv.includes("--force");

async function main() {
  const env = loadEnvLocal();
  const apiKey = env.ELEVENLABS_API_KEY ?? process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.error("Missing ELEVENLABS_API_KEY in .env.local (or env).");
    process.exit(1);
  }

  const existingId = env.ELEVENLABS_AGENT_ID?.trim();
  if (existingId && !force) {
    console.log(
      `ELEVENLABS_AGENT_ID is already set (${existingId}). Use --force to create another agent.`,
    );
    process.exit(0);
  }

  /** Optional: override default voice (Arabic-capable multilingual voices work best). */
  const voiceId =
    env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";

  const body = {
    name: "Cashirk — Drive-thru demo",
    tags: ["cashirk", "demo"],
    conversation_config: {
      tts: {
        voice_id: voiceId,
        // Arabic / non-English agents require turbo or flash v2_5 per API validation.
        model_id: "eleven_flash_v2_5",
      },
      agent: {
        language: "ar",
        first_message: "مرحباً، أهلاً في كاشيرك. كيف أقدر أساعدك؟",
        prompt: {
          prompt: `أنت مساعد صوتي ودود لمقهى في السعودية (عرض تجريبي لتطبيق كاشيرك).
تحدث بالعربية بوضوح وباختصار.
ساعد الزائر في طلب المشروبات والطعام بهدوء واحتراف.`,
        },
      },
    },
  };

  const res = await fetch("https://api.elevenlabs.io/v1/convai/agents/create", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error("ElevenLabs API error:", res.status);
    console.error(raw);
    process.exit(1);
  }

  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    console.error("Unexpected response:", raw);
    process.exit(1);
  }

  const agentId = json.agent_id;
  if (!agentId) {
    console.error("No agent_id in response:", json);
    process.exit(1);
  }

  console.log("Created agent:", agentId);
  upsertEnvLocal("ELEVENLABS_AGENT_ID", agentId);
  upsertEnvLocal("VITE_ELEVENLABS_AGENT_ID", agentId);
  console.log("Updated .env.local → ELEVENLABS_AGENT_ID, VITE_ELEVENLABS_AGENT_ID");
  syncDevVarsFromEnvLocal();
}

await main();
