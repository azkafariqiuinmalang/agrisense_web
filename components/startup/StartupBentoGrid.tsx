import {
  MessageSquare,
  Camera,
  Mic,
  CheckSquare,
  Database,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import styles from "./startup.module.css";

const features = [
  {
    icon: MessageSquare,
    title: "Percakapan WhatsApp yang Akrab",
    desc: "Mulai konsultasi tanpa hambatan install aplikasi baru. Cukup kirim chat atau sapa AgriSense dari WhatsApp harian Anda.",
    tag: "Akses Cepat",
  },
  {
    icon: Camera,
    title: "Analisis Visual Gejala Tanaman",
    desc: "Unggah foto daun atau buah yang bermasalah. Sistem membandingkan pola gejala dengan basis data melon untuk observasi awal.",
    tag: "Visi Komputer",
  },
  {
    icon: Mic,
    title: "Voice Note & Perintah Suara",
    desc: "Tangan sedang kotor saat merawat sulur? Kirimkan pesan suara. Transkripsi AI mengubah ucapan Anda menjadi draf catatan rapi.",
    tag: "Bebas Repot",
  },
  {
    icon: CheckSquare,
    title: "Gerbang Konfirmasi Eksplisit",
    desc: "Setiap pencatatan kegiatan atau pengeluaran melewati verifikasi Anda: pilih YA untuk simpan, UBAH untuk koreksi, atau BATAL.",
    tag: "Kendali Penuh",
  },
  {
    icon: Database,
    title: "Konteks Greenhouse Terpadu",
    desc: "Rekomendasi disesuaikan dengan umur HST, varietas benih, media tanah, dan histori pemupukan greenhouse Anda.",
    tag: "Data Terarah",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Web Terintegrasi",
    desc: "Lihat rekap aktivitas mingguan, kurva pertumbuhan, dan ringkasan finansial kebun dalam tampilan desktop dan mobile yang elegan.",
    tag: "Analitik Modern",
  },
];

export function StartupBentoGrid() {
  return (
    <section id="fitur" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>KAPABILITAS SISTEM</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Dirancang Mengikuti Ritme Kerja di Greenhouse.
          </h2>
          <p className={styles.sectionDesc}>
            Menggabungkan kemudahan antarmuka pesan instan dengan ketelitian pencatatan
            budidaya tanaman bernilai tinggi.
          </p>
        </div>

        <div className={styles.bentoGrid}>
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div key={index} className={styles.bentoCard}>
                <div className={styles.bentoIconWrapper}>
                  <Icon className="w-5 h-5 text-emerald-600" strokeWidth={1.85} />
                </div>
                <h3 className={styles.bentoCardTitle}>{feat.title}</h3>
                <p className={styles.bentoCardDesc}>{feat.desc}</p>
                <div className={styles.bentoBadge}>
                  <span>● {feat.tag}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
