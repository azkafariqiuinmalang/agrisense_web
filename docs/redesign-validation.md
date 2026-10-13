# Validasi AgriSense Web

Diperbarui 13 Oktober 2026. Laporan ini memisahkan pemeriksaan working tree terbaru dari pengujian milestone sebelumnya. Hasil beberapa suite tidak dijumlahkan karena cakupannya tumpang tindih.

## Pemeriksaan terbaru pada pembaruan dokumentasi

Lingkungan: Windows, Node.js 24.19.0, npm 11.17.0, Next.js 16.4.0. Target browser: headless Microsoft Edge melalui Playwright, server produksi lokal `http://127.0.0.1:3107`.

| Pemeriksaan                                             | Hasil               | Batas makna                                                                |
| ------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------- |
| `npm.cmd run lint`                                      | Lulus, exit 0       | ESLint seluruh proyek; bukan evaluasi bisnis/UX lengkap                    |
| `npx.cmd --no-install tsc --noEmit --incremental false` | Lulus, exit 0       | Type checking terpisah                                                     |
| `npm.cmd run build`                                     | Lulus, exit 0       | Turbopack dan type check; menghasilkan route statis `/` dan `/_not-found`  |
| `npm.cmd audit --omit=dev --json`                       | 0 temuan, exit 0    | Audit dependency runtime menurut data registry saat pemeriksaan            |
| `npm.cmd audit --json`                                  | 5 high, exit 1      | Temuan tooling development; belum diperbaiki                               |
| Smoke demo iPhone terhadap build terbaru                | 32/32 lulus, exit 0 | Interaksi preset, layout, reduced motion, fallback; lihat rincian di bawah |

Percobaan audit pertama gagal mengakses registry dari sandbox. Hasil tabel berasal dari percobaan berikutnya dengan akses jaringan yang berhasil, bukan dari percobaan gagal atau data cache yang diasumsikan terkini.

Build saat ini memakai font lokal. Kegagalan unduh font pada implementasi lama tidak lagi menjadi hasil build terbaru. Build Webpack alternatif, instalasi bersih `npm ci`, dan deployment host target tidak dijalankan pada pembaruan ini.

## Audit dependensi

Lima entry high mengikuti rantai:

```text
eslint-config-next
└─ @next/eslint-plugin-next
   └─ fast-glob
      └─ micromatch
         └─ braces
```

Laporan merujuk [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack-exhaustion denial of service pada pola bertingkat di `braces <=3.0.3`. Lima entry merupakan paket dalam satu rantai temuan, bukan bukti lima exploit berbeda pada aplikasi publik.

npm menyarankan `eslint-config-next@14.2.35` sebagai perubahan major/downgrade. Saran tersebut tidak diterapkan otomatis karena proyek memakai Next.js 16.4.0. Tindak lanjut: pilih perbaikan kompatibel, verifikasi dependency tree, lalu ulangi lint/type/build/audit. Nol temuan runtime tidak menjamin aplikasi bebas dari seluruh masalah keamanan.

## Pengujian demo terbaru: 32/32

Hasil mentah: [iphone-current-32.json](evidence/iphone-current-32.json). [Konteks run dan hash source terpilih](evidence/current-run-context.json) mencatat lingkungan serta hash setelah run; HEAD Git saja tidak mewakili source yang diuji karena redesign belum dikomit. Hash tersebut tidak berlaku untuk hasil milestone historis.

Script smoke dijalankan dari direktori temporary lingkungan pengembangan, memakai Playwright dari cache alat. Script bukan bagian repo dan belum terpasang sebagai `npm test`/CI; hasil tersimpan ini merupakan bukti run, bukan test suite yang otomatis dapat diulang dari clone bersih.

| Kelompok        | Pemeriksaan yang lulus                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Awal            | Dua pesan awal; frame seluruhnya muat pada desktop 1440×900                                                                    |
| Pengiriman      | Typing muncul, send dinonaktifkan saat menunggu, tahap maju, empat pesan/foto muncul, foto dimuat, bubble tidak transparan     |
| Foto/navigasi   | Dialog foto membuka dan menutup dengan Escape; kembali ke daftar chat; buka percakapan lagi                                    |
| Tahap akhir     | Draft kegiatan, konfirmasi dan delapan pesan; scroll chat tidak menggerakkan halaman                                           |
| Replay/lampiran | Replay mengulang dua pesan awal; tray membuka dan memilih foto contoh                                                          |
| Reflow          | Tidak overflow horizontal pada lebar 320, 390, 768, 1024, 1440, 1920 px                                                        |
| Mobile          | Frame terlihat pada viewport 390×844; send dan Enter berfungsi                                                                 |
| Fallback        | Reduced motion tetap berfungsi; JavaScript mati menampilkan exchange awal dan transcript native; script diblokir tetap terbaca |
| Runtime         | Tidak ada error pada event `pageerror` di halaman desktop/mobile yang diberi listener                                          |

Tes “scroll chat tidak menggerakkan halaman” mengukur posisi halaman; tes ini tidak mensimulasikan seluruh gesture iOS. Tampilan mobile di sini menggunakan emulasi viewport/touch Edge, bukan perangkat iPhone.

Screenshot dihasilkan ulang pada run tersebut: [desktop](previews/iphone-current-desktop.png), [mobile](previews/iphone-current-mobile.png), [frame](previews/iphone-current-frame.png), [foto](previews/iphone-current-photo.png).

## Riwayat pengujian dan perubahan requirement

Semua milestone berikut berlangsung 13 Oktober 2026; angka merupakan jumlah assertion pada masing-masing run.

| Milestone                | Hasil tercatat | Relevansi terhadap source sekarang                                                 |
| ------------------------ | -------------- | ---------------------------------------------------------------------------------- |
| Redesign awal            | 36/36          | Sebelum demo iPhone dan penyederhanaan hero; assertion cursor follower sudah usang |
| Implementasi demo iPhone | 32/32          | Bukti milestone; suite yang sama dijalankan ulang terhadap build terbaru           |
| Revisi hero              | 21/21          | Setelah cursor follower dihapus; hero tetap sama pada pembaruan dokumentasi ini    |

Hasil mentah milestone: [redesign-initial-36.json](evidence/redesign-initial-36.json), [iphone-milestone-32.json](evidence/iphone-milestone-32.json), [hero-refinement-21.json](evidence/hero-refinement-21.json).

Redesign awal mencakup font, smooth wheel/anchor, magnetic button, card tilt/spotlight, reveal, gambar/anchor/FAQ, enam lebar viewport, menu mobile (inert/focus trap/Escape/resize), no JS, script diblokir, reduced motion awal/live, dan event runtime error. Pengujian tersebut belum seluruhnya dijalankan ulang sebagai satu suite setelah perubahan hero/demo.

Assertion historis “cursor follows pointer” dulu lulus sesuai requirement saat itu. Requirement kemudian berubah: follower ring/dot/glow dihapus. Assertion hero terbaru “mouse overlays absent” lulus sesuai requirement sekarang. Hasil lama tidak boleh dijadikan alasan memasang kembali efek tersebut.

Revisi hero mencakup copy headline, satu ikon, hilangnya dekorasi/overlay, foto dimuat, alignment, overflow/CTA pada enam lebar, cursor overlay tidak ada, anchor demo, keberadaan frame iPhone, dan event runtime error. [Laporan hero](hero-refinement.md) memberi rincian.

## Membaca screenshot

| Preview                                                      | Status                                                               |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `hero-professional-*.png`                                    | Hero terbaru; diambil pada milestone hero                            |
| `iphone-current-*.png`                                       | Demo pada build terbaru, diambil ulang saat pembaruan dokumentasi    |
| `iphone-desktop/mobile/frame/photo.png`                      | Arsip milestone demo sebelum penyederhanaan hero                     |
| `desktop.png`, `mobile.png`, `features.png`, `full-page.png` | Arsip redesign awal; bukan screenshot seluruh halaman versi terakhir |

Berkas dokumentasi di `docs/previews/` berada di luar `public/`. Berkas screenshot lama lain di `public/` masih dapat disajikan server.

## Batas dan tindak lanjut

Belum diuji: deployment publik, browser Safari/Firefox, perangkat fisik, screen reader lengkap, seluruh kontras, Lighthouse/field Core Web Vitals, backend WhatsApp/AI, kualitas diagnosis, serta penyimpanan data nyata.

Repo belum memiliki script `test`, dependency Playwright untuk proyek, atau workflow CI. Menjadikan smoke checks reproducible dari clone bersih merupakan pekerjaan lanjutan; jangan menyebut bukti JSON ini sebagai CI.

Status Git dan config ada di [progres](PROGRESS.md); keputusan rilis ada di [kesiapan produksi](production-readiness.md).
