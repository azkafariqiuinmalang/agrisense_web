import Image from "next/image";
import { hero } from "@/content/landing";
import { story } from "@/content/story";
import { ChatBubble } from "./ChatBubble";
import { buttonClass } from "./ui";

/**
 * Hero.
 *
 * Media-led: one large, rounded, edge-to-edge photograph carries the message,
 * with the type set on it the way the reference composition works. Only four
 * elements go over the image — label, headline, description, actions — because
 * every extra overlay element pushes the block past the fold and eats the
 * photograph.
 *
 * The photo is far brighter than the reference's studio shot, so a bottom-up
 * deep green scrim (the page's own text colour, used as a photographic grade)
 * carries the white type. The upper third of the frame is left untouched.
 *
 * The conversation inset sits under the block rather than floating on the
 * image: at 700–800 px tall windows it competed with the headline for space.
 */
export function HeroSection() {
  // One exchange from the demo transcript, so the hero never contradicts it.
  const [incoming, reply] = story.stages[1].messages;

  return (
    <section
      id="beranda"
      aria-labelledby="hero-title"
      className="pb-16 pt-4 lg:pb-24 lg:pt-5"
    >
      <div className="page-container">
        {/* `isolate` keeps the scrim and the type layered above the photo. */}
        <div className="relative isolate overflow-hidden rounded-visual bg-text [--focus-ring:#ffffff]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={hero.image.width}
            height={hero.image.height}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) calc(100vw - 48px), (max-width: 1280px) calc(100vw - 80px), 1200px"
            className="absolute inset-0 h-full w-full object-cover object-[50%_78%]"
          />
          <div aria-hidden="true" className="hero-scrim absolute inset-0" />

          {/* Sized to the window, never taller than the fold: at 760 px tall
              this is 584 px, so the actions always land on screen. */}
          <div className="relative flex min-h-[clamp(30rem,calc(100vh-11rem),52rem)] flex-col justify-end p-6 sm:p-8 lg:p-12">
            <div className="max-w-[68rem]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-3 pr-3.5 text-label font-medium text-white backdrop-blur-sm">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                {hero.eyebrow}
              </span>

              <h1
                id="hero-title"
                className="mt-5 text-hero font-semibold text-white"
              >
                {hero.title}
              </h1>

              <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                <p className="max-w-[40rem] text-pretty text-lead text-white/88">
                  {hero.description}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
                  <a href="#demo" className={buttonClass.onMedia}>
                    Lihat demo
                  </a>
                  <a href="#pilot" className={buttonClass.onMediaQuiet}>
                    Diskusikan pilot
                  </a>
                </div>
              </div>

              <p className="mt-5 text-label text-white/72">{hero.note}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 w-full lg:w-[22rem]">
            <figure className="m-0 rounded-card border border-border bg-white p-3.5">
              <figcaption className="mb-2.5 flex items-center justify-between gap-3 border-b border-border pb-2">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-text-muted">
                  Ilustrasi percakapan
                </span>
                <span className="text-[0.6875rem] text-text-muted">WhatsApp</span>
              </figcaption>
              <div
                aria-hidden="true"
                className="flex flex-col gap-2 text-[0.875rem] leading-snug"
              >
                <ChatBubble message={incoming} />
                <ChatBubble message={reply} />
              </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
