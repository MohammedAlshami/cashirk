'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Users,
  Boxes,
  BriefcaseBusiness,
  Warehouse,
  MessagesSquare,
  type LucideIcon,
} from 'lucide-react';

const SOLUTIONS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Customer management',
    description:
      'Keep customer records, vehicle details, service history, and account information organized in one system.',
    icon: Users,
  },
  {
    title: 'Asset management',
    description:
      'Track workshop assets, equipment, and tools with clear ownership, status, and maintenance visibility.',
    icon: Boxes,
  },
  {
    title: 'Employee management',
    description:
      'Manage employees, roles, assignments, and performance in a structured workspace for daily operations.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Inventory management',
    description:
      'Monitor stock levels, parts usage, reorders, and workshop inventory movement with better control.',
    icon: Warehouse,
  },
  {
    title: 'Client communication and invoicing',
    description:
      'Handle client updates, billing, and invoices from one place to keep communication and cash flow aligned.',
    icon: MessagesSquare,
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
            style={{ fontFamily: '"Mori", sans-serif' }}
          >
            What the solution includes
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
                  className={`p-6 md:p-8 border-white/25 border-dashed ${!isSecondCol ? 'border-r' : ''} ${!isLastRow ? 'border-b' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-5 shrink-0 text-[#FFF7DD]" />
                    <h3
                      className="text-lg font-semibold text-[#FFF7DD]"
                      style={{ fontFamily: '"Mori", sans-serif' }}
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
