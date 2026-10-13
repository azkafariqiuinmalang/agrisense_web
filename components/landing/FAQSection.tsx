import { faq } from "@/content/landing";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";

/**
 * FAQ — DESIGN.md §5.10.
 * Native `details`/`summary`, so it is keyboard-operable and fully readable
 * without JavaScript. Ruled rows keep it lighter than a stack of cards.
 */
export function FAQSection() {
  return (
    <section id={faq.id} aria-labelledby="faq-title" className="section-y bg-bg">
      <div className="page-container">
        <SectionIntro
          id="faq-title"
          eyebrow="Tanya jawab"
          title={faq.title}
          className="max-w-[36rem]"
        />

        <div className="mt-12 flex max-w-[52rem] flex-col border-t border-border lg:mt-14">
          {faq.items.map((item, index) => (
            <Reveal key={item.q} delay={Math.min(index, 3) * 60}>
              <details className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 transition-colors duration-150 ease-out-soft hover:text-primary">
                  <h3 className="text-[1.0625rem] font-semibold text-text sm:text-lg">
                    {item.q}
                  </h3>
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-200 ease-out-soft group-open:rotate-180">
                    <Icon name="chevron" size={14} />
                  </span>
                </summary>

                <div className="pb-6 pr-12">
                  <p className="max-w-[68ch] text-[0.9375rem] leading-relaxed text-text-muted sm:text-base">
                    {item.a}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors duration-150 ease-out-soft hover:decoration-primary"
                    >
                      {item.link.label}
                      <Icon name="arrow" size={14} />
                    </a>
                  ) : null}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
