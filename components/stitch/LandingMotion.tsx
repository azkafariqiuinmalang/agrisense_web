"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./landing.module.css";

/** Native scroll and readable server HTML remain intact without JavaScript. */
export function LandingMotion({ children, className }: { children: ReactNode; className: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposeMotion = () => {};
    function initialize() {
      disposeMotion();
      if (!root || preference.matches) return;
      const animations = new Set<Animation>();
      const pending = new Set<HTMLElement>();
      const hero = root.querySelector<HTMLElement>(`.${styles.heroImage}`);
      const melon = root.querySelector<HTMLElement>(`.${styles.melonVisual}`);
      const header = root.querySelector<HTMLElement>("header");
      let frame = 0;
      function reveal(element: HTMLElement, delay = 0) {
        pending.delete(element);
        element.style.removeProperty("opacity");
        const animation = element.animate(
          [{ opacity: 0, transform: "translateY(-18px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 520, delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
      }
      const targets = root.querySelectorAll<HTMLElement>([
        styles.aboutText, styles.aboutAside, styles.sectionHeading, styles.stepCard,
        styles.demoNarrative, styles.phoneArea, styles.infoCard, styles.evidenceStrip,
        styles.trustNote, styles.faqList, styles.closing, styles.footerGrid,
      ].map(name => `.${name}`).join(","));
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          const siblings = Array.from(element.parentElement?.children ?? []);
          const stagger = element.classList.contains(styles.stepCard) || element.classList.contains(styles.infoCard);
          reveal(element, stagger ? Math.min(siblings.indexOf(element), 2) * 90 : 0);
          observer.unobserve(element);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
      for (const target of targets) {
        if (target.getBoundingClientRect().top < innerHeight - 32) continue;
        target.style.opacity = "0";
        pending.add(target);
        observer.observe(target);
      }
      const heroContent = root.querySelector<HTMLElement>(`.${styles.heroContent}`);
      if (heroContent && scrollY < 80) reveal(heroContent);
      const update = () => {
        frame = 0;
        const range = document.documentElement.scrollHeight - innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
        header?.toggleAttribute("data-scrolled", scrollY > 32);
        if (hero && scrollY < 1100) hero.style.transform = `translateY(${Math.min(scrollY * .075, 54)}px) scale(1.08)`;
        if (melon) {
          const rect = melon.getBoundingClientRect();
          if (rect.top < innerHeight && rect.bottom > 0) {
            const offset = Math.max(-18, Math.min(18, (rect.top - innerHeight * .45) * .04));
            melon.style.transform = `translateY(${offset}px)`;
          }
        }
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
      const focus = (event: FocusEvent) => {
        for (const element of pending) {
          if (event.target instanceof Node && element.contains(event.target)) {
            element.style.removeProperty("opacity");
            pending.delete(element);
            observer.unobserve(element);
          }
        }
      };
      root.dataset.motion = "ready";
      update();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      root.addEventListener("focusin", focus);
      disposeMotion = () => {
        observer.disconnect();
        animations.forEach(animation => animation.cancel());
        pending.forEach(element => element.style.removeProperty("opacity"));
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        root.removeEventListener("focusin", focus);
        hero?.style.removeProperty("transform");
        melon?.style.removeProperty("transform");
        header?.removeAttribute("data-scrolled");
        delete root.dataset.motion;
        if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
      };
    }
    initialize();
    preference.addEventListener("change", initialize);
    return () => { disposeMotion(); preference.removeEventListener("change", initialize); };
  }, []);
  return <div ref={rootRef} className={className}>
    <div ref={progressRef} className={styles.scrollProgress} aria-hidden="true" />
    {children}
  </div>;
}
