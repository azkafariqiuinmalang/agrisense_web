import { footer, navLinks } from "@/content/landing";
import { siteConfig } from "@/lib/site-config";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const FOOTER_LINKS = [
  ...navLinks,
  { href: "#demo", label: "Demo" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Footer — DESIGN.md §5.11.
 * Navigation, brand, official contact, legal and asset attribution. The CC
 * licences on the photographs require naming the author and licence, so each
 * credit is listed rather than summarised.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="page-container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-text-muted">
              {footer.description}
            </p>
            {siteConfig.contact.email ? (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              >
                {siteConfig.contact.email}
              </a>
            ) : null}
          </div>

          <nav aria-label="Navigasi footer" className="lg:col-span-3">
            <h2 className="text-label font-semibold uppercase tracking-[0.12em] text-text">
              Navigasi
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 lg:grid-cols-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[0.9375rem] text-text-muted transition-colors duration-150 ease-out-soft hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <h2 className="text-label font-semibold uppercase tracking-[0.12em] text-text">
              Atribusi dan lisensi
            </h2>

            <ul className="mt-4 flex flex-col gap-2.5 text-[0.8125rem] leading-relaxed text-text-muted">
              {siteConfig.attribution.icons8.required ? (
                <li>
                  <a
                    href={siteConfig.attribution.icons8.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-text-muted underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-soft hover:text-text"
                  >
                    {siteConfig.attribution.icons8.label}
                    <Icon name="arrow" size={12} />
                  </a>
                </li>
              ) : null}

              {siteConfig.attribution.photos.map((photo) => (
                <li key={photo.file}>
                  Foto oleh {photo.author} —{" "}
                  <a
                    href={photo.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-border underline-offset-4 transition-colors duration-150 ease-out-soft hover:text-text"
                  >
                    Wikimedia Commons
                  </a>
                  ,{" "}
                  <a
                    href={photo.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    {photo.license}
                  </a>{" "}
                  ({photo.changes}).
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-[0.8125rem] text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {siteConfig.copyrightYear} {siteConfig.name}. Hak cipta
            dilindungi.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {siteConfig.legal.privacyPolicyUrl ? (
              <a
                href={siteConfig.legal.privacyPolicyUrl}
                className="transition-colors duration-150 ease-out-soft hover:text-text"
              >
                Kebijakan privasi
              </a>
            ) : null}
            <p>Dirancang untuk greenhouse melon bermedia tanah.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
