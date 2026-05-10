"use client";

import React from "react";
import { ConversationProvider } from "@elevenlabs/react";
import { AnimatePresence, motion } from "framer-motion";
import "@/styles/landing-ar.css";
import { DemoLogoBar } from "@/components/demo/DemoLogoBar";
import { DriveThruOrb } from "@/components/demo/DriveThruOrb";
import { useDriveThruVoiceDemo } from "@/hooks/useDriveThruVoiceDemo";
import { getMenuItemById, type OrderLine } from "@/lib/demo-menu";

const PAGE_BG = "#503728";
const AR_BODY_FONT = '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif';

const COPY = {
  orbIdle: "اضغط الكرة للتحدث",
  orbActive: "اضغط الكرة للإيقاف",
} as const;

// ---------------------------------------------------------------------------
// Saudi Riyal SVG symbol
// ---------------------------------------------------------------------------
function SaudiRiyalSymbol({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1124.14 1256.39"
      className={className}
      fill="currentColor"
    >
      <path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
      <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
    </svg>
  );
}

function MoneyAmount({ amount, className }: { amount: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className ?? ""}`}>
      <span>{amount}</span>
      <span aria-hidden className="font-semibold">
        <SaudiRiyalSymbol className="w-4 h-4 translate-y-[1px]" />
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Payment Modal — shown when order is finalized
// ---------------------------------------------------------------------------
function PaymentModal({
  orderItems,
  orderTotal,
  onClose,
}: {
  orderItems: OrderLine[];
  orderTotal: number;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal card */}
      <motion.div
        dir="rtl"
        style={{ fontFamily: AR_BODY_FONT }}
        className="relative z-10 w-full max-w-sm rounded-[2rem] bg-white overflow-hidden shadow-2xl"
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
      >
        {/* Header */}
        <div className="bg-[#4a3428] px-6 py-5 text-[#FFF7DD]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium opacity-70">طلبك جاهز!</p>
              <h2 className="text-lg font-bold">ملخص الطلب</h2>
            </div>
          </div>
        </div>

        {/* Order lines */}
        <div className="px-6 py-4 space-y-3">
          {orderItems.map((line) => (
            <div key={line.lineKey} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={line.imageSrc}
                  alt={line.name}
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 leading-tight">
                    {getMenuItemById(line.itemId)?.name ?? line.name}
                  </p>
                  {line.modifiersLabel && line.modifiersLabel !== "بدون تخصيص إضافي" && (
                    <p className="text-xs text-neutral-400 mt-0.5">{line.modifiersLabel}</p>
                  )}
                  <p className="text-xs text-neutral-400">× {line.qty}</p>
                </div>
              </div>
              <p className="shrink-0 text-sm font-bold text-neutral-900">
                <MoneyAmount amount={(line.price * line.qty).toFixed(2)} />
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-dashed border-neutral-200" />

        {/* Total */}
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm font-medium text-neutral-500">الإجمالي</p>
          <p className="text-xl font-bold text-neutral-900">
            <MoneyAmount amount={orderTotal.toFixed(2)} />
          </p>
        </div>

        {/* Pay button */}
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-2xl bg-[#4a3428] py-4 text-center text-base font-bold text-[#FFF7DD] transition hover:bg-[#3a2618] active:scale-[0.98]"
          >
            تم — شكراً لطلبك!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// OrderSheet — responsive: slides from left on desktop, from bottom on mobile
// ---------------------------------------------------------------------------
function OrderSheet({ line }: { line: OrderLine }) {
  const menuItem = getMenuItemById(line.itemId);
  const hasOptions = (menuItem?.optionGroups?.length ?? 0) > 0;

  return (
    <>
      {/* ── Desktop: slide from left ── */}
      <motion.aside
        dir="rtl"
        style={{ fontFamily: AR_BODY_FONT }}
        className="hidden sm:flex w-[min(86vw,380px)] flex-col overflow-hidden rounded-[2rem] bg-white text-right"
        initial={{ x: -54, opacity: 0, scale: 0.985 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -54, opacity: 0, scale: 0.985 }}
        transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.92 }}
      >
        <OrderSheetContent line={line} hasOptions={hasOptions} menuItem={menuItem} />
      </motion.aside>

      {/* ── Mobile: slide from bottom (fixed overlay) ── */}
      <motion.aside
        dir="rtl"
        style={{ fontFamily: AR_BODY_FONT }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 overflow-hidden rounded-t-[2rem] bg-white text-right shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.92 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-200" />
        </div>
        <OrderSheetContent line={line} hasOptions={hasOptions} menuItem={menuItem} compact />
      </motion.aside>
    </>
  );
}

function OrderSheetContent({
  line,
  hasOptions,
  menuItem,
  compact = false,
}: {
  line: OrderLine;
  hasOptions: boolean;
  menuItem: ReturnType<typeof getMenuItemById>;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-3xl bg-white">
        <img
          src={line.imageSrc}
          alt={line.name}
          className={`w-full object-cover ${compact ? "h-36" : "h-48"}`}
        />

        <div className="px-4 pb-4 pt-3">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-lg font-semibold text-neutral-900">{line.name}</p>
            <p className="shrink-0 text-sm font-bold text-neutral-900">
              <MoneyAmount amount={(line.price * line.qty).toFixed(2)} />
            </p>
          </div>

          {hasOptions && menuItem?.optionGroups.map((group, gi) => (
            <div className="mt-4" key={gi}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400">
                {group.heading}
              </p>
              <div className={`mt-3 grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2"}`}>
                {group.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    className="cursor-pointer rounded-2xl border border-[#ead9c8] bg-white px-3 py-3 text-right text-sm text-neutral-900 transition hover:border-[#cda97e] hover:bg-[#fff8ef]"
                  >
                    {opt.category && (
                      <div className="text-xs text-neutral-400">{opt.category}</div>
                    )}
                    <div className={`font-semibold ${opt.category ? "mt-1" : ""}`}>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 px-4 pb-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#4a3428] px-4 py-3 text-[#FFF7DD]">
          <button type="button" className="cursor-pointer rounded-xl bg-white/10 px-5 py-3 text-lg font-bold transition hover:bg-white/20">-</button>
          <div className="text-center">
            <p className="text-lg font-bold">{line.qty}</p>
          </div>
          <button type="button" className="cursor-pointer rounded-xl bg-white/10 px-5 py-3 text-lg font-bold transition hover:bg-white/20">+</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
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
  const [showPayment, setShowPayment] = React.useState(false);
  const prevFinalized = React.useRef(false);

  const {
    agentState,
    handleOrbClick,
    status,
    getInputVolume,
    getOutputVolume,
    orderTotal,
    orderItems,
    previewLine,
    orderFinalized,
  } = useDriveThruVoiceDemo(agentId, conversationTokenPath);

  // Show payment modal as soon as order is finalized
  React.useEffect(() => {
    if (orderFinalized && !prevFinalized.current && orderItems.length > 0) {
      setShowPayment(true);
    }
    prevFinalized.current = orderFinalized;
  }, [orderFinalized, orderItems.length]);

  const currentLine = orderItems[orderItems.length - 1] ?? previewLine;
  const sheetVisible = Boolean(currentLine) && !showPayment;

  return (
    <div
      className="landing-page flex min-h-[100dvh] flex-col text-[#FFF7DD]"
      dir="rtl"
      lang="ar"
      style={{ backgroundColor: PAGE_BG }}
    >
      <DemoLogoBar />

      <div dir="ltr" className="flex min-h-0 flex-1 overflow-hidden px-4 py-6 sm:px-8">
        <div className="flex min-h-[calc(100dvh-8rem)] w-full items-center gap-6 overflow-hidden rounded-[2.25rem] bg-transparent">

          {/* Desktop side sheet */}
          <div className="hidden sm:flex shrink-0 items-center">
            <AnimatePresence initial={false} mode="wait">
              {sheetVisible && currentLine ? (
                <OrderSheet key={currentLine.lineKey} line={currentLine} />
              ) : null}
            </AnimatePresence>
          </div>

          {/* Orb + total */}
          <div className="flex flex-1 items-center justify-center">
            <div
              className={`flex flex-col items-center gap-4 transition-all duration-500 ease-out ${
                sheetVisible ? "sm:scale-100 scale-[0.72] -translate-y-16 sm:-translate-y-0" : "scale-100"
              }`}
            >
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

      {/* Mobile bottom sheet */}
      <AnimatePresence initial={false} mode="wait">
        {sheetVisible && currentLine ? (
          <div className="sm:hidden">
            <OrderSheet key={currentLine.lineKey} line={currentLine} />
          </div>
        ) : null}
      </AnimatePresence>

      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            orderItems={orderItems}
            orderTotal={orderTotal}
            onClose={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DriveThruDemoPage;