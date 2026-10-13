import type { CSSProperties, ReactNode } from "react";

/* ---------------------------------------------------------------------------
 * Buttons — DESIGN.md §6.4.
 * Primary: deep green / white text, for demo and main actions.
 * Secondary: readable outline, for pilot actions.
 * Focus rings are inherited from the global :focus-visible rule, which has a
 * 3 px offset and stays visible on both white and green surfaces.
 * ------------------------------------------------------------------------ */

const BASE =
  "inline-flex items-center justify-center gap-2 min-h-12 rounded-button font-medium transition-colors duration-150 ease-out-soft";

export const buttonClass = {
  primary: `${BASE} px-6 py-3 bg-primary text-white hover:bg-primary-hover`,
  secondary: `${BASE} px-6 py-3 border border-control-border text-text hover:bg-surface`,
  quiet: `${BASE} px-5 py-2.5 border border-border text-text hover:border-control-border hover:bg-surface`,
  // Over photography: the deep green primary would sink into the scrim, so the
  // emphasis inverts. Same roles, reversed values.
  onMedia: `${BASE} px-6 py-3 bg-white text-text hover:bg-surface`,
  onMediaQuiet: `${BASE} px-6 py-3 border border-white/55 text-white hover:bg-white/12`,
} as const;

/* ---------------------------------------------------------------------------
 * Scroll reveal wrapper — DESIGN.md §8.1.
 * Server-rendered: the hidden state only exists while `data-js` is "true", and
 * a single small client component flips the class when the element scrolls in.
 * ------------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Stagger in ms. Kept under ~120 ms so the page never feels slow. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}) {
  return (
    <Tag
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
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
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={60}>
        <h2
          id={id}
          className={`${headingSize} font-medium text-text ${centered ? "max-w-[22ch]" : "max-w-[24ch]"}`}
        >
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={110}>
          <p className={`text-lead text-text-muted ${centered ? "max-w-[54ch]" : "max-w-[58ch]"}`}>
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
