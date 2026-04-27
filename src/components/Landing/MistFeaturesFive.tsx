'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mic,
  BookOpenCheck,
  Timer,
  Plug,
  LineChart,
  type LucideIcon,
} from 'lucide-react';

const SOLUTIONS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'طلب صوتي طبيعي',
    description:
      'ذكاء اصطناعي محادث عند مكبر الصوت يعيد الصياغة والتوضيح ويتعامل مع الطلبات الخاصة ليشعر الضيف أنه مُسمَع من دون إبطاء الطابور.',
    icon: Mic,
  },
  {
    title: 'حوار يفهم القائمة',
    description:
      'يتوافق مع أوقات اليوم والعروض المؤقتة وقائمة التوقف ليبقى اقتراح البيع الإضافي وتنبيهات الحساسية دقيقة ومطابقة للسياسات.',
    icon: BookOpenCheck,
  },
  {
    title: 'إنتاجية في الذروة',
    description:
      'يحافظ على استقرار استلام الطلبات عند اندفاع الزبائن ويقلل سوء الفهم ويحرر الطاقم ليركز على التسليم والضيافة.',
    icon: Timer,
  },
  {
    title: 'تسليم لنقطة البيع والمطبخ',
    description:
      'تذاكر منظمة تتدفق إلى نقطة البيع أو نظام عرض المطبخ مع بقاء التعديلات كما هي ليتحرك الطابور ويبقى الممر هادئا.',
    icon: Plug,
  },
  {
    title: 'رؤى أداء الممر',
    description:
      'راقب زمن المعالجة وتحويل العروض المقترحة ومعدلات التسليم لضبط النصوص والتشغيل والعروض وفق بيانات واضحة.',
    icon: LineChart,
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

export default function MistFeaturesFive() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} className="bg-[#0E100F]">
      <motion.div
        className="py-24"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={morphVariants}
      >
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <h2
            className="text-balance text-2xl font-semibold md:text-3xl lg:text-4xl text-[#FFF7DD] mb-10 md:mb-12"
            style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
          >
            ما الذي يشمله الحل
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {SOLUTIONS.map((item, i) => {
              const Icon = item.icon;
              const lastRowStart = SOLUTIONS.length - 1 - ((SOLUTIONS.length - 1) % 2);
              const isLastRow = i >= lastRowStart;
              const isSecondCol = i % 2 === 1;
              return (
                <div
                  key={i}
                  className={`p-6 md:p-8 border-white/25 border-dashed ${!isSecondCol ? 'border-e' : ''} ${!isLastRow ? 'border-b' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 shrink-0 text-[#FFF7DD]" />
                    <h3
                      className="text-lg font-semibold text-[#FFF7DD]"
                      style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-balance text-sm leading-relaxed text-[#FFF7DD]/85">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
