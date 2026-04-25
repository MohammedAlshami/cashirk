'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/compat/next-link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

const TOC_ITEMS = [
  { id: 'acceptance-of-terms', label: 'Acceptance of Terms' },
  { id: 'use-license', label: 'Use License' },
  { id: 'service-description', label: 'Service Description' },
  { id: 'user-accounts', label: 'User Accounts' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'user-content', label: 'User Content' },
  { id: 'ai-disclaimer', label: 'AI-Generated Content Disclaimer' },
  { id: 'limitation-of-liability', label: 'Limitation of Liability' },
  { id: 'termination', label: 'Termination' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'changes-to-terms', label: 'Changes to Terms' },
  { id: 'contact-information', label: 'Contact Information' },
];

export function TermsOfServicePage() {
  const [activeId, setActiveId] = useState<string>(TOC_ITEMS[0]?.id ?? '');

  useEffect(() => {
    const options: IntersectionObserverInit = {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.id) {
          setActiveId(entry.target.id);
          break;
        }
      }
    };

    const observer = new IntersectionObserver(callback, options);
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0E100F] text-[#F1F1F1]"
      style={{ fontFamily: '"Mori", sans-serif' }}
    >
      <div className="min-h-screen p-4 lg:p-12">
        {/* Back link */}
        <div className="pt-4 lg:pt-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="font-cal-sans pt-[40px] text-3xl md:text-5xl lg:pt-0 text-white">
          Terms &amp; Conditions
        </h1>

        <div className="relative mb-[50vh] flex gap-12 py-[40px] md:py-[80px]">
          {/* Sticky TOC – hidden on small screens */}
          <ul
            className="border-white/10 sticky top-24 hidden h-fit w-full max-w-[300px] space-y-4 border-l md:block"
            aria-label="Table of contents"
          >
            {TOC_ITEMS.map(({ id, label }) => (
              <li key={id} className="relative cursor-pointer pl-3">
                <a href={`#${id}`} className="block">
                  {activeId === id && (
                    <span
                      className="bg-foreground absolute -left-[1.5px] top-1/2 inline-block h-5 w-[2px] -translate-y-1/2 rounded-2xl"
                      style={{ background: 'currentColor' }}
                      aria-hidden
                    />
                  )}
                  <p
                    className={`transition-opacity duration-200 ${
                      activeId === id ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    {label}
                  </p>
                </a>
              </li>
            ))}
          </ul>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-[40px] md:gap-[60px]">
            <section id="acceptance-of-terms" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Acceptance of Terms
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  By accessing and using Shami&apos;s AI-powered document generation platform
                  (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this
                  Service.
                </p>
                <p className="lg:text-lg mt-4">
                  These Terms of Service apply to all users of the Service, including without
                  limitation users who are browsers, vendors, customers, merchants, and/or
                  contributors of content.
                </p>
              </div>
            </section>

            <section id="use-license" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Use License
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Permission is granted to temporarily use the Service for personal or commercial
                  purposes. This is the grant of a license, not a transfer of title, and under this
                  license you may not:
                </p>
                <ul className="list-disc space-y-2 pl-4 mt-4 lg:text-lg">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose without explicit permission</li>
                  <li>Attempt to decompile or reverse engineer any software contained in the Service</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
                </ul>
                <p className="lg:text-lg mt-4">
                  This license shall automatically terminate if you violate any of these restrictions
                  and may be terminated by Shami at any time.
                </p>
              </div>
            </section>

            <section id="service-description" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Service Description
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Shami provides AI-powered document generation and analysis services specifically
                  designed for banking and financial institutions. Our Service includes but is not
                  limited to:
                </p>
                <ul className="list-disc space-y-2 pl-4 mt-4 lg:text-lg">
                  <li>Automated document generation using artificial intelligence</li>
                  <li>Financial data analysis and reporting</li>
                  <li>Prospectus analysis and company research</li>
                  <li>Geographical analysis and visualization</li>
                  <li>Trend analysis and market insights</li>
                </ul>
              </div>
            </section>

            <section id="user-accounts" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                User Accounts
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  When you create an account with us, you must provide information that is accurate,
                  complete, and current at all times. Failure to do so constitutes a breach of the
                  Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p className="lg:text-lg mt-4">
                  You are responsible for safeguarding the password that you use to access the
                  Service and for any activities or actions under your password, whether your
                  password is with our Service or a third-party service.
                </p>
                <p className="lg:text-lg mt-4">
                  You agree not to disclose your password to any third party. You must notify us
                  immediately upon becoming aware of any breach of security or unauthorized use of
                  your account.
                </p>
              </div>
            </section>

            <section id="intellectual-property" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Intellectual Property
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  The Service and its original content (excluding Content provided by users),
                  features, and functionality are and will remain the exclusive property of Shami
                  and its licensors. The Service is protected by copyright, trademark, and other
                  laws of both Malaysia and foreign countries.
                </p>
                <p className="lg:text-lg mt-4">
                  Our trademarks and trade dress may not be used in connection with any product or
                  service without the prior written consent of Shami.
                </p>
              </div>
            </section>

            <section id="user-content" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                User Content
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  You retain all rights to the content you upload, submit, or display on or through
                  the Service. By uploading, submitting, or displaying content, you grant us a
                  worldwide, non-exclusive, royalty-free license to use, reproduce, and process
                  your content solely for the purpose of providing the Service.
                </p>
                <p className="lg:text-lg mt-4">
                  You represent and warrant that you own or have the necessary rights to all content
                  you submit and that such content does not violate any third-party rights or
                  applicable laws.
                </p>
              </div>
            </section>

            <section id="ai-disclaimer" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                AI-Generated Content Disclaimer
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  While our AI systems are designed to provide accurate and reliable information,
                  all AI-generated content should be reviewed and verified by qualified
                  professionals before use in critical business decisions or financial transactions.
                </p>
                <p className="lg:text-lg mt-4">
                  Shami does not guarantee the accuracy, completeness, or reliability of any
                  AI-generated content and shall not be held liable for any decisions made based on
                  such content.
                </p>
              </div>
            </section>

            <section id="limitation-of-liability" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Limitation of Liability
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  In no event shall Shami, nor its directors, employees, partners, agents,
                  suppliers, or affiliates, be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including without limitation, loss of profits,
                  data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc space-y-2 pl-4 mt-4 lg:text-lg">
                  <li>Your access to or use of or inability to access or use the Service</li>
                  <li>Any conduct or content of any third party on the Service</li>
                  <li>Any content obtained from the Service</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                </ul>
              </div>
            </section>

            <section id="termination" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Termination
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We may terminate or suspend your account immediately, without prior notice or
                  liability, for any reason whatsoever, including without limitation if you breach
                  the Terms.
                </p>
                <p className="lg:text-lg mt-4">
                  Upon termination, your right to use the Service will immediately cease. If you
                  wish to terminate your account, you may simply discontinue using the Service or
                  contact us to request account deletion.
                </p>
              </div>
            </section>

            <section id="governing-law" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Governing Law
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  These Terms shall be governed and construed in accordance with the laws of
                  Malaysia, without regard to its conflict of law provisions.
                </p>
                <p className="lg:text-lg mt-4">
                  Our failure to enforce any right or provision of these Terms will not be
                  considered a waiver of those rights. If any provision of these Terms is held to
                  be invalid or unenforceable by a court, the remaining provisions of these Terms
                  will remain in effect.
                </p>
              </div>
            </section>

            <section id="changes-to-terms" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Changes to Terms
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at
                  any time. If a revision is material, we will try to provide at least 30 days&apos;
                  notice prior to any new terms taking effect.
                </p>
                <p className="lg:text-lg mt-4">
                  What constitutes a material change will be determined at our sole discretion. By
                  continuing to access or use our Service after those revisions become effective,
                  you agree to be bound by the revised terms.
                </p>
              </div>
            </section>

            <section id="contact-information" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">
                Contact Information
              </h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 mt-4 lg:text-lg">
                  <p>
                    By email:{' '}
                    <a
                      href="mailto:contact@shami.ai"
                      className="text-white underline hover:text-white/80"
                    >
                      contact@shami.ai
                    </a>
                  </p>
                  <p>
                    By visiting our contact page:{' '}
                    <a href="mailto:contact@shami.ventures" className="text-white underline hover:text-white/80">
                      contact@shami.ventures
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-white/60 text-sm text-center">
            By using Shami&apos;s services, you acknowledge that you have read and understood these
            Terms of Service and agree to be bound by them.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
