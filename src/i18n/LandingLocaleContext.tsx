"use client";

import React, { createContext, useContext } from "react";
import type { LandingLocale, LandingMessages } from "@/i18n/landing-messages";
import { landingMessages } from "@/i18n/landing-messages";

type LandingLocaleValue = {
  locale: LandingLocale;
  messages: LandingMessages;
  dir: "rtl" | "ltr";
  lang: "ar" | "en";
};

const LandingLocaleContext = createContext<LandingLocaleValue | null>(null);

export function LandingLocaleProvider({
  locale,
  children,
}: {
  locale: LandingLocale;
  children: React.ReactNode;
}) {
  const value = React.useMemo((): LandingLocaleValue => {
    const messages = landingMessages[locale];
    const dir = locale === "ar" ? "rtl" : "ltr";
    const lang = locale === "ar" ? "ar" : "en";
    return { locale, messages, dir, lang };
  }, [locale]);

  return (
    <LandingLocaleContext.Provider value={value}>{children}</LandingLocaleContext.Provider>
  );
}

export function useLandingLocale(): LandingLocaleValue {
  const ctx = useContext(LandingLocaleContext);
  if (!ctx) {
    throw new Error("useLandingLocale must be used within LandingLocaleProvider");
  }
  return ctx;
}
