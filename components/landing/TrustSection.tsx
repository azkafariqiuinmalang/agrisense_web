import { trust } from "@/content/landing";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";

const TRUST_ICONS: Record<string, IconName> = {
  leaf: "leaf",
  "checked-checkbox": "confirmed",
  inspection: "inspection",
};

/**
 * Trust and control — DESIGN.md §5.7.
 * Editorial split: the claim on the left, the three commitments as a ruled
 * list on the right. No "100% accurate" style badges anywhere.
 */
export function TrustSection() {
  return (
    <section
      id={trust.id}
      aria-labelledby="trust-title"
      className="section-y bg-surface"
    >
      <div className="page-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionIntro
              id="trust-title"
              eyebrow={trust.eyebrow}
              title={trust.title}
              size="compact"
            />
          </div>

          <ul className="flex flex-col divide-y divide-border border-y border-border lg:col-span-7">
            {trust.points.map((point, index) => (
              <Reveal as="li" key={point.title} delay={index * 80}>
                <div className="flex items-start gap-5 py-7">
                  <span className="mt-0.5 shrink-0">
                    <Icon name={TRUST_ICONS[point.icon] ?? "leaf"} size={26} />
                  </span>
                  <div>
                    <h3 className="text-h3 font-semibold text-text">
                      {point.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-text-muted sm:text-base">
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
