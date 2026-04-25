'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from 'framer-motion';
import Link from '@/compat/next-link';
import Image from '@/compat/next-image';

const EXPANDED_SECTIONS: Array<{ id: string; label: string; href?: string; image: string }> = [
  { id: 'home', label: 'Home', href: '/', image: '/landing/images/1/bg.png' },
];

const SECTION_HEIGHT = 1500;

const MAIN_IMAGE_URL =
  'https://images.unsplash.com/photo-1734772001763-d01925bd5734?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const PARALLAX_HERO_IMAGES = [
  { src: '/landing/images/5-parallax-a.jpg', alt: 'Banking' },
  { src: '/landing/images/6-parallax-b.jpg', alt: 'Medical' },
];

/** Nav overlay uses same images as hero (center + parallax) */
const MENU_SCROLL_IMAGES = [MAIN_IMAGE_URL, PARALLAX_HERO_IMAGES[0].src, PARALLAX_HERO_IMAGES[1].src];

/** Single image card with grain overlay for nav menu (same treatment as hero) */
function NavMenuImageCard({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative w-full aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden">
      <Image src={src} alt="" fill className="object-cover" />
      <HighGrainOverlay containerRef={containerRef} />
    </div>
  );
}

/** Very high grain overlay for the center hero image */
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
  }, []);

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
                  style={{ fontFamily: '"Mori", sans-serif' }}
                >
                  Imper
                </h2>
              </Link>
              <div className="size-10 shrink-0" aria-hidden />
            </div>
          </motion.nav>
        </div>
      </header>

      {/* Full-screen modal: images left (one column up, one down), text right */}
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
              {/* Left: two image columns – full height, no margin above/below */}
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

              {/* Right: text links */}
              <div className="flex flex-1 items-center justify-center lg:justify-start">
                <nav className="flex flex-col items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                  <div className="text-sm font-medium text-[#FFF7DD]/40 lg:text-base">Overview</div>
                  {EXPANDED_SECTIONS.map((section) => (
                    <Link
                      key={section.id}
                      href={section.href ?? `/#${section.id}`}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#FFF7DD] tracking-tight transition-colors hover:text-[#FFF7DD]/80"
                      style={{ fontFamily: '"Mori", sans-serif' }}
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
  const { scrollY } = useScroll();
  const textScale = useTransform(scrollY, [0, 1200], [0.06, 1]);

  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />
      {/* IMPER text centered over the main image – starts very small, grows with scroll */}
      <div className="pointer-events-none absolute inset-0 z-10 flex justify-center">
        <div className="sticky top-0 h-screen flex items-center justify-center px-6">
          <motion.div className="text-right w-fit" style={{ scale: textScale }}>
            <h1
              className="font-bold tracking-tight leading-none mb-1 sm:mb-2 whitespace-nowrap select-none"
              style={{
                fontFamily: '"Mori", sans-serif',
                fontSize: 'clamp(48px, 11vw, 220px)',
                color: '#FFF7DD',
              }}
            >
              IMPER
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-medium tracking-wide whitespace-nowrap uppercase"
              style={{ fontFamily: '"Mori", sans-serif', color: '#FFF7DD' }}
            >
              Workshop management system
            </p>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-[#0E100F]/0 to-[#0E100F]" />
    </div>
  );
};

const CenterImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, 1200],
    ['32%', '100%']
  );
  const grainScale = useTransform(scrollY, [0, 1200], [0.32, 1]);
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      ref={containerRef}
      className="sticky top-0 h-screen w-full relative"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `url(${MAIN_IMAGE_URL})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 50%, transparent 100%)',
      }}
    >
      <div className="absolute inset-0 bg-[#0E100F]/60" aria-hidden />
      <motion.div
        className="absolute inset-0 origin-center"
        style={{ scale: grainScale }}
      >
        <HighGrainOverlay containerRef={containerRef} />
      </motion.div>
    </motion.div>
  );
};
