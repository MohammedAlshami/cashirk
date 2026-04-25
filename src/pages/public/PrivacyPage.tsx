'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/compat/next-link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

const TOC_ITEMS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'data-sharing', label: 'Data Sharing and Disclosure' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'privacy-rights', label: 'Your Privacy Rights' },
  { id: 'cookies', label: 'Cookies and Tracking' },
  { id: 'third-party', label: 'Third-Party Services' },
  { id: 'children-privacy', label: "Children's Privacy" },
  { id: 'international-transfers', label: 'International Data Transfers' },
  { id: 'changes', label: 'Changes to This Privacy Policy' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'dpo', label: 'Data Protection Officer' },
];

export function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-white/70 text-sm mt-2">Last updated: January 7, 2026</p>

        <div className="relative mb-[50vh] flex gap-12 py-[40px] md:py-[80px]">
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

          <div className="flex flex-1 flex-col gap-[40px] md:gap-[60px]">
            <section id="introduction" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Introduction</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Shami (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered document generation platform and services.
                </p>
                <p className="lg:text-lg mt-4">
                  Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
                </p>
              </div>
            </section>

            <section id="information-we-collect" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Information We Collect</h3>
              <div className="opacity-[0.85] text-white/90">
                <h4 className="text-lg font-semibold text-white mt-6 mb-2">Personal Information</h4>
                <p className="lg:text-lg">
                  We may collect personal information that you voluntarily provide when you register, use our services, contact us, or subscribe to communications. This may include name, email, company, job title, phone, billing information, and account credentials.
                </p>
                <h4 className="text-lg font-semibold text-white mt-6 mb-2">Usage Data</h4>
                <p className="lg:text-lg">
                  We automatically collect IP address, browser type, device information, pages visited, features used, and referring URLs.
                </p>
                <h4 className="text-lg font-semibold text-white mt-6 mb-2">Document and Content Data</h4>
                <p className="lg:text-lg">
                  When you use our AI services we collect documents you upload, templates you create, generated content, chat messages, and analysis inputs.
                </p>
              </div>
            </section>

            <section id="how-we-use" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">How We Use Your Information</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">We use the information we collect to:</p>
                <ul className="list-disc space-y-2 pl-4 mt-4 lg:text-lg">
                  <li>Provide, operate, and maintain our Service</li>
                  <li>Process documents and generate AI-powered content</li>
                  <li>Improve, personalize, and expand our Service</li>
                  <li>Understand and analyze how you use our Service</li>
                  <li>Develop new products, services, and features</li>
                  <li>Communicate with you for support and updates</li>
                  <li>Process transactions and manage your account</li>
                  <li>Detect and prevent technical issues and security threats</li>
                  <li>Comply with legal obligations and enforce our terms</li>
                </ul>
              </div>
            </section>

            <section id="data-security" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Data Security</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We implement industry-standard security measures including encryption in transit and at rest, secure data centers, access controls, and compliance with banking industry standards. No method of transmission over the Internet is 100% secure; we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section id="data-sharing" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Data Sharing and Disclosure</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We do not sell, trade, or rent your personal information. We may share information with service providers (hosting, payments, analytics, support), when required by law, or in connection with a merger, acquisition, or sale of assets.
                </p>
              </div>
            </section>

            <section id="data-retention" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Data Retention</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We retain your information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When you delete your account, we delete or anonymize your personal information within 30 days unless we must retain it for legal purposes.
                </p>
              </div>
            </section>

            <section id="privacy-rights" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Your Privacy Rights</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Depending on your location, you may have rights to access, correct, delete, or port your data, and to object to or restrict processing. To exercise these rights, please contact us at{' '}
                  <a href="mailto:privacy@shami.ai" className="text-white underline hover:text-white/80">privacy@shami.ai</a>.
                </p>
              </div>
            </section>

            <section id="cookies" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Cookies and Tracking Technologies</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We use essential, analytics, preference, and marketing cookies. You can instruct your browser to refuse cookies, but some portions of our Service may not function properly.
                </p>
              </div>
            </section>

            <section id="third-party" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Third-Party Services</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Our Service may contain links to third-party sites. We have no control over their content or privacy practices. We advise you to review the Privacy Policy of every site you visit.
                </p>
              </div>
            </section>

            <section id="children-privacy" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Children&apos;s Privacy</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Our Service is not intended for users under 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>
            </section>

            <section id="international-transfers" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">International Data Transfers</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  Your information may be transferred to and maintained on servers outside your country. By using our Service, you consent to the transfer of your information to Malaysia and other countries. We will take steps to ensure your data is treated securely and in accordance with this Privacy Policy.
                </p>
              </div>
            </section>

            <section id="changes" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Changes to This Privacy Policy</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  We may update this Privacy Policy from time to time. We will notify you by posting the new policy on this page and updating the &quot;Last updated&quot; date. We may also send an email for significant changes. Please review this Privacy Policy periodically.
                </p>
              </div>
            </section>

            <section id="contact" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Contact Us</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">If you have questions about this Privacy Policy or our data practices:</p>
                <div className="space-y-2 mt-4 lg:text-lg">
                  <p>By email: <a href="mailto:privacy@shami.ai" className="text-white underline hover:text-white/80">privacy@shami.ai</a></p>
                  <p>By email: <a href="mailto:contact@shami.ai" className="text-white underline hover:text-white/80">contact@shami.ai</a></p>
                  <p>By visiting: <a href="mailto:contact@shami.ventures" className="text-white underline hover:text-white/80">contact@shami.ventures</a></p>
                </div>
              </div>
            </section>

            <section id="dpo" className="space-y-4 md:space-y-6">
              <h3 className="font-cal-sans text-xl lg:text-3xl text-white">Data Protection Officer</h3>
              <div className="opacity-[0.85] text-white/90">
                <p className="lg:text-lg">
                  For data protection concerns or to exercise your privacy rights, contact our Data Protection Officer at{' '}
                  <a href="mailto:dpo@shami.ai" className="text-white underline hover:text-white/80">dpo@shami.ai</a>.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-white/60 text-sm text-center">
            By using Shami&apos;s services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
