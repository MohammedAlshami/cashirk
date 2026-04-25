'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@/app/globals.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const words = [
  'design.',
  'prototype.',
  'solve.',
  'build.',
  'develop.',
  'debug.',
  'learn.',
  'cook.',
  'ship.',
  'prompt.',
  'collaborate.',
  'create.',
  'inspire.',
  'follow.',
  'innovate.',
  'test.',
  'optimize.',
  'teach.',
  'visualize.',
  'transform.',
  'scale.',
  'do it.',
];

export default function ScrollableWordsSection() {
  const [config] = useState({
    theme: 'dark',
    animate: true,
    snap: true,
    start: Math.floor(Math.random() * 100),
    end: Math.floor(Math.random() * 100) + 900,
    scroll: true,
    debug: false,
  });

  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const scrollerScrubRef = useRef<ScrollTrigger | null>(null);
  const dimmerScrubRef = useRef<ScrollTrigger | null>(null);
  const chromaEntryRef = useRef<gsap.core.Tween | null>(null);
  const chromaExitRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = config.theme;
    root.dataset.syncScrollbar = String(config.scroll);
    root.dataset.animate = String(config.animate);
    root.dataset.snap = String(config.snap);
    root.dataset.debug = String(config.debug);
    root.style.setProperty('--start', String(config.start));
    root.style.setProperty('--hue', String(config.start));
    root.style.setProperty('--end', String(config.end));

    const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];

    if (!config.animate) {
      if (chromaEntryRef.current?.scrollTrigger) {
        chromaEntryRef.current.scrollTrigger.disable(true, false);
      }
      if (chromaExitRef.current?.scrollTrigger) {
        chromaExitRef.current.scrollTrigger.disable(true, false);
      }
      dimmerScrubRef.current?.disable(true, false);
      scrollerScrubRef.current?.disable(true, false);
      gsap.set(items, { opacity: 1 });
      gsap.set(root, { '--chroma': 0 });
    } else {
      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
      dimmerScrubRef.current?.enable(true, true);
      scrollerScrubRef.current?.enable(true, true);
      if (chromaEntryRef.current?.scrollTrigger) {
        chromaEntryRef.current.scrollTrigger.enable(true, true);
      }
      if (chromaExitRef.current?.scrollTrigger) {
        chromaExitRef.current.scrollTrigger.enable(true, true);
      }
    }
  }, [config]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const items = itemsRef.current.filter(Boolean) as HTMLLIElement[];
    const contentSection = document.querySelector('.scrollable-words-content') as HTMLElement;
    
    if (items.length === 0 || !contentSection) return;

    // Wait for layout to calculate proper heights
    const setupAnimation = () => {
      // Set initial opacity - words stay in place, only opacity changes
      gsap.set(items, { 
        opacity: (i) => (i !== 0 ? 0.2 : 1),
        y: 0 // Ensure no vertical movement
      });

      // Use first and last items as triggers for the scroll range
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      
      if (!firstItem || !lastItem) return;

      // Create the dimmer animation for opacity changes only
      // Each word brightens as it reaches center, then dims as it passes
      // Words stay in their positions - no movement
      const dimmer = gsap
        .timeline()
        .to(items.slice(1), {
          opacity: 1,
          stagger: {
            each: 1 / items.length,
            from: 'start'
          },
          ease: 'none'
        })
        .to(
          items.slice(0, items.length - 1),
          {
            opacity: 0.2,
            stagger: {
              each: 1 / items.length,
              from: 'start'
            },
            ease: 'none'
          },
          0
        );

      // ScrollTrigger for dimmer effect - triggers as we scroll through the words
      dimmerScrubRef.current = ScrollTrigger.create({
        trigger: firstItem,
        endTrigger: lastItem,
        start: 'center center',
        end: 'center center',
        animation: dimmer,
        scrub: 0.5,
      });

      // Hue color animation
      const scroller = gsap
        .timeline()
        .fromTo(
          document.documentElement,
          {
            '--hue': config.start,
          },
          {
            '--hue': config.end,
            ease: 'none',
          }
        );

      scrollerScrubRef.current = ScrollTrigger.create({
        trigger: firstItem,
        endTrigger: lastItem,
        start: 'center center',
        end: 'center center',
        animation: scroller,
        scrub: 0.5,
      });

      // Chroma entry animation
      chromaEntryRef.current = gsap.fromTo(
        document.documentElement,
        {
          '--chroma': 0,
        },
        {
          '--chroma': 0.3,
          ease: 'none',
          scrollTrigger: {
            scrub: 0.5,
            trigger: firstItem,
            start: 'center center+=100',
            end: 'center center',
          },
        }
      );

      // Chroma exit animation
      chromaExitRef.current = gsap.fromTo(
        document.documentElement,
        {
          '--chroma': 0.3,
        },
        {
          '--chroma': 0,
          ease: 'none',
          scrollTrigger: {
            scrub: 0.5,
            trigger: items[items.length - 2] || lastItem,
            start: 'center center',
            end: 'center center-=100',
          },
        }
      );
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(setupAnimation, 100);
    });

    return () => {
      dimmerScrubRef.current?.kill();
      scrollerScrubRef.current?.kill();
      chromaEntryRef.current?.kill();
      chromaExitRef.current?.kill();
    };
  }, [config.start, config.end]);

  return (
    <div className="scrollable-words-section">
      <header className="scrollable-words-header">
        <h1 className="scrollable-words-fluid">you can<br />scroll.</h1>
      </header>

      <main className="scrollable-words-main">
        <section className="scrollable-words-content scrollable-words-fluid">
          <h2>
            <span aria-hidden="true">you can&nbsp;</span>
            <span className="scrollable-words-sr-only">you can ship things.</span>
          </h2>

          <ul aria-hidden="true" style={{ '--count': words.length } as React.CSSProperties}>
            {words.map((word, index) => (
              <li
                key={index}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                style={{ '--i': index } as React.CSSProperties}
              >
                {word}
              </li>
            ))}
          </ul>
        </section>

        <section className="scrollable-words-fin-section">
          <h2 className="scrollable-words-fluid">fin.</h2>
        </section>
      </main>


    </div>
  );
}

