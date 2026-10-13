import { navLinks } from "@/content/landing";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Sticky header — DESIGN.md §5.1.
 * Logo left, four links centred, demo CTA right. 72 px on desktop, 64 px on
 * mobile. The logo is a link, never a button, and there is no mega-menu.
 */
export function SiteHeader() {
  return (
    // Solid white, per DESIGN.md §5.1. A `backdrop-filter` here would make the
    // header a containing block for fixed descendants and collapse the mobile
    // menu panel, which is positioned against the viewport.
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="page-container relative flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        {/* Desktop navigation, optically centred in the bar. */}
        <nav
          aria-label="Navigasi utama"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-text-muted transition-colors duration-150 ease-out-soft hover:bg-surface hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#demo"
          className="hidden min-h-11 items-center justify-center rounded-button bg-primary px-5 text-[0.9375rem] font-medium text-white transition-colors duration-150 ease-out-soft hover:bg-primary-hover lg:inline-flex"
        >
          Lihat demo
        </a>

        {/* Mobile: the interactive menu, plus a static fallback when
            JavaScript never runs (DESIGN.md §8.3). */}
        <div className="flex items-center gap-2 lg:hidden">
          <nav
            aria-label="Navigasi"
            className="hidden no-js:flex items-center gap-3 overflow-x-auto"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="no-js:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}
