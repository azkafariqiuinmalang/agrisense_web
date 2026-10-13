import { howItWorks } from "@/content/landing";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { Reveal, SectionIntro } from "./ui";
const icons: IconName[] = ["greenhouse", "chat", "confirmed"];
const tones = [
  "bg-accent-soft text-primary",
  "bg-blue-soft text-blue",
  "bg-yellow-soft text-text",
];
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
          align="center"
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10 lg:mt-16">
          {howItWorks.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 80}
              className="relative text-center"
            >
              {index < 2 ? (
                <span
                  aria-hidden="true"
                  className="step-line hidden md:block"
                />
              ) : null}
              <div
                data-tilt
                className={
                  "relative mx-auto flex size-20 items-center justify-center rounded-[28px] " +
                  tones[index]
                }
              >
                <Icon name={icons[index]} size={32} />
                <span className="absolute -bottom-2 -right-2 flex size-7 items-center justify-center rounded-full border-4 border-bg bg-text text-[0.625rem] text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-7 text-h3 font-medium">{step.title}</h3>
              <p className="mx-auto mt-3 max-w-[31ch] text-[0.9375rem] text-text-muted">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
