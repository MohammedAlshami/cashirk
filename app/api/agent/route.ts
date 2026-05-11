import { NextResponse } from "next/server";
import { ElevenLabsClient, ElevenLabsError } from "@elevenlabs/elevenlabs-js";
import { Llm } from "@elevenlabs/elevenlabs-js/dist/api/types/Llm";
import type { ObjectJsonSchemaPropertyInput } from "@elevenlabs/elevenlabs-js/dist/api/types/ObjectJsonSchemaPropertyInput";
import { ClientEvent } from "@elevenlabs/elevenlabs-js/api/types/ClientEvent";
import type { KnowledgeBaseLocator } from "@elevenlabs/elevenlabs-js/api/types/KnowledgeBaseLocator";
import {
  AGENT_FIRST_MESSAGE_AR,
  buildAgentSystemPromptAr,
  buildMenuKnowledgeJson,
} from "@/lib/demo-menu";

function requireApiKey(): string | null {
  const key = process.env.ELEVENLABS_API_KEY;
  return key?.trim() ? key : null;
}

function client() {
  return new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });
}

function buildAddMenuItemToolConfig() {
  const parameters: ObjectJsonSchemaPropertyInput = {
    type: "object",
    properties: {
      item_id: {
        type: "string",
        description: "Menu item ID from the knowledge base.",
      },
      quantity: {
        type: "integer",
        description: "Quantity to add.",
      },
      sugar: {
        type: "string",
        enum: ["none", "less", "regular"],
        description: "Sugar level only.",
      },
      notes: {
        type: "string",
        description: "Optional special instructions.",
      },
    },
    required: ["item_id", "quantity"],
  };

  return {
    type: "client" as const,
    name: "add_menu_item",
    description:
      "Add one menu item to the current order. Use item_id, quantity, sugar, and optional notes. Do not ask about ice or temperature. Call this tool immediately once the item, quantity, and sugar are known.",
    expectsResponse: false,
    executionMode: "immediate" as const,
    parameters,
  };
}

function buildKnowledgeBaseText() {
  return buildMenuKnowledgeJson();
}

const MENU_KNOWLEDGE_BASE: KnowledgeBaseLocator[] = [
  {
    type: "text",
    name: "Drive-thru menu",
    id: "r0iYJ4BmLDpj2YgUzhnO",
  } as KnowledgeBaseLocator,
];

function buildPreaddMenuItemToolConfig() {
  const parameters: ObjectJsonSchemaPropertyInput = {
    type: "object",
    properties: {
      item_id: {
        type: "string",
        description: "Menu item ID from the knowledge base.",
      },
      notes: {
        type: "string",
        description: "Optional special instructions.",
      },
    },
    required: ["item_id"],
  };

  return {
    type: "client" as const,
    name: "preadd_menu_item",
    description:
      "Preview a menu item as soon as it is recognized so the UI sheet opens before the order is finalized. Call this immediately when you identify the item name. Only item_id is required.",
    expectsResponse: false,
    executionMode: "immediate" as const,
    parameters,
  };
}

function apiErrorMessage(err: unknown): string {
  if (err instanceof ElevenLabsError) return err.message;
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}

export async function GET(request: Request) {
  const apiKey = requireApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY. Add it to your environment." },
      { status: 500 },
    );
  }

  const agentId = new URL(request.url).searchParams.get("agentId")?.trim();
  if (!agentId) {
    return NextResponse.json(
      { error: "Missing agentId. Pass ?agentId=your-agent-id" },
      { status: 400 },
    );
  }

  try {
    const agent = await client().conversationalAi.agents.get(agentId);
    return NextResponse.json({
      agentId: agent.agentId,
      agentName: agent.name,
      conversationConfig: agent.conversationConfig,
      versionId: agent.versionId,
      branchId: agent.branchId,
    });
  } catch (err) {
    const status = err instanceof ElevenLabsError && err.statusCode ? err.statusCode : 502;
    return NextResponse.json(
      { error: apiErrorMessage(err) },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}

export async function POST() {
  const apiKey = requireApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY. Add it to your environment." },
      { status: 500 },
    );
  }

  try {
    const created = await client().conversationalAi.agents.create({
      name: "Quickstart voice test agent",
      enableVersioning: true,
      conversationConfig: {
        agent: {
          firstMessage: AGENT_FIRST_MESSAGE_AR,
          language: "ar",
          prompt: {
            prompt: buildAgentSystemPromptAr(),
            llm: Llm.Gpt4O,
            temperature: 0.15,
            knowledgeBase: MENU_KNOWLEDGE_BASE,
          },
        },
        conversation: {
          clientEvents: [
            ClientEvent.Audio,
            ClientEvent.Interruption,
            ClientEvent.UserTranscript,
            ClientEvent.TentativeUserTranscript,
            ClientEvent.AgentResponse,
            ClientEvent.InternalTentativeAgentResponse,
            ClientEvent.AgentChatResponsePart,
            ClientEvent.AgentToolRequest,
            ClientEvent.AgentToolResponse,
          ],
        },
      },
    });

    return NextResponse.json({
      agentId: created.agentId,
      agentName: "Quickstart voice test agent",
    });
  } catch (err) {
    const status = err instanceof ElevenLabsError && err.statusCode ? err.statusCode : 502;
    return NextResponse.json(
      { error: apiErrorMessage(err) },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}

export async function PATCH(request: Request) {
  const apiKey = requireApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY. Add it to your environment." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as { agentId?: string } | null;
  const agentId = body?.agentId?.trim();
  if (!agentId) {
    return NextResponse.json(
      { error: "Missing agentId in request body." },
      { status: 400 },
    );
  }

  try {
    const agent = await client().conversationalAi.agents.get(agentId);
    const tools = await client().conversationalAi.tools.list();

    const addTool = tools.tools.find(
      (tool) => tool.toolConfig.type === "client" && tool.toolConfig.name === "add_menu_item",
    );
    const preaddTool = tools.tools.find(
      (tool) => tool.toolConfig.type === "client" && tool.toolConfig.name === "preadd_menu_item",
    );
    const completeOrderTool = tools.tools.find(
      (tool) => tool.toolConfig.type === "client" && tool.toolConfig.name === "complete_order",
    );
    const clearOrderTool = tools.tools.find(
      (tool) => tool.toolConfig.type === "client" && tool.toolConfig.name === "clear_order",
    );
    const menuContextTool = tools.tools.find(
      (tool) => tool.toolConfig.type === "client" && tool.toolConfig.name === "get_menu_context",
    );

    if (addTool) {
      await client().conversationalAi.tools.update(addTool.id, {
        toolConfig: buildAddMenuItemToolConfig(),
      });
    }

    let preaddToolId = preaddTool?.id ?? null;
    if (preaddTool) {
      await client().conversationalAi.tools.update(preaddTool.id, {
        toolConfig: buildPreaddMenuItemToolConfig(),
      });
    } else {
      const createdPreadd = await client().conversationalAi.tools.create({
        toolConfig: buildPreaddMenuItemToolConfig(),
      });
      preaddToolId = createdPreadd.id;
    }

    const existingToolIds = new Set(
      ((agent.conversationConfig.agent?.prompt as { tool_ids?: string[]; toolIds?: string[] } | undefined)
        ?.tool_ids ?? [])
        .concat(
          ((agent.conversationConfig.agent?.prompt as { tool_ids?: string[]; toolIds?: string[] } | undefined)
            ?.toolIds ?? []),
        ),
    );

    if (addTool) existingToolIds.add(addTool.id);
    if (preaddToolId) existingToolIds.add(preaddToolId);
    if (completeOrderTool) existingToolIds.add(completeOrderTool.id);
    if (clearOrderTool) existingToolIds.add(clearOrderTool.id);
    if (menuContextTool) existingToolIds.add(menuContextTool.id);

    const nextToolIds = Array.from(existingToolIds);

    const updated = await client().conversationalAi.agents.update(agentId, {
      conversationConfig: {
        ...agent.conversationConfig,
        agent: {
          ...agent.conversationConfig.agent,
          firstMessage: AGENT_FIRST_MESSAGE_AR,
          language: "ar",
          prompt: {
            prompt: buildAgentSystemPromptAr(),
            llm: Llm.Gpt4O,
            temperature: 0.15,
            toolIds: nextToolIds,
            knowledgeBase: MENU_KNOWLEDGE_BASE,
          },
        },
        conversation: {
          ...agent.conversationConfig.conversation,
          clientEvents: [
            ClientEvent.Audio,
            ClientEvent.Interruption,
            ClientEvent.UserTranscript,
            ClientEvent.TentativeUserTranscript,
            ClientEvent.AgentResponse,
            ClientEvent.InternalTentativeAgentResponse,
            ClientEvent.AgentChatResponsePart,
            ClientEvent.AgentToolRequest,
            ClientEvent.AgentToolResponse,
          ],
        },
      },
    });

    return NextResponse.json({
      agentId: updated.agentId,
      agentName: updated.name,
      addMenuItemToolId: addTool?.id ?? null,
      preaddMenuItemToolId: preaddToolId,
      toolIds: nextToolIds,
    });
  } catch (err) {
    const status = err instanceof ElevenLabsError && err.statusCode ? err.statusCode : 502;
    return NextResponse.json(
      { error: apiErrorMessage(err) },
      { status: status >= 400 && status < 600 ? status : 502 },
    );
  }
}
