import Image from "next/image";
import { context } from "@/content/landing";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";

const POINT_ICONS: Record<string, IconName> = {
  chat: "chat",
  camera: "camera",
  calendar: "calendar",
};

/**
 * Field context — DESIGN.md §5.3.
 * A 5/7 editorial split. The three points are a hairline-ruled list rather than
 * three more cards, so the page keeps a varied rhythm (§4).
 */
export function ContextSection() {
  return (
    <section
      id={context.id}
      aria-labelledby="context-title"
      className="section-y bg-surface"
    >
      <div className="page-container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <figure className="m-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-visual bg-white sm:aspect-[16/10] lg:aspect-[4/5]">
                <Image
                  src={context.image.src}
                  alt={context.image.alt}
                  width={context.image.width}
                  height={context.image.height}
                  loading="lazy"
                  sizes="(max-width: 1024px) calc(100vw - 48px), 480px"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-label text-text-muted">
                {context.image.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionIntro
              id="context-title"
              eyebrow={context.eyebrow}
              title={context.title}
              lead={context.body}
            />

            <Reveal delay={150}>
              <ul className="mt-10 divide-y divide-border border-y border-border">
                {context.points.map((point) => (
                  <li
                    key={point.text}
                    className="flex items-start gap-4 py-5 sm:gap-5"
                  >
                    <span className="mt-0.5 shrink-0">
                      <Icon name={POINT_ICONS[point.icon] ?? "chat"} size={24} />
                    </span>
                    <p className="text-base font-medium text-text sm:text-[1.0625rem]">
                      {point.text}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
