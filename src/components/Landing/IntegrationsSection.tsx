'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import Image from '@/compat/next-image';
import { useLandingLocale } from '@/i18n/LandingLocaleContext';

const INTEGRATIONS: {
  id: string;
  nameAr: string;
  nameEn: string;
  src: string;
}[] = [
  {
    id: 'foodics',
    nameAr: 'فوديكس',
    nameEn: 'Foodics',
    src: '/landing/integrations/foodics-favicon.png',
  },
  {
    id: 'zid',
    nameAr: 'زد',
    nameEn: 'Zid',
    src: '/landing/integrations/zid-favicon.png',
  },
  {
    id: 'salla',
    nameAr: 'سلّة',
    nameEn: 'Salla',
    src: '/landing/integrations/salla.svg',
  },
  {
    id: 'square',
    nameAr: 'سكوير',
    nameEn: 'Square',
    src: '/landing/integrations/square.svg',
  },
  {
    id: 'odoo',
    nameAr: 'أودو',
    nameEn: 'Odoo',
    src: '/landing/integrations/odoo.svg',
  },
  {
    id: 'qoyod',
    nameAr: 'قيود',
    nameEn: 'Qoyod',
    src: '/landing/integrations/qoyod-favicon.png',
  },
  {
    id: 'lightspeed',
    nameAr: 'لايت سبيد',
    nameEn: 'Lightspeed',
    src: '/landing/integrations/lightspeed-favicon.png',
  },
];

const morphVariants = {
  hidden: { opacity: 0, scale: 0.97, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function IntegrationsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });
  const { locale, messages } = useLandingLocale();
  const primaryIsAr = locale === 'ar';

  return (
    <section ref={sectionRef} id="integrations" className="bg-[#0E100F]">
      <motion.div
        className="py-24"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={morphVariants}
      >
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <h2 className="mb-14 text-balance text-center text-3xl font-semibold md:mb-16 md:text-4xl lg:text-5xl text-[#FFF7DD]">
            {messages.integrations.sectionTitle}
          </h2>

          <ul className="flex flex-wrap items-end justify-center gap-x-8 gap-y-14 sm:gap-x-12 md:gap-x-16 md:gap-y-16 lg:gap-x-20">
            {INTEGRATIONS.map((item) => {
              const isSvg = item.src.endsWith('.svg');
              const primary = primaryIsAr ? item.nameAr : item.nameEn;
              const secondary = primaryIsAr ? item.nameEn : item.nameAr;
              return (
                <li key={item.id} className="flex w-[10rem] flex-col items-center sm:w-[11rem] md:w-[12rem]">
                  {isSvg ? (
                    <img
                      src={item.src}
                      alt=""
                      className="max-h-14 w-auto max-w-[9rem] object-contain brightness-0 invert opacity-[0.88] transition-opacity hover:opacity-100 sm:max-h-16 md:max-h-[4.5rem] md:max-w-[10rem]"
                      width={160}
                      height={72}
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt=""
                      width={128}
                      height={128}
                      className="h-16 w-16 object-contain opacity-90 transition-opacity hover:opacity-100 sm:h-[4.5rem] sm:w-[4.5rem] md:h-20 md:w-20"
                      loading="lazy"
                    />
                  )}
                  <span className="mt-4 text-center text-base font-medium text-[#FFF7DD] sm:text-lg md:text-xl">
                    {primary}
                  </span>
                  <span className="mt-1 text-center text-xs font-medium uppercase tracking-[0.12em] text-[#FFF7DD]/40 sm:text-sm md:text-base">
                    {secondary}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
