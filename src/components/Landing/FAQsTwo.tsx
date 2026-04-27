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
      question: 'ما هو كاشيرك؟',
      answer:
        'كاشيرك وكيل صوتي بالذكاء الاصطناعي لممرات درايف ثرو يستمع ويتحدث مثل موظف تدريب ماهر ويلتقط التعديلات ويمرر التذاكر المكتملة إلى نقطة البيع أو شاشة المطبخ.',
    },
    {
      id: 'item-2',
      question: 'كيف يبدو للزبائن؟',
      answer:
        'يستخدم الوكيل كلاما منخفض التأخير وبصياغة آمنة للعلامة بحيث تبدو التحيات وعروض البيع الإضافي والتأكيدات طبيعية ومتسقة وسهلة المتابعة في الممر الصاخب.',
    },
    {
      id: 'item-3',
      question: 'هل يمكنه اتباع قائمتنا وسياساتنا؟',
      answer:
        'نعم. نُزامن القائمة والأسعار وأوقات اليوم وقواعد الامتثال ليحترم الوكيل العناصر المتوقفة والحساسيات والعروض كما يفعل عضو طاقم مدرب جيدا.',
    },
    {
      id: 'item-4',
      question: 'ماذا يحدث عندما يحتاج الزبون إلى إنسان؟',
      answer:
        'يمكن تصعيد الطلبات الحساسة أو المعقدة بسلاسة إلى عضو يرتدي سماعة مع الحفاظ على السياق لكي لا يكرر الزبون نفسه.',
    },
    {
      id: 'item-5',
      question: 'لمن صُمم كاشيرك؟',
      answer:
        'لعلامات الوجبات السريعة والمطاعم غير الرسمية وللمشغلين متعددي الفروع وللمجموعات الامتيازية التي تريد أتمتة صوتية موثوقة عند المكبر من دون المساس بدقة التذكرة.',
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
            style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
          >
            الأسئلة الشائعة
          </h2>
          <p
            className="mt-4 text-balance text-[#FFF7DD]/90"
          >
            إجابات مختصرة عن الوكيل الصوتي لممرات درايف ثرو وكيف يدعم ممراتك وطاقمك.
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
                  style={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}
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
            لم تجد ما تبحث عنه؟{' '}
            <Link
              href="/#contact"
              className="underline underline-offset-4"
            >
              تواصل معنا
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
