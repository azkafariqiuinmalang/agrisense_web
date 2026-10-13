import Image from "next/image";
import { about } from "@/content/landing";
import { Reveal } from "./ui";

/**
 * About — DESIGN.md §5.9.
 * Only verifiable facts: what the project covers and why WhatsApp. No invented
 * team names, institutions, or visit history.
 */
export function AboutSection() {
  return (
    <section
      id={about.id}
      aria-labelledby="about-title"
      className="section-y bg-surface"
    >
      <div className="page-container">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <figure className="m-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-visual bg-white sm:aspect-[16/10] lg:aspect-[4/5]">
                <Image
                  src={about.image.src}
                  alt={about.image.alt}
                  width={about.image.width}
                  height={about.image.height}
                  loading="lazy"
                  sizes="(max-width: 1024px) calc(100vw - 48px), 480px"
                  className="h-full w-full object-cover object-[50%_60%]"
                />
              </div>
              <figcaption className="mt-3 text-label text-text-muted">
                {about.image.caption}
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <span className="eyebrow">
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                {about.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <h2
                id="about-title"
                className="mt-4 max-w-[26ch] text-h2 font-medium text-text"
              >
                {about.title}
              </h2>
            </Reveal>
            <div className="mt-6 flex flex-col gap-5">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={110 + index * 60}>
                  <p className="max-w-[62ch] text-lead text-text-muted">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
