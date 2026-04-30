"use client";

import { ConversationProvider } from "@elevenlabs/react";
import React from "react";
import "@/styles/landing-ar.css";
import { DemoLogoBar } from "@/components/demo/DemoLogoBar";
import { DriveThruOrb } from "@/components/demo/DriveThruOrb";
import { useDriveThruVoiceDemo } from "@/pages/demo/useDriveThruVoiceDemo";

const SAR_IMG = "/demo/saudi-riyal-symbol.svg";

function SarSymbol({ className }: { className?: string }) {
  return (
    <img
      src={SAR_IMG}
      alt=""
      aria-hidden
      decoding="async"
      className={`inline-block h-[1em] w-auto shrink-0 align-[-0.15em] ${className ?? ""}`}
    />
  );
}

function MoneyAmount({
  amount,
  className,
  darkSymbol,
}: {
  amount: string;
  className?: string;
  darkSymbol?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className ?? ""}`}>
      <span>{amount}</span>
      <SarSymbol className={darkSymbol ? "brightness-0 opacity-80" : undefined} />
    </span>
  );
}

const DEMO_PRODUCT_IMAGES = {
  latte:
    "https://upload.wikimedia.org/wikipedia/commons/d/d8/Caffe_Latte_at_Pulse_Cafe.jpg",
  croissant:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Croissant-Petr_Kratochvil.jpg",
} as const;

const PAGE_BG = "#503728";
const RECEIPT_SURFACE = "#ffffff";

type ReceiptLine = {
  id: string;
  name: string;
  qty: number;
  unitAmount: string;
  lineAmount: string;
  imageSrc: string;
};

const RECEIPT_LINES: ReceiptLine[] = [
  {
    id: "1",
    name: "لاتيه كبير بالشوفان",
    qty: 1,
    unitAmount: "٥٫٢٥",
    lineAmount: "٥٫٢٥",
    imageSrc: DEMO_PRODUCT_IMAGES.latte,
  },
  {
    id: "2",
    name: "كرواسون بالزبدة",
    qty: 1,
    unitAmount: "٤٫٢٥",
    lineAmount: "٤٫٢٥",
    imageSrc: DEMO_PRODUCT_IMAGES.croissant,
  },
];

const RECEIPT_TOTAL_AMOUNT = "٩٫٥٠";

function ReceiptBlock() {
  return (
    <div
      dir="rtl"
      className="flex h-full w-full min-h-0 flex-1 flex-col rounded-2xl border border-neutral-200 p-6 text-right shadow-sm sm:p-8"
      style={{ backgroundColor: RECEIPT_SURFACE }}
    >
      <div className="shrink-0">
        <h2 className="font-display-hero text-xl font-bold text-neutral-900 sm:text-2xl">الإيصال</h2>
        <p className="mt-1 text-sm text-neutral-500">ممر ٢ · طلب مكتمل</p>
      </div>

      <ul className="mt-6 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
        {RECEIPT_LINES.map((line) => (
          <li
            key={line.id}
            className="flex flex-row-reverse items-center gap-4 border-b border-neutral-200 pb-4 last:border-0 last:pb-0 sm:gap-5"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-28">
              <img
                src={line.imageSrc}
                alt="صورة المنتج"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-snug text-neutral-900">{line.name}</p>
              <p className="mt-1 text-sm text-neutral-600">
                <span className="tabular-nums">الكمية {line.qty}</span>
                <span className="mx-1 text-neutral-400">×</span>
                <MoneyAmount amount={line.unitAmount} darkSymbol />
              </p>
            </div>
            <div className="font-display-hero shrink-0 text-base text-neutral-900 sm:text-lg">
              <MoneyAmount amount={line.lineAmount} darkSymbol />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex shrink-0 flex-row-reverse items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-sm font-medium text-neutral-600">الإجمالي</span>
        <span className="font-display-hero text-xl font-bold text-neutral-900 sm:text-2xl">
          <MoneyAmount amount={RECEIPT_TOTAL_AMOUNT} darkSymbol />
        </span>
      </div>
    </div>
  );
}

function DriveThruDemoInner() {
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

      <div
        className="grid min-h-0 flex-1 grid-cols-1 gap-8 px-4 py-6 sm:px-8 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(320px,44%)] lg:items-stretch lg:gap-10"
        style={{ direction: "ltr" }}
      >
        <div dir="rtl" className="flex min-h-[65vh] flex-1 flex-col lg:h-full lg:min-h-0">
          <ReceiptBlock />
        </div>

        <aside
          dir="rtl"
          className="flex min-h-0 flex-1 flex-col items-center justify-center py-4 lg:sticky lg:top-6 lg:self-stretch lg:py-8"
        >
          <DriveThruOrb
            agentState={agentState}
            status={status}
            onOrbClick={handleOrbClick}
            getInputVolume={getInputVolume}
            getOutputVolume={getOutputVolume}
          />
          <p className="mt-5 max-w-sm text-center text-sm leading-relaxed text-[#FFF7DD]/80">
            {status === "connected"
              ? "المحادثة نشطة — تنتهي تلقائياً بعد ٣٠ ثانية."
              : "اضغط على الكرة للتحدث مع الوكيل (حد أقصى ٣٠ ثانية)."}
          </p>
          {voiceHint ? (
            <p className="mt-3 max-w-sm text-center text-sm leading-relaxed text-amber-200/95" role="alert">
              {voiceHint}
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export function DriveThruDemoPage() {
  return (
    <ConversationProvider>
      <DriveThruDemoInner />
    </ConversationProvider>
  );
}
