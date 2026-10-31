# AgriSense Web

Landing page berbahasa Indonesia untuk memperkenalkan prototipe asisten budidaya melon di greenhouse bermedia tanah.

**Status per 14 Oktober 2026:** dashboard petani dan login WhatsApp diperbarui. Website membaca API/MCP backend yang sudah ada, dengan polling 5 detik saat halaman aktif. Backend, database, dan MCP di `D:\Development\Agrisense` tidak diubah. Daftar dibatasi kemampuan API yang tersedia; riwayat transaksi lengkap belum dapat dibaca. Demo landing tetap memakai pesan contoh dan terpisah dari dashboard.

Panduan dashboard aktif, konfigurasi lokal, batas data, dan hasil pengujian: [integrasi dashboard petani](docs/backend-integration.md).

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

Integrasi petani tersedia pada `/login` dan `/dashboard`, menggunakan kode
sekali pakai dari perintah WhatsApp `LOGIN`. Dashboard membaca backend melalui
server Next.js, bukan langsung ke database. Konfigurasi, batasan, dan pengujian:
[integrasi backend](docs/backend-integration.md). Landing/demo publik tetap
terpisah dan tidak berubah menjadi simulasi dashboard.

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

`npm start` memerlukan build terlebih dahulu. Build saat ini menghasilkan halaman `/`, `/login`, `/dashboard`, `/cms`, serta API session/dashboard/CMS dinamis. Build lokal tidak membuktikan deployment publik sudah berjalan. `build:webpack` tersedia sebagai alternatif, tetapi tidak dijalankan pada pembaruan ini. Setelah build, jalankan `npm run test:dashboard` untuk pengujian adapter baca terhadap upstream simulasi terisolasi.

## Teknologi yang digunakan

| Bagian           | Implementasi saat ini                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| Framework        | Next.js 16.4.0 App Router, React 19.3.0, TypeScript                          |
| Styling          | Tailwind CSS 4 dan CSS khusus                                                |
| Identitas visual | Plus Jakarta Sans lokal untuk landing/dashboard/login, Material Symbols SVG  |
| Animasi          | Web Animations pada landing aktif; CSS pada dashboard/login                  |
| Smooth scroll    | Scroll native dan CSS smooth scroll pada landing                             |
| Demo             | Transcript contoh otomatis dalam frame CSS/SVG; terpisah dari data dashboard |

Landing aktif diadaptasi dari desain Stitch yang dipilih pengguna. Dashboard/login memakai identitas hijau-mint yang selaras. AgriSense merupakan produk independen; penggunaan aset Google tidak berarti afiliasi atau sertifikasi Google. GSAP/Lenis dan komponen Material sebelumnya masih tersimpan sebagai implementasi lama. MUI dan `@material/web` tidak dipakai.

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

Pada 31 Oktober 2026, pembaruan landing, dashboard petani/login, dan adapter baca dikomit sebagai `2bd37c6` dan dipush ke `feature/updated-design`, lalu digabungkan ke `main`. Lint, TypeScript, build produksi, dan 10 tes API dengan upstream simulasi lulus pada sesi ini. Deployment publik dan alur WhatsApp pengguna nyata belum diverifikasi.

## Lisensi dan aset

Google Sans menyertakan SIL OFL; Material Symbols menyertakan Apache-2.0. Foto memiliki kredit, sumber, dan tautan lisensi di footer. Foto merupakan ilustrasi konteks, bukan bukti pengguna/pilot AgriSense. Aset Icons8 dan screenshot lama masih tersimpan di `public/`; berkas dalam direktori tersebut dapat disajikan oleh server meskipun tidak dipakai di halaman. Proyek belum memiliki berkas lisensi tingkat repositori untuk kode sendiri.
