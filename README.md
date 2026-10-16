# Cashirk — Real-Time Voice Agent in the Browser

A small Next.js app that lets you **create and talk to a voice agent** in the browser using
the **ElevenLabs Agents** platform. Pick a name and a system prompt, the server creates
the agent and issues a short-lived token, and the conversation runs over WebRTC with a
live transcript and speaking/listening state.

Built for UMHackathon-style demos — no telephony code required.

## Features

- Provision a voice agent from a name + system prompt
- Live browser conversations (WebRTC, low latency)
- Short-lived tokens issued by the server
- Live transcript + on-screen listening/speaking state
- 3D visual (Three.js) for the agent
- Built on the ElevenLabs Agents platform

## Tech stack

- **Frontend:** Next.js, React 18, TypeScript, Tailwind, Three.js
- **Runtime:** Cloudflare Workers + OpenNext
- **Voice:** ElevenLabs Agents, WebRTC

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
```

Set environment variables (e.g. in `.env.local`) before running:

```ini
ELEVENLABS_API_KEY=
```

Inspect agent config with:

```bash
# (sscript removed from repo; copy agent id from config if needed)
```

## Notes

- Bring your own ElevenLabs API key (free tier keys work for dev).
- No secrets are tracked in Git.
