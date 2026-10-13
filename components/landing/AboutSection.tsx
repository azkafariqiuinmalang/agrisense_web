import Image from "next/image";
import { about } from "@/content/landing";
import { Flower } from "./Flower";
import { Reveal, SectionIntro } from "./ui";
export function AboutSection() {
  return (
    <section
      id={about.id}
      aria-labelledby="about-title"
      className="section-y bg-bg"
    >
      <div className="page-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <SectionIntro
              id="about-title"
              eyebrow={about.eyebrow}
              title={about.title}
              size="compact"
            />
            <div className="mt-6 flex flex-col gap-5">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={index * 60}>
                  <p className="max-w-[53ch] text-lead text-text-muted">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="relative">
            <figure>
              <div
                data-tilt
                className="image-frame relative aspect-[1.1] bg-blue-soft"
              >
                <div
                  data-scroll-media
                  className="absolute -inset-y-7 inset-x-0"
                >
                  <Image
                    src={about.image.src}
                    alt={about.image.alt}
                    width={about.image.width}
                    height={about.image.height}
                    loading="lazy"
                    sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 700px, 500px"
                    className="h-full w-full object-cover object-[50%_62%]"
                  />
                </div>
              </div>
              <figcaption className="mt-3 text-label text-text-muted">
                {about.image.caption}
              </figcaption>
            </figure>
            <div
              aria-hidden="true"
              data-parallax="-10"
              className="absolute -right-3 -top-8 size-20 text-yellow"
            >
              <Flower className="h-full w-full" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
