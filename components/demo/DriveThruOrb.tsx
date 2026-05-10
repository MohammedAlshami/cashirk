"use client";

import React, { lazy, Suspense } from "react";
import type { AgentState } from "@/components/demo/Orb";

/** Local status shape (same values as former `@elevenlabs/react` hook). */
export type DemoVoiceStatus = "disconnected" | "connecting" | "connected";

const Orb = lazy(() => import("@/components/demo/Orb").then((m) => ({ default: m.Orb })));

export function DriveThruOrb({
  agentState,
  getInputVolume,
  getOutputVolume,
  ringOffsetClassName = "ring-offset-[#503728]",
}: {
  agentState: AgentState;
  getInputVolume: () => number;
  getOutputVolume: () => number;
  ringOffsetClassName?: string;
}) {
  return (
    <div
      className={`relative mx-auto block w-full max-w-[min(78vw,380px)] rounded-full ring-offset-4 ${ringOffsetClassName}`}
      aria-hidden={false}
    >
      <Suspense
        fallback={
          <div className="mx-auto aspect-square w-full max-w-[min(78vw,380px)] rounded-full bg-black/10" aria-hidden />
        }
      >
        <Orb
          agentState={agentState}
          colors={["#FFF7DD", "#c9a87c"]}
          volumeMode="manual"
          getInputVolume={getInputVolume}
          getOutputVolume={getOutputVolume}
          className="relative mx-auto aspect-square w-full max-w-[min(78vw,380px)] min-h-[min(62vw,380px)]"
        />
      </Suspense>
    </div>
  );
}
