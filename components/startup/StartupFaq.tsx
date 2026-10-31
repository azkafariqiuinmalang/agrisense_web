"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import styles from "./startup.module.css";

const faqs = [
  {
    q: "Apakah petani harus memasang aplikasi baru di ponsel?",
    a: "Tidak perlu. Seluruh interaksi percakapan dan konsultasi berjalan langsung melalui WhatsApp yang sudah akrab Anda gunakan. Dashboard web dapat dibuka melalui browser biasa tanpa perlu mendownload file APK tambahan.",
  },
  {
    q: "Bagaimana cara masuk ke Dashboard Petani di web?",
    a: "Kirim kata LOGIN ke kontak WhatsApp AgriSense yang terdaftar. Anda akan menerima kode akses sekali pakai (OTP) yang berlaku selama 5 menit untuk memverifikasi kepemilikan nomor telepon Anda secara aman.",
  },
  {
    q: "Apakah foto tanaman menghasilkan diagnosis penyakit yang pasti?",
    a: "Tidak. Foto berfungsi sebagai alat bantu observasi awal untuk mengenali gejala visual seperti pola bercak atau nekrosis daun. Pemeriksaan fisik lapangan dan konfirmasi langsung tetap diperlukan sebelum menentukan dosis perlakuan tanaman.",
  },
  {
    q: "Apakah data kebun langsung tersimpan saat saya mengirim pesan teks?",
    a: "Tidak. Setiap kegiatan atau pengeluaran akan dirangkum menjadi draft terlebih dahulu. Sistem mewajibkan Anda membalas YA, UBAH, atau BATAL sebelum data resmi dicatat ke database.",
  },
  {
    q: "Apakah AgriSense menyetujui atau menjamin permohonan kredit KUR?",
    a: "Tidak. Fasilitas catatan finansial hanya membantu petani merapikan pembukuan mandiri. AgriSense bukan lembaga keuangan dan tidak memiliki wewenang persetujuan kredit perbankan.",
  },
  {
    q: "Apakah platform ini sudah tersedia untuk publik?",
    a: "Platform saat ini berada pada tahap rilis pengujian pilot terarah untuk petani greenhouse melon. Anda dapat mencoba simulator interaktif di halaman ini atau mendiskusikan implementasi uji coba bersama tim kami.",
  },
];

export function StartupFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PERTANYAAN UMUM</span>
          </div>
          <h2 className={styles.sectionTitle}>Semua Hal yang Perlu Anda Ketahui.</h2>
          <p className={styles.sectionDesc}>
            Transparansi mengenai cara kerja asisten, privasi data, dan batasan operasional platform.
          </p>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className={styles.faqSummary}
                  aria-expanded={isOpen}
                >
                  <span className="text-left pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
