'use client';

import React from 'react';
import { TextBoxReveal } from '@/components/v1/skiper70';
import { useLandingLocale } from '@/i18n/LandingLocaleContext';

export default function TextBoxRevealSection() {
  const { messages } = useLandingLocale();
  const { paragraph1, paragraph2, highlights } = messages.textReveal;

  return (
    <section className="pt-24 md:pt-32 pb-0 bg-[#0E100F] font-sf-pro-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-2xl leading-relaxed text-[#FFF7DD] md:text-3xl lg:text-4xl xl:text-5xl">
          <TextBoxReveal
            highlights={highlights}
            scrollDrive
            className="mb-10 max-w-none w-full"
          >
            {paragraph1}
          </TextBoxReveal>

          <div>
            <TextBoxReveal highlights={highlights} scrollDrive className="max-w-none w-full">
              {paragraph2}
            </TextBoxReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
