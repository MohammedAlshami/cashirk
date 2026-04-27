import { createFileRoute } from "@tanstack/react-router";

function getEnv(name: string): string | undefined {
  try {
    return typeof process !== "undefined" ? process.env[name] : undefined;
  } catch {
    return undefined;
  }
}

export const Route = createFileRoute("/api/elevenlabs/conversation-token")({
  server: {
    handlers: {
      GET: async () => {
        const apiKey = getEnv("ELEVENLABS_API_KEY");
        const agentId = getEnv("ELEVENLABS_AGENT_ID");

        if (!apiKey || !agentId) {
          return Response.json(
            {
              error: "Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID on the server.",
            },
            { status: 503 },
          );
        }

        const url = `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`;

        const upstream = await fetch(url, {
          method: "GET",
          headers: {
            "xi-api-key": apiKey,
          },
        });

        if (!upstream.ok) {
          const text = await upstream.text();
          console.error("ElevenLabs conversation token error:", upstream.status, text);
          return Response.json(
            { error: "Failed to fetch conversation token from ElevenLabs." },
            { status: 502 },
          );
        }

        const body = (await upstream.json()) as { token?: string };
        if (!body.token) {
          return Response.json({ error: "Invalid token response." }, { status: 502 });
        }

        return Response.json({ token: body.token });
      },
    },
  },
});