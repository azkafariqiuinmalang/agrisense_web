"use client";

import { useEffect, useRef } from "react";

/** One motion owner: GSAP ticker, Lenis, reveals and hover effects. */
export function ScrollReveal() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    // Availability means hydration succeeded, not just that an inline script ran.
    root.dataset.js = "true";
    let cancelled = false;
    let teardown: (() => void) | undefined;

    async function initialize() {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      const header = document.querySelector<HTMLElement>(".site-header");
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(".nav-link"),
      );
      const updateHeader = () =>
        header?.classList.toggle("is-scrolled", window.scrollY > 20);
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });

      // Scroll spy also works when motion is disabled.
      const sections = links
        .map((link) => document.getElementById(link.hash.slice(1)))
        .filter((el): el is HTMLElement => !!el);
      const spy = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            links.forEach((link) => {
              if (link.hash === "#" + entry.target.id)
                link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          }
        },
        { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
      );
      sections.forEach((section) => spy.observe(section));

      media.add("(prefers-reduced-motion: no-preference)", () => {
        let active = true;
        const lenis = new Lenis({
          duration: 1.1,
          smoothWheel: true,
          syncTouch: false,
          anchors: false,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          prevent: (node) => !!node.closest("[data-lenis-prevent]"),
          virtualScroll: () => root.dataset.menuOpen !== "true",
        });
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        const update = () => ScrollTrigger.update();
        lenis.on("scroll", update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        root.dataset.motionReady = "true";

        const anchorClick = (event: MouseEvent) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const anchor = (event.target as Element).closest<HTMLAnchorElement>(
            'a[href^="#"]',
          );
          if (
            !anchor ||
            anchor.hasAttribute("download") ||
            anchor.target === "_blank"
          )
            return;
          const target = document.getElementById(
            decodeURIComponent(anchor.hash.slice(1)),
          );
          if (!target || root.dataset.menuOpen === "true") return;
          event.preventDefault();
          const padding =
            parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
          const destination =
            window.scrollY + target.getBoundingClientRect().top - padding;
          lenis.scrollTo(destination, {
            duration: 1.2,
            onComplete: () => {
              if (window.location.hash !== anchor.hash)
                history.pushState(null, "", anchor.hash);
              if (anchor.hash === "#main") {
                target.tabIndex = -1;
                target.focus({ preventScroll: true });
              }
            },
          });
        };
        document.addEventListener("click", anchorClick);
        const scrollToStage = (event: Event) => {
          const target = (event as CustomEvent<HTMLElement>).detail;
          if (!target) return;
          const alignment =
            target.dataset.scrollAlign === "start"
              ? parseFloat(getComputedStyle(root).scrollPaddingTop) || 112
              : window.innerHeight * 0.5;
          const destination =
            window.scrollY + target.getBoundingClientRect().top - alignment;
          lenis.scrollTo(destination, { duration: 0.8 });
        };
        window.addEventListener("agrisense:scroll", scrollToStage);

        // Anything above the fold remains readable. Only below-fold content is
        // prepared for an entrance, after the animation engine has loaded.
        document
          .querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.92)
              return;
            gsap.fromTo(
              el,
              { y: 32, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay:
                  Math.min(Number(el.dataset.revealDelay || 0), 160) / 1000,
                scrollTrigger: { trigger: el, start: "top 94%", once: true },
              },
            );
          });
        // Hero entrance never hides the headline or actions.
        if (window.scrollY < 100)
          gsap.from("[data-hero-enter]", {
            y: 20,
            duration: 0.9,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "transform",
          });
        document
          .querySelectorAll<HTMLElement>("[data-scroll-media]")
          .forEach((el) => {
            gsap.fromTo(
              el,
              { y: -14 },
              {
                y: 14,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });
        gsap.to(progressRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
          },
        });

        const onMenu = (event: Event) => {
          const open = (event as CustomEvent<boolean>).detail;
          if (open) lenis.stop();
          else lenis.start();
        };
        window.addEventListener("agrisense:menu", onMenu);
        if (root.dataset.menuOpen === "true") lenis.stop();
        const refresh = () => {
          lenis.resize();
          ScrollTrigger.refresh();
        };
        window.addEventListener("agrisense:layout", refresh);
        void document.fonts.ready.then(() => {
          if (!cancelled && active) refresh();
        });
        return () => {
          active = false;
          document.removeEventListener("click", anchorClick);
          window.removeEventListener("agrisense:scroll", scrollToStage);
          window.removeEventListener("agrisense:menu", onMenu);
          window.removeEventListener("agrisense:layout", refresh);
          gsap.ticker.remove(tick);
          lenis.off("scroll", update);
          lenis.destroy();
          delete root.dataset.motionReady;
        };
      });

      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const floaters = Array.from(
            document.querySelectorAll<HTMLElement>("[data-parallax]"),
          ).map((el) => ({
            amount: Number(el.dataset.parallax || 10),
            x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
          }));
          const move = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            const dx = event.clientX / window.innerWidth - 0.5;
            const dy = event.clientY / window.innerHeight - 0.5;
            floaters.forEach((floater) => {
              floater.x(dx * floater.amount);
              floater.y(dy * floater.amount);
            });
          };
          window.addEventListener("pointermove", move, { passive: true });
          const hoverCleanup: (() => void)[] = [];
          document
            .querySelectorAll<HTMLElement>(".magnetic, [data-tilt]")
            .forEach((el) => {
              const tilt = el.hasAttribute("data-tilt");
              const x = gsap.quickTo(el, "x", {
                duration: 0.45,
                ease: "power3.out",
              });
              const y = gsap.quickTo(el, "y", {
                duration: 0.45,
                ease: "power3.out",
              });
              const rx = gsap.quickTo(el, "rotationX", {
                duration: 0.6,
                ease: "power3.out",
              });
              const ry = gsap.quickTo(el, "rotationY", {
                duration: 0.6,
                ease: "power3.out",
              });
              let bounds: DOMRect | null = null;
              const enter = () => {
                bounds = el.getBoundingClientRect();
              };
              const hover = (event: PointerEvent) => {
                if (event.pointerType === "touch") return;
                const rect = bounds || el.getBoundingClientRect();
                const nx = (event.clientX - rect.left) / rect.width - 0.5;
                const ny = (event.clientY - rect.top) / rect.height - 0.5;
                if (tilt) {
                  rx(-ny * 5);
                  ry(nx * 5);
                  el.style.setProperty("--pointer-x", (nx + 0.5) * 100 + "%");
                  el.style.setProperty("--pointer-y", (ny + 0.5) * 100 + "%");
                } else {
                  x(nx * 10);
                  y(ny * 8);
                }
              };
              const reset = () => {
                x(0);
                y(0);
                rx(0);
                ry(0);
                bounds = null;
              };
              el.addEventListener("pointerenter", enter);
              el.addEventListener("pointermove", hover, { passive: true });
              el.addEventListener("pointerleave", reset);
              el.addEventListener("blur", reset);
              hoverCleanup.push(() => {
                el.removeEventListener("pointerenter", enter);
                el.removeEventListener("pointermove", hover);
                el.removeEventListener("pointerleave", reset);
                el.removeEventListener("blur", reset);
                el.style.removeProperty("--pointer-x");
                el.style.removeProperty("--pointer-y");
              });
            });
          return () => {
            window.removeEventListener("pointermove", move);
            hoverCleanup.forEach((cleanup) => cleanup());
          };
        },
      );
      const refreshOnLayout = () => ScrollTrigger.refresh();
      document.addEventListener("toggle", refreshOnLayout, true);
      teardown = () => {
        media.revert();
        spy.disconnect();
        window.removeEventListener("scroll", updateHeader);
        document.removeEventListener("toggle", refreshOnLayout, true);
        links.forEach((link) => link.removeAttribute("aria-current"));
      };
    }
    // Failure leaves the server-rendered content and native scrolling intact.
    void initialize().catch(() => {
      delete root.dataset.motionReady;
    });
    return () => {
      cancelled = true;
      teardown?.();
      root.dataset.js = "false";
    };
  }, []);

  return <div ref={progressRef} className="scroll-progress" aria-hidden="true" />;
}
