# AgriSense Web

Landing page berbahasa Indonesia untuk memperkenalkan prototipe asisten budidaya melon di greenhouse bermedia tanah.

**Status per 13 Oktober 2026:** frontend dan demo terpandu sudah diimplementasikan serta diuji secara lokal. Ini belum menjadi layanan WhatsApp/AI siap produksi. Demo menggunakan pesan contoh, tidak menerima pertanyaan bebas, dan tidak menyimpan kegiatan ke database.

## Dokumentasi

| Dokumen                                           | Isi                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------- |
| [Progres](docs/PROGRESS.md)                       | Milestone, fitur yang benar-benar ada, status Git, dan pekerjaan berikutnya |
| [Kesiapan produksi](docs/production-readiness.md) | Perbedaan publikasi landing page dan peluncuran layanan WhatsApp            |
| [Validasi](docs/redesign-validation.md)           | Hasil pemeriksaan terbaru, bukti, riwayat pengujian, dan batasnya           |
| [Desain](DESIGN.md)                               | Sistem visual, layout, animasi, dan aksesibilitas yang diimplementasikan    |
| [Demo iPhone](docs/iphone-demo.md)                | Interaksi demo dan batas simulasi                                           |
| [Hero](docs/hero-refinement.md)                   | Penyederhanaan hero sesuai revisi terakhir                                  |
| [Manifest aset](docs/asset-manifest.md)           | Aset aktif, arsip, sumber, dan lisensi                                      |
| [Aset Google](docs/google-assets.md)              | Font dan ikon lokal beserta sumber unduhan                                  |
| [Foto demo](docs/demo-photo-source.md)            | Provenance foto daun melon                                                  |
| [Instruksi agen](AGENTS.md)                       | Aturan Next.js untuk perubahan kode                                         |

## Menjalankan proyek

Diperlukan Node.js minimal 20.9 menurut panduan yang disertakan dalam paket Next.js terpasang. Lingkungan verifikasi saat ini: Windows, Node.js 24.19.0, npm 11.17.0. Versi minimum tersebut belum diuji khusus di proyek ini.

```sh
npm ci
npm run dev
```

Buka [localhost:3000](http://localhost:3000). Pada PowerShell, gunakan `npm.cmd` / `npx.cmd` jika shim diblokir. Font, ikon, wallpaper, dan foto disajikan dari aplikasi sendiri.

Untuk memeriksa lalu menjalankan build produksi lokal:

```sh
npm run lint
npx --no-install tsc --noEmit --incremental false
npm run build
npm start
```

`npm start` memerlukan build terlebih dahulu. Build berhasil menghasilkan halaman statis `/` dan halaman bawaan `/_not-found`; ini bukan bukti bahwa sebuah deployment publik sudah berjalan. `build:webpack` tersedia sebagai alternatif, tetapi tidak dijalankan pada pembaruan dokumentasi ini.

## Teknologi yang digunakan

| Bagian           | Implementasi saat ini                                             |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | Next.js 16.4.0 App Router, React 19.3.0, TypeScript               |
| Styling          | Tailwind CSS 4 dan CSS khusus                                     |
| Identitas visual | Google Sans lokal, Material Symbols Rounded SVG inline, palet HCT |
| Animasi          | GSAP 3.15.0 / ScrollTrigger                                       |
| Smooth scroll    | Lenis 1.3.26 untuk wheel; touch tetap native                      |
| Demo             | React state, transcript lokal, frame iPhone dari CSS/SVG          |

Tampilan terinspirasi Material 3/Expressive. AgriSense merupakan produk independen; penggunaan aset Google tidak berarti afiliasi atau sertifikasi Google. MUI dan `@material/web` tidak dipakai. `@gsap/react` terpasang, tetapi komponen saat ini menggunakan GSAP langsung.

Regenerasi token warna:

```sh
npm run design:tokens
```

Generator memakai Material Color Utilities 0.3.0 dan menghasilkan `app/material-tokens.css`. Versi 0.4.0 pernah gagal di runtime lokal karena import ESM tanpa ekstensi; pemilihan 0.3.0 merupakan keputusan implementasi, bukan klaim kompatibilitas seluruh versi Node.

## Peta berkas utama

| Berkas/direktori                             | Tanggung jawab                                         |
| -------------------------------------------- | ------------------------------------------------------ |
| `app/page.tsx`                               | Urutan section landing page                            |
| `app/layout.tsx`                             | Font lokal, metadata dasar, bahasa, skip link          |
| `app/globals.css`, `app/material-tokens.css` | Layout, komponen, frame, token                         |
| `content/landing.ts`                         | Copy editorial                                         |
| `content/story.ts`                           | Empat tahap percakapan contoh                          |
| `lib/site-config.ts`                         | Kontak, domain, status fitur/pilot, legal, kredit foto |
| `components/landing/ScrollReveal.tsx`        | GSAP, Lenis, anchor, hover, reduced motion             |
| `components/landing/IPhoneWhatsAppDemo.tsx`  | Simulasi chat dan foto                                 |
| `components/landing/MobileNavigation.tsx`    | Menu mobile dan pengelolaan fokus                      |
| `docs/previews/`, `docs/evidence/`           | Screenshot dan bukti pemeriksaan; bukan aset halaman   |

## Konfigurasi yang masih kosong

`productionUrl`, nomor WhatsApp, email, kebijakan privasi, syarat penggunaan, dan identitas pengembang masih `null`. `pilot.acceptingRequests` masih `false`; keempat fitur berstatus `prototype`.

Mengisi konfigurasi tidak mengimplementasikan backend. Label fitur hanya boleh dinaikkan setelah fitur benar-benar dapat digunakan dan diverifikasi. Tautan kontak pilot muncul jika penerimaan dibuka **dan** kanal kontak tersedia. `termsUrl` belum dirender oleh footer, meskipun field konfigurasinya sudah ada.

## Validasi dan publikasi

Pada pembaruan ini, lint, TypeScript, dan build produksi lokal lulus. Audit runtime melaporkan 0 temuan; audit lengkap melaporkan 5 temuan tinggi pada rantai tooling ESLint. Rincian dan batas hasil ada di [laporan validasi](docs/redesign-validation.md).

Pada 13 Oktober 2026, redesign, demo iPhone, aset, dan dokumentasi berhasil dipush ke `origin/main` pada [commit implementasi `06956ea`](https://github.com/Rafiqalha/agrisense-web/commit/06956ea). Branch lokal sekarang `main`. Pembaruan catatan publikasi berada pada commit dokumentasi berikutnya; lihat [riwayat main](https://github.com/Rafiqalha/agrisense-web/commits/main). Push GitHub tidak membuktikan deployment publik sudah berjalan; deployment belum diverifikasi.

## Lisensi dan aset

Google Sans menyertakan SIL OFL; Material Symbols menyertakan Apache-2.0. Foto memiliki kredit, sumber, dan tautan lisensi di footer. Foto merupakan ilustrasi konteks, bukan bukti pengguna/pilot AgriSense. Aset Icons8 dan screenshot lama masih tersimpan di `public/`; berkas dalam direktori tersebut dapat disajikan oleh server meskipun tidak dipakai di halaman. Proyek belum memiliki berkas lisensi tingkat repositori untuk kode sendiri.
