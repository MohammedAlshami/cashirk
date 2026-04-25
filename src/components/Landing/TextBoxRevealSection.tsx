'use client';

import React, { useRef } from 'react';
import { TextBoxReveal } from '@/components/v1/skiper70';
import ScrollArrowToContent from '@/components/Landing/ScrollArrowToContent';

const HIGHLIGHTS = [
  { word: 'workshop', textClass: '!text-[#0E100F]', bgClass: '!bg-amber-200/90' },
  { word: 'management', textClass: '!text-[#0E100F]', bgClass: '!bg-teal-200/90' },
  { word: 'customers', textClass: '!text-[#0E100F]', bgClass: '!bg-amber-300/90' },
  { word: 'employees', textClass: '!text-[#0E100F]', bgClass: '!bg-sky-200/90' },
  { word: 'assets', textClass: '!text-[#0E100F]', bgClass: '!bg-emerald-200/90' },
  { word: 'inventory', textClass: '!text-[#0E100F]', bgClass: '!bg-violet-200/90' },
  { word: 'invoicing', textClass: '!text-[#0E100F]', bgClass: '!bg-rose-200/90' },
  { word: 'operations', textClass: '!text-[#0E100F]', bgClass: '!bg-cyan-200/90' },
  { word: 'workflows', textClass: '!text-[#0E100F]', bgClass: '!bg-indigo-200/90' },
  { word: 'communication', textClass: '!text-[#0E100F]', bgClass: '!bg-lime-200/90' },
  { word: 'KPIs', textClass: '!text-[#0E100F]', bgClass: '!bg-green-200/90' },
  { word: 'control', textClass: '!text-[#0E100F]', bgClass: '!bg-fuchsia-200/90' },
  { word: 'measure', textClass: '!text-[#0E100F]', bgClass: '!bg-orange-200/90' },
  { word: 'grow', textClass: '!text-[#0E100F]', bgClass: '!bg-amber-200/90' },
];

export default function TextBoxRevealSection() {
  const arrowStartRef = useRef<HTMLElement | null>(null);

  return (
    <section className="pt-24 md:pt-32 pb-0 bg-[#0E100F] font-sf-pro-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-2xl leading-relaxed text-[#FFF7DD] md:text-3xl lg:text-4xl xl:text-5xl">
          <TextBoxReveal
            highlights={HIGHLIGHTS}
            scrollDrive
            className="mb-10 max-w-none w-full"
          >
            We provide workshop management solutions that help workshop owners
            manage customers, employees, assets, inventory, invoicing, and
            communication in one system.
          </TextBoxReveal>

          <div>
            <TextBoxReveal
              highlights={HIGHLIGHTS}
              scrollDrive
              className="max-w-none w-full"
              wordRef={(word, el) => {
                if (word === 'touch.') (arrowStartRef as React.MutableRefObject<HTMLElement | null>).current = el;
              }}
            >
              Imper helps workshop owners streamline operations, improve
              visibility across teams and stock, and keep every job, client,
              and invoice in sync.
            </TextBoxReveal>
          </div>
        </div>

        {/* Hand-drawn arrow: from "touch." (letter h) to first "T" of content heading - hidden for now */}
        <div className="hidden" aria-hidden>
          <ScrollArrowToContent startRef={arrowStartRef} />
        </div>
      </div>
    </section>
  );
}
