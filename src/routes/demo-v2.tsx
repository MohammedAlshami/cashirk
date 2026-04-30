import { createFileRoute } from "@tanstack/react-router";
import { DriveThruDemoV2Page } from "@/pages/demo/DriveThruDemoV2Page";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/demo-v2")({
  head: () => ({
    meta: [
      ...seo({
        title: "عرض الوكيل الصوتي — كاشيرك",
        description: "عرض تجريبي: وكيل صوتي كاشيرك (واجهة الكرة فقط).",
        keywords: "كاشيرك، درايف ثرو، ذكاء اصطناعي صوتي، عرض تجريبي",
      }),
    ],
  }),
  component: DriveThruDemoV2Page,
});
