import { pilot } from "@/content/landing";
import { getPilotContact } from "@/lib/site-config";
import { Icon } from "./Icon";
import { Reveal, buttonClass } from "./ui";

/**
 * Pilot — DESIGN.md §5.8.
 * One soft green panel, the single place on the page that carries a field of
 * colour. The contact button only exists when an approved channel does; until
 * then the panel states the real status rather than offering a dead link.
 */
export function PilotSection() {
  const contact = getPilotContact();

  return (
    <section id={pilot.id} aria-labelledby="pilot-title" className="section-y bg-bg">
      <div className="page-container">
        <Reveal className="mx-auto max-w-[68rem] rounded-visual border border-border bg-surface p-8 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <span className="eyebrow">
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                {pilot.eyebrow}
              </span>
              <h2
                id="pilot-title"
                className="mt-4 max-w-[20ch] text-h2 font-medium text-text"
              >
                {pilot.title}
              </h2>
              <p className="mt-5 max-w-[52ch] text-lead text-text-muted">
                {pilot.body}
              </p>

              <div className="mt-8">
                {contact ? (
                  <a
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass.primary}
                  >
                    {contact.label}
                    <Icon name="arrow-inverse" size={16} />
                  </a>
                ) : (
                  <div className="max-w-[34rem] rounded-card border border-border bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0">
                        <Icon name="info" size={18} />
                      </span>
                      <div>
                        <p className="text-[0.9375rem] font-semibold text-text">
                          {pilot.closedStatus.title}
                        </p>
                        <p className="mt-1.5 text-label text-text-muted">
                          {pilot.closedStatus.body}
                        </p>
                      </div>
                    </div>
                    <a
                      href="#demo"
                      className={`${buttonClass.quiet} mt-4 w-full sm:w-auto`}
                    >
                      Pelajari demo
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <h3 className="text-label font-semibold uppercase tracking-[0.12em] text-text-muted">
                {pilot.fitTitle}
              </h3>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {pilot.fit.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-3.5">
                    <Icon name="check" size={18} />
                    <span className="text-[0.9375rem] font-medium text-text">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
