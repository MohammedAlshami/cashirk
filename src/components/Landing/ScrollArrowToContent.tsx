import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

/** Ref for the element where the arrow should start (e.g. word "touch." – path comes out from the h) */
export type ScrollArrowStartRef = React.RefObject<HTMLElement | null>;

const ARROW_TIP_ID = 'content-heading-first-letter';

/** Original loopy spiral path: starts at (40,90), ends at (155,45) in local coords */
const SPIRAL_PATH =
  'M40 90C45 85 55 75 65 85C75 95 65 110 55 105C45 100 50 80 65 70C80 60 95 70 100 85C105 100 95 115 85 110C75 105 80 85 95 70C110 55 130 50 155 45';

const SPIRAL_START = { x: 40, y: 90 };
const SPIRAL_END = { x: 155, y: 45 };

const STROKE_WIDTH = 3;

/**
 * Arrow from start element (e.g. "touch.") to the first "T" of the content heading.
 * Uses a curvy loopy spiral path, transformed so it runs from "touch." to "T".
 */
const ScrollArrowToContent = ({ startRef }: { startRef?: ScrollArrowStartRef }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [arrowPos, setArrowPos] = useState({ x: 0, y: 0, angle: 0 });
  const [groupTransform, setGroupTransform] = useState('');
  const [viewBox, setViewBox] = useState({ w: 100, h: 100 });

  const { scrollY } = useScroll();
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // Scroll range: when start element enters view → when content heading is in view
  useLayoutEffect(() => {
    const startEl = startRef?.current ?? null;
    const endElForScroll =
      typeof document !== 'undefined' ? document.getElementById('content-heading') : null;
    if (!startEl || !endElForScroll) return;

    let startScrollY = 0;
    let endScrollY = 1;

    const updateBounds = () => {
      const rectStart = startEl.getBoundingClientRect();
      const scroll = scrollY.get();
      startScrollY = scroll + rectStart.top - window.innerHeight;
      if (endElForScroll) {
        const rectEnd = endElForScroll.getBoundingClientRect();
        endScrollY = rectEnd.top + scroll - window.innerHeight * 0.4;
      }

      // Transform spiral so its start (40,90) → "touch." and end (155,45) → first "T"
      const tipEl =
        typeof document !== 'undefined' ? document.getElementById(ARROW_TIP_ID) : null;
      if (tipEl) {
        const rectTip = tipEl.getBoundingClientRect();
        const startX = rectStart.right - 4;
        const startY = rectStart.top + rectStart.height / 2;
        const endX = rectTip.left + 4;
        const endY = rectTip.top + rectTip.height / 2;
        const destDx = endX - startX;
        const destDy = endY - startY;
        const origDx = SPIRAL_END.x - SPIRAL_START.x;
        const origDy = SPIRAL_END.y - SPIRAL_START.y;
        const distOrig = Math.hypot(origDx, origDy) || 1;
        const distDest = Math.hypot(destDx, destDy) || 1;
        const scale = distDest / distOrig;
        const angleOrig = Math.atan2(origDy, origDx);
        const angleDest = Math.atan2(destDy, destDx);
        const angleDeg = ((angleDest - angleOrig) * 180) / Math.PI;
        const tx = startX - SPIRAL_START.x;
        const ty = startY - SPIRAL_START.y;
        // Transform: translate to start, rotate, scale, translate spiral start to origin
        setGroupTransform(
          `translate(${startX},${startY}) rotate(${angleDeg}) scale(${scale}) translate(${-SPIRAL_START.x},${-SPIRAL_START.y})`
        );
      }
      setViewBox({ w: window.innerWidth, h: window.innerHeight });
    };

    const updateProgress = () => {
      updateBounds();
      const scroll = scrollY.get();
      const denom = endScrollY - startScrollY;
      const p = denom !== 0 ? (scroll - startScrollY) / denom : 0;
      rawProgress.set(Math.max(0, Math.min(1, p)));
    };

    updateProgress();
    const unsub = scrollY.on('change', updateProgress);
    window.addEventListener('resize', updateProgress);
    const ro =
      typeof window !== 'undefined' &&
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updateProgress)
        : null;
    if (typeof document !== 'undefined') {
      const tipEl = document.getElementById(ARROW_TIP_ID);
      if (tipEl && ro) ro.observe(tipEl);
    }
    return () => {
      unsub();
      window.removeEventListener('resize', updateProgress);
      ro?.disconnect();
    };
  }, [startRef, scrollY, rawProgress]);

  // Arrowhead position and angle from path progress
  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        const currentLength = latest * length;
        const point = pathRef.current.getPointAtLength(currentLength);
        const lookBack = pathRef.current.getPointAtLength(Math.max(0, currentLength - 1));
        const lookAhead = pathRef.current.getPointAtLength(Math.min(length, currentLength + 1));
        const angle =
          Math.atan2(lookAhead.y - lookBack.y, lookAhead.x - lookBack.x) * (180 / Math.PI);
        setArrowPos({ x: point.x, y: point.y, angle });
      }
    });
  }, [smoothProgress, groupTransform]);

  const opacity = useTransform(smoothProgress, [0, 0.02], [0, 1]);
  const arrowColor = '#f5d0fe';

  return (
    <>
      {/* Spacer so layout below text is unchanged */}
      <div className="h-[316px] bg-[#0E100F] flex flex-col items-center py-2" aria-hidden />

      {/* Fixed overlay: curvy loopy spiral from "touch." to "T", transformed to fit */}
      <svg
        className="pointer-events-none fixed left-0 top-0 z-0 h-screen w-screen"
        viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {groupTransform && (
          <g transform={groupTransform}>
            <path
              ref={pathRef}
              d={SPIRAL_PATH}
              stroke="transparent"
              strokeWidth={STROKE_WIDTH}
            />
            <motion.path
              d={SPIRAL_PATH}
              stroke={arrowColor}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: smoothProgress, opacity }}
            />
            <motion.path
              d="M -10,-7 C -8,-7 2,-2 4,0 C 2,2 -8,7 -10,7 C -11,7 -11,4 -9,0 C -11,-4 -11,-7 -10,-7 Z"
              fill={arrowColor}
              stroke={arrowColor}
              strokeWidth="2"
              strokeLinejoin="round"
              style={{
                opacity,
                x: arrowPos.x,
                y: arrowPos.y,
                rotate: arrowPos.angle,
                scale: 0.7,
                transformOrigin: 'center',
              }}
            />
          </g>
        )}
      </svg>
    </>
  );
};

export default ScrollArrowToContent;
