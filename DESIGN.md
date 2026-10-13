# Desain AgriSense

## Landing page aktif: adaptasi Google Stitch

Revisi 13 Oktober 2026 mengganti route `/` dengan desain dari project **Custom Design System**, screen `6b95ef9e7b5740709092fa5388ac66e2` pada project `10451069147770532943`. Ekspor referensi disimpan di `docs/stitch-reference/`; implementasi React berada di `components/stitch/`.

Komposisi mempertahankan header pill mengambang, hero foto greenhouse dengan overlay hijau, ilustrasi tangan dan melon, tiga kartu langkah, simulator chat, informasi AI, kepercayaan, FAQ, CTA hijau gelap, dan footer. Font Plus Jakarta Sans variable 400–800 disajikan lokal dengan lisensi OFL. Logo asli pengguna dari `LOGO AGRISENSE.jpg` digunakan di header, footer, dan avatar chat melalui komponen bersama `BrandGlyph`. Salinan `public/images/agrisense-logo.jpg` identik dengan sumber; framing CSS menjaga proporsi dan mengurangi margin putih tanpa mengubah gambar. Placeholder SVG lama diganti, termasuk untuk komponen demo sebelumnya. Watermark placeholder pada CTA dihapus.

Skill **UI/UX Pro Max** digunakan untuk hierarki CTA, tipografi fluid, menu mobile native dengan Escape, focus-visible, gambar responsif, dan reduced motion. Simulator otomatis mengulang delapan pesan contoh ketika terlihat, tanpa tombol play/reset/langkah. Ringkasan draft ditahan lebih lama sebelum contoh balasan YA; hasil akhir ditahan sebelum siklus berikutnya. Tidak ada pesan WhatsApp atau penulisan database nyata. Copy membedakan pengembangan/uji lokal dari layanan publik, serta tidak menjanjikan diagnosis pasti atau persetujuan KUR. Nomor WhatsApp publik yang belum dikonfigurasi mengarahkan CTA ke simulator.

`LandingMotion` mengelola reveal dari atas ke bawah (18px/520ms), stagger kartu 90ms, parallax pendek pada hero/ilustrasi melon, dan indikator progres scroll. Memakai Web Animations, IntersectionObserver, serta requestAnimationFrame tanpa mengaktifkan engine GSAP/Lenis lama atau mengambil alih native scroll. HTML awal tetap terbaca; hanya elemen di bawah viewport disiapkan setelah hydration, dan elemen fokus langsung ditampilkan. Observer, timer, listener, dan animasi dibersihkan saat unmount/perubahan preferensi motion.

Demo berhenti sementara di luar viewport, saat tab tidak aktif, saat fokus keyboard berada di dalamnya, atau ketika opsi **Hentikan animasi** dicentang. Reduced motion menampilkan percakapan lengkap tanpa autoplay/parallax/reveal. Transcript statis bisa dibuka kapan pun dan perubahan otomatis tidak diumumkan berulang melalui live region. Login, dashboard, API session, cookie, dan integrasi backend tidak diubah. Komponen landing lama dipertahankan sebagai referensi; uraian di bawah bagian ini merupakan dokumentasi implementasi sebelumnya, bukan komposisi route `/` yang sekarang.

Validasi dasar sebelumnya: lint, TypeScript, dan production build lulus; browser diperiksa pada lebar 375, 768, 1024, dan 1440px tanpa overflow horizontal. Menu mobile, FAQ, dan akses login diuji. Revisi motion/autoloop juga lulus lint komponen serta production build; perkembangan pesan otomatis, indikator scroll/header, dan opsi jeda diperiksa pada browser produksi. Reduced motion didukung di kode, tetapi belum diuji melalui pengaturan perangkat fisik. Pengujian ini bukan audit WCAG menyeluruh atau verifikasi kanal WhatsApp produksi.

Konfigurasi pemrosesan Tailwind kini mengecualikan `*.module.css` agar ekspor kelas CSS Module tidak hilang. Aset hero/melon berasal dari referensi pengguna dan diberi label ilustrasi; foto daun contoh tetap memakai sumber serta lisensi yang tercatat di `siteConfig.attribution`.

## Dokumentasi desain sebelumnya

Status implementasi sebelumnya per 13 Oktober 2026. Bagian historis berikut bukan janji kemampuan layanan.

## Identitas dan batas klaim

AgriSense memperkenalkan prototipe asisten budidaya melon di greenhouse bermedia tanah. Arah visual terinspirasi Material 3/Expressive dengan identitas pertanian sendiri. Penggunaan font/ikon Google tidak berarti AgriSense merupakan produk, mitra, atau layanan tersertifikasi Google.

Copy utama berada di `content/landing.ts` dan `content/story.ts`; fakta bisnis berada di `lib/site-config.ts`. Semua kemampuan masih diberi label prototipe. Pilot ditutup dan kanal kontak belum diisi. Foto stok berlisensi tidak boleh digambarkan sebagai kebun pelanggan, hasil pilot, atau dukungan institusi kepada AgriSense.

Demo adalah interaksi frontend dengan pesan contoh. Teks “Catatan penyiraman disimpan.” pada tahap terakhir merupakan bagian transcript; tidak ada penyimpanan nyata.

## Sistem visual

| Elemen      | Implementasi                                                              |
| ----------- | ------------------------------------------------------------------------- |
| Font        | Google Sans variable Latin, normal 400–700, `next/font/local`             |
| Ikon        | Material Symbols Rounded, path SVG inline `currentColor`                  |
| Warna dasar | Latar hangat `#fcfcf8`, teks netral gelap, aksi utama hijau               |
| Palet       | Hijau, biru, kuning, coral, ungu; token HCT dari Material Color Utilities |
| Bentuk      | Tombol pill, panel melengkung, state layer dan elevasi ringan             |
| Grid        | Container maksimum 74rem, gutter responsif dan jarak antarsection         |
| Headline    | Ukuran fluid; hero lebih tenang dan ringan pada revisi terakhir           |

Token dihasilkan oleh `scripts/generate-material-theme.mjs` melalui `npm run design:tokens`. Generator merupakan tooling development, bukan runtime browser. Tone 40 dipakai untuk aksen tertentu, tone 90/95 untuk container. Palet HCT tidak otomatis menjamin kontras teks pada seluruh kombinasi; audit kontras menyeluruh belum dilakukan.

## Komposisi halaman yang diimplementasikan

Urutan mengikuti `app/page.tsx`:

1. Header sticky: logo, empat anchor, CTA demo, menu mobile.
2. Hero editorial dua kolom: teks dan satu foto greenhouse, caption tenang, dua CTA, baris kemampuan berupa teks.
3. Konteks lapangan: foto dan daftar konteks dengan aksen warna.
4. Demo chat bergaya WhatsApp dalam frame iPhone CSS/SVG dan empat langkah.
5. Empat kartu kemampuan dengan warna berbeda dan label prototipe.
6. Tiga langkah cara kerja.
7. Komitmen kepercayaan.
8. Panel pilot dengan kriteria kecocokan dan status tertutup.
9. Tentang AgriSense dan foto greenhouse.
10. FAQ dengan `details/summary` native.
11. Panel penutup kuning, kemudian footer navigasi dan kredit foto.

Hero terbaru hanya menggunakan satu ikon pada panah CTA utama. Sun/microphone tile, rosette, pola titik, garis coretan, dan kartu chat yang menimpa foto telah dihapus dari hero. Ikon dan elemen dekoratif tetap digunakan di section lain; permintaan penyederhanaan diterapkan pada hero yang ditunjuk pengguna.

## Motion dan scroll

`ScrollReveal.tsx` mengelola GSAP, ScrollTrigger, dan Lenis. Animasi lain memiliki konteks lokal pada menu/demo dan melakukan cleanup.

- Wheel scroll dihaluskan Lenis, disinkronkan ke ticker GSAP dan ScrollTrigger.
- Touch scroll tetap native; riwayat chat dan menu memakai scroll internal.
- Anchor tetap merupakan link asli. Saat motion siap, scroll ke section diatur Lenis dengan offset header dan hash URL.
- Reveal section di bawah fold disiapkan setelah engine dimuat. Foto memakai parallax pendek dengan batas.
- Tombol magnetic, card tilt/spotlight, dan beberapa parallax dekoratif aktif untuk pointer halus dengan hover dan motion diizinkan.
- Efek lingkaran, titik biru, dan glow yang mengikuti mouse telah dihapus. Cursor native tetap digunakan.
- Progress bar berwarna menunjukkan posisi scroll.
- Reduced motion ditangani melalui media query; smooth scroll dan transform utama dinonaktifkan/revert.
- `data-js` baru berubah setelah hydration. HTML awal tidak disembunyikan hanya karena JavaScript diharapkan tersedia.

Halaman tetap dapat dibaca jika JavaScript tidak tersedia. Efek motion tidak berarti setiap elemen bergerak pada setiap gerakan cursor.

## Demo dan responsivitas

Frame berupa CSS/SVG yang menyerupai iPhone, bukan foto perangkat, emulator iOS, atau embed aplikasi WhatsApp asli. Header, Dynamic Island, status bar, read receipt, bubble, wallpaper, dan composer dibuat lokal.

Interaksi mencakup mengirim preset, balasan dengan jeda simulasi, memilih tahap, replay, lampiran foto contoh, dialog foto, dan daftar chat lokal. Tidak ada input bebas, upload, rekaman suara, panggilan, gateway WhatsApp, atau database.

ScrollTrigger memilih tahap pada viewport minimal 64rem dan tinggi 760px, ketika motion diizinkan. Kontrol eksplisit tetap tersedia pada mobile dan reduced motion. Layar tanpa JavaScript menampilkan exchange awal serta transcript lengkap melalui disclosure native. Rincian ada di [demo iPhone](docs/iphone-demo.md).

## Aksesibilitas yang diterapkan

Satu H1, landmark semantik, hierarki heading, skip link, nama kontrol, focus state, alt/dimensi gambar, serta ikon dekoratif yang disembunyikan dari assistive technology sudah ada.

Menu mobile menangani Escape, focus trap, inert pada latar, scroll lock, nested scroll, pemulihan fokus, dan perubahan viewport ke desktop. Demo memiliki pressed state, pengumuman balasan melalui live region, scroll region focusable, dan dialog foto native.

Implementasi dan smoke test ini belum membuktikan kepatuhan WCAG lengkap. Pengujian screen reader, seluruh rasio kontras, Safari/Firefox, dan perangkat fisik belum dilakukan.

## Status dokumentasi dan referensi

[Progres](docs/PROGRESS.md), [validasi](docs/redesign-validation.md), dan [kesiapan produksi](docs/production-readiness.md) menjadi rujukan status pekerjaan. Beberapa komentar source masih merujuk nomor section spesifikasi lama seperti “§5.4”; nomor itu bukan struktur dokumen ini dan bukan bukti fitur telah selesai.

Sumber desain/aset: [Material 3](https://m3.material.io/), [Google Sans](https://github.com/googlefonts/googlesans), [Material Symbols](https://developers.google.com/fonts/docs/material_symbols), [Material Color Utilities](https://github.com/material-foundation/material-color-utilities), [GSAP](https://gsap.com/docs/v3/), [Lenis](https://github.com/darkroomengineering/lenis). Provenance unduhan dicatat di [aset Google](docs/google-assets.md).
