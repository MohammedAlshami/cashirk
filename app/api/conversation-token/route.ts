import { NextResponse } from "next/server";

function requireApiKey(): string | null {
  const key = process.env.ELEVENLABS_API_KEY;
  return key?.trim() ? key : null;
}

function apiErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred.";
}

export async function GET(request: Request) {
  const apiKey = requireApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY. Add it to your environment." },
      { status: 500 }
    );
  }

  const agentId = new URL(request.url).searchParams.get("agentId")?.trim();
  if (!agentId) {
    return NextResponse.json(
      { error: "Missing agentId. Pass ?agentId=your-agent-id" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return NextResponse.json(
        {
          error: body || "Failed to get conversation token from ElevenLabs.",
        },
        { status: response.status }
      );
    }

    const body = (await response.json()) as { token?: string };
    if (!body.token) {
      return NextResponse.json(
        { error: "ElevenLabs token response did not include a token." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      token: body.token,
    });
  } catch (err) {
    return NextResponse.json(
      { error: apiErrorMessage(err) },
      { status: 502 }
    );
  }
}
