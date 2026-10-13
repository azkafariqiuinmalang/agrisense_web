# Integrasi web–backend petani

## Jalur data

Browser → API Next.js (`/api/session`, `/api/dashboard`) → platform-service
Rust (`/identity/login`, `/identity/profile`, `/identity/dashboard`) → fungsi
database `identity.farmer_dashboard()`.

Web tidak memakai koneksi database langsung, JWT signing secret, atau token
internal Brain/AI. Nomor pada form hanya identitas; kode kanal membuktikan
kepemilikan. JWT hasil backend disimpan dalam cookie HttpOnly, SameSite=Strict,
berumur 15 menit. Pada produksi, cookie Secure dan prefiks `__Host-` digunakan.
Token tidak dikembalikan dalam JSON login dan tidak disimpan di localStorage.

## Konfigurasi lokal

Isi `.env.local` yang diabaikan Git:

```dotenv
AGRISENSE_PLATFORM_URL=http://127.0.0.1:3009
```

Untuk stack uji terisolasi, ganti port menjadi `13009`. Checkpoint integrasi
lokal saat ini diarahkan ke port uji tersebut. Backend memerlukan migrasi
`202610130002_farmer_dashboard.sql` dan binary platform-service terbaru.
Jangan mengarahkan tes fixture ke database normal.

Konfigurasi lokal juga memakai `AGRISENSE_DATA_ENV=validation`, sehingga
dashboard menandai data sebagai database uji. Saat memakai backend normal yang
telah diverifikasi, ubah port/origin dan label environment tersebut; jangan
menampilkan fixture sebagai data produksi.

Pada produksi, set origin backend yang dipercaya dan
`AGRISENSE_WEB_ORIGIN=https://<domain-web-yang-disetujui>`. Tanpa konfigurasi
origin web, POST login/logout produksi ditolak. Browser tidak mengakses backend
lintas origin, sehingga tidak perlu membuka CORS database/service ke publik.

## Penggunaan

1. Petani terdaftar mengirim `LOGIN` melalui WhatsApp.
2. Bot mengirim kode sekali pakai 64 karakter hex, berlaku 5 menit (bukan PIN
   enam angka). Form mengizinkan paste dan menyediakan petunjuk format.
3. Buka `/login`; isi nomor dan kode. Format lokal `08…` dinormalisasi ke `+628…`.
4. Setelah backend memverifikasi kode dan profil petani aktif, buka `/dashboard`.
5. Gunakan Muat ulang untuk membaca perubahan terbaru dari WhatsApp; belum
   menggunakan WebSocket atau live polling. Tombol Keluar menghapus cookie web.

Logout tidak mencabut JWT yang sudah dicuri dari backend; token tetap memiliki
masa berlaku backend. Tidak ada refresh token atau akun admin dalam dashboard
ini. Form tidak menerbitkan kode sendiri dan tidak menyediakan login bypass.

## Data dan grafik

- Ringkasan seluruh riwayat: jumlah kebun, tanaman aktif, aktivitas, panen kg,
  dan total pengeluaran (hanya transaksi expense, bukan revenue/transfer).
- Grafik batang sederhana: pengeluaran per kategori dan komposisi aktivitas
  selama enam bulan kalender terakhir, termasuk bulan berjalan sampai hari ini.
- Tabel tren enam bulan: panen dan pengeluaran, dengan bulan kosong bernilai nol
  pencatatan; bukan estimasi hasil pertanian.
- Maksimal 100 kebun, 100 tanaman, dan 20 aktivitas terbaru; agregat ringkasan
  dihitung dari seluruh data pemilik, bukan potongan daftar tersebut.
- Kalender menggunakan Asia/Jakarta. Nominal rupiah dikirim sebagai string
  dan diformat memakai BigInt agar tidak kehilangan presisi integer besar.
- Tidak ada grafik/data contoh pada dashboard aktif. Empty state dan kegagalan
  backend ditampilkan secara berbeda.

Seluruh akses dashboard scoped oleh signed JWT sub dan akun database aktif.
Tidak ada owner ID pada URL, arbitrary MCP proxy, endpoint konfirmasi, atau
endpoint tulis pada web. API memakai no-store; suspended/non-farmer ditolak.
GET `/dashboard` menyajikan shell tanpa data pribadi; data hanya dimuat melalui
API terautentikasi, dan pengunjung tanpa sesi diarahkan ke login.

## Verifikasi

Di web: `npm run lint`, `npx --no-install tsc --noEmit --incremental false`,
dan `npm run build`.

Di backend: runner validasi terisolasi menjalankan tes SQL
`infrastructure/postgres/tests/farmer_dashboard.sql`. Dengan stack uji dan web
lokal berjalan, jalankan dari root backend:

```sh
python scripts/check_web_dashboard.py --disposable-demo-db --web-url http://127.0.0.1:3000
```

Script menyiapkan dan membersihkan petani sintetis hanya pada container yang
terverifikasi sebagai project `agrisense-validation`. Kode diterbitkan oleh
Brain melalui perintah LOGIN terautentikasi, lalu dipakai pada API web nyata.
Ini tidak membuktikan pengiriman Meta WhatsApp, kualitas AI, atau kesiapan
deployment produksi. Output tidak mencetak kode, cookie, JWT, atau data petani.

Sebelum rilis: uji kanal WhatsApp nyata, deployment HTTPS, konfigurasi proxy
dan origin, pembatas abuse login, kebijakan retensi data, serta smoke test
pada lingkungan staging dengan akun yang disetujui.

## Hasil verifikasi 13 Oktober 2026

- Lint, TypeScript, dan build produksi frontend lulus.
- Build/runtime backend lulus; 75 tes Rust lulus, 1 doc-test contoh diabaikan.
- Empat suite SQL, termasuk dashboard ownership/agregat/grant, lulus.
- Regresi offline: 9 core flow, 16 MCP HTTP, dan 17 domain gap checks lulus.
- Integrasi web–Rust–PostgreSQL: 13 checks lulus, termasuk kode sekali pakai,
  expiry, cookie, isolasi pemilik, status/role terbaru, read-only dan logout.
- Tidak ada inferensi AI berbayar atau pengiriman Meta nyata pada rangkaian ini.
- Backend menggunakan branch `azkafariqiuinmalang/web-dashboard-integration`;
  web menggunakan `feature/backend-dashboard-integration`. Belum commit/push.

Runner menggunakan compiler Docker 1.97.1 yang sudah tersedia, bukan mengunduh
toolchain floating stable. Autentikasi webhook validation dibuat sementara
dan dikembalikan setelah runner selesai; file `.env` backend tidak diubah.
Stack uji dipertahankan untuk pengecekan lokal. Tidak ada migrasi database normal.
