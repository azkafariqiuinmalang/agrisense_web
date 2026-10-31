import Link from "next/link";
import { MessageSquare, ArrowRight, ArrowUpRight } from "lucide-react";
import styles from "./startup.module.css";

export function StartupCta({ whatsappUrl }: { whatsappUrl: string | null }) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.ctaBannerWrapper}>
          <div className={styles.ctaBannerGlow} aria-hidden="true" />

          <h2 className={styles.ctaBannerTitle}>
            Satu Greenhouse. Satu Percakapan.
            <br />
            Panen Lebih Terukur.
          </h2>

          <p className={styles.ctaBannerDesc}>
            Tingkatkan efisiensi kerja di kebun melon Anda dengan asisten WhatsApp yang
            selalu siap mencatat dan menganalisis kapan saja.
          </p>

          <div className={styles.ctaBannerActions}>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBannerBtnPrimary}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mulai via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <a href="#simulasi" className={styles.ctaBannerBtnPrimary}>
                <MessageSquare className="w-4 h-4" />
                <span>Coba Simulasi AI</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}

            <Link href="/login" className={styles.ctaBannerBtnOutline}>
              <span>Buka Dashboard Petani</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className={styles.ctaBannerFootnote}>
            Tahap Pengujian Pilot • Terbuka untuk Mitra Greenhouse Melon
          </div>
        </div>
      </div>
    </section>
  );
}
