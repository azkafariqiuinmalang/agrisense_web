import { AboutSection } from "@/components/landing/AboutSection";
import { CapabilityGrid } from "@/components/landing/CapabilityGrid";
import { ClosingSection } from "@/components/landing/ClosingSection";
import { ContextSection } from "@/components/landing/ContextSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PilotSection } from "@/components/landing/PilotSection";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { TrustSection } from "@/components/landing/TrustSection";
import { WhatsAppStory } from "@/components/landing/WhatsAppStory";

/**
 * Landing page section order — DESIGN.md §4.
 * Server Components by default; only the menu, the scroll reveal, and the
 * demo story are interactive.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <ContextSection />
        <WhatsAppStory />
        <CapabilityGrid />
        <HowItWorks />
        <TrustSection />
        <PilotSection />
        <AboutSection />
        <FAQSection />
        <ClosingSection />
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
