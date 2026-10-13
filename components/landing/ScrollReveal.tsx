"use client";

import { useEffect } from "react";

/**
 * One observer for every `[data-reveal]` element on the page (DESIGN.md §8.1).
 *
 * Renders nothing. The hidden state lives behind `html[data-js="true"]` in CSS,
 * so a visitor without JavaScript never sees a blank section, and reduced
 * motion resolves everything to its final state immediately.
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (targets.length === 0) return;

    const reveal = (el: Element) => el.classList.add("is-revealed");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));

    // Safety net: anything already on screen is shown even if the observer
    // never reports it (print, very tall viewports, snapshot tooling).
    const failsafe = window.setTimeout(() => {
      for (const el of targets) {
        if (el.getBoundingClientRect().top < window.innerHeight) reveal(el);
      }
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
