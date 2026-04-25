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

  const faqItems = [
    {
      id: 'item-1',
      question: 'What does Imper do?',
      answer:
        'Imper is a workshop management system built to help workshop owners manage customers, employees, assets, inventory, and invoicing from one place.',
    },
    {
      id: 'item-2',
      question: 'What features are included?',
      answer:
        'The platform covers customer management, employee management, asset tracking, inventory control, job coordination, communication, and invoicing so daily operations stay organized.',
    },
    {
      id: 'item-3',
      question: 'Can the system be tailored to our workflow?',
      answer:
        'Yes. Imper is designed to adapt to how your workshop operates, so the system can support your processes, team structure, and operational needs.',
    },
    {
      id: 'item-4',
      question: 'Does Imper help with client communication and billing?',
      answer:
        'Yes. You can manage client communication and invoicing in one place, making it easier to keep customers updated and maintain clear billing records.',
    },
    {
      id: 'item-5',
      question: 'What kind of workshop is Imper for?',
      answer:
        'Imper is suited for workshop owners who need a professional system to manage operations, assets, stock, employees, and client relationships in one platform.',
    },
  ];

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
          <h2
            className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-[#FFF7DD]"
            style={{ fontFamily: '"Mori", sans-serif' }}
          >
            Solution FAQs
          </h2>
          <p
            className="mt-4 text-balance text-[#FFF7DD]/90"
          >
            Quick answers about the workshop management system and how it supports your operations.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 shadow-sm ring-2 ring-white/5 md:px-8"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed border-white/10"
              >
                <AccordionTrigger
                  className="cursor-pointer text-base hover:no-underline text-[#FFF7DD]"
                  style={{ fontFamily: '"Mori", sans-serif' }}
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
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link
              href="/#contact"
              className="underline underline-offset-4"
            >
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
