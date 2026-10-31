import Link from "next/link";
import { Leaf, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import styles from "./startup.module.css";

export function StartupFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand Col */}
          <div className={styles.footerBrandCol}>
            <Link href="/" className={styles.brand} aria-label="AgriSense">
              <div className={styles.brandIcon}>
                <Leaf className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <span>AgriSense</span>
            </Link>
            <p>
              Asisten agronomis digital khusus budidaya melon greenhouse berbasis percakapan
              WhatsApp dan analitik web modern.
            </p>
            <div className={styles.statusIndicator}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Operasional Normal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div className={styles.footerColTitle}>Navigasi</div>
            <div className={styles.footerLinks}>
              <a href="#fitur" className={styles.footerLink}>Fitur Unggulan</a>
              <a href="#alur-kerja" className={styles.footerLink}>Alur Kerja</a>
              <a href="#simulasi" className={styles.footerLink}>Simulasi AI</a>
              <a href="#keamanan" className={styles.footerLink}>Keamanan & Privasi</a>
              <a href="#faq" className={styles.footerLink}>Pertanyaan Umum (FAQ)</a>
            </div>
          </div>

          {/* Portal & Akses */}
          <div>
            <div className={styles.footerColTitle}>Akses Platform</div>
            <div className={styles.footerLinks}>
              <Link href="/login" className={`${styles.footerLink} flex items-center gap-1`}>
                <span>Dashboard Petani</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/cms" className={`${styles.footerLink} flex items-center gap-1`}>
                <span>Portal CMS Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <a href="#simulasi" className={styles.footerLink}>
                Uji Interaktif Simulator
              </a>
              {siteConfig.legal.privacyPolicyUrl && (
                <a href={siteConfig.legal.privacyPolicyUrl} className={styles.footerLink}>
                  Kebijakan Privasi
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div>
            © {siteConfig.copyrightYear} AgriSense. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="text-xs text-zinc-400">
            Dibuat untuk efisiensi & presisi budidaya melon greenhouse modern.
          </div>
        </div>
      </div>
    </footer>
  );
}
