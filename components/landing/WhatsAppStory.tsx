"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { story } from "@/content/story";
import { ChatBubble, ChatDisclaimer } from "./ChatBubble";
import { LeafGlyph } from "./Logo";
import { StoryTranscript } from "./StoryTranscript";
import { SectionIntro } from "./ui";

/**
 * Sticky demo storytelling — DESIGN.md §5.4 / §8.2.
 *
 * Desktop: the four steps scroll in the left column while the conversation
 * panel stays put on the right and the transcript accumulates. CSS `position:
 * sticky` does the pinning; ScrollTrigger only reports which step is active, so
 * nothing is pinned twice (§8.2).
 *
 * Every other condition — narrow, short, reduced-motion, or no JavaScript at
 * all — renders the same four steps as a plain stacked list with their
 * conversation attached, which is the required static fallback (§7, §8.3).
 */

const STORY_MEDIA =
  "(min-width: 64rem) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

function subscribeToStoryMedia(onChange: () => void) {
  const query = window.matchMedia(STORY_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function WhatsAppStory() {
  const [activeStage, setActiveStage] = useState(0);
  const storyMode = useStoryMode();

  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // ScrollTrigger drives the stage on desktop only, matching the CSS that
  // makes the panel sticky. Loading it lazily keeps GSAP out of the initial
  // bundle (DESIGN.md §11).
  useEffect(() => {
    if (!storyMode) return;
    const section = sectionRef.current;
    const steps = stepRefs.current.filter((el): el is HTMLLIElement => !!el);
    if (!section || steps.length === 0) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // Scoped so unmount and breakpoint changes revert every trigger (§8.4).
      const ctx = gsap.context(() => {
        steps.forEach((step, index) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 62%",
            end: "bottom 62%",
            onEnter: () => setActiveStage(index),
            onEnterBack: () => setActiveStage(index),
          });
        });

        // Webfonts and images change layout height; re-measure once they settle.
        void document.fonts?.ready.then(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
      }, section);

      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [storyMode]);

  return (
    <section
      id={story.id}
      ref={sectionRef}
      aria-labelledby="demo-title"
      className="section-y bg-bg"
    >
      <div className="page-container">
        <SectionIntro
          id="demo-title"
          eyebrow={story.eyebrow}
          title={story.title}
          lead={story.intro}
          className="max-w-[46rem]"
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <ol className="flex flex-col lg:col-span-6">
            {story.stages.map((stage, index) => (
              <StoryStep
                key={stage.title}
                stage={stage}
                index={index}
                total={story.stages.length}
                active={index === activeStage}
                passed={index < activeStage}
                storyMode={storyMode}
                onSelect={() => {
                  setActiveStage(index);
                  stepRefs.current[index]?.scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  });
                }}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
              />
            ))}
          </ol>

          {storyMode ? (
            <div className="lg:col-span-6">
              <div className="sticky top-[calc(var(--header-h)+24px)] mx-auto w-full max-w-[30rem]">
                <StoryPanel stage={activeStage} />
              </div>
            </div>
          ) : null}
        </div>

        <StoryTranscript />
      </div>
    </section>
  );
}

function useStoryMode() {
  return useSyncExternalStore(
    subscribeToStoryMedia,
    () => window.matchMedia(STORY_MEDIA).matches,
    () => false,
  );
}

/* ------------------------------------------------------------------------- */

function StoryStep({
  stage,
  index,
  total,
  active,
  passed,
  storyMode,
  onSelect,
  ref,
}: {
  stage: (typeof story.stages)[number];
  index: number;
  total: number;
  active: boolean;
  /** The stage selection has already moved past this step. */
  passed: boolean;
  storyMode: boolean;
  onSelect: () => void;
  ref: (el: HTMLLIElement | null) => void;
}) {
  const isLast = index === total - 1;

  return (
    <li
      ref={ref}
      className="group relative flex gap-5 lg:min-h-[26vh]"
      aria-current={active && storyMode ? "step" : undefined}
    >
      {/* Progress rail: the path already walked is green. */}
      {!isLast ? (
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-[1.375rem] top-12 hidden w-px transition-colors duration-300 ease-out-soft lg:block ${
            passed ? "bg-primary" : "bg-border"
          }`}
        />
      ) : null}

      <span
        aria-hidden="true"
        className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200 ease-out-soft ${
          active
            ? "border-primary bg-primary text-white"
            : "border-border bg-white text-text-muted"
        }`}
      >
        {index + 1}
      </span>

      <div className="relative flex-1 pb-9 lg:pb-10">
        <h3
          className={`text-h3 font-semibold transition-colors duration-200 ease-out-soft ${
            active ? "text-text" : "text-text-muted group-hover:text-text"
          }`}
        >
          {stage.title}
        </h3>
        <p className="mt-1.5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-text-muted">
          {stage.body}
        </p>

        {/* The whole step is the control, but the heading carries the meaning,
            so the button is an overlay with its own accessible name. */}
        {storyMode ? (
          <button
            type="button"
            onClick={onSelect}
            className="absolute inset-0 rounded-md"
          >
            <span className="sr-only">
              Tampilkan tahap {index + 1}: {stage.title}
            </span>
          </button>
        ) : null}

        {/* Mobile and no-JS: each step carries its own conversation. */}
        {!storyMode ? (
          <div className="mt-5 flex flex-col gap-2.5 border-l border-border pl-5 lg:pl-16">
            {stage.messages.map((message, messageIndex) => (
              <ChatBubble
                key={`${index}-${messageIndex}`}
                message={message}
                className="max-w-[min(88%,30rem)]"
              />
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------------- */

function StoryPanel({ stage }: { stage: number }) {
  const current = story.stages[stage];

  // Everything said so far, keyed by a stable index so earlier bubbles are
  // never re-mounted (and never replay their entrance) when the stage moves.
  const messages = useMemo(
    () =>
      story.stages
        .slice(0, stage + 1)
        .flatMap((entry) => entry.messages)
        .map((message, index) => ({ message, index })),
    [stage],
  );

  // Keep the transcript pinned to the newest message and slide it up as the
  // conversation grows (DESIGN.md §8.2: no sudden height changes).
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const previousOffset = useRef<number | null>(null);
  const previousHeight = useRef(0);
  const [overflowing, setOverflowing] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const height = track.offsetHeight;
    const limit = viewport.clientHeight;
    const offset = Math.max(0, height - limit);

    setOverflowing(offset > 0);

    const from = previousOffset.current ?? offset;
    previousOffset.current = offset;

    const grew = height > previousHeight.current;
    previousHeight.current = height;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!grew || reduce || from === offset) {
      track.style.transform = `translateY(${-offset}px)`;
      return;
    }

    // Jump back to where the transcript was, then let the CSS transition
    // carry it to its new resting position.
    track.style.transition = "none";
    track.style.transform = `translateY(${-from}px)`;
    void track.offsetHeight;
    track.style.transition = "";
    track.style.transform = `translateY(${-offset}px)`;
  }, [messages.length]);

  return (
    <article className="overflow-hidden rounded-visual border border-border bg-white shadow-panel">
      <header className="flex items-center justify-between gap-4 bg-primary px-5 py-3.5 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <LeafGlyph className="size-5 text-white" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.9375rem] font-semibold leading-tight">
              AgriSense
            </span>
            <span className="block truncate text-[0.6875rem] text-white/75">
              Asisten budidaya melon
            </span>
          </span>
        </div>

        {/* Stage indicator 1–4 (§5.4). */}
        <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
          {story.stages.map((entry, index) => (
            <span
              key={entry.title}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out-soft ${
                index === stage ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </span>
        <span className="sr-only">
          Tahap {stage + 1} dari {story.stages.length}
        </span>
      </header>

      {/* Sized once for the longest state so the panel never changes height
          while the story advances (DESIGN.md §8.2). */}
      <div className="relative h-[clamp(17rem,38vh,22rem)] bg-white">
        <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
          <div
            ref={trackRef}
            // Extra top padding reserves the strip the stage chip sits in, so
            // messages never render underneath it.
            className="chat-track absolute inset-x-0 top-0 flex flex-col gap-2.5 px-4 pb-4 pt-14"
          >
            {/* Stable keys mean React only creates DOM for the messages a new
                stage adds, so the entrance animation plays for those alone. */}
            {messages.map(({ message, index }) => (
              <ChatBubble key={index} message={message} animate />
            ))}
          </div>
        </div>

        {/* Fade the older messages out instead of cutting them off. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white to-transparent transition-opacity duration-300 ${
            overflowing ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
          <span className="rounded-full border border-border bg-white/95 px-3 py-1 text-[0.6875rem] font-medium text-text-muted backdrop-blur-sm">
            Tahap {stage + 1} · {current.title}
          </span>
        </div>
      </div>

      <footer className="border-t border-border bg-surface px-5 py-3">
        <ChatDisclaimer text={story.label} />
      </footer>
    </article>
  );
}
