'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useLandingLocale } from '@/i18n/LandingLocaleContext';
import { landingHomeHref } from '@/i18n/landing-path';

const MAIN_IMAGE_URL = '/landing/hero-main.png';

export function SmoothScrollHeroContent() {
  return (
    <>
      <LandingNav />
      <Hero />
    </>
  );
}

export const LandingNav = () => {
  const { locale, messages } = useLandingLocale();

  const otherLocaleHref = locale === 'ar' ? '/en' : '/';
  const otherLocaleLabel =
    locale === 'ar' ? messages.language.switchToEn : messages.language.switchToAr;

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full px-4 pt-2 font-sf-pro-display sm:px-6">
        <div className="flex w-full text-[#FFF7DD]">
          <motion.nav
            className="font-sf-pro-display w-full overflow-hidden rounded-2xl border-0 py-2"
            animate={{ height: 56, borderRadius: 16, maxWidth: '100%' }}
          >
            <div className="flex w-full items-center justify-between px-4 text-[#FFF7DD] sm:px-5">
              <Link href={landingHomeHref(locale)} className="block">
                <h2 className="flex text-xl font-bold tracking-tight transition-opacity hover:opacity-90">
                  {messages.nav.brand}
                </h2>
              </Link>
              <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <Link
                  href="/demo"
                  className="text-sm font-medium text-[#FFF7DD]/70 transition-colors hover:text-[#FFF7DD]"
                >
                  {messages.nav.demo}
                </Link>
                <Link
                  href={otherLocaleHref}
                  className="text-sm font-medium text-[#FFF7DD]/70 transition-colors hover:text-[#FFF7DD]"
                  aria-label={messages.language.currentAria}
                >
                  {otherLocaleLabel}
                </Link>
              </div>
            </div>
          </motion.nav>
        </div>
      </header>
    </>
  );
};

const Hero = () => {
  const { messages } = useLandingLocale();

  return (
    <section className="relative w-full overflow-hidden bg-[#0E100F] pt-24 sm:pt-28">
      <ContainerScroll
        titleComponent={
          <>
            <h1
              className="mb-2 select-none font-bold leading-none tracking-tight text-[#FFF7DD] sm:mb-3"
              style={{
                fontSize: 'clamp(40px, 9vw, 140px)',
              }}
            >
              {messages.hero.title}
            </h1>
            <p className="mx-auto mb-2 max-w-2xl text-balance text-sm font-medium text-[#FFF7DD] sm:mb-3 sm:text-base md:text-lg lg:text-xl">
              {messages.hero.tagline}
            </p>
          </>
        }
      >
        <div className="relative h-full min-h-[12rem] w-full overflow-hidden rounded-2xl">
          <img
            src={MAIN_IMAGE_URL}
            alt=""
            width={1400}
            height={720}
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0E100F]/50" aria-hidden />
        </div>
      </ContainerScroll>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-[#0E100F]" />
    </section>
  );
};
