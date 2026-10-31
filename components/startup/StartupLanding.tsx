import localFont from "next/font/local";
import { getPilotWhatsAppUrl } from "@/lib/site-config";
import { StartupHeader } from "./StartupHeader";
import { StartupHero } from "./StartupHero";
import { StartupMetrics } from "./StartupMetrics";
import { StartupBentoGrid } from "./StartupBentoGrid";
import { StartupWorkflow } from "./StartupWorkflow";
import { StartupSimulator } from "./StartupSimulator";
import { StartupTrust } from "./StartupTrust";
import { StartupFaq } from "./StartupFaq";
import { StartupCta } from "./StartupCta";
import { StartupFooter } from "./StartupFooter";
import styles from "./startup.module.css";

const plusJakarta = localFont({
  src: "../../public/fonts/plus-jakarta-variable.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-jakarta",
});

export function StartupLanding() {
  const whatsappUrl = getPilotWhatsAppUrl();

  return (
    <div className={`${styles.startup} ${plusJakarta.variable}`}>
      <StartupHeader whatsappUrl={whatsappUrl} />
      <main id="main">
        <StartupHero whatsappUrl={whatsappUrl} />
        <StartupMetrics />
        <StartupBentoGrid />
        <StartupWorkflow />
        <StartupSimulator />
        <StartupTrust />
        <StartupFaq />
        <StartupCta whatsappUrl={whatsappUrl} />
      </main>
      <StartupFooter />
    </div>
  );
}
