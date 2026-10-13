import type { StoryMessage } from "@/content/story";
import { Icon } from "./Icon";

/**
 * A single bubble in the illustrated WhatsApp conversation.
 *
 * Shared by the hero inset, the sticky demo panel, and the per-stage mobile
 * view so a bubble always looks the same. Decorative duplicates of the written
 * transcript are marked `aria-hidden` by their parent (DESIGN.md §8.3).
 */
export function ChatBubble({
  message,
  animate = false,
  className = "",
}: {
  message: StoryMessage;
  /** Play the entrance animation. Only new bubbles should ask for it. */
  animate?: boolean;
  className?: string;
}) {
  const isOutgoing = message.from === "user";

  return (
    <div
      className={[
        "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[0.9375rem] leading-[1.5] text-text",
        isOutgoing
          ? "self-end rounded-br-md bg-chat-out"
          : // A hairline keeps the pale incoming bubble legible on white.
            "self-start rounded-bl-md border border-border bg-chat-bg",
        animate ? "chat-bubble" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {message.attachment === "photo" ? (
        <span className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-white/80 px-2.5 py-1.5 text-[0.8125rem] font-medium">
          <Icon name="camera" size={16} />
          Foto daun melon.jpg
        </span>
      ) : null}
      {message.text}
    </div>
  );
}

/** The "illustration only" caption that keeps the mockup honest (§5.4, §12). */
export function ChatDisclaimer({ text }: { text: string }) {
  return (
    <p className="flex items-center justify-center gap-1.5 text-center text-[0.75rem] leading-snug text-text-muted">
      <Icon name="info" size={14} />
      {text}
    </p>
  );
}
