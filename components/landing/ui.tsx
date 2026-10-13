import type { ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Material buttons — DESIGN.md.
 * Primary: deep green / white text, for demo and main actions.
 * Secondary: tonal green container, for pilot actions.
 * Focus rings are inherited from the global :focus-visible rule, which has a
 * Visible on both light and green surfaces.
 * ------------------------------------------------------------------------ */

const BASE =
  "material-button magnetic inline-flex items-center justify-center gap-2.5 min-h-13 rounded-button font-medium transition-colors duration-200 ease-out-soft";

export const buttonClass = {
  primary: `${BASE} px-6 py-3 bg-primary text-white hover:bg-primary-hover`,
  secondary: `${BASE} px-6 py-3 bg-accent-soft text-primary hover:bg-accent`,
  quiet: `${BASE} px-5 py-2.5 border border-border text-text hover:border-control-border hover:bg-surface`,
  // Over photography: the deep green primary would sink into the scrim, so the
  // emphasis inverts. Same roles, reversed values.
  onMedia: `${BASE} px-6 py-3 bg-white text-text hover:bg-surface`,
  onMediaQuiet: `${BASE} px-6 py-3 border border-white/55 text-white hover:bg-white/12`,
} as const;

/* ---------------------------------------------------------------------------
 * Server-rendered reveal marker. Content is visible by default; GSAP prepares
 * below-fold entrances only after the motion engine loads successfully.
 * ------------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Stagger in ms; the motion owner caps it at 160 ms. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  return (
    <Tag
      data-reveal=""
      data-reveal-delay={delay}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Section heading block: eyebrow + H2 + optional lead, in one rhythm. */
export function SectionIntro({
  eyebrow,
  title,
  lead,
  id,
  align = "start",
  size = "default",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  id?: string;
  align?: "start" | "center";
  /** `compact` keeps headings to a sane line count in narrow split columns. */
  size?: "default" | "compact";
  className?: string;
}) {
  const centered = align === "center";
  const headingSize = size === "compact" ? "text-h2-compact" : "text-h2";
  return (
    <div
      className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "items-start"} ${className}`}
    >
      {eyebrow ? (
        <Reveal>
          <span className="eyebrow">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-primary"
            />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={60}>
        <h2
          id={id}
          className={`${headingSize} font-normal text-text ${centered ? "max-w-[24ch]" : "max-w-[25ch]"}`}
        >
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={110}>
          <p
            className={`text-lead text-text-muted ${centered ? "max-w-[54ch]" : "max-w-[58ch]"}`}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
