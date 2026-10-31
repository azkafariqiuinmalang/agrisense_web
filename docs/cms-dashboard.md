# Dashboard CMS AgriSense

Tanggal: 13 Oktober 2026. Route `/cms`, khusus admin aktif, baca-saja.

UI memakai identitas hijau-mint, logo asli, dan Plus Jakarta Sans yang disajikan lokal. Panduan UI/UX Pro Max diterapkan pada hierarki ringkasan, tabel responsif, fokus keyboard, kontrol minimal 44px, empty/error/loading state, legenda dan tabel angka pendamping grafik, serta reduced motion. Rekomendasi generik dark glass tidak dipakai karena tidak cocok dengan identitas landing yang dipilih pengguna.

Bagian UI: Ringkasan, Pengguna, Kebun & tanaman, Keuangan. Data didapat dari `/api/cms` → platform-service `/admin/dashboard` → PostgreSQL. Tidak ada angka demo hardcoded di halaman. Pencarian, filter, halaman, detail, refresh, serta logout berfungsi; bukan tombol kosmetik.

Backend memeriksa role dan status database. Login admin/super_admin aktif menuju CMS, petani menuju dashboard miliknya. Pengguna lain tidak mendapat akses. Penolakan CMS tidak menghapus sesi petani yang sah. Dashboard CMS tidak mengirim action MCP atau menulis data domain.

Nomor disamarkan pada API, bukan hanya melalui CSS. Tidak ada NIK, alamat lengkap, koordinat, isi chat, JWT, atau cookie di respons CMS. Data validasi ditandai jelas; data kosong tetap kosong, bukan diganti angka contoh.

Preview lokal: `http://127.0.0.1:3000/cms`. `.env.local` diabaikan Git dan saat ini mengarah ke platform CMS uji `http://127.0.0.1:14009`, dengan label `cms_validation`. Backend lama pada `13009` tidak diganti. Container CMS memakai database terpisah berisi fixture sintetis, bukan database petani produksi.

Verifikasi: lint komponen CMS, TypeScript/build, SQL dan integrasi HTTP, serta browser desktop/mobile. Detail implementasi, hasil, keterbatasan, dan operasi ada pada backend `docs/runbooks/admin-cms.md`. Dua warning lint lama pada komponen login masih ada; bukan error build.

Screenshot pemeriksaan: `docs/previews/cms-desktop.jpg`. Screenshot memakai data uji. Komponen landing, animasi, serta perubahan staged pengguna dipertahankan; file yang diubah pada milestone ini perlu review diff tersendiri sebelum staging/commit.
