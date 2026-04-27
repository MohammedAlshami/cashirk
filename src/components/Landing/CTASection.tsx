'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLandingVariation } from './LandingVariationContext';
import {
  CTA_BUTTON_VARIANT_CLASSES,
  CTA_BUTTON_WRAPPER_CLASS,
  ctaNeedsWrapper,
} from './ctaButtonVariants';

const CAL_COM_URL = 'https://cal.com/shami.ventures';

const morphVariants = {
  hidden: { opacity: 0, scale: 0.97, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });
  const { ctaVariant } = useLandingVariation();

  const linkEl = (
    <a
      href={CAL_COM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={CTA_BUTTON_VARIANT_CLASSES[ctaVariant]}
      style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
    >
      احجز عرضا توضيحيا
    </a>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 sm:py-28 md:py-32 lg:py-40 overflow-hidden bg-[#0E100F]"
    >
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={morphVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 sm:mb-14 md:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 sm:gap-10">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none tracking-tight text-[#FFF7DD]"
              style={{
                fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                letterSpacing: '-0.03em',
              }}
            >
              <span className="block">هل أنت مستعد لترقية درايف ثرو لديك؟</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 flex-shrink-0">
              {ctaNeedsWrapper(ctaVariant) && CTA_BUTTON_WRAPPER_CLASS[ctaVariant] ? (
                <div className={CTA_BUTTON_WRAPPER_CLASS[ctaVariant]}>
                  {linkEl}
                </div>
              ) : (
                linkEl
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
