"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollAnimationWrapper from "@/components/Landing/ScrollAnimationWrapper";

const QUOTE_TEXT =
  "كاشيرك وكيل صوتي بالذكاء الاصطناعي لممرات درايف ثرو يجيب على مكبر الصوت ويفهم الطلبات الطبيعية مع التعديلات والاستبدالات ويؤكد الإجماليات ويمرر تذاكر منظمة إلى نقطة البيع أو شاشة المطبخ ليبقى الطاقم مركزا على الطعام والخدمة.";

const SUBTITLE =
  "ذكاء اصطناعي صوتي لممرات درايف ثرو — سريع ودقيق ومتسق مع علامتك عند ذروة الطلب";

export default function ImageGridSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start 1.05", "start 0"],
  });

  const contentOpacity = useTransform(sectionProgress, [0.2, 0.5], [0, 1]);
  const contentY = useTransform(sectionProgress, [0.2, 0.5], [20, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-w-0 pb-20 sm:pb-24 md:pb-28 lg:pb-32 overflow-hidden bg-[#0E100F] font-sf-pro-display"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollAnimationWrapper>
          <motion.div className="relative" style={{ opacity: contentOpacity, y: contentY }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[60vh]">
              <div className="lg:border-e border-white/10 lg:pe-12">
                <p className="font-display-hero text-7xl sm:text-8xl lg:text-[8.75rem] font-extrabold tracking-tighter leading-[0.9] text-[#FFF7DD]">
                  ماذا نفعل
                </p>
              </div>
              <div>
                <p className="font-sf-pro-text text-2xl text-[#FFF7DD]/90 mb-6">{SUBTITLE}</p>
                <p className="font-sf-pro-display text-lg text-[#FFF7DD]/60 leading-relaxed">
                  {QUOTE_TEXT}
                </p>
              </div>
            </div>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>

    </section>
  );
}
