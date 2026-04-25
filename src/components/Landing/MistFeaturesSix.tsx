'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import {
  ArrowUp,
  CalendarCheck,
  Globe,
  Play,
  Plus,
  Signature,
  Sparkles,
  Target,
} from 'lucide-react';

const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4';
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4';
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4';
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4';

export default function MistFeaturesSix() {
  return (
    <section className="bg-[#0E100F] hidden">
      <div className="py-24">
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div>
            <h2
              className="text-balance text-2xl font-semibold md:text-3xl lg:text-4xl text-[#FFF7DD]"
              style={{ fontFamily: '"Mori", sans-serif' }}
            >
              Empowering teams with AI-driven solutions
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="soft" className="overflow-hidden p-6 border-white/10 bg-white/5">
              <Target className="size-5 text-[#FFF7DD]" />
              <h3
                className="mt-5 text-lg font-semibold text-[#FFF7DD]"
                style={{ fontFamily: '"Mori", sans-serif' }}
              >
                AI-powered drafting
              </h3>
              <p
                className="mt-3 text-balance text-sm leading-relaxed text-[#FFF7DD]/85"
              >
                Our AI helps turn natural language and templates into
                production-ready documents and content.
              </p>
              <MeetingIllustration />
            </Card>

            <Card variant="soft" className="group overflow-hidden px-6 pt-6 border-white/10 bg-white/5">
              <CalendarCheck className="size-5 text-[#FFF7DD]" />
              <h3
                className="mt-5 text-lg font-semibold text-[#FFF7DD]"
                style={{ fontFamily: '"Mori", sans-serif' }}
              >
                Intelligent review
              </h3>
              <p
                className="mt-3 text-balance text-sm leading-relaxed text-[#FFF7DD]/85"
              >
                We analyze content for clarity, compliance, and optimization so
                you can ship with confidence.
              </p>
              <CodeReviewIllustration />
            </Card>

            <Card variant="soft" className="group overflow-hidden px-6 pt-6 border-white/10 bg-white/5">
              <Sparkles className="size-5 text-[#FFF7DD]" />
              <h3
                className="mt-5 text-lg font-semibold text-[#FFF7DD]"
                style={{ fontFamily: '"Mori", sans-serif' }}
              >
                Contextual AI assistant
              </h3>
              <p
                className="mt-3 text-balance text-sm leading-relaxed text-[#FFF7DD]/85"
              >
                A companion that understands your context and helps with
                complex drafting and analysis.
              </p>
              <div className="-mx-2 -mt-2 overflow-hidden px-2 pt-2">
                <AIAssistantIllustration />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function MeetingIllustration() {
  const avatars = [
    { src: MESCHAC_AVATAR, alt: 'Person 1' },
    { src: BERNARD_AVATAR, alt: 'Person 2' },
    { src: THEO_AVATAR, alt: 'Person 3' },
    { src: GLODIE_AVATAR, alt: 'Person 4' },
  ];
  return (
    <Card aria-hidden className="mt-9 aspect-video p-4 border-white/10 bg-white/5">
      <div className="mb-0.5 text-sm font-semibold text-[#FFF7DD]">
        Strategy meeting
      </div>
      <div className="mb-4 flex gap-2 text-sm text-[#FFF7DD]/80">
        2:30 – 3:45 PM
      </div>
      <div className="mb-2 flex -space-x-1.5">
        {avatars.map((a, i) => (
          <div
            key={i}
            className="size-7 overflow-hidden rounded-full border border-white bg-white shadow shadow-black/5"
          >
            <img
              src={a.src}
              alt={a.alt}
              className="aspect-square size-full object-cover"
              width={28}
              height={28}
            />
          </div>
        ))}
      </div>
      <div className="text-sm font-medium text-[#FFF7DD]/80">
        Pipeline discussion
      </div>
    </Card>
  );
}

function CodeReviewIllustration() {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-[80%] translate-y-4 p-3 transition-transform duration-200 ease-in-out group-hover:-rotate-3 border-white/10 bg-white/5">
        <div className="mb-3 flex items-center gap-2">
          <div className="size-6 overflow-hidden rounded-full border border-white/20 bg-white/10 shadow shadow-black/5">
            <img
              src={MESCHAC_AVATAR}
              alt=""
              className="aspect-square size-full object-cover"
              width={24}
              height={24}
            />
          </div>
          <span className="text-sm font-medium text-[#FFF7DD]/80">
            Review
          </span>
          <span className="text-xs text-[#FFF7DD]/80">
            2m
          </span>
        </div>
        <div className="ml-8 space-y-2">
          <div className="h-2 rounded-full bg-white/15" />
          <div className="h-2 w-3/5 rounded-full bg-white/15" />
          <div className="h-2 w-1/2 rounded-full bg-white/15" />
        </div>
        <Signature className="ml-8 mt-3 size-5 text-[#FFF7DD]/40" />
      </Card>
      <Card className="aspect-[3/5] absolute -top-4 right-0 flex w-[40%] translate-y-4 p-2 transition-transform duration-200 ease-in-out group-hover:rotate-3 border-white/10 bg-white/5">
        <div className="m-auto flex size-10 rounded-full bg-white/10">
          <Play className="m-auto size-4 text-[#FFF7DD]/50" />
        </div>
      </Card>
    </div>
  );
}

function AIAssistantIllustration() {
  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video translate-y-4 p-4 pb-6 transition-transform duration-200 group-hover:translate-y-0 border-white/10 bg-white/5"
    >
      <div className="w-fit">
        <Sparkles className="size-3.5 fill-purple-300 stroke-purple-300" />
        <p className="mt-2 line-clamp-2 text-sm text-[#FFF7DD]">
          How can I speed up our document drafting and keep compliance in
          check?
        </p>
      </div>
      <div className="-mx-3 -mb-3 mt-3 space-y-3 rounded-lg p-3 bg-white/10">
        <div className="text-sm text-[#FFF7DD]/80">
          Ask AI Assistant
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7 rounded-2xl bg-transparent shadow-none"
            >
              <Globe className="size-4" />
            </Button>
          </div>
          <Button size="icon" className="size-7 rounded-2xl bg-black">
            <ArrowUp strokeWidth={3} className="text-[#FFF7DD]" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
