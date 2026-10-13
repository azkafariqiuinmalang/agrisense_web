# Progres AgriSense Web

Diperbarui 13 Oktober 2026, berdasarkan dokumentasi proyek, kode working tree, status Git lokal, dan pemeriksaan pada sesi pengembangan ini.

**Kesimpulan:** landing page dan demo frontend telah diimplementasikan. Build lokal dapat dijalankan; layanan WhatsApp/AI, penyimpanan kegiatan, penerimaan pilot, dan deployment publik belum terbukti tersedia.

Tidak digunakan persentase penyelesaian karena belum ada baseline pekerjaan backend, kriteria pilot, atau rencana rilis yang disepakati.

## Milestone

| Tahap               | Hasil aktual                                                                         | Status                                                                       |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Landing page awal   | Section, copy Indonesia, konfigurasi fakta bisnis, foto dan atribusi                 | Snapshot Git `ca6707a`                                                       |
| Publikasi awal      | Remote GitHub disetel dan snapshot awal dipush ke `main` pada sesi sebelumnya        | Referensi lokal `origin/main` masih `ca6707a`; remote live tidak dicek ulang |
| Redesign Material   | Google Sans lokal, SVG Material Symbols, warna HCT, layout responsif, GSAP dan Lenis | Ada di working tree; belum dikomit                                           |
| Demo iPhone         | Frame CSS/SVG realistis, UI chat familiar, empat tahap dan interaksi preset          | Ada; simulasi frontend                                                       |
| Revisi mouse        | Ring, titik biru, glow follower dihapus; cursor native                               | Ada di source terbaru                                                        |
| Revisi hero         | Dua kolom rapi, satu foto, sedikit ikon, tanpa chat overlay/dekorasi hero lama       | Ada di source terbaru                                                        |
| Dokumentasi terkini | Status, batas fitur, validasi, sumber aset, kebutuhan rilis diperjelas               | Pembaruan dokumentasi ini                                                    |

## Matriks kemampuan

| Area             | Yang sudah ada                                                                                 | Yang belum ada / batas aktual                                     |
| ---------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Landing page     | Header, hero, konteks, demo, kemampuan, cara kerja, trust, pilot, tentang, FAQ, penutup/footer | Halaman layanan aplikasi di luar landing page                     |
| Visual Google    | Font/ikon resmi dengan lisensi lokal, palet dan styling khusus                                 | Sertifikasi/afiliasi Google; MUI/`@material/web` tidak digunakan  |
| Motion           | GSAP reveal/parallax/hover, Lenis wheel/anchor, reduced motion                                 | Pengukuran performa lapangan; efek follower mouse sengaja dihapus |
| Percakapan demo  | Delapan pesan pada empat tahap, typing simulasi, kirim preset/Enter, replay                    | Pertanyaan bebas, model AI, WhatsApp gateway                      |
| Foto             | Foto daun melon contoh dan dialog pembesaran                                                   | Upload foto pengguna, analisis gambar atau diagnosis              |
| Suara            | Kartu kemampuan dan copy yang menyebut prototipe                                               | Rekaman, upload, transkripsi, atau voice response                 |
| Catatan kegiatan | Draft dan konfirmasi dalam transcript                                                          | Database, persistensi, riwayat akun, ekspor                       |
| Menu/FAQ         | Menu mobile dengan pengelolaan fokus dan disclosure native                                     | Audit aksesibilitas lengkap                                       |
| Pilot            | Kriteria dan status tertutup                                                                   | Pendaftaran, formulir, kontak aktif, pelaksanaan pilot            |
| Konten/SEO       | Bahasa Indonesia, title/description, Open Graph dasar                                          | Domain, canonical eksplisit, OG image, sitemap/robots route       |
| Hosting          | Build produksi lokal berhasil                                                                  | URL deployment dan konfigurasi host terverifikasi                 |

Label `prototype` pada config adalah status presentasi; bukan bukti backend fitur tersebut tersedia.

## Konfigurasi aktual

Sumber: `lib/site-config.ts`.

| Field                                   | Nilai saat pemeriksaan | Dampak                                                 |
| --------------------------------------- | ---------------------- | ------------------------------------------------------ |
| `productionUrl`                         | `null`                 | Metadata base domain tidak dikonfigurasi               |
| `contact.whatsappNumber`                | `null`                 | Tidak ada link WhatsApp pilot                          |
| `contact.email`                         | `null`                 | Tidak ada kanal email                                  |
| `pilot.acceptingRequests`               | `false`                | Penerimaan pilot tertutup; CTA mengarah ke demo        |
| `features.chat/photo/voice/activityLog` | Semua `prototype`      | Kartu menyatakan tahap prototipe                       |
| `legal.privacyPolicyUrl`                | `null`                 | Link kebijakan privasi tidak ditampilkan               |
| `legal.termsUrl`                        | `null`                 | Belum diisi; footer juga belum merender field ini      |
| `developer`                             | `null`                 | Identitas tim/pengembang belum dipublikasikan          |
| `attribution.icons8.required`           | `false`                | Ikon lama tidak dirender; berkas arsip tetap di public |
| `attribution.photos`                    | Empat foto             | Footer menampilkan kredit, sumber, lisensi, modifikasi |

## Verifikasi

Pembaruan ini menjalankan lint seluruh proyek, TypeScript terpisah, build Turbopack, dan audit npm terbaru. Hasil serta pengujian browser dicatat di [validasi](redesign-validation.md).

Bukti browser berasal dari milestone berbeda. Hasil 36, 32, dan 21 pemeriksaan tidak dijumlahkan sebagai satu suite atau jumlah skenario unik. Pemeriksaan historis cursor follower sudah tidak sesuai requirement terbaru.

## Git dan rilis

- Repository: [Rafiqalha/agrisense-web](https://github.com/Rafiqalha/agrisense-web).
- Branch kerja: `feature/material-expressive-redesign`.
- HEAD: `ca6707a2863402713b1b74b78d2ee1523910208c`.
- Referensi lokal `main` dan `origin/main`: commit yang sama.
- Ada perubahan tracked dan berkas baru yang belum dikomit, termasuk komponen demo, font, ikon, token, bukti, dan dokumentasi.
- Pemeriksaan referensi lokal bukan pembacaan langsung remote. Tidak ada commit, push, merge, atau deploy baru dalam pembaruan dokumentasi ini.

Screenshot dokumentasi dapat menunjukkan revisi berbeda. Preview hero terbaru adalah referensi hero saat ini; screenshot redesign awal tetap diberi label historis.

## Pekerjaan berikutnya

| Prioritas/scope      | Pekerjaan                                                                                           | Bukti selesai yang dibutuhkan                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Publikasi frontend   | Putuskan domain/host, siapkan build dari checkout bersih yang mencakup aset baru, rilis dan cek URL | Build di lingkungan target, URL publik, navigasi/aset/reduced motion berfungsi |
| Kualitas development | Tinjau 5 temuan audit tooling dan pilih perbaikan kompatibel                                        | Audit ulang dan lint/build tetap lulus; jangan otomatis downgrade framework    |
| Kualitas frontend    | Safari/Firefox, perangkat mobile fisik, screen reader, kontras, performa                            | Hasil uji yang dicatat, bukan asumsi dari Edge                                 |
| Operasional          | Tentukan CI, logging/monitoring sesuai hosting, dan proses rollback                                 | Alur rilis yang dijalankan/teruji                                              |
| Konten rilis         | Domain/kontak/identitas yang disetujui, informasi privasi sesuai penggunaan, review copy            | Nilai nyata, link berfungsi, klaim sesuai kemampuan                            |
| Kebersihan aset      | Review screenshot/starter/Icons8 di public; tentukan lisensi kode sendiri                           | Aset publik sesuai kebutuhan dan keputusan lisensi jelas                       |
| Layanan WhatsApp     | Rancang backend/gateway, model, pengelolaan foto/suara, persistensi dan konfirmasi                  | Pengujian end-to-end dengan layanan nyata                                      |
| Pilot                | Tentukan kesiapan fitur, kanal penerimaan dan prosedur pendampingan                                 | Kanal resmi aktif dan fitur diverifikasi pada lingkungan yang ditawarkan       |

Backend dan pilot merupakan pekerjaan lanjutan di luar redesign frontend yang sudah dilakukan. Kebutuhan rilis terinci di [kesiapan produksi](production-readiness.md).
