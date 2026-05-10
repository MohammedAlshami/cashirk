'use client';

import React, { useRef } from 'react';
import {
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from 'framer-motion';

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[44rem] flex-col items-center justify-start px-2 pb-4 pt-16 sm:pt-20 md:h-[54rem] md:px-12 md:pb-8 md:pt-24"
    >
      <div
        className="relative w-full pb-4 pt-2 md:pb-12 md:pt-6"
        style={{ perspective: '1000px' }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

function Header({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) {
  return (
    <motion.div
      style={{ y: translate }}
      className="mx-auto max-w-5xl px-4 text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
      className="mx-auto mt-5 h-[22rem] w-full max-w-5xl rounded-[28px] border border-white/[0.12] bg-[#141615] p-2 shadow-2xl sm:mt-7 sm:h-[26rem] md:mt-10 md:h-[36rem] md:rounded-[30px] md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-[#0E100F] md:rounded-2xl md:p-1">
        {children}
      </div>
    </motion.div>
  );
}
