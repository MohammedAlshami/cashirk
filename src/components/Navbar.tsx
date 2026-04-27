'use client';

import React, { useState } from 'react';
import Link from '@/compat/next-link';
import Image from '@/compat/next-image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const BG_BASE = 'rgba(14, 16, 15, 0.72)';
const BG_SCROLLED = 'rgba(14, 16, 15, 0.92)';

// Use bg images from public/landing/images (not hover.png) for expanded nav cards
const EXPANDED_SECTIONS: Array<{ id: string; label: string; href?: string; image: string }> = [
  { id: 'home', label: 'Home', href: '/', image: '/landing/images/1/bg.png' },
];

// max-w-xl = 36rem = 576px, max-w-7xl = 80rem = 1280px (Tailwind)
const NAV_MAX_WIDTH_COLLAPSED = 576;
const NAV_MAX_WIDTH_EXPANDED = 1280; // max-w-7xl

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentExited, setContentExited] = useState(true); // true when collapsed so nav starts small
  const { scrollY } = useScroll();
  const navBackground = useTransform(scrollY, [0, 80], [BG_BASE, BG_SCROLLED]);
  const navShadow = useTransform(
    scrollY,
    [0, 80],
    ['none', '0 0.25rem 1.5rem rgba(0,0,0,0.24)']
  );

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full pt-2 font-sf-pro-display">
        <div className="flex w-full justify-center px-2 text-[#FFF7DD]">
          <motion.nav
            className="font-sf-pro-display w-full overflow-hidden border-0 bg-background py-2 backdrop-blur-xl"
            style={{
              backgroundColor: navBackground,
              boxShadow: navShadow,
            }}
            animate={{
              // Shrink nav bar only after expanded content has finished exiting
              height: isExpanded || !contentExited ? 'fit-content' : 56, // h-14 = 3.5rem
              borderRadius: isExpanded || !contentExited ? 24 : 16, // rounded-3xl, rounded-2xl
              maxWidth: isExpanded || !contentExited ? NAV_MAX_WIDTH_EXPANDED : NAV_MAX_WIDTH_COLLAPSED,
            }}
            transition={{
              height: { type: 'spring', damping: 28, stiffness: 120 },
              borderRadius: { type: 'spring', damping: 28, stiffness: 120 },
              maxWidth: { type: 'spring', damping: 28, stiffness: 120 },
            }}
          >
            <div className="flex w-full items-center justify-between px-4 text-[#FFF7DD]">
              <div className="flex items-center">
                {!isExpanded && (
                  <Link href="/" className="block">
                    <h2 className="flex text-xl font-medium leading-[1.2105263158] tracking-[0.012em] transition-opacity hover:opacity-90">
                      Cashirk
                    </h2>
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2" />
            </div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  className="h-full overflow-hidden px-8 pb-8 pt-5 transform-none opacity-100 lg:px-14"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 100 }}
                  onExitComplete={() => setContentExited(true)}
                >
                  <div className="mb-10 min-h-10 border-b border-foreground/10 opacity-100">
                    <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
                      <h2 className="text-3xl font-semibold leading-[1.2105263158] text-[#FFF7DD] lg:text-5xl">
                        Cashirk
                      </h2>
                    </div>
                  </div>
                  <div className="mt-6 p-2 opacity-100 lg:p-5">
                    <div className="flex items-center gap-2 text-foreground/40 lg:text-xl">
                      Overview
                    </div>
                    <div className="mt-5 flex max-w-xl flex-wrap gap-8 lg:mt-8">
                      {EXPANDED_SECTIONS.map((section) => (
                        <Link
                          key={section.id}
                          href={section.href ?? `/#${section.id}`}
                          className="group flex cursor-pointer flex-col items-center gap-4 text-[#FFF7DD]"
                          onClick={() => setIsExpanded(false)}
                        >
                          <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-colors group-hover:border-white/30">
                            <Image
                              src={section.image}
                              alt={section.label}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                          </div>
                          <span className="text-center text-lg font-medium capitalize transition-colors group-hover:text-[#FFF7DD]">
                            {section.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </div>
      </header>
    </>
  );
}
