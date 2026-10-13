import { capabilities } from "@/content/landing";
import { getFeatureStatus, isFeatureVisible } from "@/lib/site-config";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";

const CAPABILITY_ICONS: Record<string, IconName> = {
  chat: "chat",
  camera: "camera",
  microphone: "microphone",
  task: "task",
};

/**
 * Capabilities — DESIGN.md §5.5.
 * Four columns separated by rules and space rather than four more boxes, so
 * this section does not repeat the shape of the ones around it (§4).
 */
export function CapabilityGrid() {
  const items = capabilities.items.filter((item) => isFeatureVisible(item.key));

  return (
    <section
      id="fitur"
      aria-labelledby="capabilities-title"
      className="section-y bg-surface"
    >
      <div className="page-container">
        <SectionIntro
          id="capabilities-title"
          title={capabilities.title}
          lead={capabilities.intro}
          className="max-w-[42rem]"
        />

        <ul className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-8 lg:mt-14 lg:grid-cols-4 lg:gap-x-8">
          {items.map((item, index) => {
            const status = getFeatureStatus(item.key);
            return (
              <Reveal as="li" key={item.key} delay={index * 70}>
                <div className="flex h-full flex-col border-t border-border pt-6">
                  <Icon name={CAPABILITY_ICONS[item.icon] ?? "chat"} size={32} />

                  <h3 className="mt-5 text-h3 font-semibold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-text-muted">
                    {item.body}
                  </p>

                  <p className="mt-5 flex items-center gap-2 text-label text-text-muted">
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        status.verified ? "bg-accent" : "bg-border"
                      }`}
                    />
                    {status.label}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={120}>
          <p className="mt-12 flex items-start gap-3 border-t border-border pt-6 text-[0.9375rem] leading-relaxed text-text-muted">
            <span className="mt-0.5 shrink-0">
              <Icon name="info" size={18} />
            </span>
            {capabilities.prototypeNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
