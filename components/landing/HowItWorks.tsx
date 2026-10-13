import { howItWorks } from "@/content/landing";
import { Reveal, SectionIntro } from "./ui";

/**
 * How it works — DESIGN.md §5.6.
 * Three ordered steps on a rule. No prose about download times or accounts,
 * because neither is part of the real onboarding path.
 */
export function HowItWorks() {
  return (
    <section
      id={howItWorks.id}
      aria-labelledby="how-it-works-title"
      className="section-y bg-bg"
    >
      <div className="page-container">
        <SectionIntro
          id="how-it-works-title"
          eyebrow="Cara kerja"
          title={howItWorks.title}
          className="max-w-[36rem]"
        />

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-x-10 lg:mt-14">
          {howItWorks.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 80}
              className="relative border-t border-border pt-6"
            >
              <span
                aria-hidden="true"
                className="absolute -top-[3px] left-0 size-1.5 rounded-full bg-accent"
              />
              <span className="text-label font-semibold tracking-[0.14em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-h3 font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-text-muted">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
