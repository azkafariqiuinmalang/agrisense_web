import { capabilities } from "@/content/landing";
import { getFeatureStatus, isFeatureVisible } from "@/lib/site-config";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";
const icons: Record<string, IconName> = {
  chat: "chat",
  camera: "camera",
  microphone: "microphone",
  task: "task",
};
const tones = [
  "bg-blue-soft text-blue",
  "bg-yellow-soft text-text",
  "bg-coral-soft text-coral",
  "bg-purple-soft text-purple",
];
export function CapabilityGrid() {
  const items = capabilities.items.filter((item) => isFeatureVisible(item.key));
  return (
    <section
      id="fitur"
      aria-labelledby="capabilities-title"
      className="section-y bg-bg"
    >
      <div className="page-container">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <SectionIntro
            id="capabilities-title"
            eyebrow="Dirancang untuk keseharian"
            title={capabilities.title}
            className="max-w-[43rem]"
          />
          <Reveal>
            <p className="max-w-[30ch] text-lead text-text-muted">
              {capabilities.intro}
            </p>
          </Reveal>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {items.map((item, index) => {
            const status = getFeatureStatus(item.key);
            return (
              <Reveal as="li" key={item.key} delay={index * 50}>
                <div
                  data-tilt
                  className={"feature-card " + tones[index % tones.length]}
                >
                  <span className="feature-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className="feature-icon">
                    <Icon name={icons[item.icon] || "chat"} size={30} />
                  </span>
                  <h3 className="mt-7 text-h3 font-medium text-text">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-text-muted">
                    {item.body}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-[0.75rem] font-medium text-text-muted">
                    <span
                      aria-hidden="true"
                      className={
                        "size-1.5 rounded-full " +
                        (status.verified ? "bg-primary" : "bg-text-muted")
                      }
                    />
                    {status.label}
                  </span>
                  <span aria-hidden="true" className="feature-decoration" />
                </div>
              </Reveal>
            );
          })}
        </ul>
        <Reveal>
          <p className="mt-6 flex items-start gap-2.5 text-label text-text-muted">
            <Icon name="info" size={18} className="mt-0.5 shrink-0" />
            {capabilities.prototypeNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
