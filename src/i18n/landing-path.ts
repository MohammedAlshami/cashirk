import type { LandingLocale } from "@/i18n/landing-messages";

/** Root path for the localized landing (Arabic default at `/`, English at `/en`). */
export function landingBase(locale: LandingLocale): "/" | "/en" {
  return locale === "ar" ? "/" : "/en";
}

export function landingHomeHref(locale: LandingLocale): "/" | "/en" {
  return landingBase(locale);
}

export function landingHashHref(locale: LandingLocale, hash: string): string {
  const base = landingBase(locale);
  const h = hash.replace(/^#/, "");
  return `${base}#${h}`;
}
