import Image from "next/image";
import { hero } from "@/content/landing";
import { Icon } from "./Icon";
import { buttonClass } from "./ui";

export function HeroSection() {
  const emphasizedPhrase = "lewat WhatsApp.";
  const introduction = hero.title.replace(emphasizedPhrase, "").trim();

  return (
    <section id="beranda" aria-labelledby="hero-title" className="hero-section">
      <div className="page-container">
        <div className="hero-layout">
          <div className="hero-copy">
            <p data-hero-enter className="hero-eyebrow">
              {hero.eyebrow}
            </p>
            <h1 data-hero-enter id="hero-title" className="hero-title">
              <span className="hero-heading-intro">{introduction}</span>{" "}
              <span className="hero-emphasis">{emphasizedPhrase}</span>
            </h1>
            <p data-hero-enter className="hero-description">
              {hero.description}
            </p>
            <div data-hero-enter className="hero-actions">
              <a href="#demo" className={buttonClass.primary}>
                Lihat demo
                <Icon name="arrow" size={19} className="button-icon" />
              </a>
              <a
                href="#pilot"
                className={`${buttonClass.quiet} hero-secondary`}
              >
                Diskusikan pilot
              </a>
            </div>
            <p data-hero-enter className="hero-note">
              {hero.note}
            </p>
          </div>

          <figure data-hero-enter className="hero-visual">
            <div className="hero-photo">
              <div data-scroll-media className="hero-image-layer">
                <Image
                  src={hero.image.src}
                  alt={hero.image.alt}
                  width={hero.image.width}
                  height={hero.image.height}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(100vw - 64px), (max-width: 1280px) calc((100vw - 144px) / 2), 560px"
                  className="h-full w-full object-cover object-[50%_65%]"
                />
              </div>
            </div>
            <figcaption className="hero-image-caption">
              <span>Melon · Greenhouse · Media tanah</span>
              <span className="hero-photo-label">Konteks lapangan</span>
            </figcaption>
          </figure>
        </div>

        <div data-hero-enter className="hero-capabilities">
          <p>Satu percakapan. Banyak kemungkinan.</p>
          <ul aria-label="Kemampuan prototipe AgriSense">
            <li>Percakapan</li>
            <li>Foto tanaman</li>
            <li>Pesan suara</li>
            <li>Catatan kegiatan</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
