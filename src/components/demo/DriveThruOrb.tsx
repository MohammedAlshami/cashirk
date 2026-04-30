"use client";

import type { ConversationStatus } from "@elevenlabs/react";
import React, { lazy, Suspense, useEffect, useState } from "react";
import type { AgentState } from "@/components/demo/Orb";

const Orb = lazy(() => import("@/components/demo/Orb").then((m) => ({ default: m.Orb })));

export function DriveThruOrb({
  agentState,
  status,
  onOrbClick,
  getInputVolume,
  getOutputVolume,
  ringOffsetClassName = "ring-offset-[#503728]",
}: {
  agentState: AgentState;
  status: ConversationStatus;
  onOrbClick: () => void | Promise<void>;
  getInputVolume: () => number;
  getOutputVolume: () => number;
  ringOffsetClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const busy = status === "connecting" || status === "connected";

  if (!mounted) {
    return (
      <div className="mx-auto aspect-square w-full max-w-[min(92vw,440px)] rounded-full bg-black/15" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      onClick={() => void onOrbClick()}
      disabled={busy}
      className={`relative mx-auto block w-full max-w-[min(92vw,440px)] cursor-pointer rounded-full border-0 bg-transparent p-0 shadow-none outline-none ring-offset-4 ${ringOffsetClassName} focus-visible:ring-2 focus-visible:ring-[#FFF7DD]/70 disabled:cursor-default disabled:opacity-95`}
      aria-label={
        busy ? "جاري المحادثة الصوتية" : "اضغط للتحدث مع الوكيل لمدة تصل إلى ٣٠ ثانية"
      }
    >
      <Suspense
        fallback={
          <div className="mx-auto aspect-square w-full max-w-[min(92vw,440px)] rounded-full bg-black/10" aria-hidden />
        }
      >
        <Orb
          agentState={agentState}
          colors={["#FFF7DD", "#c9a87c"]}
          volumeMode="manual"
          getInputVolume={getInputVolume}
          getOutputVolume={getOutputVolume}
          className="relative mx-auto aspect-square w-full max-w-[min(92vw,440px)] min-h-[min(72vw,440px)]"
        />
      </Suspense>
    </button>
  );
}
