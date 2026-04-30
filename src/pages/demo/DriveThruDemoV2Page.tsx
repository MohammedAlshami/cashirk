"use client";

import { ConversationProvider } from "@elevenlabs/react";
import React from "react";
import "@/styles/landing-ar.css";
import { DemoLogoBar } from "@/components/demo/DemoLogoBar";
import { DriveThruOrb } from "@/components/demo/DriveThruOrb";
import { useDriveThruVoiceDemo } from "@/pages/demo/useDriveThruVoiceDemo";

const PAGE_BG = "#503728";

function DriveThruDemoV2Inner() {
  const { agentState, handleOrbClick, voiceHint, status, getInputVolume, getOutputVolume } =
    useDriveThruVoiceDemo();

  return (
    <div
      className="landing-page flex min-h-screen flex-col text-[#FFF7DD]"
      dir="rtl"
      lang="ar"
      style={{ backgroundColor: PAGE_BG }}
    >
      <DemoLogoBar />

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
        <DriveThruOrb
          agentState={agentState}
          status={status}
          onOrbClick={handleOrbClick}
          getInputVolume={getInputVolume}
          getOutputVolume={getOutputVolume}
        />
        <p className="mt-8 max-w-sm text-center text-sm leading-relaxed text-[#FFF7DD]/80">
          {status === "connected"
            ? "المحادثة نشطة — تنتهي تلقائياً بعد ٣٠ ثانية."
            : "اضغط على الكرة للتحدث مع الوكيل (حد أقصى ٣٠ ثانية)."}
        </p>
        {voiceHint ? (
          <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-amber-200/95" role="alert">
            {voiceHint}
          </p>
        ) : null}
      </main>
    </div>
  );
}

export function DriveThruDemoV2Page() {
  return (
    <ConversationProvider>
      <DriveThruDemoV2Inner />
    </ConversationProvider>
  );
}
