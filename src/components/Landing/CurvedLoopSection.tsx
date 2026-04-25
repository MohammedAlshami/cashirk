'use client';

import React from 'react';
import CurvedLoop from './shadcn/CurvedLoop';

export default function CurvedLoopSection() {
  return (
    <section id="curved-loop-section" className="relative w-full overflow-visible -mt-32 lg:-mt-96 z-10" style={{ backgroundColor: 'transparent' }}>
      <div className="relative" style={{ height: '100vh', minHeight: '600px' }}>
        {/* Right side gradient blend only - left side removed */}
        <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-20 bg-gradient-to-l from-[#181818] to-transparent" />
        
        <CurvedLoop
          marqueeText="AI-Powered Analytics • Real-Time Insights • Automated Workflows • Intelligent Document Processing • Advanced Data Extraction • Smart Decision Making • Seamless Integration • Enterprise-Grade Security • "
          speed={2}
          className="fill-white"
          curveAmount={400}
          direction="left"
          interactive={true}
        />
      </div>
    </section>
  );
}

