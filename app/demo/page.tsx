import { DriveThruDemoPage } from "@/components/demo/DriveThruDemoPage";

function resolveAgentId(): string {
  const server =
    typeof process !== "undefined"
      ? process.env.ELEVENLABS_AGENT_ID ?? process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID
      : undefined;
  return typeof server === "string" ? server.trim() : "";
}

/** Passed to ConvAI WebSocket `authorization` (bearer). Omit when agent is public or set ELEVENLABS_CONVAI_SKIP_AUTH=true. */
function resolveConversationTokenPath(): string {
  return "/api/conversation-token";
}

export default function DemoPage() {
  const agentId = resolveAgentId();
  const conversationTokenPath = resolveConversationTokenPath();
  return <DriveThruDemoPage agentId={agentId} conversationTokenPath={conversationTokenPath} />;
}
