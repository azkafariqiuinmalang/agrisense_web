import { pilot } from "@/content/landing";
import { getPilotContact } from "@/lib/site-config";
import { Icon } from "./Icon";
import { Flower } from "./Flower";
import { Reveal, buttonClass } from "./ui";
export function PilotSection() {
  const contact = getPilotContact();
  return (
    <section
      id={pilot.id}
      aria-labelledby="pilot-title"
      className="section-y bg-bg"
    >
      <div className="page-container">
        <Reveal>
          <div className="pilot-panel p-7 sm:p-10 lg:p-14">
            <Flower className="pilot-flower" />
            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
              <div>
                <span className="eyebrow rounded-full bg-white/65 px-3 py-1.5">
                  <Icon name="leaf" size={16} />
                  {pilot.eyebrow}
                </span>
                <h2
                  id="pilot-title"
                  className="mt-5 max-w-[19ch] text-h2 font-normal"
                >
                  {pilot.title}
                </h2>
                <p className="mt-5 max-w-[48ch] text-lead text-text-muted">
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
                      <Icon name="arrow" size={20} />
                    </a>
                  ) : (
                    <a href="#demo" className={buttonClass.primary}>
                      Pelajari demo
                      <Icon name="arrow" size={20} className="button-icon" />
                    </a>
                  )}
                </div>
              </div>
              <div className="rounded-[32px] bg-white/75 p-6 sm:p-8">
                <h3 className="text-lg font-medium">{pilot.fitTitle}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {pilot.fit.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[0.9375rem]"
                    >
                      <Icon
                        name="check"
                        size={20}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                {!contact ? (
                  <div className="mt-6 border-t border-border pt-5">
                    <p className="flex items-start gap-2.5 text-label font-medium">
                      <Icon name="info" size={18} className="shrink-0" />
                      {pilot.closedStatus.title}
                    </p>
                    <p className="mt-2 text-label text-text-muted">
                      {pilot.closedStatus.body}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
