import { LandingLocaleProvider } from "@/i18n/LandingLocaleContext";
import { LandingPage } from "@/components/LandingPage";

export default function Home() {
  return (
    <LandingLocaleProvider locale="ar">
      <LandingPage />
    </LandingLocaleProvider>
  );
}
