'use client';

import React, { createContext, useContext, useState } from 'react';
import type { CTAButtonVariant } from './ctaButtonVariants';

type LandingVariationContextValue = {
  ctaVariant: CTAButtonVariant;
  setCtaVariant: (v: CTAButtonVariant) => void;
};

const LandingVariationContext = createContext<LandingVariationContextValue | null>(null);

export function LandingVariationProvider({ children }: { children: React.ReactNode }) {
  const [ctaVariant, setCtaVariant] = useState<CTAButtonVariant>(4);
  return (
    <LandingVariationContext.Provider value={{ ctaVariant, setCtaVariant }}>
      {children}
    </LandingVariationContext.Provider>
  );
}

export function useLandingVariation(): LandingVariationContextValue {
  const ctx = useContext(LandingVariationContext);
  if (!ctx) {
    return {
      ctaVariant: 4,
      setCtaVariant: () => {},
    };
  }
  return ctx;
}
