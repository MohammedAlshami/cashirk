/** Drive-thru demo menu: IDs must match ConvAI client tools + agent prompt. */

export type MenuModifierHints = {
  sugar?: "regular" | "less" | "none";
  notes?: string;
};

/** A single selectable option shown in the order sheet UI. */
export type MenuOption = {
  /** Label shown in the sheet (Arabic) */
  label: string;
  /** Optional sub-label shown above the label (e.g. category name) */
  category?: string;
};

/** A group of options shown together under a heading in the order sheet. */
export type MenuOptionGroup = {
  /** Section heading (Arabic) */
  heading: string;
  options: MenuOption[];
};

export type DemoMenuItem = {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  description: string;
  /** Text sent to the agent describing available customizations. */
  customization: string;
  /**
   * Option groups shown in the side/bottom sheet UI.
   * Leave empty (`[]`) to hide the options panel entirely (e.g. food items).
   */
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

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

const SUGAR_OPTIONS: MenuOptionGroup = {
  heading: "السكر",
  options: [
    { label: "بدون سكر" },
    { label: "سكر أقل" },
    { label: "عادي" },
    { label: "إضافي" },
  ],
};

export const DEMO_MENU: DemoMenuItem[] = [
  {
    id: "iced-spanish-latte",
    name: "لاتيه إسباني بارد",
    price: 18,
    imageSrc: "/demo/menu/iced-spanish-latte.jpg",
    description: "إسبريسو مع حليب ونكهة إسبانية وحلاوة خفيفة، يقدم بارداً مع ثلج.",
    customization: "السكر: بدون سكر، سكر أقل، عادي، إضافي.",
    optionGroups: [SUGAR_OPTIONS],
  },
  {
    id: "new-york-cheesecake",
    name: "تشيزكيك نيويورك مع صوص توت",
    price: 16,
    imageSrc: "/demo/menu/new-york-cheesecake.jpg",
    description: "قطعة تشيزكيك كريمية بنمط نيويورك مع طبقة توت حلوة ومتوازنة.",
    // No sugar options — cheesecake sweetness is fixed
    customization: "لا توجد تخصيصات إضافية.",
    optionGroups: [],
  },
  {
    id: "hot-latte",
    name: "لاتيه ساخن",
    price: 14,
    imageSrc: "/demo/menu/hot-latte.jpg",
    description: "إسبريسو مع حليب مبخر، يقدم ساخناً بدرجة حرارة مريحة للشرب.",
    customization: "السكر: بدون سكر، سكر أقل، عادي، إضافي.",
    optionGroups: [SUGAR_OPTIONS],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getMenuItemById(id: string): DemoMenuItem | undefined {
  return DEMO_MENU.find((item) => item.id === id);
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
      })),
    },
    null,
    2,
  );
}

export const AGENT_SYSTEM_PROMPT_AR = `أنت موظف طلبات صوتي لمقهى في مسار السيارات (درايف ثرو).

القواعد:
1) استخدم فقط عناصر القائمة المعروفة في سياق القائمة (JSON). لا تخلق منتجات أو أسعاراً.
2) اسأل فقط عن السكر إذا لم يذكره العميل بوضوح وكان الصنف يدعم تخصيص السكر. لا تسأل عن الثلج أو الحرارة.
3) إذا لم يذكر العميل الكمية بوضوح، اسأل عن الكمية.
4) عندما يذكر العميل طلباً مفهوماً من القائمة، لا تكتفِ بالرد النصي. نفّذ أداة العميل add_menu_item مباشرة إذا كان item_id والكمية والسكر متوفرين. إذا كان السكر أو الكمية غير واضحين، اسأل فقط عن الناقص ثم نفّذ الأداة فوراً بعد الحصول عليه.
5) عندما تتعرّف على الصنف لأول مرة، استدعِ preadd_menu_item فوراً وبمفردها لفتح البطاقة. لا تنتظر الكمية أو السكر قبل استدعائها.
6) عندما يؤكد العميل أن الطلب نهائي، استخدم complete_order لإنهاء الطلب وإغلاق الجلسة بعد توديع قصير.
7) تحدث العربية الفصحى المبسطة والودودة ما لم يطلب العميل غير ذلك.
8) لا تؤكد إضافة الأصناف نصياً قبل استدعاء add_menu_item. أداة العميل هي مصدر الحقيقة للطلب.
9) لا تكتب كوداً أو أوامر وهمية أو أسماء دوال مثل default_api.add_menu_item أو print(...). استدعِ أداة العميل فعلياً فقط.
10) إذا كنت تعرف item_id والكمية والسكر، فاستدعِ add_menu_item فوراً ولا تسأل سؤالاً إضافياً.
11) لا تذكر اسم الأداة داخل النص الظاهر للمستخدم؛ نفذها بصمت عبر المنصة.

معرفات العناصر: iced-spanish-latte، new-york-cheesecake، hot-latte.
`;
