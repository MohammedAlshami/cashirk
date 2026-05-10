"use client";

import { useConversation, useConversationClientTool } from "@elevenlabs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AgentState } from "@/components/demo/Orb";
import { DEMO_MENU, type OrderLine, type TranscriptLine } from "@/lib/demo-menu";
import { useVoiceTools } from "@/hooks/voiceTools";
export function useDriveThruVoiceDemo(agentId: string, tokenEndpoint: string) {
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [previewLine, setPreviewLine] = useState<OrderLine | null>(null);
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const timerRef = useRef<number | null>(null);
  const stopRequestedRef = useRef(false);
  const endSessionRef = useRef<(() => void | Promise<void>) | null>(null);
  const nextLineId = useRef(0);

  const { addMenuItem, preaddMenuItem, clearOrder, completeOrder } = useVoiceTools(
    setOrderItems,
    setPreviewLine,
    setOrderFinalized,
    endSessionRef,
  );

  useConversationClientTool("get_menu_context", () =>
    JSON.stringify({
      menu: DEMO_MENU.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
      current_order: orderItems,
    }),
  );

  useConversationClientTool("preadd_menu_item", preaddMenuItem);
  useConversationClientTool("add_menu_item", addMenuItem);
  useConversationClientTool("clear_order", clearOrder);
  useConversationClientTool("complete_order", completeOrder);

  const conversation = useConversation({
    onMessage: (message) => {
      const text = String((message as any).message ?? "").trim();
      if (!text) return;

      setTranscriptLines((prev) => {
        const last = prev[prev.length - 1];
        if (last?.text === text) return prev;
        nextLineId.current += 1;
        return [...prev, { id: `m-${nextLineId.current}`, text }];
      });
    },
    onConnect: () => {
      setSecondsRemaining(120);
    },
    onDisconnect: () => {
      setSecondsRemaining(0);
    },
    onError: (error) => {
      setVoiceHint(error instanceof Error ? error.message : String(error));
    },
  });

  const { startSession, endSession, getInputVolume, getOutputVolume, status, mode } = conversation;

  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);

  const agentState = useMemo((): AgentState => {
    if (status === "connecting") return "thinking";
    if (status !== "connected") return null;
    return mode === "speaking" ? "talking" : "listening";
  }, [mode, status]);

  const handleOrbClick = useCallback(async () => {
    if (status === "connecting" || status === "connected") {
      await endSession();
      return;
    }

    try {
      const res = await fetch(`${tokenEndpoint}?agentId=${agentId}`);
      const data = await res.json();
      const token = data?.signed_url || data?.token;

      await startSession({ conversationToken: token });
    } catch (err) {
      setVoiceHint(String(err));
    }
  }, [agentId, endSession, startSession, status, tokenEndpoint]);

  const orderTotal = useMemo(
    () => orderItems.reduce((sum, line) => sum + line.price * line.qty, 0),
    [orderItems],
  );

  return {
    agentState,
    handleOrbClick,
    status,
    getInputVolume,
    getOutputVolume,
    orderItems,
    previewLine,
    orderFinalized,
    orderTotal,
    secondsRemaining,
    transcriptLines,
  };
}