"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks } from "@/content/landing";
import { buttonClass } from "./ui";
import { Icon } from "./Icon";
export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled])",
        ) || [],
      );
    const root = document.documentElement;
    const oldBodyOverflow = document.body.style.overflow;
    const oldRootOverflow = root.style.overflow;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main,body > footer,.brand-logo,.site-header nav[aria-label="Navigasi utama"],.site-header a.material-button',
      ),
    ).filter((el) => !panel?.contains(el));
    const previousInert = background.map((el) => el.inert);
    background.forEach((el) => {
      el.inert = true;
    });
    root.dataset.menuOpen = "true";
    document.body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("agrisense:menu", { detail: true }));
    focusable()[0]?.focus();
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable(),
        first = items[0],
        last = items[items.length - 1];
      if (!first) return;
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !panel?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !panel?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
    function breakpoint(event: MediaQueryListEvent) {
      if (event.matches) close();
    }
    document.addEventListener("keydown", keyboard);
    desktop.addEventListener("change", breakpoint);
    return () => {
      document.removeEventListener("keydown", keyboard);
      desktop.removeEventListener("change", breakpoint);
      document.body.style.overflow = oldBodyOverflow;
      root.style.overflow = oldRootOverflow;
      background.forEach((el, index) => {
        el.inert = previousInert[index];
      });
      delete root.dataset.menuOpen;
      window.dispatchEvent(
        new CustomEvent("agrisense:menu", { detail: false }),
      );
    };
  }, [isOpen, close]);
  useEffect(() => {
    if (
      !isOpen ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void import("gsap")
      .then(({ gsap }) => {
        if (cancelled || !panelRef.current) return;
        const ctx = gsap.context(() => {
          gsap.fromTo(
            "nav li, .mobile-panel > div:last-child",
            { y: 18, opacity: 0.6 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.045,
              ease: "power3.out",
            },
          );
        }, panelRef);
        revert = () => ctx.revert();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [isOpen]);
  const select = (hash: string) => {
    setIsOpen(false);
    document.documentElement.removeAttribute("data-menu-open");
    window.dispatchEvent(new CustomEvent("agrisense:menu", { detail: false }));
    window.setTimeout(() => {
      const target = document.getElementById(hash.slice(1));
      const heading = target?.querySelector<HTMLElement>("h1,h2") || target;
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        heading.addEventListener(
          "blur",
          () => heading.removeAttribute("tabindex"),
          { once: true },
        );
      }
    }, 50);
  };
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "mobile-menu" : undefined}
        aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        tabIndex={isOpen ? -1 : 0}
        className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-primary"
      >
        <Icon name={isOpen ? "close" : "menu"} size={24} />
      </button>
      {isOpen ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          data-lenis-prevent
          className="mobile-panel fixed inset-x-0 bottom-0 top-[76px] z-50 flex flex-col overflow-y-auto border-t border-border bg-bg px-6 pt-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-label font-medium text-text-muted">
              Jelajahi AgriSense
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup navigasi"
              className="flex size-11 items-center justify-center rounded-full bg-surface"
            >
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav aria-label="Navigasi mobile" className="mt-5">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => select(link.href)}
                    className="flex items-center justify-between rounded-[24px] bg-white p-5 text-2xl font-normal"
                  >
                    <span>
                      <span className="mr-4 text-label text-text-muted">
                        0{index + 1}
                      </span>
                      {link.label}
                    </span>
                    <Icon name="arrow" size={22} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3 py-8">
            <a
              href="#demo"
              onClick={() => select("#demo")}
              className={buttonClass.primary}
            >
              Lihat demo
              <Icon name="arrow" size={20} />
            </a>
            <a
              href="#pilot"
              onClick={() => select("#pilot")}
              className={buttonClass.secondary}
            >
              Diskusikan pilot
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
