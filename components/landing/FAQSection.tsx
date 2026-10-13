import { faq } from "@/content/landing";
import { Icon } from "./Icon";
import { Reveal, SectionIntro } from "./ui";
export function FAQSection() {
  return (
    <section
      id={faq.id}
      aria-labelledby="faq-title"
      className="section-y bg-surface"
    >
      <div className="page-container">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <SectionIntro
              id="faq-title"
              eyebrow="Tanya jawab"
              title={faq.title}
              size="compact"
            />
            <Reveal>
              <div className="mt-7 inline-flex size-20 items-center justify-center rounded-[28px] bg-yellow-soft text-text">
                <Icon name="chat" size={36} />
              </div>
            </Reveal>
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            {faq.items.map((item, index) => (
              <Reveal key={item.q} delay={Math.min(index, 3) * 40}>
                <details className="faq-item group">
                  <summary className="flex list-none items-center justify-between gap-5 p-5 hover:text-primary sm:p-6">
                    <h3 className="text-[1rem] font-medium">{item.q}</h3>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-primary transition-transform duration-200 group-open:rotate-180">
                      <Icon name="chevron" size={20} />
                    </span>
                  </summary>
                  <div className="px-5 pb-6 sm:px-6">
                    <p className="text-[0.9375rem] leading-relaxed text-text-muted">
                      {item.a}
                    </p>
                    {item.link ? (
                      <a
                        href={item.link.href}
                        className="mt-3 inline-flex items-center gap-2 font-medium text-primary underline underline-offset-4"
                      >
                        {item.link.label}
                        <Icon name="arrow" size={18} />
                      </a>
                    ) : null}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
