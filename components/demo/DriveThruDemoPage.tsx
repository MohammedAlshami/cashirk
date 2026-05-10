"use client";

import React from "react";
import { ConversationProvider } from "@elevenlabs/react";
import { AnimatePresence, motion } from "framer-motion";
import "@/styles/landing-ar.css";
import { DemoLogoBar } from "@/components/demo/DemoLogoBar";
import { DriveThruOrb } from "@/components/demo/DriveThruOrb";
import { useDriveThruVoiceDemo } from "@/hooks/useDriveThruVoiceDemo";
import type { OrderLine } from "@/lib/demo-menu";

const PAGE_BG = "#503728";
const AR_BODY_FONT = '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif';

const COPY = {
  orbIdle: "اضغط الكرة للتحدث",
  orbActive: "اضغط الكرة للإيقاف",
} as const;

function MoneyAmount({ amount, className }: { amount: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className ?? ""}`}>
      <span>{amount}</span>
      <span aria-hidden className="font-semibold">
        ر.س
      </span>
    </span>
  );
}

function OrderSheet({ line }: { line: OrderLine }) {
  return (
    <motion.aside
      dir="rtl"
      style={{ fontFamily: AR_BODY_FONT }}
      className="w-[min(86vw,380px)] overflow-hidden rounded-[2rem] bg-white text-right"
      initial={{ x: -54, opacity: 0, scale: 0.985 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -54, opacity: 0, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.92 }}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1">
          <div className="overflow-hidden rounded-3xl bg-white">
            <img src={line.imageSrc} alt={line.name} className="h-48 w-full object-cover" />

            <div className="px-4 pb-4 pt-3">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 text-lg font-semibold text-neutral-900">{line.name}</p>
                <p className="shrink-0 text-sm font-bold text-neutral-900">
                  <MoneyAmount amount={(line.price * line.qty).toFixed(2)} />
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">السكر</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {["بدون سكر", "سكر أقل", "عادي", "إضافي"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      className="cursor-pointer rounded-2xl border border-[#ead9c8] bg-white px-3 py-3 text-right text-sm text-neutral-900 transition hover:border-[#cda97e] hover:bg-[#fff8ef]"
                    >
                      <div className="text-xs text-neutral-400">السكر</div>
                      <div className="mt-1 font-semibold">{label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 mt-4 p-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#4a3428] px-4 py-3 text-[#FFF7DD]">
            <button
              type="button"
              className="cursor-pointer rounded-xl bg-white/10 px-5 py-3 text-lg font-bold transition hover:bg-white/20"
            >
              -
            </button>
            <div className="text-center">
              <p className="text-lg font-bold">{line.qty}</p>
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-xl bg-white/10 px-5 py-3 text-lg font-bold transition hover:bg-white/20"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export function DriveThruDemoPage({
  agentId,
  conversationTokenPath,
}: {
  agentId: string;
  conversationTokenPath: string;
}) {
  return (
    <ConversationProvider>
      <DriveThruDemoPageInner agentId={agentId} conversationTokenPath={conversationTokenPath} />
    </ConversationProvider>
  );
}

function DriveThruDemoPageInner({
  agentId,
  conversationTokenPath,
}: {
  agentId: string;
  conversationTokenPath: string;
}) {
  const {
    agentState,
    handleOrbClick,
    status,
    getInputVolume,
    getOutputVolume,
    orderTotal,
    orderItems,
    previewLine,
  } = useDriveThruVoiceDemo(agentId, conversationTokenPath);

  const currentLine = orderItems[orderItems.length - 1] ?? previewLine;
  const sheetVisible = Boolean(currentLine);

  return (
    <div
      className="landing-page flex min-h-screen flex-col text-[#FFF7DD]"
      dir="rtl"
      lang="ar"
      style={{ backgroundColor: PAGE_BG }}
    >
      <DemoLogoBar />

      <div dir="ltr" className="flex min-h-0 flex-1 overflow-hidden px-4 py-6 sm:px-8">
        <div className="flex min-h-[calc(100vh-8rem)] w-full items-center gap-6 overflow-hidden rounded-[2.25rem] bg-transparent">
          <div className="flex shrink-0 items-center">
            <AnimatePresence initial={false} mode="wait">
              {sheetVisible && currentLine ? (
                <OrderSheet key={currentLine.lineKey} line={currentLine} />
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="flex max-w-[92vw] flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => void handleOrbClick()}
                disabled={status === "connecting"}
                className="block cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF7DD]/80 disabled:cursor-not-allowed"
                aria-label={status === "connected" || status === "connecting" ? COPY.orbActive : COPY.orbIdle}
                title={status === "connected" || status === "connecting" ? COPY.orbActive : COPY.orbIdle}
              >
                <DriveThruOrb
                  agentState={agentState}
                  getInputVolume={getInputVolume}
                  getOutputVolume={getOutputVolume}
                />
              </button>

              <div dir="rtl" className="mt-4 text-center" style={{ fontFamily: AR_BODY_FONT }}>
                <p className="mt-2 text-lg font-bold text-[#FFF7DD]">
                  <MoneyAmount amount={orderTotal.toFixed(2)} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriveThruDemoPage;