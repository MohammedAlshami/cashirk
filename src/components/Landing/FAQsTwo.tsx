'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from '@/compat/next-link';
import { useLandingLocale } from '@/i18n/LandingLocaleContext';
import { landingHashHref } from '@/i18n/landing-path';

const morphVariants = {
  hidden: { opacity: 0, scale: 0.97, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function FAQsTwo() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });
  const { locale, messages } = useLandingLocale();

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#0E100F]"
    >
      <motion.div
        className="mx-auto max-w-5xl px-4 md:px-6"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={morphVariants}
      >
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-[#FFF7DD]">
            {messages.faq.title}
          </h2>
          <p
            className="mt-4 text-balance text-[#FFF7DD]/90"
          >
            {messages.faq.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 shadow-sm ring-2 ring-white/5 md:px-8"
          >
            {messages.faq.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed border-white/10"
              >
                <AccordionTrigger
                  className="cursor-pointer text-base hover:no-underline text-[#FFF7DD]"
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p
                    className="text-base leading-relaxed text-[#FFF7DD]/85"
                  >
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p
            className="mt-6 px-6 md:px-8 text-[#FFF7DD]/90 text-[0.9375rem]"
          >
            {messages.faq.contactPrompt}{' '}
            <Link
              href={landingHashHref(locale, 'contact')}
              className="underline underline-offset-4"
            >
              {messages.faq.contactLink}
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
