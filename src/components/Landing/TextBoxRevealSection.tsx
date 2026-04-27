'use client';

import React from 'react';
import { TextBoxReveal } from '@/components/v1/skiper70';

const HIGHLIGHTS = [
  { word: 'صوتية', textClass: '!text-[#0E100F]', bgClass: '!bg-amber-200/90' },
  { word: 'الذكاء', textClass: '!text-[#0E100F]', bgClass: '!bg-teal-200/90' },
  { word: 'الاصطناعي', textClass: '!text-[#0E100F]', bgClass: '!bg-amber-300/90' },
  { word: 'درايف', textClass: '!text-[#0E100F]', bgClass: '!bg-sky-200/90' },
  { word: 'ثرو', textClass: '!text-[#0E100F]', bgClass: '!bg-emerald-200/90' },
  { word: 'سيارة', textClass: '!text-[#0E100F]', bgClass: '!bg-violet-200/90' },
  { word: 'طلبات', textClass: '!text-[#0E100F]', bgClass: '!bg-rose-200/90' },
  { word: 'التعديلات', textClass: '!text-[#0E100F]', bgClass: '!bg-cyan-200/90' },
  { word: 'المطبخ', textClass: '!text-[#0E100F]', bgClass: '!bg-indigo-200/90' },
  { word: 'البيع', textClass: '!text-[#0E100F]', bgClass: '!bg-lime-200/90' },
  { word: 'كاشيرك', textClass: '!text-[#0E100F]', bgClass: '!bg-green-200/90' },
  { word: 'مطاعم', textClass: '!text-[#0E100F]', bgClass: '!bg-fuchsia-200/90' },
  { word: 'الانتظار', textClass: '!text-[#0E100F]', bgClass: '!bg-orange-200/90' },
  { word: 'المبيعات', textClass: '!text-[#0E100F]', bgClass: '!bg-amber-200/90' },
  { word: 'الحوار', textClass: '!text-[#0E100F]', bgClass: '!bg-teal-200/90' },
  { word: 'العلامة', textClass: '!text-[#0E100F]', bgClass: '!bg-sky-200/90' },
  { word: 'مكبر', textClass: '!text-[#0E100F]', bgClass: '!bg-emerald-200/90' },
];

export default function TextBoxRevealSection() {
  return (
    <section className="pt-24 md:pt-32 pb-0 bg-[#0E100F] font-sf-pro-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 text-2xl leading-relaxed text-[#FFF7DD] md:text-3xl lg:text-4xl xl:text-5xl">
          <TextBoxReveal
            highlights={HIGHLIGHTS}
            scrollDrive
            className="mb-10 max-w-none w-full"
          >
            نطوّر حلولا صوتية تعتمد الذكاء الاصطناعي لممرات درايف ثرو حيث يرحب
            بكل سيارة ويستلم طلبات دقيقة مع التعديلات ويرسلها مباشرة إلى شاشة
            المطبخ أو نقطة البيع دون إبطاء النافذة.
          </TextBoxReveal>

          <div>
            <TextBoxReveal highlights={HIGHLIGHTS} scrollDrive className="max-w-none w-full">
              كاشيرك تدعم مطاعم الوجبات السريعة والعلامات غير الرسمية على
              تقليل أوقات الانتظار واقتراح المزيد من المبيعات خلال الحوار
              والحفاظ على لهجة العلامة عند كل مكبر صوت.
            </TextBoxReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
