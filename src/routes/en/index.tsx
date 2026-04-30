import { createFileRoute } from "@tanstack/react-router";
import { LandingLocaleProvider } from "@/i18n/LandingLocaleContext";
import { LandingPage } from "@/pages/public/LandingPage";

export const Route = createFileRoute("/en/")({
  component: LandingEnRoute,
});

function LandingEnRoute() {
  return (
    <LandingLocaleProvider locale="en">
      <LandingPage />
    </LandingLocaleProvider>
  );
}
