import { createFileRoute } from "@tanstack/react-router";
import { DriveThruDemoPage } from "@/pages/demo/DriveThruDemoPage";
import { seo } from "@/utils/seo";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      ...seo({
        title: "عرض قائمة المقهى — كاشيرك",
        description: "عرض ممر درايف ثرو: قائمة مقهى ووكيل صوتي كاشيرك.",
        keywords: "كاشيرك، درايف ثرو، قائمة مقهى، ذكاء اصطناعي صوتي",
      }),
    ],
  }),
  component: DriveThruDemoPage,
});
