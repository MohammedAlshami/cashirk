'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextEffectSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const textElements = containerRef.current.querySelectorAll('.text-effect');

    textElements.forEach((text) => {
      gsap.to(text, {
        backgroundSize: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: text,
          start: 'center 80%',
          end: 'center 20%',
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col justify-center items-start px-[10%] py-[10%] min-h-[200vh]"
    >
      <h1 className="text-effect">
        AI ANALYTICS<span>FOR BANKS</span>
      </h1>
      <h1 className="text-effect">
        REAL-TIME INSIGHTS<span>DATA-DRIVEN DECISIONS</span>
      </h1>
      <h1 className="text-effect">
        RISK ASSESSMENT<span>FRAUD DETECTION</span>
      </h1>
      <h1 className="text-effect">
        PREDICTIVE MODELING<span>MARKET ANALYSIS</span>
      </h1>
      <h1 className="text-effect">
        TRANSFORM BANKING<span>WITH AI POWER</span>
      </h1>

      <style jsx>{`
        .text-effect {
          font-family: 'Mori', sans-serif;
          font-size: 10vw;
          letter-spacing: -0.01em;
          line-height: 100%;
          margin: 0;
          width: 100%;
          color: rgba(182, 182, 182, 0.2);
          background: linear-gradient(to right, #b6b6b6, #b6b6b6) no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          background-size: 0%;
          transition: background-size cubic-bezier(0.1, 0.5, 0.5, 1) 0.5s;
          border-bottom: 1px solid #2F2B28;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          position: relative;
        }

        .text-effect span {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #4246ce;
          color: #0D0D0D;
          clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%);
          transform-origin: center;
          transition: all cubic-bezier(0.1, 0.5, 0.5, 1) 0.4s;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .text-effect:hover > span {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
        }

        .text-effect a {
          text-decoration: none;
          color: inherit;
        }
      `}</style>
    </div>
  );
}

