"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { story } from "@/content/story";
import { IPhoneWhatsAppDemo } from "./IPhoneWhatsAppDemo";
import { StoryTranscript } from "./StoryTranscript";
import { SectionIntro } from "./ui";

const STORY_MEDIA =
  "(min-width: 64rem) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";
function subscribeToStoryMedia(onChange: () => void) {
  const query = window.matchMedia(STORY_MEDIA);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function WhatsAppStory() {
  const [activeStage, setActiveStage] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const storyMode = useSyncExternalStore(
    subscribeToStoryMedia,
    () => window.matchMedia(STORY_MEDIA).matches,
    () => false,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const manualUntil = useRef(0);

  const selectStage = useCallback(
    (index: number) => {
      manualUntil.current = performance.now() + 1800;
      setActiveStage(index);
      if (!storyMode) return;
      const target = stepRefs.current[index];
      if (!target) return;
      if (document.documentElement.dataset.motionReady === "true")
        window.dispatchEvent(
          new CustomEvent("agrisense:scroll", { detail: target }),
        );
      else target.scrollIntoView({ block: "center", behavior: "smooth" });
    },
    [storyMode],
  );

  const replay = () => {
    selectStage(0);
    setReplayKey((previous) => previous + 1);
  };

  useEffect(() => {
    if (!storyMode) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          stepRefs.current.forEach((step, index) => {
            if (!step) return;
            const select = () => {
              if (performance.now() >= manualUntil.current)
                setActiveStage(index);
            };
            ScrollTrigger.create({
              trigger: step,
              start: "top 35%",
              end: "bottom 35%",
              onEnter: select,
              onEnterBack: select,
            });
          });
        }, sectionRef);
        void document.fonts.ready.then(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });
        revert = () => ctx.revert();
      })
      .catch(() => {});
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
        <div className="story-shell iphone-story-shell mt-10 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <ol className="iphone-story-steps order-2 flex flex-col lg:order-1 lg:col-span-6">
            {story.stages.map((entry, index) => (
              <li
                key={entry.title}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                data-scroll-align="start"
                className="story-step group relative flex gap-4"
                aria-current={activeStage === index ? "step" : undefined}
              >
                {index < story.stages.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={
                      "absolute bottom-0 left-[2.875rem] top-18 hidden w-px lg:block " +
                      (index < activeStage ? "bg-primary" : "bg-border")
                    }
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={
                    "flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-medium " +
                    (activeStage === index
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-text-muted")
                  }
                >
                  {index + 1}
                </span>
                <div className="relative min-w-0 flex-1 pb-4">
                  <h3
                    className={
                      "text-h3 font-medium " +
                      (activeStage === index ? "text-text" : "text-text-muted")
                    }
                  >
                    {entry.title}
                  </h3>
                  <p className="mt-2 max-w-[35ch] text-[0.9375rem] text-text-muted">
                    {entry.body}
                  </p>
                  <button
                    type="button"
                    className="story-select absolute inset-0 rounded-xl no-js:hidden"
                    onClick={() => selectStage(index)}
                    aria-label={
                      "Tampilkan tahap " + (index + 1) + ": " + entry.title
                    }
                  />
                </div>
              </li>
            ))}
          </ol>
          <div className="order-1 min-w-0 lg:order-2 lg:col-span-6">
            <div className="iphone-sticky">
              <IPhoneWhatsAppDemo
                stage={activeStage}
                replayKey={replayKey}
                onStageChange={selectStage}
                onReplay={replay}
              />
            </div>
          </div>
        </div>
        <p className="mt-5 text-center text-label text-text-muted">
          Demo interaktif dengan data contoh. Tidak mengirim pesan ke WhatsApp.
        </p>
        <StoryTranscript />
      </div>
    </section>
  );
}
