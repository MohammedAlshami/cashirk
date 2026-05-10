import { LandingLocaleProvider } from "@/i18n/LandingLocaleContext";
import { LandingPage } from "@/components/LandingPage";

export default function EnglishHome() {
  return (
    <LandingLocaleProvider locale="en">
      <LandingPage />
    </LandingLocaleProvider>
  );
}
