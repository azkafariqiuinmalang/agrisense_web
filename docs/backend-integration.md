# Dashboard petani: membaca backend tetap

Diperbarui 14 Oktober 2026. Scope pekerjaan: UI/UX website dan penghubung baca website. Repository, service, database, migrasi, dan MCP di `D:\Development\Agrisense` tidak diubah.

## Perilaku pengguna

1. Petani mengirim `LOGIN` pada percakapan WhatsApp AgriSense yang sudah digunakan.
2. Halaman `/login` menerima nomor WhatsApp dan kode 64 karakter dari balasan backend. Nomor saja tidak cukup. UI OTP 6 digit dan nomor bantuan hardcoded sudah dihapus.
3. API session web memakai login backend yang sudah ada. JWT tetap berada dalam cookie HttpOnly, SameSite Strict, Secure pada production, berumur sesuai kontrak backend 15 menit.
4. Setelah login, `/dashboard` memuat catatan milik sesi tersebut. Pencatatan dilakukan melalui WhatsApp; dashboard tidak menyediakan operasi tulis.
5. Data diperiksa otomatis setiap 5 detik setelah pembacaan sebelumnya selesai, saat tab terlihat dan browser online. Perubahan yang sudah tersimpan muncul pada pembacaan berikutnya.

Ini pembaruan berkala mendekati real time, bukan push event/WebSocket. Waktu total juga dipengaruhi proses simpan backend, jaringan, dan durasi request. Pesan WhatsApp atau draft yang belum dikonfirmasi tidak diperlakukan sebagai data tersimpan.

## Penghubung yang benar-benar dipakai

`GET /api/dashboard` tidak lagi memanggil `/identity/dashboard`, yang tidak tersedia pada backend yang diperiksa. Website memakai operasi berikut:

| Akses                                         | Tujuan                                                           | Batas                                                      |
| --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Platform `GET /identity/profile`              | Identitas, role dan status saat ini                              | Harus petani aktif/pending verification                    |
| Brain `POST /mcp/call`: `get_farm_status`     | Daftar kebun dan tanaman aktif per kebun                         | Maksimal 25 kebun                                          |
| Brain `POST /mcp/call`: `get_crop_status`     | Tanaman, varietas, tanggal/umur/status, sistem dan luas budidaya | Maksimal 25 tanaman                                        |
| Brain `POST /mcp/call`: `get_harvest_history` | Riwayat panen tercatat                                           | Maksimal 25 catatan                                        |
| Brain `POST /mcp/call`: `check_credit_score`  | Skor yang sudah ada dan masa berlaku                             | Bukan scoring baru atau persetujuan bank                   |
| Farm `POST /internal/activities/recent`       | Aktivitas terbaru dari tanaman aktif terakhir                    | Maksimal 20; memerlukan credential internal baca di server |

Walaupun beberapa endpoint menggunakan POST, operasi yang dipilih adalah pembacaan. Adapter tidak memanggil `record_expense`, `request_kur`, `/mcp/confirm`, `/internal/operations`, AI/vision, atau query database langsung. Nama tool/path tetap di kode, bukan input dari browser.

JWT dipakai untuk pembacaan MCP. Nomor untuk pembacaan aktivitas berasal dari profile backend yang sudah terautentikasi, bukan query/body pengguna. Query pemilihan pemilik ditolak. API memakai private/no-store dan tidak mengembalikan JWT maupun credential internal.

## Data yang belum bisa dijanjikan

- API MCP yang tersedia membatasi daftar hingga 25 item dan tidak menyediakan pagination untuk membaca seluruh riwayat.
- Aktivitas adalah 20 catatan terbaru **dari tanaman aktif terakhir**, bukan seluruh aktivitas seluruh kebun.
- Daftar transaksi pemasukan/pengeluaran, draft/revisi CRUD, dan receipt belum memiliki penghubung HTTP baca yang tersedia untuk website ini.
- Ringkasan UI menyebut jumlah/berat **yang ditampilkan**, bukan total seluruh data di database.
- Bagian keuangan menampilkan keterbatasan akses riwayat, bukan angka nol atau data contoh.
- CMS admin belum diubah pada pekerjaan dashboard petani ini; endpoint admin/dashboard yang diperlukan CMS lama tetap belum tersedia pada backend yang diperiksa.

Seluruh data petani belum dapat ditampilkan hanya dengan kontrak API tersebut. Backend tetap dipertahankan; keterbatasan ditampilkan secara jujur tanpa bypass akses database atau membuat endpoint baru pada backend.

## Sinkronisasi dan sesi

Polling memakai satu request pada satu waktu. Fokus/tab aktif dan event online memicu pemeriksaan. Tab tersembunyi tidak terus polling; koneksi offline mempertahankan snapshot terakhir. Kegagalan request memakai backoff hingga 30 detik; kegagalan bagian tertentu ditampilkan sebagai kondisi parsial.

401/403 menghapus snapshot dan mengarahkan pengguna ke login. Logout menghentikan polling, membatalkan request frontend, dan menghapus snapshot sebelum navigasi, termasuk pada tree route yang disimpan Next.js. Kolom kode/nomor login dikosongkan setelah login berhasil. Data dashboard tidak disimpan di localStorage/sessionStorage.

## Konfigurasi web

Salin `.env.example` menjadi `.env.local` jika belum ada:

```dotenv
AGRISENSE_PLATFORM_URL=http://127.0.0.1:3009
AGRISENSE_BRAIN_URL=http://127.0.0.1:3002
AGRISENSE_FARM_URL=http://127.0.0.1:3003
AGRISENSE_WEB_ORIGIN=http://localhost:3000
AGRISENSE_DATA_ENV=configured_backend
AGRISENSE_FARM_READ_TOKEN=
```

`AGRISENSE_FARM_READ_TOKEN` bersifat server-only dan harus cocok dengan `BRAIN_FARM_TOKEN` backend yang sudah ada. Tanpa credential ini, aktivitas diberi status belum terhubung; data MCP lain tetap dapat dimuat. Tidak ada token registrasi MCP, JWT signing secret, atau credential database yang diperlukan di browser.

Pada workspace ini, konfigurasi lokal dibuat saat belum ada `.env.local`, memakai origin localhost dan token Farm yang sudah dikonfigurasi backend. Nilai secret tidak dicetak dan file diabaikan Git. Konfigurasi backend tidak diedit. Untuk deployment, isi origin service terpercaya serta origin HTTPS web melalui environment host.

Untuk fixture validation, set `AGRISENSE_DATA_ENV=validation`; UI menandai mode uji. Jangan memakai data fixture sebagai bukti data produksi.

## Verifikasi dan batas bukti

```sh
npm run lint
npx --no-install tsc --noEmit --incremental false
npm run build
npm run test:dashboard
```

`test:dashboard` memakai Node test runner dan HTTP upstream simulasi terisolasi. Build diperlukan sebelum tes. Sepuluh tes mencakup sesi, pemilihan pemilik, operasi baca terbatas, perubahan data, gagal parsial, response tidak valid, pencabutan akses, dan format login/cookie.

`tests/dashboard-browser.mjs` memakai Playwright sebagai alat verifikasi lokal opsional (bukan dependency runtime). Jalankan setelah build, dengan Playwright tersedia atau `PLAYWRIGHT_MODULE` menunjuk module Playwright lokal. Browser yang digunakan adalah headless Microsoft Edge.

Hasil pada pekerjaan ini: lint, TypeScript/build lulus; **10/10 tes API** dan **30/30 pemeriksaan browser** lulus. Pemeriksaan browser meliputi login, auto-refresh data baru, enam/pendek kode ditolak, filter, viewport 320–1440px, offline/recovery, gagal parsial, single-flight, tab background, pencabutan akses, logout saat request masih berjalan, dan cookie dibersihkan.

Tes tersebut memakai data sintetis dan menjalankan website serta adapter sesungguhnya terhadap upstream simulasi. Ini bukan verifikasi pengiriman Meta WhatsApp, kode login pengguna nyata, atau end-to-end pencatatan WA pada database utama. Tidak ada transaksi fixture, migrasi, atau reset pada backend AgriSense.

Preview data uji: [dashboard desktop](previews/farmer-dashboard-desktop.png), [dashboard mobile](previews/farmer-dashboard-mobile.png), [login desktop](previews/farmer-login-desktop.png), [login mobile](previews/farmer-login-mobile.png).

## Berkas utama

- `app/dashboard/FarmerDashboard.tsx`, `dashboard.module.css`: layout dan tampilan data.
- `app/dashboard/use-farmer-dashboard.ts`: lifecycle polling, snapshot, dan cleanup.
- `lib/farmer-dashboard-server.ts`, `farmer-dashboard-types.ts`: adapter baca dan data yang diizinkan keluar ke browser.
- `app/api/dashboard/route.ts`: route snapshot milik sesi login.
- `app/login/LoginForm.tsx`: login dengan kode backend yang benar.
