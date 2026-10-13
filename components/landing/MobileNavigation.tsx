"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks } from "@/content/landing";
import { buttonClass } from "./ui";
import { Icon } from "./Icon";

/**
 * Mobile menu — DESIGN.md §5.1 / §10.
 * Escape closes it and returns focus to the trigger, Tab is trapped inside the
 * panel while it is open, and the trigger carries a clear accessible name.
 */
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
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      );

    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        className="inline-flex size-11 items-center justify-center rounded-button border border-control-border text-text transition-colors duration-150 ease-out-soft hover:bg-surface"
      >
        <Icon name={isOpen ? "close" : "menu"} size={20} />
      </button>

      {isOpen ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col justify-between overflow-y-auto border-t border-border bg-white px-6 pb-8 pt-4"
        >
          <nav aria-label="Navigasi mobile">
            <ul className="divide-y divide-border">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-4 text-lg font-medium text-text"
                  >
                    {link.label}
                    <Icon name="arrow" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="#demo"
              onClick={() => setIsOpen(false)}
              className={`${buttonClass.primary} w-full`}
            >
              Lihat demo
            </a>
            <a
              href="#pilot"
              onClick={() => setIsOpen(false)}
              className={`${buttonClass.secondary} w-full`}
            >
              Diskusikan pilot
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
