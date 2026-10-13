"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { story, speakerLabel, type StoryMessage } from "@/content/story";
import { LeafGlyph } from "./Logo";

function subscribeHydration() {
  return () => {};
}
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type PhoneIconName =
  | "back"
  | "video"
  | "phone"
  | "plus"
  | "camera"
  | "send"
  | "sticker"
  | "check"
  | "replay"
  | "close"
  | "chat";
function PhoneIcon({
  name,
  size = 22,
}: {
  name: PhoneIconName;
  size?: number;
}) {
  const paths: Record<PhoneIconName, React.ReactNode> = {
    back: <path d="m14.5 4-8 8 8 8" />,
    video: (
      <>
        <rect x="3" y="6" width="12" height="12" rx="3" />
        <path d="m15 10 6-3v10l-6-3" />
      </>
    ),
    phone: (
      <path d="M7 3 4 4.5c-1 6 5 13 12 15l3-3-4-4-2 2c-2-1-4-3-5-5l2-2-3-4Z" />
    ),
    plus: <path d="M12 4v16M4 12h16" />,
    camera: (
      <>
        <path d="M4 7h3l2-3h6l2 3h3v13H4Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    send: (
      <>
        <path d="m4 12 16-8-5 16-3-6-8-2Z" />
        <path d="m12 14 8-10" />
      </>
    ),
    sticker: (
      <>
        <path d="M5 3h14a2 2 0 0 1 2 2v9l-7 7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path d="M14 21v-5a2 2 0 0 1 2-2h5" />
      </>
    ),
    check: (
      <>
        <path d="m2 12 4 4L16 6" />
        <path d="m10 14 2 2L22 6" />
      </>
    ),
    replay: (
      <>
        <path d="M4 9a8 8 0 1 1 0 6M4 4v5h5" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chat: (
      <>
        <path d="M4 4h16v12H9l-5 4V4Z" />
        <path d="M8 8h8M8 12h5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

function StatusIcons() {
  return (
    <span className="iphone-status-icons" aria-hidden="true">
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx=".7" />
        <rect x="4.3" y="5.5" width="3" height="6.5" rx=".7" />
        <rect x="8.6" y="3" width="3" height="9" rx=".7" />
        <rect x="13" width="3" height="12" rx=".7" />
      </svg>
      <svg
        width="16"
        height="12"
        viewBox="0 0 20 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      >
        <path d="M2 3q8-6 16 0M5 6q5-4 10 0M8 9q2-2 4 0" />
        <circle cx="10" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
      <span className="iphone-battery">
        <span />
      </span>
    </span>
  );
}

function WhatsAppMessage({
  message,
  id,
  stageIndex,
  onPhoto,
}: {
  message: StoryMessage;
  id: string;
  stageIndex: number;
  onPhoto: () => void;
}) {
  const outgoing = message.from === "user";
  return (
    <div
      className={
        "wa-message " + (outgoing ? "wa-message-out" : "wa-message-in")
      }
      data-message-id={id}
      data-message-stage={stageIndex}
    >
      <span className="sr-only">{speakerLabel[message.from]}: </span>
      {message.attachment === "photo" ? (
        <button
          type="button"
          onClick={onPhoto}
          className="wa-photo"
          aria-label="Lihat foto contoh daun melon"
        >
          <Image
            src="/images/demo-melon-leaf.jpg"
            alt="Foto contoh daun melon dengan bercak dan bagian menguning."
            width={768}
            height={512}
            sizes="240px"
            className="h-full w-full object-cover"
          />
          <span className="wa-photo-caption">Foto daun melon.jpg</span>
        </button>
      ) : null}
      <span>{message.text}</span>
      <span className="wa-message-meta">
        <span>09:{String(41 + stageIndex).padStart(2, "0")}</span>
        {outgoing ? (
          <span className="wa-read-receipt" aria-label="Dibaca">
            <PhoneIcon name="check" size={15} />
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function IPhoneWhatsAppDemo({
  stage,
  replayKey,
  onStageChange,
  onReplay,
}: {
  stage: number;
  replayKey: number;
  onStageChange: (stage: number) => void;
  onReplay: () => void;
}) {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  const [chatOpen, setChatOpen] = useState(true);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const key = stage + ":" + replayKey;
  const [run, setRun] = useState({ key: "0:0", typing: false, complete: true });
  const currentRun =
    run.key === key ? run : { key, typing: true, complete: false };
  const chatRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const photoDialogRef = useRef<HTMLDialogElement>(null);
  const seenMessages = useRef(new Set<string>());
  const previousConversation = useRef(key);
  const userScrolling = useRef(false);
  const nextStage = stage < story.stages.length - 1 ? stage + 1 : null;
  const draft =
    nextStage !== null ? story.stages[nextStage].messages[0].text : "";
  const completed = nextStage === null && currentRun.complete;

  useEffect(() => {
    if (!hydrated) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = window.setTimeout(
      () => setRun({ key, typing: !reduce, complete: reduce }),
      50,
    );
    const end = window.setTimeout(
      () => setRun({ key, typing: false, complete: true }),
      reduce ? 60 : 1250,
    );
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [key, hydrated]);

  useEffect(() => {
    if (!hydrated || !chatOpen) return;
    const viewport = chatRef.current;
    if (!viewport) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void import("gsap")
      .then(({ gsap }) => {
        if (cancelled) return;
        if (previousConversation.current !== key) {
          previousConversation.current = key;
          userScrolling.current = false;
        }
        const interruptScroll = () => {
          userScrolling.current = true;
          gsap.killTweensOf(viewport, "scrollTop");
        };
        const interruptForKey = (event: KeyboardEvent) => {
          if (
            [
              "ArrowUp",
              "ArrowDown",
              "PageUp",
              "PageDown",
              "Home",
              "End",
            ].includes(event.key)
          )
            interruptScroll();
        };
        viewport.addEventListener("wheel", interruptScroll, { passive: true });
        viewport.addEventListener("touchstart", interruptScroll, {
          passive: true,
        });
        viewport.addEventListener("keydown", interruptForKey);
        const ctx = gsap.context(() => {
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          const fresh = Array.from(
            viewport.querySelectorAll<HTMLElement>("[data-message-id]"),
          ).filter(
            (el) =>
              el.dataset.messageStage === String(stage) &&
              !seenMessages.current.has(key + ":" + el.dataset.messageId),
          );
          fresh.forEach((el) =>
            seenMessages.current.add(key + ":" + el.dataset.messageId),
          );
          if (!reduce) {
            gsap.fromTo(
              fresh,
              { y: 10, scale: 0.97 },
              {
                y: 0,
                scale: 1,
                duration: 0.35,
                stagger: 0.08,
                ease: "power2.out",
              },
            );
            if (!userScrolling.current)
              gsap.to(viewport, {
                scrollTop: viewport.scrollHeight,
                duration: 0.45,
                ease: "power2.out",
                overwrite: "auto",
              });
            gsap.to(".wa-typing span", {
              y: -3,
              duration: 0.3,
              stagger: 0.1,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          } else if (!userScrolling.current)
            viewport.scrollTop = viewport.scrollHeight;
        }, phoneRef);
        cleanup = () => {
          viewport.removeEventListener("wheel", interruptScroll);
          viewport.removeEventListener("touchstart", interruptScroll);
          viewport.removeEventListener("keydown", interruptForKey);
          const position = viewport.scrollTop;
          ctx.revert();
          viewport.scrollTop = position;
        };
      })
      .catch(() => {
        viewport.scrollTop = viewport.scrollHeight;
      });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [
    key,
    currentRun.complete,
    currentRun.typing,
    hydrated,
    chatOpen,
    reducedMotion,
    stage,
  ]);

  const showPhoto = () => photoDialogRef.current?.showModal();
  const send = () => {
    if (!currentRun.complete) return;
    if (nextStage === null) onReplay();
    else onStageChange(nextStage);
  };

  return (
    <div className="iphone-demo">
      <div className="iphone-frame" data-testid="iphone-frame">
        <span
          className="iphone-side-button iphone-action-button"
          aria-hidden="true"
        />
        <span
          className="iphone-side-button iphone-volume-up"
          aria-hidden="true"
        />
        <span
          className="iphone-side-button iphone-volume-down"
          aria-hidden="true"
        />
        <span
          className="iphone-side-button iphone-power-button"
          aria-hidden="true"
        />
        <div className="iphone-screen" ref={phoneRef}>
          <div className="iphone-status-bar">
            <span className="iphone-time">9:41</span>
            <span className="iphone-dynamic-island" aria-hidden="true">
              <span />
            </span>
            <StatusIcons />
          </div>
          {chatOpen ? (
            <div className="wa-app">
              <header className="wa-header">
                <button
                  type="button"
                  className="wa-back"
                  aria-label="Kembali ke daftar chat"
                  onClick={() => setChatOpen(false)}
                  disabled={!hydrated}
                >
                  <PhoneIcon name="back" size={24} />
                </button>
                <span className="wa-avatar" aria-hidden="true">
                  <LeafGlyph className="size-6" />
                </span>
                <div className="wa-contact">
                  <span className="wa-contact-name">AgriSense</span>
                  <span className="wa-contact-status">
                    {currentRun.typing ? "mengetik…" : "Asisten budidaya melon"}
                  </span>
                </div>
                <span className="wa-header-actions" aria-hidden="true">
                  <PhoneIcon name="video" size={21} />
                  <PhoneIcon name="phone" size={19} />
                </span>
              </header>
              <div
                className="wa-conversation"
                ref={chatRef}
                data-lenis-prevent
                tabIndex={0}
                role="region"
                aria-label="Percakapan demo WhatsApp AgriSense"
              >
                <span className="wa-date">Hari ini</span>
                <p className="wa-demo-notice">
                  Demo interaktif. Percakapan ini menggunakan pesan contoh.
                </p>
                {story.stages
                  .slice(0, stage)
                  .flatMap((entry, stageIndex) =>
                    entry.messages.map((message, index) => (
                      <WhatsAppMessage
                        key={stageIndex + "-" + index}
                        id={stageIndex + "-" + index}
                        message={message}
                        stageIndex={stageIndex}
                        onPhoto={showPhoto}
                      />
                    )),
                  )}
                {story.stages[stage].messages
                  .filter(
                    (message) => message.from === "user" || currentRun.complete,
                  )
                  .map((message, index) => (
                    <WhatsAppMessage
                      key={stage + "-" + index}
                      id={stage + "-" + index}
                      message={message}
                      stageIndex={stage}
                      onPhoto={showPhoto}
                    />
                  ))}
                {currentRun.typing ? (
                  <div
                    className="wa-message wa-message-in wa-typing"
                    aria-label="AgriSense sedang mengetik"
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                ) : null}
              </div>
              {attachmentsOpen ? (
                <div className="wa-attachment-tray">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-semibold">
                      Foto contoh
                    </span>
                    <button
                      type="button"
                      aria-label="Tutup pilihan lampiran"
                      onClick={() => setAttachmentsOpen(false)}
                    >
                      <PhoneIcon name="close" size={18} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="wa-attachment-option"
                    onClick={() => {
                      setAttachmentsOpen(false);
                      onStageChange(1);
                    }}
                  >
                    <Image
                      src="/images/demo-melon-leaf.jpg"
                      alt=""
                      width={72}
                      height={48}
                      sizes="72px"
                    />
                    <span>Foto daun melon.jpg</span>
                  </button>
                </div>
              ) : null}
              <form
                className="wa-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
              >
                <button
                  type="button"
                  className="wa-attach-button"
                  aria-label="Pilih foto contoh"
                  disabled={!hydrated || !currentRun.complete}
                  onClick={() => setAttachmentsOpen(!attachmentsOpen)}
                >
                  <PhoneIcon name="plus" size={25} />
                </button>
                <div className="wa-input-shell">
                  <textarea
                    aria-label="Pesan contoh untuk dikirim"
                    name="demo-message"
                    value={draft}
                    readOnly
                    rows={1}
                    placeholder={
                      completed ? "Percakapan selesai" : "Pesan contoh"
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        send();
                      }
                    }}
                  />
                  <span aria-hidden="true">
                    <PhoneIcon name="sticker" size={19} />
                  </span>
                </div>
                <button
                  type="submit"
                  className="wa-send-button"
                  aria-label={
                    completed ? "Ulangi percakapan" : "Kirim pesan contoh"
                  }
                  disabled={!hydrated || !currentRun.complete}
                >
                  <PhoneIcon name={completed ? "replay" : "send"} size={20} />
                </button>
              </form>
            </div>
          ) : (
            <div className="wa-chat-list">
              <div className="wa-list-heading">
                <h3>Chat</h3>
                <span aria-hidden="true">
                  <PhoneIcon name="plus" />
                </span>
              </div>
              <div className="wa-search" aria-hidden="true">
                Cari
              </div>
              <button
                type="button"
                className="wa-chat-list-item"
                onClick={() => setChatOpen(true)}
                aria-label="Buka percakapan AgriSense"
              >
                <span className="wa-avatar">
                  <LeafGlyph className="size-7" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-semibold">AgriSense</span>
                  <span className="mt-1 block text-[0.75rem] text-text-muted">
                    {story.stages[stage].messages[1].text}
                  </span>
                </span>
                <span className="self-start text-[0.625rem] text-text-muted">
                  09:{41 + stage}
                </span>
              </button>
              <span className="wa-list-footer">
                <PhoneIcon name="chat" size={23} />
                Chat
              </span>
            </div>
          )}
          <div className="iphone-home-area" aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
      <div className="iphone-demo-controls">
        <div
          className="iphone-stage-picker"
          role="group"
          aria-label="Pilih tahap demo"
        >
          {story.stages.map((entry, index) => (
            <button
              key={entry.title}
              type="button"
              aria-label={"Tahap " + (index + 1) + ": " + entry.title}
              aria-pressed={stage === index}
              onClick={() => onStageChange(index)}
              disabled={!hydrated}
            >
              <span aria-hidden="true">{index + 1}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="iphone-replay-button"
          onClick={onReplay}
          disabled={!hydrated}
        >
          <PhoneIcon name="replay" size={16} />
          Ulangi demo
        </button>
      </div>
      <p className="iphone-demo-help">
        Coba tombol kirim atau foto untuk melanjutkan percakapan contoh.
      </p>
      <span
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {currentRun.complete
          ? "Tahap " + (stage + 1) + ": " + story.stages[stage].messages[1].text
          : "AgriSense sedang mengetik balasan contoh."}
      </span>
      <dialog
        ref={photoDialogRef}
        data-lenis-prevent
        className="wa-photo-dialog"
        aria-label="Foto contoh daun melon"
      >
        <div className="flex items-center justify-between gap-4 p-4">
          <span className="text-sm font-medium">Foto daun melon.jpg</span>
          <button
            type="button"
            aria-label="Tutup foto"
            onClick={() => photoDialogRef.current?.close()}
            className="flex size-10 items-center justify-center rounded-full bg-surface"
          >
            <PhoneIcon name="close" />
          </button>
        </div>
        <Image
          src="/images/demo-melon-leaf.jpg"
          alt="Foto contoh daun melon dengan bercak dan bagian menguning, bukan hasil diagnosis demo."
          width={768}
          height={512}
          sizes="(max-width: 640px) 90vw, 600px"
        />
        <p className="p-4 text-label text-text-muted">
          Foto contoh untuk demonstrasi percakapan. Foto tidak digunakan untuk
          membuat diagnosis.
        </p>
      </dialog>
    </div>
  );
}
