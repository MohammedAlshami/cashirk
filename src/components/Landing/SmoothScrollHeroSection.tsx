'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from '@/compat/next-link';
import Image from '@/compat/next-image';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const EXPANDED_SECTIONS: Array<{ id: string; label: string; href?: string; image: string }> = [
  { id: 'home', label: 'الرئيسية', href: '/', image: '/landing/images/1/bg.png' },
];

const MAIN_IMAGE_URL =
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const PARALLAX_HERO_IMAGES = [
  { src: '/landing/images/5-parallax-a.jpg', alt: 'خدمة درايف ثرو' },
  { src: '/landing/images/6-parallax-b.jpg', alt: 'مطعم خدمة سريعة' },
];

const MENU_SCROLL_IMAGES = [MAIN_IMAGE_URL, PARALLAX_HERO_IMAGES[0].src, PARALLAX_HERO_IMAGES[1].src];

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

  useMotionValueEvent(scrollY, 'change', () => {
    if (isExpanded) setIsExpanded(false);
  });

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full px-4 pt-2 font-sf-pro-display sm:px-6">
        <div className="flex w-full text-[#FFF7DD]">
          <motion.nav
            className="font-sf-pro-display w-full overflow-hidden rounded-2xl border-0 py-2"
            animate={{ height: 56, borderRadius: 16, maxWidth: '100%' }}
          >
            <div className="flex w-full items-center justify-between px-4 text-[#FFF7DD] sm:px-5">
              <Link href="/" className="block">
                <h2
                  className="flex text-xl font-bold tracking-tight transition-opacity hover:opacity-90"
                  style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
                >
                  كاشيرك
                </h2>
              </Link>
              <Link
                href="/demo"
                className="shrink-0 text-sm font-medium text-[#FFF7DD]/70 transition-colors hover:text-[#FFF7DD]"
                style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
              >
                تجربة القائمة
              </Link>
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
                      {[...MENU_SCROLL_IMAGES, ...MENU_SCROLL_IMAGES].map((src, idx) => (
                        <NavMenuImageCard key={`left-${idx}`} src={src} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 -my-8 nav-menu-scroll-up">
                    <div className="flex flex-col gap-8">
                      {[...MENU_SCROLL_IMAGES].reverse().concat([...MENU_SCROLL_IMAGES].reverse()).map((src, idx) => (
                        <NavMenuImageCard key={`right-${idx}`} src={src} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center lg:justify-start">
                <nav className="flex flex-col items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                  <div className="text-sm font-medium text-[#FFF7DD]/40 lg:text-base">نظرة عامة</div>
                  {EXPANDED_SECTIONS.map((section) => (
                    <Link
                      key={section.id}
                      href={section.href ?? `/#${section.id}`}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#FFF7DD] tracking-tight transition-colors hover:text-[#FFF7DD]/80"
                      style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
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
  return (
    <section className="relative w-full overflow-hidden bg-[#0E100F] pt-24 sm:pt-28">
      <ContainerScroll
        titleComponent={
          <>
            <h1
              className="mb-2 select-none font-bold leading-none tracking-tight text-[#FFF7DD] sm:mb-3"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontSize: 'clamp(40px, 9vw, 140px)',
              }}
            >
              كاشيرك
            </h1>
            <p
              className="mx-auto mb-2 max-w-2xl text-balance text-sm font-medium text-[#FFF7DD] sm:mb-3 sm:text-base md:text-lg lg:text-xl"
              style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
            >
              وكيل صوتي بالذكاء الاصطناعي لخدمة السيارات (درايف ثرو)
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
