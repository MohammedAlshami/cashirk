"use client";

import React from "react";
import { ReactLenis } from "lenis/react";
import { useLandingLocale } from "@/i18n/LandingLocaleContext";
import { SmoothScrollHeroContent } from "@/components/Landing/SmoothScrollHeroSection";
import ImageGridSection from "@/components/Landing/ImageGridSection";
import TextBoxRevealSection from "@/components/Landing/TextBoxRevealSection";
import MistFeaturesFive from "@/components/Landing/MistFeaturesFive";
import IntegrationsSection from "@/components/Landing/IntegrationsSection";
import MistFeaturesSix from "@/components/Landing/MistFeaturesSix";
import FAQsTwo from "@/components/Landing/FAQsTwo";
import CTASection from "@/components/Landing/CTASection";
import { LandingVariationProvider } from "@/components/Landing/LandingVariationContext";
import Footer from "@/components/Footer";

export function LandingPage() {
  const { dir, lang, locale } = useLandingLocale();

  return (
    <LandingVariationProvider>
      <div
        className="landing-page min-h-screen relative text-[#FFF7DD]"
        dir={dir}
        lang={lang}
        data-locale={locale}
        style={{ backgroundColor: '#0E100F' }}
      >
        <ReactLenis root options={{ lerp: 0.05 }}>
          <div className="relative z-[1]">
            <SmoothScrollHeroContent />

            <div id="what-we-do">
              <ImageGridSection />
            </div>

            <div id="text-reveal">
              <TextBoxRevealSection />
            </div>

            <div id="solutions">
              <MistFeaturesFive />
            </div>

            <div id="integrations">
              <IntegrationsSection />
            </div>

            <div id="mist-6">
              <MistFeaturesSix />
            </div>

            <div id="features-start" className="h-px w-full" aria-hidden />
            <div className="relative z-10">
              <div id="faq">
                <FAQsTwo />
              </div>

              <CTASection />

              <div id="contact">
                <Footer />
              </div>
            </div>
          </div>
        </ReactLenis>
      </div>
    </LandingVariationProvider>
  );
}
