import { navLinks } from "@/content/landing";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { buttonClass } from "./ui";
export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="page-container flex h-[76px] items-center justify-between gap-4 lg:h-[88px]">
        <Logo />
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <a
            href="#demo"
            className={
              buttonClass.primary + " min-h-11 px-5 py-2.5 text-[0.9375rem]"
            }
          >
            Lihat demo
          </a>
        </div>
        <div className="lg:hidden">
          <nav
            aria-label="Navigasi"
            className="hidden no-js:flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-label"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-text-muted"
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
