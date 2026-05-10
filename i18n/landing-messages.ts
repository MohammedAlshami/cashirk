import type { HighlightConfig } from "@/components/v1/skiper70";

export type LandingLocale = "ar" | "en";

export type SolutionItem = {
  title: string;
  description: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type LandingMessages = {
  nav: {
    brand: string;
    demo: string;
    menuOverview: string;
    home: string;
  };
  language: {
    switchToAr: string;
    switchToEn: string;
    currentAria: string;
  };
  hero: {
    title: string;
    tagline: string;
  };
  parallaxImages: { altA: string; altB: string };
  imageGrid: {
    title: string;
    subtitle: string;
    quote: string;
  };
  textReveal: {
    paragraph1: string;
    paragraph2: string;
    highlights: HighlightConfig[];
  };
  solutions: {
    sectionTitle: string;
    items: SolutionItem[];
  };
  integrations: {
    sectionTitle: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
    contactPrompt: string;
    contactLink: string;
  };
  cta: {
    title: string;
    button: string;
  };
  footer: {
    contactHeading: string;
    copyright: string;
  };
};

const highlight = (
  word: string,
  textClass = "!text-[#0E100F]",
  bgClass = "!bg-amber-200/90",
): HighlightConfig => ({ word, textClass, bgClass });

export const landingMessages: Record<LandingLocale, LandingMessages> = {
  ar: {
    nav: {
      brand: "كاشيرك",
      demo: "تجربة القائمة",
      menuOverview: "نظرة عامة",
      home: "الرئيسية",
    },
    language: {
      switchToAr: "العربية",
      switchToEn: "English",
      currentAria: "تبديل اللغة",
    },
    hero: {
      title: "كاشيرك",
      tagline: "وكيل صوتي بالذكاء الاصطناعي لخدمة السيارات (درايف ثرو)",
    },
    parallaxImages: {
      altA: "خدمة درايف ثرو",
      altB: "مطعم خدمة سريعة",
    },
    imageGrid: {
      title: "ماذا نفعل",
      subtitle:
        "ذكاء اصطناعي صوتي لممرات درايف ثرو — سريع ودقيق ومتسق مع علامتك عند ذروة الطلب",
      quote:
        "كاشيرك وكيل صوتي بالذكاء الاصطناعي لممرات درايف ثرو يجيب على مكبر الصوت ويفهم الطلبات الطبيعية مع التعديلات والاستبدالات ويؤكد الإجماليات ويمرر تذاكر منظمة إلى نقطة البيع أو شاشة المطبخ ليبقى الطاقم مركزا على الطعام والخدمة.",
    },
    textReveal: {
      paragraph1:
        "نطوّر حلولا صوتية تعتمد الذكاء الاصطناعي لممرات درايف ثرو حيث يرحب بكل سيارة ويستلم طلبات دقيقة مع التعديلات ويرسلها مباشرة إلى شاشة المطبخ أو نقطة البيع دون إبطاء النافذة.",
      paragraph2:
        "كاشيرك تدعم مطاعم الوجبات السريعة والعلامات غير الرسمية على تقليل أوقات الانتظار واقتراح المزيد من المبيعات خلال الحوار والحفاظ على لهجة العلامة عند كل مكبر صوت.",
      highlights: [
        highlight("صوتية", "!text-[#0E100F]", "!bg-amber-200/90"),
        highlight("الذكاء", "!text-[#0E100F]", "!bg-teal-200/90"),
        highlight("الاصطناعي", "!text-[#0E100F]", "!bg-amber-300/90"),
        highlight("درايف", "!text-[#0E100F]", "!bg-sky-200/90"),
        highlight("ثرو", "!text-[#0E100F]", "!bg-emerald-200/90"),
        highlight("سيارة", "!text-[#0E100F]", "!bg-violet-200/90"),
        highlight("طلبات", "!text-[#0E100F]", "!bg-rose-200/90"),
        highlight("التعديلات", "!text-[#0E100F]", "!bg-cyan-200/90"),
        highlight("المطبخ", "!text-[#0E100F]", "!bg-indigo-200/90"),
        highlight("البيع", "!text-[#0E100F]", "!bg-lime-200/90"),
        highlight("كاشيرك", "!text-[#0E100F]", "!bg-green-200/90"),
        highlight("مطاعم", "!text-[#0E100F]", "!bg-fuchsia-200/90"),
        highlight("الانتظار", "!text-[#0E100F]", "!bg-orange-200/90"),
        highlight("المبيعات", "!text-[#0E100F]", "!bg-amber-200/90"),
        highlight("الحوار", "!text-[#0E100F]", "!bg-teal-200/90"),
        highlight("العلامة", "!text-[#0E100F]", "!bg-sky-200/90"),
        highlight("مكبر", "!text-[#0E100F]", "!bg-emerald-200/90"),
      ],
    },
    solutions: {
      sectionTitle: "ما الذي يشمله الحل",
      items: [
        {
          title: "طلب صوتي طبيعي",
          description:
            "ذكاء اصطناعي محادث عند مكبر الصوت يعيد الصياغة والتوضيح ويتعامل مع الطلبات الخاصة ليشعر الضيف أنه مُسمَع من دون إبطاء الطابور.",
        },
        {
          title: "حوار يفهم القائمة",
          description:
            "يتوافق مع أوقات اليوم والعروض المؤقتة وقائمة التوقف ليبقى اقتراح البيع الإضافي وتنبيهات الحساسية دقيقة ومطابقة للسياسات.",
        },
        {
          title: "إنتاجية في الذروة",
          description:
            "يحافظ على استقرار استلام الطلبات عند اندفاع الزبائن ويقلل سوء الفهم ويحرر الطاقم ليركز على التسليم والضيافة.",
        },
        {
          title: "تسليم لنقطة البيع والمطبخ",
          description:
            "تذاكر منظمة تتدفق إلى نقطة البيع أو نظام عرض المطبخ مع بقاء التعديلات كما هي ليتحرك الطابور ويبقى الممر هادئا.",
        },
        {
          title: "رؤى أداء الممر",
          description:
            "راقب زمن المعالجة وتحويل العروض المقترحة ومعدلات التسليم لضبط النصوص والتشغيل والعروض وفق بيانات واضحة.",
        },
      ],
    },
    integrations: {
      sectionTitle: "التكامل مع أنظمة نقطة البيع",
    },
    faq: {
      title: "الأسئلة الشائعة",
      subtitle:
        "إجابات مختصرة عن الوكيل الصوتي لممرات درايف ثرو وكيف يدعم ممراتك وطاقمك.",
      items: [
        {
          id: "item-1",
          question: "ما هو كاشيرك؟",
          answer:
            "كاشيرك وكيل صوتي بالذكاء الاصطناعي لممرات درايف ثرو يستمع ويتحدث مثل موظف تدريب ماهر ويلتقط التعديلات ويمرر التذاكر المكتملة إلى نقطة البيع أو شاشة المطبخ.",
        },
        {
          id: "item-2",
          question: "كيف يبدو للزبائن؟",
          answer:
            "يستخدم الوكيل كلاما منخفض التأخير وبصياغة آمنة للعلامة بحيث تبدو التحيات وعروض البيع الإضافي والتأكيدات طبيعية ومتسقة وسهلة المتابعة في الممر الصاخب.",
        },
        {
          id: "item-3",
          question: "هل يمكنه اتباع قائمتنا وسياساتنا؟",
          answer:
            "نعم. نُزامن القائمة والأسعار وأوقات اليوم وقواعد الامتثال ليحترم الوكيل العناصر المتوقفة والحساسيات والعروض كما يفعل عضو طاقم مدرب جيدا.",
        },
        {
          id: "item-4",
          question: "ماذا يحدث عندما يحتاج الزبون إلى إنسان؟",
          answer:
            "يمكن تصعيد الطلبات الحساسة أو المعقدة بسلاسة إلى عضو يرتدي سماعة مع الحفاظ على السياق لكي لا يكرر الزبون نفسه.",
        },
        {
          id: "item-5",
          question: "لمن صُمم كاشيرك؟",
          answer:
            "لعلامات الوجبات السريعة والمطاعم غير الرسمية وللمشغلين متعددي الفروع وللمجموعات الامتيازية التي تريد أتمتة صوتية موثوقة عند المكبر من دون المساس بدقة التذكرة.",
        },
      ],
      contactPrompt: "لم تجد ما تبحث عنه؟",
      contactLink: "تواصل معنا",
    },
    cta: {
      title: "هل أنت مستعد لترقية درايف ثرو لديك؟",
      button: "احجز عرضا توضيحيا",
    },
    footer: {
      contactHeading: "للاستفسارات تواصل معنا",
      copyright: `© ${new Date().getFullYear()} كاشيرك · جميع الحقوق محفوظة`,
    },
  },
  en: {
    nav: {
      brand: "Cashirk",
      demo: "Try the demo",
      menuOverview: "Overview",
      home: "Home",
    },
    language: {
      switchToAr: "العربية",
      switchToEn: "English",
      currentAria: "Switch language",
    },
    hero: {
      title: "Cashirk",
      tagline: "AI voice agent for drive-thru lanes",
    },
    parallaxImages: {
      altA: "Drive-thru service",
      altB: "Quick-service restaurant",
    },
    imageGrid: {
      title: "What we do",
      subtitle:
        "Voice AI for drive-thru lanes — fast, accurate, and on-brand when volume spikes",
      quote:
        "Cashirk is an AI voice agent for drive-thru lanes that answers on the speaker, understands natural orders with substitutions and modifiers, confirms totals, and sends structured tickets to your POS or kitchen display so your team stays focused on food and hospitality.",
    },
    textReveal: {
      paragraph1:
        "We build AI voice experiences for drive-thru lanes that greet every vehicle, capture precise orders with modifications, and route them straight to the kitchen display or POS without slowing the window.",
      paragraph2:
        "Cashirk supports quick-service and casual brands to shorten waits, surface add-ons in conversation, and keep brand voice consistent at every speaker.",
      highlights: [
        highlight("AI", "!text-[#0E100F]", "!bg-teal-200/90"),
        highlight("voice", "!text-[#0E100F]", "!bg-amber-200/90"),
        highlight("drive-thru", "!text-[#0E100F]", "!bg-sky-200/90"),
        highlight("vehicle,", "!text-[#0E100F]", "!bg-violet-200/90"),
        highlight("orders", "!text-[#0E100F]", "!bg-rose-200/90"),
        highlight("modifications,", "!text-[#0E100F]", "!bg-cyan-200/90"),
        highlight("kitchen", "!text-[#0E100F]", "!bg-indigo-200/90"),
        highlight("POS", "!text-[#0E100F]", "!bg-lime-200/90"),
        highlight("window.", "!text-[#0E100F]", "!bg-emerald-200/90"),
        highlight("Cashirk", "!text-[#0E100F]", "!bg-green-200/90"),
        highlight("quick-service", "!text-[#0E100F]", "!bg-fuchsia-200/90"),
        highlight("brands", "!text-[#0E100F]", "!bg-orange-200/90"),
        highlight("waits,", "!text-[#0E100F]", "!bg-amber-200/90"),
        highlight("add-ons", "!text-[#0E100F]", "!bg-teal-200/90"),
        highlight("conversation,", "!text-[#0E100F]", "!bg-sky-200/90"),
        highlight("brand", "!text-[#0E100F]", "!bg-emerald-200/90"),
        highlight("speaker.", "!text-[#0E100F]", "!bg-rose-200/90"),
      ],
    },
    solutions: {
      sectionTitle: "What the solution includes",
      items: [
        {
          title: "Natural voice ordering",
          description:
            "Conversational AI at the speaker that clarifies phrasing and handles special requests so guests feel heard—without slowing the line.",
        },
        {
          title: "Menu-aware dialogue",
          description:
            "Aligned with dayparts, promos, and 86 lists so upsells and allergy prompts stay accurate and policy-compliant.",
        },
        {
          title: "Throughput at peak",
          description:
            "Keeps order-taking steady during rushes, reduces mis-hears, and frees crew to focus on handoff and hospitality.",
        },
        {
          title: "Handoff to POS & kitchen",
          description:
            "Structured tickets flow to your POS or kitchen display with modifiers intact so the line moves and the lane stays calm.",
        },
        {
          title: "Lane performance insights",
          description:
            "Track handle time, upsell conversion, and service cadence to tune prompts, staffing, and offers with clear data.",
        },
      ],
    },
    integrations: {
      sectionTitle: "POS integrations",
    },
    faq: {
      title: "Frequently asked questions",
      subtitle:
        "Short answers about the drive-thru voice agent and how it supports your lanes and crew.",
      items: [
        {
          id: "item-1",
          question: "What is Cashirk?",
          answer:
            "Cashirk is an AI voice agent for drive-thru lanes that listens and speaks like a well-trained teammate—capturing modifiers and passing completed tickets to your POS or kitchen display.",
        },
        {
          id: "item-2",
          question: "What do guests experience?",
          answer:
            "Low-latency speech with brand-safe wording so greetings, upsells, and confirmations feel natural and easy to follow—even in a noisy lane.",
        },
        {
          id: "item-3",
          question: "Can it follow our menu and policies?",
          answer:
            "Yes. We sync menu, pricing, dayparts, and compliance rules so the agent respects 86’d items, allergens, and promos like a sharp crew member.",
        },
        {
          id: "item-4",
          question: "What if someone needs a human?",
          answer:
            "Sensitive or complex orders can escalate smoothly to a headset teammate with full context—no frustrating repeats.",
        },
        {
          id: "item-5",
          question: "Who is Cashirk for?",
          answer:
            "Quick-service and casual brands, multi-unit operators, and franchise groups that want reliable speaker automation without sacrificing ticket accuracy.",
        },
      ],
      contactPrompt: "Didn’t find what you need?",
      contactLink: "Contact us",
    },
    cta: {
      title: "Ready to upgrade your drive-thru?",
      button: "Book a demo",
    },
    footer: {
      contactHeading: "Questions? Get in touch",
      copyright: `© ${new Date().getFullYear()} Cashirk · All rights reserved`,
    },
  },
};
