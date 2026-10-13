import Image from "next/image";

/**
 * Single icon family for the whole page: Icons8 Material Outlined PNGs.
 * Keeping the map in one place stops icon sets from drifting apart
 * (DESIGN.md §6.5) and keeps alt text out of decorative markup.
 */
const ICONS = {
  chat: "/icons/chat-176b3a-96.png",
  camera: "/icons/camera-176b3a-96.png",
  microphone: "/icons/microphone-176b3a-96.png",
  task: "/icons/task-176b3a-96.png",
  leaf: "/icons/leaf-176b3a-96.png",
  inspection: "/icons/inspection-176b3a-96.png",
  confirmed: "/icons/checked-checkbox-176b3a-96.png",
  calendar: "/icons/calendar-176b3a-48.png",
  check: "/icons/checkmark-176b3a-48.png",
  chevron: "/icons/expand-arrow-176b3a-48.png",
  arrow: "/icons/forward-176b3a-48.png",
  "arrow-inverse": "/icons/forward-ffffff-48.png",
  menu: "/icons/menu-123524-48.png",
  close: "/icons/multiply-123524-48.png",
  info: "/icons/info-4b6357-48.png",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  /** Rendered size in CSS px. Source files are 48/96 px, so this stays crisp. */
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={ICONS[name]}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      // Small local UI icons: one size, no photo pipeline (DESIGN.md §9.3).
      sizes={`${size}px`}
      className={className}
    />
  );
}
