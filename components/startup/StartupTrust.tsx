import { ShieldCheck, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import styles from "./startup.module.css";

const trustItems = [
  {
    icon: Lock,
    title: "Isolasi Data Kebun per Identitas",
    desc: "Setiap data kebun, pengeluaran, dan riwayat tanaman diisolasi secara ketat berdasarkan nomor WhatsApp petani. Petani lain tidak dapat mengakses catatan Anda.",
  },
  {
    icon: CheckCircle2,
    title: "Konfirmasi Eksplisit (Human-in-the-Loop)",
    desc: "AI tidak akan pernah menyimpan transaksi atau kegiatan tanpa izin langsung Anda. Jawaban YA, UBAH, atau BATAL selalu menjadi penentu akhir.",
  },
  {
    icon: AlertTriangle,
    title: "Saran Pendamping, Bukan Pengganti Uji Lab",
    desc: "Analisis visual membantu mendeteksi gejala awal secara cepat. Untuk tindakan berisiko tinggi atau aplikasi dosis kimiawi, konfirmasi lapangan tetap utama.",
  },
];

export function StartupTrust() {
  return (
    <section id="keamanan" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRANSPARANSI & KEAMANAN</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Kepercayaan Anda Dibangun di Atas Kendali Penuh.
          </h2>
          <p className={styles.sectionDesc}>
            Prinsip keamanan data, batasan tanggung jawab kecerdasan buatan, dan perlindungan
            privasi kebun Anda sejak hari pertama.
          </p>
        </div>

        <div className={styles.trustGrid}>
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={styles.trustCard}>
                <div className={styles.trustCardIcon}>
                  <Icon className="w-5 h-5" strokeWidth={1.9} />
                </div>
                <h3 className={styles.trustCardTitle}>{item.title}</h3>
                <p className={styles.trustCardText}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
