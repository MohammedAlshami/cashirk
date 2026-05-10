"use client";

import { useConversation, useConversationClientTool } from "@elevenlabs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AgentState } from "@/components/demo/Orb";
import {
  DEMO_MENU,
  formatModifiersAr,
  type MenuModifierHints,
  type OrderLine,
  type TranscriptLine,
} from "@/lib/demo-menu";

export type { OrderLine, TranscriptLine } from "@/lib/demo-menu";

type ConversationTokenResponse = {
  token?: string;
  signed_url?: string;
  error?: string;
};

type SimulationToolCall = {
  requestId?: string;
  toolName?: string;
  paramsAsJson?: string;
  toolHasBeenCalled?: boolean;
};

type SimulationTurn = {
  role?: string;
  message?: string | null;
  toolCalls?: SimulationToolCall[];
  toolResults?: Array<{ requestId?: string; toolName?: string; resultValue?: string }>;
};

type SimulationResponse = {
  simulatedConversation?: SimulationTurn[];
  analysis?: unknown;
};

type StreamingSimulationResponse = {
  simulatedConversation?: SimulationTurn[] | null;
  analysis?: unknown | null;
};

function parseModifierHints(params: Record<string, unknown>): MenuModifierHints {
  const sugar = params.sugar;
  const notes = params.notes;
  return {
    sugar: sugar === "regular" || sugar === "less" || sugar === "none" ? sugar : undefined,
    notes: typeof notes === "string" ? notes : undefined,
  };
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[ًٌٍَُِّْٰ]/g, "");
}

function resolveMenuItem(params: Record<string, unknown>) {
  const rawId = String(params.item_id ?? params.itemId ?? params.id ?? "").trim();
  const rawName = String(params.item_name ?? params.itemName ?? params.name ?? "").trim();

  if (rawId) {
    const byId = DEMO_MENU.find((item) => item.id === rawId);
    if (byId) return byId;
  }

  if (rawName) {
    const normalized = normalizeText(rawName);
    const byExact = DEMO_MENU.find((item) => normalizeText(item.name) === normalized);
    if (byExact) return byExact;

    const byPartial = DEMO_MENU.find(
      (item) =>
        normalizeText(item.name).includes(normalized) || normalized.includes(normalizeText(item.name)),
    );
    if (byPartial) return byPartial;
  }

  return null;
}

async function resolveConversationToken(tokenEndpoint: string, agentId: string): Promise<string> {
  const response = await fetch(`${tokenEndpoint}?agentId=${encodeURIComponent(agentId)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as ConversationTokenResponse | null;
  if (!response.ok) {
    throw new Error(body?.error || `Failed to load ElevenLabs token (${response.status})`);
  }

  if (body?.signed_url) return body.signed_url;
  const token = body?.token?.trim();
  if (!token) throw new Error("ElevenLabs token response did not include a token.");
  return token;
}

function formatOrderItemName(itemId: string, hints: MenuModifierHints): string | null {
  const item = DEMO_MENU.find((entry) => entry.id === itemId);
  if (!item) return null;
  const modifiersLabel = formatModifiersAr(hints);
  return modifiersLabel === "???? ????? ?????" ? item.name : `${item.name} (${modifiersLabel})`;
}

function buildOrderLineFromParams(params: Record<string, unknown>): OrderLine | null {
  const item = resolveMenuItem(params);
  if (!item) return null;

  const quantity = Math.max(1, Number(params.quantity) || 1);
  const hints = parseModifierHints(params);
  const displayName = formatOrderItemName(item.id, hints);
  if (!displayName) return null;

  return {
    lineKey: `${item.id}|${displayName}`,
    itemId: item.id,
    name: displayName,
    qty: quantity,
    price: item.price,
    imageSrc: item.imageSrc,
    modifiersLabel: formatModifiersAr(hints),
    modifiers: hints,
  };
}

export function useDriveThruVoiceDemo(agentId: string, tokenEndpoint: string) {
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [orderItems, setOrderItems] = useState<OrderLine[]>([]);
  const [previewLine, setPreviewLine] = useState<OrderLine | null>(null);
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isUploadingRecording, setIsUploadingRecording] = useState(false);
  const timerRef = useRef<number | null>(null);
  const stopRequestedRef = useRef(false);
  const endSessionRef = useRef<(() => void | Promise<void>) | null>(null);
  const nextLineId = useRef(0);

  const addMenuItem = useCallback((params: Record<string, unknown>) => {
    console.log("[VoiceDemo][tool] add_menu_item request", params);
    const line = buildOrderLineFromParams(params);
    if (!line) {
      console.warn("[VoiceDemo][tool] add_menu_item rejected", params);
      return JSON.stringify({
        ok: false,
        error: "Unknown menu item",
        received: {
          item_id: params.item_id ?? null,
          item_name: params.item_name ?? null,
        },
      });
    }

    console.log("[VoiceDemo][tool] add_menu_item resolved", line);
    setOrderItems((current) => {
      const existing = current.find((currentLine) => currentLine.lineKey === line.lineKey);
      if (existing) {
        console.log("[VoiceDemo][tool] add_menu_item increment", {
          lineKey: line.lineKey,
          previousQty: existing.qty,
          addedQty: line.qty,
        });
        return current.map((currentLine) =>
          currentLine.lineKey === line.lineKey ? { ...currentLine, qty: currentLine.qty + line.qty } : currentLine,
        );
      }
      console.log("[VoiceDemo][tool] add_menu_item append", line);
      return [...current, line];
    });

    const response = JSON.stringify({
      ok: true,
      added: { item_id: line.itemId, item_name: line.name, quantity: line.qty, modifiers: line.modifiers },
    });
    console.log("[VoiceDemo][tool] add_menu_item response", response);
    return response;
  }, []);

  const preaddMenuItem = useCallback((params: Record<string, unknown>) => {
    console.log("[VoiceDemo][tool] preadd_menu_item request", params);
    const line = buildOrderLineFromParams(params);
    if (!line) {
      console.warn("[VoiceDemo][tool] preadd_menu_item rejected", params);
      return JSON.stringify({
        ok: false,
        error: "Unknown menu item",
        received: {
          item_id: params.item_id ?? null,
          item_name: params.item_name ?? null,
        },
      });
    }

    console.log("[VoiceDemo][tool] preadd_menu_item preview", line);
    setPreviewLine(line);
    const response = JSON.stringify({
      ok: true,
      preview: { item_id: line.itemId, item_name: line.name, quantity: line.qty, modifiers: line.modifiers },
    });
    console.log("[VoiceDemo][tool] preadd_menu_item response", response);
    return response;
  }, []);

  const clearOrder = useCallback(() => {
    console.log("[VoiceDemo][tool] clear_order request");
    setOrderItems([]);
    setPreviewLine(null);
    setOrderFinalized(false);
    const response = JSON.stringify({ ok: true });
    console.log("[VoiceDemo][tool] clear_order response", response);
    return response;
  }, []);

  const completeOrder = useCallback(() => {
    console.log("[VoiceDemo][tool] complete_order request");
    setOrderFinalized(true);
    setPreviewLine(null);
    stopRequestedRef.current = true;
    window.setTimeout(() => {
      void endSessionRef.current?.();
    }, 0);
    const response = JSON.stringify({ ok: true });
    console.log("[VoiceDemo][tool] complete_order response", response);
    return response;
  }, []);

  const adjustCurrentOrderQuantity = useCallback((delta: number) => {
    setOrderItems((current) => {
      if (current.length === 0 || delta === 0) return current;
      const lastIndex = current.length - 1;
      const last = current[lastIndex];
      const nextQty = last.qty + delta;
      if (nextQty <= 0) return current.slice(0, -1);
      const next = current.slice();
      next[lastIndex] = { ...last, qty: nextQty };
      return next;
    });
  }, []);

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

  const applyToolCall = useCallback(
    (toolName: string, params: Record<string, unknown>) => {
      console.log("[VoiceDemo][tool] applyToolCall", { toolName, params });
      if (toolName === "get_menu_context") {
        const response = JSON.stringify({
          ok: true,
          menu: DEMO_MENU.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
          })),
          current_order: orderItems,
        });
        console.log("[VoiceDemo][tool] get_menu_context response", response);
        return response;
      }
      if (toolName === "preadd_menu_item") return preaddMenuItem(params);
      if (toolName === "add_menu_item") return addMenuItem(params);
      if (toolName === "clear_order") return clearOrder();
      if (toolName === "complete_order") return completeOrder();
      const response = JSON.stringify({ ok: false, error: `Unsupported tool: ${toolName}` });
      console.warn("[VoiceDemo][tool] unsupported tool", response);
      return response;
    },
    [addMenuItem, clearOrder, completeOrder, orderItems, preaddMenuItem],
  );

  const replaySimulation = useCallback(
    async (userPrompt: string) => {
      setIsSimulating(true);
      try {
        const response = await fetch("/api/agent/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId,
            userPrompt,
          }),
        });

        const payload = (await response.json().catch(() => null)) as SimulationResponse | null;
        if (!response.ok) {
          throw new Error((payload as { error?: string } | null)?.error || `Simulation failed (${response.status})`);
        }

        for (const turn of payload?.simulatedConversation ?? []) {
          console.log("[VoiceDemo][simulation] turn", turn);
          for (const toolCall of turn.toolCalls ?? []) {
            if (!toolCall.toolName) continue;
            let params: Record<string, unknown> = {};
            if (toolCall.paramsAsJson) {
              try {
                params = JSON.parse(toolCall.paramsAsJson) as Record<string, unknown>;
              } catch {
                params = {};
              }
            }
            if (toolCall.toolName === "add_menu_item") {
              setPreviewLine(buildOrderLineFromParams(params));
            }
            const result = applyToolCall(toolCall.toolName, params);
            console.log("[VoiceDemo][simulation] tool result", {
              toolName: toolCall.toolName,
              requestId: toolCall.requestId,
              params,
              result,
            });
          }
        }

        return payload;
      } finally {
        setIsSimulating(false);
      }
    },
    [agentId, applyToolCall],
  );

  const replaySimulationStream = useCallback(
    async (userPrompt: string) => {
      setIsSimulating(true);
      try {
        const response = await fetch("/api/agent/simulate-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId,
            userPrompt,
          }),
        });

        if (!response.ok || !response.body) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || `Simulation failed (${response.status})`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;
            console.log("[VoiceDemo][simulation-stream] raw line", line);

            let parsedLine: string;
            try {
              parsedLine = JSON.parse(line) as string;
            } catch {
              continue;
            }

            let payload: StreamingSimulationResponse | null = null;
            try {
              payload = JSON.parse(parsedLine) as StreamingSimulationResponse;
            } catch {
              continue;
            }

            for (const turn of payload?.simulatedConversation ?? []) {
              console.log("[VoiceDemo][simulation-stream] turn", turn);
              for (const toolCall of turn.toolCalls ?? []) {
                if (!toolCall.toolName) continue;
                let params: Record<string, unknown> = {};
                if (toolCall.paramsAsJson) {
                  try {
                    params = JSON.parse(toolCall.paramsAsJson) as Record<string, unknown>;
                  } catch {
                    params = {};
                  }
                }
                if (toolCall.toolName === "add_menu_item") {
                  setPreviewLine(buildOrderLineFromParams(params));
                }
                const result = applyToolCall(toolCall.toolName, params);
                console.log("[VoiceDemo][simulation-stream] tool result", {
                  toolName: toolCall.toolName,
                  requestId: toolCall.requestId,
                  params,
                  result,
                });
              }
            }
          }
        }
      } finally {
        setIsSimulating(false);
      }
    },
    [agentId, applyToolCall],
  );

  const conversation = useConversation({
    onAgentToolRequest: (toolRequest) => {
      console.log("[VoiceDemo][tool] onAgentToolRequest", toolRequest);
      const request = toolRequest as {
        tool_name?: string;
        toolName?: string;
        parameters?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };
      const toolName = String(request.tool_name ?? request.toolName ?? "").trim();
      if (toolName !== "add_menu_item" && toolName !== "preadd_menu_item") {
        console.log("[VoiceDemo][tool] onAgentToolRequest ignored", { toolName });
        return;
      }

      const params = request.parameters ?? request.params ?? {};
      console.log("[VoiceDemo][tool] onAgentToolRequest preview", params);
      setPreviewLine(buildOrderLineFromParams(params));
    },
    onUnhandledClientToolCall: (toolRequest) => {
      console.log("[VoiceDemo][tool] onUnhandledClientToolCall", toolRequest);
      const request = toolRequest as {
        tool_name?: string;
        toolName?: string;
        parameters?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };
      const toolName = String(request.tool_name ?? request.toolName ?? "").trim();
      if (toolName !== "add_menu_item" && toolName !== "preadd_menu_item") {
        console.log("[VoiceDemo][tool] onUnhandledClientToolCall ignored", { toolName });
        return;
      }

      const params = request.parameters ?? request.params ?? {};
      console.log("[VoiceDemo][tool] onUnhandledClientToolCall preview", params);
      setPreviewLine(buildOrderLineFromParams(params));
    },
    onAgentToolResponse: (toolResponse) => {
      console.log("[VoiceDemo][tool] onAgentToolResponse", toolResponse);
    },
    onDebug: (event) => {
      console.log("[VoiceDemo][debug]", event);
    },
    onConnect: () => {
      setSecondsRemaining(30);
      setVoiceHint(null);
      setOrderFinalized(false);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((current) => {
          const next = Math.max(0, current - 1);
          if (next <= 0 && !stopRequestedRef.current) {
            stopRequestedRef.current = true;
            window.setTimeout(() => {
              void endSessionRef.current?.();
            }, 0);
          }
          return next;
        });
      }, 1000);
    },
    onDisconnect: () => {
      setSecondsRemaining(0);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopRequestedRef.current = false;
    },
    onError: (error: unknown) => {
      setVoiceHint(error instanceof Error ? error.message : String(error));
    },
    onMessage: (message) => {
      const msg = message as { message?: string };
      const text = String(msg.message ?? "").trim();
      if (!text) return;
      console.log("[VoiceDemo][message]", text);
      setTranscriptLines((prev) => {
        const last = prev[prev.length - 1];
        if (last?.text === text) return prev;
        nextLineId.current += 1;
        return [...prev, { id: `m-${nextLineId.current}`, text }];
      });
    },
  });

  const { startSession, endSession, getInputVolume, getOutputVolume, status, mode } = conversation;

  useEffect(() => {
    endSessionRef.current = endSession;
  }, [endSession]);

  const playRecordingIntoSession = useCallback(
    async (file: File) => {
      setIsUploadingRecording(true);
      try {
        if (status !== "connected") {
          throw new Error("Start the live voice session before sending the recording.");
        }

        console.log("[VoiceDemo][recording] upload start", {
          name: file.name,
          type: file.type,
          size: file.size,
        });
        const uploaded = await conversation.uploadFile(file);
        console.log("[VoiceDemo][recording] upload complete", uploaded);
        console.log("[VoiceDemo][recording] send multimodal message", { fileId: uploaded.fileId });
        conversation.sendMultimodalMessage({ fileId: uploaded.fileId });
      } finally {
        setIsUploadingRecording(false);
      }
    },
    [conversation, status],
  );

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    },
    [],
  );

  const agentState = useMemo((): AgentState => {
    if (status === "connecting") return "thinking";
    if (status !== "connected") return null;
    return mode === "speaking" ? "talking" : "listening";
  }, [mode, status]);

  const handleOrbClick = useCallback(async () => {
    if (status === "connecting" || status === "connected") {
      stopRequestedRef.current = true;
      await endSession();
      return;
    }

    setVoiceHint(null);
    if (!agentId.trim()) {
      setVoiceHint("Configure ELEVENLABS_AGENT_ID or VITE_ELEVENLABS_AGENT_ID.");
      return;
    }

    try {
      const conversationToken = await resolveConversationToken(tokenEndpoint, agentId.trim());
      await startSession({
        conversationToken,
      });
    } catch (error) {
      setVoiceHint(error instanceof Error ? error.message : String(error));
    }
  }, [agentId, endSession, startSession, status, tokenEndpoint]);

  const orderTotal = useMemo(
    () => orderItems.reduce((sum, line) => sum + line.price * line.qty, 0),
    [orderItems],
  );

  return {
    agentState,
    handleOrbClick,
    replaySimulation,
    replaySimulationStream,
    playRecordingIntoSession,
    simulateAddMenuItem: addMenuItem,
    simulateClearOrder: clearOrder,
    simulateCompleteOrder: completeOrder,
    adjustCurrentOrderQuantity,
    applyToolCall,
    isSimulating,
    isUploadingRecording,
    voiceHint,
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





