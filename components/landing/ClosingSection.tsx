import { closing } from "@/content/landing";
import { getPilotContact } from "@/lib/site-config";
import { Flower } from "./Flower";
import { Icon } from "./Icon";
import { Reveal, buttonClass } from "./ui";
export function ClosingSection() {
  const contact = getPilotContact();
  return (
    <section aria-labelledby="closing-title" className="section-y bg-bg">
      <div className="page-container">
        <Reveal>
          <div className="closing-panel px-6 py-16 text-center sm:px-10 lg:py-20">
            <div
              aria-hidden="true"
              data-parallax="12"
              className="absolute -left-14 top-8 size-44 text-yellow"
            >
              <Flower className="h-full w-full" />
            </div>
            <div
              aria-hidden="true"
              data-parallax="-12"
              className="absolute -bottom-14 -right-8 size-48 text-coral-soft"
            >
              <Flower className="h-full w-full" />
            </div>
            <div className="relative">
              <span className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-white text-primary">
                <Icon name="sparkle" size={28} />
              </span>
              <h2
                id="closing-title"
                className="mx-auto mt-6 max-w-[24ch] text-h2 font-normal"
              >
                {closing.title}
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="#demo" className={buttonClass.primary}>
                  Lihat demo
                  <Icon name="arrow" size={20} className="button-icon" />
                </a>
                {contact ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass.secondary}
                  >
                    {contact.label}
                  </a>
                ) : (
                  <a href="#pilot" className={buttonClass.quiet + " bg-white"}>
                    Diskusikan pilot
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
