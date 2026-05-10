"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const RESTAURANT_LOGO =
  "https://daratalqahwa.com/wp-content/uploads/2024/03/logo-placement-01-1.png";

export function DemoLogoBar({ centerAction }: { centerAction?: ReactNode }) {
  return (
    <header dir="rtl" className="flex shrink-0 items-center justify-between gap-6 px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="block shrink-0">
          <h2 className="text-xl font-bold tracking-tight text-[#FFF7DD] transition-opacity hover:opacity-90" style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
            كاشيرك
          </h2>
        </Link>
      </div>

      <div className="flex flex-1 justify-center">{centerAction ?? null}</div>

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
