import { Zap, Smartphone, ShieldCheck, Lock } from "lucide-react";
import styles from "./startup.module.css";

const metrics = [
  {
    icon: Zap,
    value: "< 3 Detik",
    label: "Waktu respon AI rata-rata via percakapan WhatsApp",
  },
  {
    icon: Smartphone,
    value: "100%",
    label: "Dukungan penuh seluruh tipe smartphone tanpa aplikasi tambahan",
  },
  {
    icon: ShieldCheck,
    value: "3 Tahap",
    label: "Gerbang konfirmasi draft: Review, Keputusan, Catat permanen",
  },
  {
    icon: Lock,
    value: "Terisolasi",
    label: "Akses data kebun diproteksi autentikasi OTP sekali pakai",
  },
];

export function StartupMetrics() {
  return (
    <section className={styles.metricsSection} aria-label="Statistik Utama">
      <div className={styles.container}>
        <div className={styles.metricsGrid}>
          {metrics.map((m, index) => {
            const Icon = m.icon;
            return (
              <div key={index} className={styles.metricCard}>
                <div className={styles.metricIconWrap}>
                  <Icon className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                </div>
                <div>
                  <div className={styles.metricValue}>{m.value}</div>
                  <div className={styles.metricLabel}>{m.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
