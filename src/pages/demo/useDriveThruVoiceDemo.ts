"use client";

import { useConversation } from "@elevenlabs/react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { AgentState } from "@/components/demo/Orb";

const SESSION_LIMIT_MS = 30_000;

export function useDriveThruVoiceDemo() {
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endSessionRef = useRef<(() => void) | null>(null);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimerRef.current !== null) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  const { startSession, endSession, status, mode, getInputVolume, getOutputVolume } =
    useConversation({
      onConnect: () => {
        clearSessionTimer();
        sessionTimerRef.current = window.setTimeout(() => {
          endSessionRef.current?.();
          sessionTimerRef.current = null;
        }, SESSION_LIMIT_MS);
      },
      onDisconnect: () => {
        clearSessionTimer();
      },
    });

  endSessionRef.current = endSession;

  const agentState = useMemo((): AgentState => {
    if (status === "connecting") return "thinking";
    if (status !== "connected") return null;
    return mode === "speaking" ? "talking" : "listening";
  }, [status, mode]);

  const [voiceHint, setVoiceHint] = useState<string | null>(null);

  const handleOrbClick = useCallback(async () => {
    if (status === "connecting" || status === "connected") return;

    setVoiceHint(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceHint("يلزم السماح بالميكروفون للتحدث مع الوكيل.");
      return;
    }

    let token: string | undefined;
    try {
      const res = await fetch("/api/elevenlabs/conversation-token");
      if (res.ok) {
        const data = (await res.json()) as { token?: string };
        token = data.token;
      }
    } catch {
      /* fall through — may use public agent id */
    }

    const viteAgentId =
      typeof import.meta.env.VITE_ELEVENLABS_AGENT_ID === "string" &&
      import.meta.env.VITE_ELEVENLABS_AGENT_ID.length > 0
        ? import.meta.env.VITE_ELEVENLABS_AGENT_ID
        : undefined;

    const arabic = {
      overrides: {
        agent: {
          language: "ar" as const,
        },
      },
    };

    if (token) {
      startSession({
        conversationToken: token,
        ...arabic,
      });
      return;
    }

    if (viteAgentId) {
      startSession({
        agentId: viteAgentId,
        ...arabic,
      });
      return;
    }

    setVoiceHint(
      "أضِف ELEVENLABS_API_KEY و ELEVENLABS_AGENT_ID في .env.local أو عيّن VITE_ELEVENLABS_AGENT_ID لوكيل عام.",
    );
  }, [startSession, status]);

  return {
    agentState,
    handleOrbClick,
    voiceHint,
    status,
    getInputVolume,
    getOutputVolume,
  };
}
