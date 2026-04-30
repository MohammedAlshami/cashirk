'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from '@/compat/next-link';
import Image from '@/compat/next-image';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useLandingLocale } from '@/i18n/LandingLocaleContext';
import { landingHashHref, landingHomeHref } from '@/i18n/landing-path';

const MAIN_IMAGE_URL = '/landing/hero-main.png';

const SHOW_DEMO_IN_LANDING_NAV = false;

const PARALLAX_SRC = ['/landing/images/5-parallax-a.jpg', '/landing/images/6-parallax-b.jpg'];

function NavMenuImageCard({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative w-full aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden">
      <Image src={src} alt="" fill className="object-cover" />
      <HighGrainOverlay containerRef={containerRef} />
    </div>
  );
}

function HighGrainOverlay({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const w = Math.ceil(rect.width * dpr);
      const h = Math.ceil(rect.height * dpr);
      if (w <= 0 || h <= 0) return;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 10;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const ro = typeof window !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) {
      ro.observe(container);
      resize();
    }
    return () => ro?.disconnect();
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full z-[1]"
      style={{
        imageRendering: 'pixelated',
        mixBlendMode: 'overlay',
        opacity: 0.45,
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 58%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 58%, transparent 100%)',
      }}
      aria-hidden
    />
  );
}

export function SmoothScrollHeroContent() {
  return (
    <>
      <LandingNav />
      <Hero />
    </>
  );
}

export const LandingNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollY } = useScroll();
  const { locale, messages } = useLandingLocale();

  const expandedSections = useMemo(
    () => [{ id: 'home', label: messages.nav.home, href: landingHashHref(locale, 'home') }],
    [locale, messages.nav.home],
  );

  const menuScrollImages = useMemo(
    () => [MAIN_IMAGE_URL, ...PARALLAX_SRC],
    [],
  );

  useMotionValueEvent(scrollY, 'change', () => {
    if (isExpanded) setIsExpanded(false);
  });

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
                  href={otherLocaleHref}
                  className="text-sm font-medium text-[#FFF7DD]/70 transition-colors hover:text-[#FFF7DD]"
                  aria-label={messages.language.currentAria}
                >
                  {otherLocaleLabel}
                </Link>
                {SHOW_DEMO_IN_LANDING_NAV ? (
                  <Link
                    href="/demo"
                    className="text-sm font-medium text-[#FFF7DD]/70 transition-colors hover:text-[#FFF7DD]"
                  >
                    {messages.nav.demo}
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.nav>
        </div>
      </header>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-[60] overflow-hidden"
            style={{ backgroundColor: '#0E100F' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-full w-full flex-col lg:flex-row gap-8 lg:gap-16 px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-24 pb-8 overflow-hidden">
              <div className="hidden lg:flex flex-1 gap-4 lg:gap-8 overflow-hidden min-h-0 -mt-20 sm:-mt-24 -mb-8">
                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 -my-8 nav-menu-scroll-down">
                    <div className="flex flex-col gap-8">
                      {[...menuScrollImages, ...menuScrollImages].map((src, idx) => (
                        <NavMenuImageCard key={`left-${idx}`} src={src} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 -my-8 nav-menu-scroll-up">
                    <div className="flex flex-col gap-8">
                      {[...menuScrollImages].reverse().concat([...menuScrollImages].reverse()).map((src, idx) => (
                        <NavMenuImageCard key={`right-${idx}`} src={src} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center lg:justify-start">
                <nav className="flex flex-col items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                  <div className="text-sm font-medium text-[#FFF7DD]/40 lg:text-base">
                    {messages.nav.menuOverview}
                  </div>
                  {expandedSections.map((section) => (
                    <Link
                      key={section.id}
                      href={section.href}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#FFF7DD] tracking-tight transition-colors hover:text-[#FFF7DD]/80"
                      onClick={() => setIsExpanded(false)}
                    >
                      {section.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nav-menu-scroll-down-kf {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes nav-menu-scroll-up-kf {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .nav-menu-scroll-down {
          animation: nav-menu-scroll-down-kf 25s linear infinite;
        }
        .nav-menu-scroll-up {
          animation: nav-menu-scroll-up-kf 25s linear infinite;
        }
        .nav-menu-scroll-down:hover,
        .nav-menu-scroll-up:hover {
          animation-play-state: paused;
        }
      `}} />
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
