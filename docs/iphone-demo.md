# Demo interaktif WhatsApp dalam frame iPhone

Status implementasi per 13 Oktober 2026.

Demo menampilkan enclosure bergaya iPhone dengan tepi metal, bezel hitam, tombol samping, Dynamic Island, status bar, dan home indicator. **Frame dibuat lokal dengan CSS/SVG; bukan foto frame perangkat, emulator iOS, atau embed WhatsApp asli.** Chat mengadopsi tampilan familiar WhatsApp iOS, tetapi berjalan sebagai komponen React di website.

Pengguna telah memilih demo interaktif dengan UI WhatsApp realistis menggunakan data contoh. Integrasi backend bukan scope implementasi demo ini.

## Interaksi yang benar-benar tersedia

| Kontrol              | Perilaku                                                                |
| -------------------- | ----------------------------------------------------------------------- |
| Send atau Enter      | Mengirim pesan preset tahap berikutnya                                  |
| Typing/reply         | Menampilkan indikator dan balasan dari transcript setelah jeda simulasi |
| Pemilih empat tahap  | Menampilkan percakapan sampai tahap yang dipilih                        |
| Replay               | Mengulang percakapan dari tahap pertama                                 |
| Tombol lampiran      | Membuka tray foto contoh; pilihan memakai aset bawaan                   |
| Foto dalam bubble    | Membuka preview melalui dialog native; Escape/close menutupnya          |
| Back dan daftar chat | Beralih ke daftar chat lokal lalu membuka AgriSense kembali             |
| Scroll di chat       | Membaca riwayat dalam frame tanpa menggulir halaman luar                |

Composer `readOnly` dan diberi nama “Pesan contoh untuk dikirim”. Tidak tersedia pengetikan pertanyaan bebas. Send dinonaktifkan ketika balasan sedang disimulasikan.

## Data dan empat tahap

Sumber data: `content/story.ts`, empat tahap dengan dua pesan per tahap.

1. Mengenalkan konteks: melon, Greenhouse A, media tanah.
2. Mengirim foto daun menguning dan menerima pertanyaan klarifikasi.
3. Mengirim perintah contoh `CATAT` dan memeriksa draft penyiraman.
4. Mengirim `YA` dan melihat balasan contoh “Catatan penyiraman disimpan.”

Tidak ada database atau persistensi. Kalimat “disimpan” menggambarkan alur produk yang direncanakan; hasil nyata hanya perubahan state lokal. Reload menginisialisasi demo kembali. Tidak ditemukan panggilan backend/gateway pada alur ini.

Banner di chat menyatakan pesan contoh, dan disclaimer luar frame menyatakan demo tidak mengirim pesan ke WhatsApp. Foto daun adalah aset berlisensi, bukan kiriman petani atau hasil diagnosis AgriSense.

## Bagian dekoratif dan batas fitur

Status bar 9:41, sinyal, baterai, kamera Dynamic Island, timestamp, dan read receipt bersifat representasi visual. Ikon call/video dekoratif; tidak melakukan panggilan. Tidak ada upload foto bebas, rekaman suara, audio player pesan pengguna, akun chat, AI generatif, atau koneksi WhatsApp.

UI ini bukan instalasi aplikasi native dan belum diuji pada iPhone fisik.

## Layout, scroll, dan aksesibilitas

Komponen utama: `components/landing/IPhoneWhatsAppDemo.tsx`; orchestration tahap: `WhatsAppStory.tsx`; styling: `app/globals.css`.

Frame tetap ditampilkan pada desktop, mobile, viewport pendek, dan reduced motion. Mode sticky/ScrollTrigger memilih tahap hanya pada viewport minimal 64rem dan tinggi 760px dengan motion diizinkan. Pemilih tahap/replay tetap tersedia tanpa mode scroll story.

Chat memakai region focusable, `data-lenis-prevent`, dan scroll native. Wheel/touch/scroll key menghentikan autoscroll GSAP; pergantian tahap baru dapat mengaktifkannya kembali. Tahap terakhir menyediakan ruang agar frame tetap terlihat pada mode sticky.

Kontrol tahap mempunyai nama aksesibel dan pressed state, balasan memakai live announcement, dan preview foto menggunakan `dialog` native. Tanpa JavaScript, exchange awal dan transcript lengkap melalui `details/summary` tetap terbaca; interaksi simulasi tidak berjalan.

## Aset

Wallpaper `public/images/demo-chat-wallpaper.svg` dan frame/status icon dibuat lokal. Foto `public/images/demo-melon-leaf.jpg` merupakan foto asli daun melon berlisensi CC BY 3.0. Sumber ada di [provenance foto](demo-photo-source.md); footer memuat atribusi.

Tidak ditambahkan library frame atau runtime request eksternal untuk demo.

## Validasi dan bukti

Run milestone demo lulus 32/32 smoke checks. Suite tersebut dijalankan ulang pada build terbaru selama pembaruan dokumentasi dan kembali lulus 32/32. Lint seluruh proyek, TypeScript, dan build produksi juga lulus. Lihat [laporan validasi](redesign-validation.md) dan [hasil terbaru](evidence/iphone-current-32.json).

Preview build terbaru: [desktop](previews/iphone-current-desktop.png), [mobile](previews/iphone-current-mobile.png), [frame](previews/iphone-current-frame.png), [foto](previews/iphone-current-photo.png).

Arsip milestone: [desktop](previews/iphone-desktop.png), [mobile](previews/iphone-mobile.png), [frame](previews/iphone-frame.png), [foto](previews/iphone-photo.png). Arsip itu diambil sebelum revisi hero terbaru.

Pengujian memakai headless Edge dan server `next start` lokal. Pengujian ini tidak membuktikan integrasi native WhatsApp, layanan AI, persistensi, dukungan Safari, perangkat fisik, atau kepatuhan aksesibilitas lengkap.
