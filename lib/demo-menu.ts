import menuProducts from "@/lib/menu-products-local.json";

/** Drive-thru demo menu: IDs must match ConvAI client tools + agent prompt. */

export type MenuModifierHints = {
  sugar?: "regular" | "less" | "none";
  notes?: string;
};

export type MenuOption = {
  label: string;
  category?: string;
};

export type MenuOptionGroup = {
  heading: string;
  options: MenuOption[];
};

export type DemoMenuItem = {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  description: string;
  customization: string;
  optionGroups: MenuOptionGroup[];
};

export type OrderLine = {
  lineKey: string;
  itemId: string;
  name: string;
  qty: number;
  price: number;
  imageSrc: string;
  modifiersLabel: string;
  modifiers: MenuModifierHints;
};

export type TranscriptLine = {
  id: string;
  text: string;
};

const SUGAR_OPTIONS: MenuOptionGroup = {
  heading: "السكر",
  options: [
    { label: "بدون سكر" },
    { label: "سكر أقل" },
    { label: "عادي" },
    { label: "إضافي" },
  ],
};

type MenuProduct = {
  title: string;
  description: string;
  price: string;
  calories: string;
  local_image: string;
};

const MENU_PRODUCTS = menuProducts as MenuProduct[];

function parsePrice(price: string) {
  const match = price.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[ًٌٍَُِّْٰ]/g, "");
}

function buildAliases(product: MenuProduct) {
  const aliases = new Set<string>([
    normalizeText(product.title),
    normalizeText(product.description),
  ]);

  const legacyAliases: Record<string, string[]> = {
    "item-01": ["اسبريسو - سنقل", "اسبريسو - دبل", "إسبريسو - سنقل", "إسبريسو - دبل"],
    "item-02": ["ماكياتو - صغير", "ماكياتو - كبير"],
    "item-03": ["ماكياتو بالشوكولاتة المره - وسط", "ماكياتو بالشوكولاتة المره - كبير"],
    "item-04": ["ماكياتو بالتوفي - وسط", "ماكياتو بالتوفي - كبير"],
    "item-05": ["فلات وايت - وسط", "فلات وايت - كبير"],
    "item-06": ["موكا - سنقل", "موكا - دبل"],
    "item-07": ["لاتيه - وسط", "لاتيه - كبير"],
    "item-08": ["كورتادو - سنقل", "كورتادو - دبل"],
    "item-09": ["قهوة تركي - سنقل", "قهوة تركي - دبل"],
    "item-10": ["امريكانو", "أمريكانو"],
    "item-11": ["قهوة امريكي", "قهوة أمريكي"],
    "item-12": ["قهوة فرنسي"],
    "item-13": ["شوكولاتة ساخنة"],
    "item-14": ["قهوة تركي مع حليب - دبل", "قهوة تركي مع حليب - سنقل"],
    "item-15": ["شيزكيك البسبوسة باللوتس"],
    "item-16": ["براوني شوكولاتة دبي"],
    "item-17": ["موكا بالشوكولاته - موكا بالشوكولاته-وسط", "موكا بالشوكولاته - كبير"],
    "item-18": ["قهوة كولد برو قارورة"],
    "item-19": ["قهوة مثلجة - كبير"],
    "item-20": ["١٦ - صغير"],
    "item-21": ["ايس سبانيش لاتيه - كبير"],
    "item-22": ["شوكلت فرابتشينو - كبير"],
    "item-23": ["لاتيه بارد", "آيس شيكن فانيلا", "آيس شيكن كاراميل"],
    "item-24": ["فانيلا مثلجة - صغير"],
    "item-25": ["ميلك شيك تمر"],
    "item-26": ["مياه معدنية"],
    "item-27": ["آيس شيكن وايت موكا"],
  };

  const index = MENU_PRODUCTS.findIndex((p) => p === product);
  const itemId = `item-${String(index + 1).padStart(2, "0")}`;
  for (const alias of legacyAliases[itemId] ?? []) {
    aliases.add(normalizeText(alias));
  }

  return Array.from(aliases);
}

function hasSugarOptions(product: MenuProduct) {
  const title = normalizeText(product.title);
  const description = normalizeText(product.description);
  return /(لاتيه|موكا|ماكياتو|فلات وايت|كورتادو|أمريكانو|امريكانو|قهوة|شيكن|سبانيش|كولد برو|فرابتشينو|فانيلا|شوكولاتة|اسبريسو|إسبريسو)/.test(
    `${title} ${description}`,
  ) && !/(كيك|تشيز|براوني|مياه|ماء|مياه معدنية)/.test(`${title} ${description}`);
}

function toDemoMenuItem(product: MenuProduct, index: number): DemoMenuItem {
  const id = `item-${String(index + 1).padStart(2, "0")}`;
  const price = parsePrice(product.price);
  return {
    id,
    name: product.title,
    price,
    imageSrc: product.local_image,
    description: product.description,
    customization: hasSugarOptions(product)
      ? "السكر: بدون سكر، سكر أقل، عادي، إضافي."
      : "لا توجد تخصيصات إضافية.",
    optionGroups: hasSugarOptions(product) ? [SUGAR_OPTIONS] : [],
  };
}

export const DEMO_MENU: DemoMenuItem[] = MENU_PRODUCTS.map(toDemoMenuItem);

export function getMenuItemById(id: string): DemoMenuItem | undefined {
  return DEMO_MENU.find((item) => item.id === id);
}

export function findMenuItemByText(text: string): DemoMenuItem | undefined {
  const normalized = normalizeText(text);
  return DEMO_MENU.find((item, index) => {
    const product = MENU_PRODUCTS[index];
    const aliases = buildAliases(product);
    return aliases.some((alias) => alias === normalized || alias.includes(normalized) || normalized.includes(alias));
  });
}

export function formatModifiersAr(m: MenuModifierHints): string {
  const parts: string[] = [];
  if (m.sugar === "less") parts.push("سكر أقل");
  else if (m.sugar === "none") parts.push("بدون سكر");
  else if (m.sugar === "regular") parts.push("سكر عادي");
  if (m.notes?.trim()) parts.push(m.notes.trim());
  return parts.length ? parts.join(" · ") : "بدون تخصيص إضافي";
}

export function buildMenuKnowledgeJson(): string {
  return JSON.stringify(
    {
      menu: DEMO_MENU.map((i) => ({
        item_id: i.id,
        name_ar: i.name,
        price_sar: i.price,
        description_ar: i.description,
        customization_ar: i.customization,
        image_path: i.imageSrc,
      })),
    },
    null,
    2,
  );
}

export function buildAgentSystemPromptAr() {
  return `أنت موظف طلبات صوتي لمقهى في مسار السيارات (درايف ثرو).

القواعد:
1) استخدم فقط عناصر القائمة المعروفة في سياق القائمة (JSON). لا تخلق منتجات أو أسعاراً.
2) اسأل فقط عن السكر إذا لم يذكره العميل بوضوح وكان الصنف يدعم تخصيص السكر. لا تسأل عن الثلج أو الحرارة.
3) إذا لم يذكر العميل الكمية بوضوح، اسأل عن الكمية.
4) عندما يذكر العميل طلباً مفهوماً من القائمة، لا تكتفِ بالرد النصي. نفّذ أداة العميل add_menu_item مباشرة إذا كان item_id والكمية والسكر متوفرين. إذا كان السكر أو الكمية غير واضحين، اسأل فقط عن الناقص ثم نفّذ الأداة فوراً بعد الحصول عليه.
5) عندما تتعرّف على الصنف لأول مرة، استدعِ preadd_menu_item فوراً وبمفردها لفتح البطاقة. لا تنتظر الكمية أو السكر قبل استدعائها.
6) عندما يؤكد العميل أن الطلب نهائي أو يطلب الإنهاء، استخدم complete_order فوراً لإنهاء الطلب وإغلاق الجلسة بعد توديع قصير جداً.
7) عبارات الإنهاء تشمل على الأقل: "بس"، "خلاص"، "لا شكراً"، "تسلم"، "just now"، "no that's all"، "that's all"، "we're done".
8) إذا قال العميل أي صيغة لإنهاء الطلب، لا تطرح سؤالاً إضافياً. نفّذ complete_order مباشرة.
9) تحدث العربية الفصحى المبسطة والودودة ما لم يطلب العميل غير ذلك.
10) لا تؤكد إضافة الأصناف نصياً قبل استدعاء add_menu_item. أداة العميل هي مصدر الحقيقة للطلب.
11) لا تكتب كوداً أو أوامر وهمية أو أسماء دوال مثل default_api.add_menu_item أو print(...). استدعِ أداة العميل فعلياً فقط.
12) إذا كنت تعرف item_id والكمية والسكر، فاستدعِ add_menu_item فوراً ولا تسأل سؤالاً إضافياً.
13) لا تذكر اسم الأداة داخل النص الظاهر للمستخدم؛ نفّذها بصمت عبر المنصة.

استخدم فقط عناصر القائمة التالية مع معرّفها:
${DEMO_MENU.map((item) => `- ${item.id} | ${item.name} | ${item.price} ريال`).join("\n")}
`;
}

export const AGENT_SYSTEM_PROMPT_AR = buildAgentSystemPromptAr();

export const AGENT_FIRST_MESSAGE_AR = "مرحباً، معك موظف الطلبات. كيف يمكنني مساعدتك اليوم؟";
