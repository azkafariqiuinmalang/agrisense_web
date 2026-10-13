import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

/**
 * AgriSense brand mark.
 *
 * User-provided LOGO AGRISENSE.jpg, preserved unchanged in public/images.
 * White backing matches the source JPEG. CSS frames its generous outer margin
 * without changing the artwork or stretching its aspect ratio.
 */
export function BrandGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: "inline-block", overflow: "hidden", background: "#fff", borderRadius: "inherit", flexShrink: 0, aspectRatio: "1" }}
    >
      <Image
        src="/images/agrisense-logo.jpg"
        alt=""
        width={1254}
        height={1254}
        sizes="48px"
        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", transform: "scale(1.4)" }}
      />
    </span>
  );
}

/** Backward-compatible name for the earlier demo components. */
export const LeafGlyph = BrandGlyph;

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-[15px] bg-white ${className}`}
    >
      <BrandGlyph className="size-full" />
    </span>
  );
}

export function Logo({ href = "#beranda" }: { href?: string }) {
  return (
    <a
      href={href}
      className="brand-logo magnetic inline-flex items-center gap-2.5 rounded-md"
      aria-label={`${siteConfig.name} — kembali ke beranda`}
    >
      <LogoMark className="size-10" />
      <span
        className="text-[1.375rem] font-medium tracking-[-0.04em] text-text"
        translate="no"
      >
        {siteConfig.name}
      </span>
    </a>
  );
}
