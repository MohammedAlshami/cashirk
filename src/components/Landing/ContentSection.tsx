'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const CONTENT_TABS = [
  { id: 'voice', label: 'Voice agents', src: '/landing/images/1/bg.png', alt: 'Voice agents for debt collection' },
  { id: 'whatsapp', label: 'WhatsApp', src: '/landing/images/2/bg.png', alt: 'WhatsApp automation' },
  { id: 'email', label: 'Email', src: '/landing/images/3/bg.png', alt: 'Email automation' },
  { id: 'insights', label: 'Insights', src: '/landing/content-screenshot.png', alt: 'Analytics and reporting' },
];

/** Grain overlay over the content image (same style as hero section) */
function GrainOverlay({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
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
        data[i + 3] = 45;
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
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full rounded-xl"
      style={{
        imageRendering: 'pixelated',
        mixBlendMode: 'overlay',
      }}
      aria-hidden
    />
  );
}

const morphVariants = {
  hidden: { opacity: 0, scale: 0.97, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const tabImageVariants = {
  enter: { opacity: 0, scale: 0.97, filter: 'blur(8px)' },
  center: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, scale: 0.97, filter: 'blur(8px)', transition: { duration: 0.3 } },
};

export default function ContentSection() {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const grainContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-32 bg-[#0E100F]"
    >
      <motion.div
        className="container mx-auto space-y-8 px-4 sm:px-6 lg:px-8 md:space-y-12"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={morphVariants}
      >
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <div className="relative z-10">
          <h2
            id="content-heading"
            className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-[#FFF7DD]"
            style={{
              fontFamily: '"Mori", sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            <span id="content-heading-first-letter">T</span>ransform debt collection with AI that works across voice, WhatsApp, and email.
          </h2>
          </div>
          <div className="space-y-6 relative z-10">
            <p
              className="leading-relaxed text-[#FFF7DD]/90"
              style={{ fontFamily: '"Mori", sans-serif' }}
            >
              Shami is more than individual tools. We bring together voice agents,
              WhatsApp automation, and email automation into a single agentic
              debt-collection systemâ€”so you reach customers where they are, keep
              conversations consistent, and scale recovery with confidence.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {CONTENT_TABS.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === i
                    ? 'bg-[#FFF7DD] text-[#0E100F]'
                    : 'bg-white/10 text-[#FFF7DD] hover:bg-white/15'
                }`}
                style={{ fontFamily: '"Mori", sans-serif' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div ref={imageWrapRef} className="relative w-full overflow-hidden rounded-xl aspect-video">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                ref={grainContainerRef}
                className="absolute inset-0 rounded-xl overflow-hidden"
                variants={tabImageVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <img
                  src={CONTENT_TABS[activeTab].src}
                  alt={CONTENT_TABS[activeTab].alt}
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                />
                <GrainOverlay containerRef={grainContainerRef} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
