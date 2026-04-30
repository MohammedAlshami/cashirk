import { createFileRoute } from "@tanstack/react-router";
import { LandingLocaleProvider } from "@/i18n/LandingLocaleContext";
import { LandingPage } from "@/pages/public/LandingPage";

export const Route = createFileRoute("/")({
  component: LandingArRoute,
});

function LandingArRoute() {
  return (
    <LandingLocaleProvider locale="ar">
      <LandingPage />
    </LandingLocaleProvider>
  );
}
