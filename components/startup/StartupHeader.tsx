"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Leaf, MessageSquare, ArrowUpRight, Menu, X } from "lucide-react";
import styles from "./startup.module.css";

const navItems = [
  { href: "#fitur", label: "Fitur" },
  { href: "#alur-kerja", label: "Alur Kerja" },
  { href: "#simulasi", label: "Simulasi AI" },
  { href: "#keamanan", label: "Keamanan" },
  { href: "#faq", label: "FAQ" },
];

export function StartupHeader({ whatsappUrl }: { whatsappUrl: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <Link href="/" className={styles.brand} aria-label="AgriSense — Beranda">
          <div className={styles.brandIcon}>
            <Leaf className="w-5 h-5 text-white" strokeWidth={2.2} />
          </div>
          <span>AgriSense</span>
        </Link>

        <nav className={styles.navLinks} aria-label="Navigasi Utama">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <Link href="/cms" className={styles.cmsLink}>
            CMS
          </Link>

          <Link href="/login" className={styles.loginBtn}>
            Masuk
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2} />
          </Link>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnPrimary}
            >
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              <span>Mulai via WhatsApp</span>
            </a>
          ) : (
            <a href="#simulasi" className={styles.ctaBtnPrimary}>
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              <span>Coba Demo</span>
            </a>
          )}

          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Buka menu navigasi"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className={styles.mobileDrawer}
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.mobileDrawerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <div className={styles.brandIcon}>
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-zinc-900">AgriSense</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mt-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
              <div className="h-px bg-zinc-200 my-2" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 text-sm font-medium text-emerald-700 flex items-center justify-between"
              >
                <span>Masuk Dashboard Petani</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
