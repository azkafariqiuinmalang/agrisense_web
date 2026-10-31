import { MessageSquare, Sliders, CheckCircle2 } from "lucide-react";
import styles from "./startup.module.css";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Mulai Percakapan di WhatsApp",
    desc: "Buka obrolan AgriSense di ponsel Anda. Kirimkan pesan teks, rekaman suara, atau foto daun yang ingin Anda tanyakan kondisinya.",
  },
  {
    step: "02",
    icon: Sliders,
    title: "Tinjau Draft & Saran Agronomis",
    desc: "Sistem mencocokkan gejala dengan panduan melon dan menyiapkan draf rapi. Anda mendapat opsi rekomendasi yang dapat ditelaah.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Konfirmasi & Akses Dashboard",
    desc: "Balas YA untuk menyimpan kegiatan secara permanen. Rekap otomatis langsung tampil di dashboard web petani Anda secara realtime.",
  },
];

export function StartupWorkflow() {
  return (
    <section id="alur-kerja" className={`${styles.section} ${styles.workflowSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <span>ALUR KERJA PRAKTIS</span>
          </div>
          <h2 className={styles.sectionTitle}>Mulai AgriSense dalam 3 Langkah Mudah.</h2>
          <p className={styles.sectionDesc}>
            Alur kerja yang dirancang agar petani tetap memegang kendali penuh tanpa
            birokrasi digital yang rumit.
          </p>
        </div>

        <div className={styles.workflowGrid}>
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className={styles.workflowStepCard}>
                <div className={styles.workflowNumber}>
                  <span>TAHAP {s.step}</span>
                </div>
                <div className={styles.bentoIconWrapper}>
                  <Icon className="w-5 h-5 text-emerald-600" strokeWidth={2} />
                </div>
                <h3 className={styles.workflowTitle}>{s.title}</h3>
                <p className={styles.workflowDesc}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
