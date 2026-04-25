export type CTAButtonVariant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const baseCtaClasses =
  'inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export const CTA_BUTTON_VARIANT_CLASSES: Record<CTAButtonVariant, string> = {
  1: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  2: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  3: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  4: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  5: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  6: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  7: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
  8: `${baseCtaClasses} bg-[#FFF7DD] text-[#0E100F] hover:bg-white`,
};

export const CTA_BUTTON_WRAPPER_CLASS: Partial<Record<CTAButtonVariant, string>> = {};

export function ctaNeedsWrapper(_variant: CTAButtonVariant): boolean {
  return false;
}
