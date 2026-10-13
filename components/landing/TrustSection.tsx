import { trust } from "@/content/landing";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { Reveal, SectionIntro } from "./ui";
const icons: Record<string, IconName> = {
  leaf: "leaf",
  "checked-checkbox": "confirmed",
  inspection: "inspection",
};
export function TrustSection() {
  return (
    <section
      id={trust.id}
      aria-labelledby="trust-title"
      className="section-y bg-surface"
    >
      <div className="page-container">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionIntro
            id="trust-title"
            eyebrow={trust.eyebrow}
            title={trust.title}
            size="compact"
          />
          <ul className="flex flex-col gap-5">
            {trust.points.map((point, index) => (
              <Reveal as="li" key={point.title} delay={index * 80}>
                <div
                  className="flex items-start gap-5 rounded-card bg-white p-6"
                  data-tilt
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[18px] bg-accent-soft text-primary">
                    <Icon name={icons[point.icon]} size={26} />
                  </span>
                  <div>
                    <h3 className="text-h3 font-medium">{point.title}</h3>
                    <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-text-muted">
                      {point.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
