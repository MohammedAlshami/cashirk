"use client";

import {
  ConversationProvider,
  useConversation,
  type ConversationStatus,
} from "@elevenlabs/react";
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/styles/landing-ar.css";
import Link from "@/compat/next-link";
import type { AgentState } from "@/components/demo/Orb";

const Orb = lazy(() => import("@/components/demo/Orb").then((m) => ({ default: m.Orb })));

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
  /** Dark riyal glyph on light backgrounds (e.g. white receipt test). */
  darkSymbol?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-1 tabular-nums ${className ?? ""}`}>
      <span>{amount}</span>
      <SarSymbol className={darkSymbol ? "brightness-0 opacity-80" : undefined} />
    </span>
  );
}

const PLACEHOLDER_IMG =
  "https://images.deliveryhero.io/image/global-menu-service/HS_SA/vendor/136682/product/e0c22adb-e82f-470f-9878-bb4d1ac096e1.jpg?width=1024&quality=100&webp=true";

const RESTAURANT_LOGO =
  "https://daratalqahwa.com/wp-content/uploads/2024/03/logo-placement-01-1.png";

const PAGE_BG = "#503728";
/** Receipt card — testing white surface; revert to `#5c4336` + cream text when done. */
const RECEIPT_SURFACE = "#ffffff";

type ReceiptLine = {
  id: string;
  name: string;
  qty: number;
  unitAmount: string;
  lineAmount: string;
};

const RECEIPT_LINES: ReceiptLine[] = [
  { id: "1", name: "لاتيه كبير بالشوفان", qty: 1, unitAmount: "٥٫٢٥", lineAmount: "٥٫٢٥" },
  { id: "2", name: "كرواسون بالزبدة", qty: 1, unitAmount: "٤٫٢٥", lineAmount: "٤٫٢٥" },
];

const RECEIPT_TOTAL_AMOUNT = "٩٫٥٠";

/** Voice session auto-ends after this duration (ElevenLabs WebRTC). */
const SESSION_LIMIT_MS = 30_000;

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
                src={PLACEHOLDER_IMG}
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

function LogoBar() {
  return (
    <header dir="rtl" className="flex shrink-0 items-center justify-between gap-6 px-5 py-4 sm:px-8">
      <Link href="/" className="block shrink-0">
        <h2
          className="text-xl font-bold tracking-tight text-[#FFF7DD] transition-opacity hover:opacity-90"
          style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
        >
          كاشيرك
        </h2>
      </Link>
      <img
        src={RESTAURANT_LOGO}
        alt="دار القهوة"
        className="h-9 w-auto max-w-[min(52vw,220px)] object-contain object-right sm:h-11"
        loading="eager"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    </header>
  );
}

function DriveThruOrb({
  agentState,
  status,
  onOrbClick,
  getInputVolume,
  getOutputVolume,
}: {
  agentState: AgentState;
  status: ConversationStatus;
  onOrbClick: () => void | Promise<void>;
  getInputVolume: () => number;
  getOutputVolume: () => number;
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
      className="relative mx-auto block w-full max-w-[min(92vw,440px)] cursor-pointer rounded-full border-0 bg-transparent p-0 shadow-none outline-none ring-offset-4 ring-offset-[#503728] focus-visible:ring-2 focus-visible:ring-[#FFF7DD]/70 disabled:cursor-default disabled:opacity-95"
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

function DriveThruDemoInner() {
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endSessionRef = useRef<(() => void) | null>(null);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimerRef.current !== null) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  const { startSession, endSession, status, mode, getInputVolume, getOutputVolume } =
    useConversation({
      onConnect: () => {
        clearSessionTimer();
        sessionTimerRef.current = window.setTimeout(() => {
          endSessionRef.current?.();
          sessionTimerRef.current = null;
        }, SESSION_LIMIT_MS);
      },
      onDisconnect: () => {
        clearSessionTimer();
      },
    });

  endSessionRef.current = endSession;

  const agentState = useMemo((): AgentState => {
    if (status === "connecting") return "thinking";
    if (status !== "connected") return null;
    return mode === "speaking" ? "talking" : "listening";
  }, [status, mode]);

  const [voiceHint, setVoiceHint] = useState<string | null>(null);

  const handleOrbClick = async () => {
    if (status === "connecting" || status === "connected") return;

    setVoiceHint(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceHint("يلزم السماح بالميكروفون للتحدث مع الوكيل.");
      return;
    }

    let token: string | undefined;
    try {
      const res = await fetch("/api/elevenlabs/conversation-token");
      if (res.ok) {
        const data = (await res.json()) as { token?: string };
        token = data.token;
      }
    } catch {
      /* fall through — may use public agent id */
    }

    const viteAgentId =
      typeof import.meta.env.VITE_ELEVENLABS_AGENT_ID === "string" &&
      import.meta.env.VITE_ELEVENLABS_AGENT_ID.length > 0
        ? import.meta.env.VITE_ELEVENLABS_AGENT_ID
        : undefined;

    const arabic = {
      overrides: {
        agent: {
          language: "ar" as const,
        },
      },
    };

    if (token) {
      startSession({
        conversationToken: token,
        ...arabic,
      });
      return;
    }

    if (viteAgentId) {
      startSession({
        agentId: viteAgentId,
        ...arabic,
      });
      return;
    }

    setVoiceHint(
      "أضِف ELEVENLABS_API_KEY و ELEVENLABS_AGENT_ID في .env.local أو عيّن VITE_ELEVENLABS_AGENT_ID لوكيل عام.",
    );
  };

  return (
    <div
      className="landing-page flex min-h-screen flex-col text-[#FFF7DD]"
      dir="rtl"
      lang="ar"
      style={{ backgroundColor: PAGE_BG }}
    >
      <LogoBar />

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
