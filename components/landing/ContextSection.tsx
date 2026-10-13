import Image from "next/image";
import { context } from "@/content/landing";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";
const icons: Record<string, IconName> = {
  chat: "chat",
  camera: "camera",
  calendar: "calendar",
};
const tones = [
  "bg-blue-soft text-blue",
  "bg-yellow-soft text-text",
  "bg-coral-soft text-coral",
];
export function ContextSection() {
  return (
    <section
      id={context.id}
      aria-labelledby="context-title"
      className="section-y bg-bg"
    >
      <div className="page-container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <Reveal className="relative">
            <figure>
              <div
                data-tilt
                className="image-frame relative aspect-[4/3] bg-surface lg:aspect-[1.06]"
              >
                <div
                  data-scroll-media
                  className="absolute -inset-y-7 inset-x-0"
                >
                  <Image
                    src={context.image.src}
                    alt={context.image.alt}
                    width={context.image.width}
                    height={context.image.height}
                    loading="lazy"
                    sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 700px, 520px"
                    className="h-full w-full object-cover object-[50%_65%]"
                  />
                </div>
                <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-label">
                  <Icon name="greenhouse" size={18} className="text-primary" />
                  Dari greenhouse Anda
                </span>
              </div>
              <figcaption className="mt-3 text-label text-text-muted">
                {context.image.caption}
              </figcaption>
            </figure>
          </Reveal>
          <div>
            <SectionIntro
              id="context-title"
              eyebrow={context.eyebrow}
              title={context.title}
              lead={context.body}
              size="compact"
            />
            <ul className="mt-7 flex flex-col gap-3">
              {context.points.map((point, index) => (
                <Reveal as="li" key={point.text} delay={index * 60}>
                  <div className="flex items-center gap-4 rounded-[20px] bg-white py-3">
                    <span
                      className={
                        "flex size-12 shrink-0 items-center justify-center rounded-[16px] " +
                        tones[index]
                      }
                    >
                      <Icon name={icons[point.icon] || "chat"} size={23} />
                    </span>
                    <p className="text-[0.9375rem] font-medium">{point.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
