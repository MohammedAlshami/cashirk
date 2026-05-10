"use client";

import React, { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const isActive = agentState !== null;
  const isTalking = agentState === "talking";

  return (
    <div
      className={`relative mx-auto block w-full max-w-[min(78vw,380px)] rounded-full ring-offset-4 ${ringOffsetClassName}`}
      aria-hidden={false}
    >
      {/* ── Halo rings: visible only when active ── */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Outer slow pulse */}
            <motion.span
              key="halo-outer"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: isTalking
                  ? "radial-gradient(circle, rgba(255,247,221,0.22) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(255,247,221,0.12) 0%, transparent 70%)",
                boxShadow: isTalking
                  ? "0 0 0 12px rgba(255,247,221,0.08), 0 0 40px 8px rgba(255,247,221,0.14)"
                  : "0 0 0 8px rgba(255,247,221,0.06), 0 0 28px 4px rgba(255,247,221,0.09)",
              }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.07, 1],
              }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{
                duration: isTalking ? 1.1 : 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Inner crisp ring */}
            <motion.span
              key="halo-inner"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                boxShadow: isTalking
                  ? "0 0 0 3px rgba(255,247,221,0.55)"
                  : "0 0 0 2px rgba(255,247,221,0.30)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>

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
