# Kesiapan produksi

Penilaian per 13 Oktober 2026 terhadap working tree lokal. “Build lulus” dan “layanan siap produksi” memiliki kriteria berbeda.

## Status menurut tujuan rilis

| Tujuan                                           | Status berdasarkan bukti                                                                                        |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Pengembangan dan demo frontend lokal             | Dapat dijalankan; lint, TypeScript, dan build produksi lokal lulus                                              |
| Preview untuk review UI                          | Layak dibuat dari working tree lengkap; deployment preview belum diverifikasi                                   |
| Landing page publik yang jujur tentang prototipe | Belum dinyatakan siap rilis penuh: domain/host, konfigurasi publik, dan pengujian deployment belum diselesaikan |
| Layanan WhatsApp/AI untuk petani                 | Belum siap; integrasi layanan dan data tidak diimplementasikan dalam repo ini                                   |
| Pilot dengan pendaftaran                         | Belum dibuka; config menutup penerimaan dan kanal kontak kosong                                                 |

Landing page informasi tidak harus memiliki backend. Backend diperlukan jika rilis menjanjikan konsultasi WhatsApp, analisis foto/suara, atau pencatatan nyata.

## Fakta yang sudah diverifikasi

- Landing route `/` diprerender statis oleh build Next.js 16.4.0.
- Font lokal menghilangkan kebutuhan unduh Google Fonts saat build.
- Foto, wallpaper, font, dan SVG tersedia di repo; foto diberi kredit di footer.
- Source mencantumkan status prototipe dan disclaimer contoh percakapan.
- Demo menggunakan transcript dan state React; tidak ditemukan integrasi WhatsApp/AI, API aplikasi, database, atau persistensi percakapan.
- Lint, TypeScript, build dan audit npm diperbarui pada sesi dokumentasi ini.
- Pengujian browser mempunyai cakupan dan waktu milestone tertentu; lihat [validasi](redesign-validation.md).

## Kebutuhan sebelum publikasi frontend

| Area                  | Kondisi sekarang                                                        | Tindakan dan kriteria penerimaan                                                                                        |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Snapshot rilis        | Snapshot lengkap sudah dikomit dan dipush ke main pada `06956ea`        | Build ulang dari checkout bersih pada host target; push GitHub belum membuktikan deployment                             |
| Hosting/domain        | Domain config kosong; deployment tidak diverifikasi                     | Tentukan host dan domain; cek URL HTTPS, route/aset, navigasi dan fallback pada host itu                                |
| Klaim produk          | Copy manfaat masih bernuansa layanan, dengan label/disclaimer prototipe | Review seluruh copy agar manfaat yang direncanakan tidak dibaca sebagai layanan aktif                                   |
| Kontak/pilot          | Kanal kosong, pilot tertutup                                            | Publikasi informasi boleh mempertahankan pilot tertutup; jika dibuka, butuh kanal resmi dan kesiapan operasional nyata  |
| Metadata              | Title/description/OG dasar; index/follow sudah true                     | Putuskan indexability preview/rilis; isi domain, periksa canonical/share image/sitemap sesuai strategi publikasi        |
| Legal/identitas       | Field legal dan pengembang kosong; terms tidak dirender                 | Isi data yang telah disetujui dan informasi privasi sesuai penggunaan nyata; implementasikan link terms jika dibutuhkan |
| Dependensi            | Runtime audit 0; audit penuh 5 high di tooling                          | Review advisori dan perbaikan kompatibel; audit 0 bukan jaminan keamanan menyeluruh                                     |
| Browser/aksesibilitas | Smoke test Edge, responsive, keyboard tertentu, reduced/no JS           | Uji browser target/perangkat fisik, screen reader dan kontras sebelum mengklaim cakupan lebih luas                      |
| Performa              | Belum ada metrik field atau laporan Lighthouse tersimpan                | Ukur halaman pada perangkat/jaringan sasaran; tetapkan target sebelum menyebut skor                                     |
| Operasi               | Tidak ada pipeline CI/monitoring khusus dalam repo                      | Tentukan checks rilis, health check/monitoring sesuai host dan rollback                                                 |
| Aset publik           | Screenshot lama, ikon lama, SVG starter masih di public                 | Review kebutuhan penyajian publik; direktori docs bukan lokasi aset runtime                                             |
| Lisensi kode          | Belum ada lisensi repo untuk kode sendiri                               | Tentukan kebijakan distribusi; lisensi font/foto tidak melisensikan seluruh kode aplikasi                               |

Konfigurasi security header khusus tidak terlihat di `next.config.ts`. Header yang ditambahkan hosting belum diperiksa; dokumentasi ini tidak menyatakan kondisi header situs live. Pilihan security header dan fitur Next eksperimental (`agentFeedback`, cache components/partial prefetching) perlu ditinjau sesuai host/rencana rilis, bukan diasumsikan aman atau bermasalah hanya dari nama opsi.

## Kebutuhan sebelum layanan WhatsApp/pilot

Belum diimplementasikan dalam repo ini:

1. Gateway dan akun bisnis WhatsApp yang benar-benar menerima/mengirim pesan.
2. Backend, autentikasi/otorisasi sesuai model produk, dan model AI.
3. Penanganan foto/suara pengguna dan batas penggunaan.
4. Database, kepemilikan data, konfirmasi dan penyimpanan kegiatan.
5. Penanganan gagal/timeout, eskalasi ke manusia, dan prosedur pendampingan.
6. Informasi privasi sesuai data yang diproses, kebijakan retensi, dan pengelolaan akses.
7. Pengujian end-to-end serta evaluasi kualitas jawaban budidaya pada kondisi penggunaan nyata.

Daftar ini adalah kebutuhan lanjutan jika scope layanan diambil, bukan fitur yang sudah dikerjakan. Contoh foto penyakit tidak membuktikan diagnosis AI; balasan contoh “disimpan” tidak membuktikan persistensi.

## Cara mengaktifkan kontak tanpa melebihkan kemampuan

`getPilotContact()` hanya menghasilkan CTA pilot saat `acceptingRequests === true` dan nomor WhatsApp/email tersedia. WhatsApp diprioritaskan; email menjadi fallback. Mengisi nomor hanya membuat link `wa.me`, bukan integrasi API WhatsApp.

Mengubah `features.*` menjadi `available` hanya mengubah label “Tersedia untuk pilot”. Gunakan setelah pengujian layanan pada lingkungan yang ditawarkan, bukan sebagai cara menyelesaikan backlog backend.

Mengisi `productionUrl` memasang `metadataBase`; tidak otomatis membuat canonical, sitemap, OG image, atau deployment. Mengisi `termsUrl` juga tidak otomatis menampilkan link terms pada footer saat ini.

## Hal yang belum dapat disimpulkan

Belum ada bukti runtime deployment publik, traffic pengguna, hasil pilot, efektivitas agronomi, SLA, field Core Web Vitals, kepatuhan WCAG lengkap, atau pengujian iPhone fisik/Safari. Audit dependensi dan smoke test lokal tidak membuktikan hal-hal tersebut.

Perubahan dokumentasi ini tidak mengaktifkan pilot, menaikkan status fitur, mengubah backend, memperbaiki dependency, atau melakukan deployment. [Progres](PROGRESS.md) mencatat pekerjaan dan status Git; [validasi](redesign-validation.md) mencatat hasil pemeriksaan.
