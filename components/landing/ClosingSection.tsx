import { closing } from "@/content/landing";
import { getPilotContact } from "@/lib/site-config";
import { Reveal, buttonClass } from "./ui";

/**
 * Closing call to action — DESIGN.md §5.11.
 * The final action repeats the hero's, and the pilot link only appears when a
 * real channel exists.
 */
export function ClosingSection() {
  const contact = getPilotContact();

  return (
    <section aria-labelledby="closing-title" className="bg-bg">
      <div className="page-container">
        <Reveal className="flex flex-col items-center border-t border-border py-16 text-center lg:py-20">
          <h2
            id="closing-title"
            className="max-w-[24ch] text-h2 font-medium text-text"
          >
            {closing.title}
          </h2>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a href="#demo" className={buttonClass.primary}>
              Lihat demo
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
              <a href="#pilot" className={buttonClass.secondary}>
                Diskusikan pilot
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
