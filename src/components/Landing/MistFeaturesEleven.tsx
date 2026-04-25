'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

const MIST11_TABS = [
  { id: 'clinic', label: 'Clinic', src: '/landing/images/1/bg.png', alt: 'Clinic' },
  { id: 'patients', label: 'Patients', src: '/landing/images/2/bg.png', alt: 'Patients' },
  { id: 'operations', label: 'Operations', src: '/landing/images/3/bg.png', alt: 'Operations' },
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

const tabImageVariants = {
  enter: { opacity: 0, scale: 0.97, filter: 'blur(8px)' },
  center: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, scale: 0.97, filter: 'blur(8px)', transition: { duration: 0.3 } },
};

export default function MistFeaturesEleven() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [activeTab, setActiveTab] = useState(0);

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
            className="text-balance text-2xl font-semibold md:text-3xl md:text-4xl text-[#FFF7DD]"
            style={{ fontFamily: '"Mori", sans-serif' }}
          >
            <span className="text-[#FFF7DD]/80">End-to-end medical management: </span>
            your clinic and your patients, in one system.
          </h2>
          <div className="mt-12 space-y-4">
            <div className="flex flex-wrap gap-2">
              {MIST11_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === i
                      ? 'bg-[#FFF7DD] text-[#0E100F]'
                      : 'bg-white/10 text-[#FFF7DD] hover:bg-white/15'
                  }`}
                  style={{ fontFamily: '"Mori", sans-serif' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Card
              variant="soft"
              className="relative overflow-hidden p-0 sm:col-span-2 border-white/10 bg-white/5"
            >
              <div className="relative w-full aspect-video">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeTab}
                    src={MIST11_TABS[activeTab].src}
                    alt={MIST11_TABS[activeTab].alt}
                    className="absolute inset-0 size-full object-cover opacity-40"
                    loading="lazy"
                    variants={tabImageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  />
                </AnimatePresence>
              </div>
            </Card>
          </div>
          <div className="mt-16 space-y-12 md:mt-20">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <h3
                  className="text-xl font-medium text-[#FFF7DD]"
                  style={{ fontFamily: '"Mori", sans-serif' }}
                >
                  Clinic operations
                </h3>
                <p
                  className="text-sm leading-relaxed text-[#FFF7DD]/85"
                >
                  Manage appointments, staff, and day-to-day operations in one
                  place. Our system keeps your clinic running smoothly from open
                  to close.
                </p>
              </div>
              <div className="space-y-2">
                <h3
                  className="text-xl font-medium text-[#FFF7DD]"
                  style={{ fontFamily: '"Mori", sans-serif' }}
                >
                  Patient journey
                </h3>
                <p
                  className="text-sm leading-relaxed text-[#FFF7DD]/85"
                >
                  From booking and check-in to follow-up and records—one system
                  for the full patient experience so nothing falls between the
                  cracks.
                </p>
              </div>
              <div className="space-y-2">
                <h3
                  className="text-xl font-medium text-[#FFF7DD]"
                  style={{ fontFamily: '"Mori", sans-serif' }}
                >
                  End-to-end
                </h3>
                <p
                  className="text-sm leading-relaxed text-[#FFF7DD]/85"
                >
                  One platform for both clinic and patients. No more juggling
                  tools; everything stays in sync so you can focus on care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
