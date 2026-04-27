'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const BG = '#0E100F';
const TEXT = '#FFF7DD';

const morphVariants = {
  hidden: { opacity: 0, scale: 0.97, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });

  return (
    <div
      ref={sectionRef}
      className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10"
      style={{ backgroundColor: BG }}
    >
      <motion.footer
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={morphVariants}
        className="relative w-full overflow-hidden rounded-xl flex flex-col"
        style={{
          minHeight: '800px',
          backgroundColor: BG,
          fontFamily: '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif',
        }}
      >
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 z-10 py-24 md:py-32">
          <div className="relative inline-block overflow-visible w-full">
            <h2
              className="font-bold tracking-tight leading-none whitespace-nowrap text-center min-h-[1em]"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                fontSize: 'clamp(60px, 15vw, 300px)',
                color: TEXT,
              }}
            >
              كاشيرك
            </h2>
          </div>
        </div>

        <div className="z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 pb-8 mt-auto">
          <div className="flex flex-row flex-wrap items-baseline justify-center lg:justify-end gap-12 sm:gap-16 md:gap-24 mb-24">
            <div className="flex flex-col gap-2">
              <h4
                className="font-bold text-lg md:text-xl uppercase tracking-wide"
                style={{ color: TEXT }}
              >
                للاستفسارات تواصل معنا
              </h4>
              <a
                href="mailto:mshami2021@gmail.com"
                className="font-bold text-base md:text-lg hover:opacity-80 transition-opacity block"
                style={{ color: TEXT }}
              >
                mshami2021@gmail.com
              </a>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 text-xs sm:text-sm"
            style={{ color: 'rgba(255, 247, 221, 0.6)', fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
          >
            <p>© {new Date().getFullYear()} كاشيرك · جميع الحقوق محفوظة</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
