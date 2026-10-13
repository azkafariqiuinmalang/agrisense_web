import { siteConfig } from "@/lib/site-config";

/**
 * AgriSense brand mark.
 *
 * The identity is still a pre-launch placeholder (DESIGN.md §15): a seedling —
 * two leaves and a stem — drawn as plain SVG so it stays crisp at every size
 * and never depends on a stock asset. Swap in the licensed brand file when it
 * exists; the wordmark width is stable, so nothing reflows.
 */
export function LeafGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g fill="currentColor">
        <ellipse cx="20.2" cy="13.8" rx="4.6" ry="2.4" transform="rotate(-35 20.2 13.8)" />
        <ellipse cx="11.8" cy="13.8" rx="4.6" ry="2.4" transform="rotate(35 11.8 13.8)" />
      </g>
      <path
        d="M16 27V12.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-[9px] bg-primary ${className}`}
    >
      <LeafGlyph className="size-[62%] text-white" />
    </span>
  );
}

export function Logo({ href = "#beranda" }: { href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2.5 rounded-md"
      aria-label={`${siteConfig.name} — kembali ke beranda`}
    >
      <LogoMark className="size-8" />
      <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-text">
        {siteConfig.name}
      </span>
    </a>
  );
}
