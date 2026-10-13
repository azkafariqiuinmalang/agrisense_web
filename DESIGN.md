# AgriSense — DESIGN.md

> Spesifikasi landing page, konten, interaksi, dan implementasi.
> Status: rancangan untuk implementasi; belum merupakan website yang telah dibangun.
> Versi: 1.0 · 8 Oktober 2026
> Stack: Next.js App Router + TypeScript · Montserrat · Icons8 Material Outlined

## 1. Tujuan dan batas produk

AgriSense membantu petani melon dalam greenhouse bermedia tanah berkonsultasi dan mencatat aktivitas budidaya melalui WhatsApp. Landing page harus menjelaskan manfaat ini dalam beberapa detik, memperlihatkan alur pemakaian, lalu mengarahkan pengunjung ke demo atau diskusi pilot.

Audiens utama adalah pengelola greenhouse dan petani melon yang sudah menggunakan WhatsApp. Pengunjung tidak perlu memahami AI, dashboard, atau istilah infrastruktur untuk mengerti produk.

### Keputusan utama

| Aspek | Keputusan |
| --- | --- |
| Karakter | Tenang, jelas, modern, dekat dengan kegiatan pertanian |
| Referensi | Hierarki editorial dan penyajian bukti ala Scale AI; identitas AgriSense tetap mandiri |
| Warna | Putih dominan, hijau tua untuk aksi dan teks, hijau muda sebagai aksen |
| Kanal produk | WhatsApp; landing page menjelaskan pengalaman tersebut |
| Fokus visual | Greenhouse nyata dan percakapan WhatsApp yang terbaca |
| Aksi utama | **Lihat demo** → bagian demo dalam halaman |
| Aksi kedua | **Diskusikan pilot** → bagian pilot |
| Motion utama | Satu bagian storytelling dengan panel demo sticky pada desktop |
| Implementasi | Server Components sebagai dasar; Client Components hanya untuk interaksi |
| Klaim | Berdasarkan fitur dan bukti yang terverifikasi; tanpa angka atau logo rekaan |

### Batas cakupan

Dokumen ini mencakup satu landing page responsif. Tidak mencakup pembangunan gateway WhatsApp, autentikasi, dashboard, pembayaran, marketplace, CRM, atau backend AI.

Konteks proyek yang dibahas sebelumnya menunjukkan prototipe dengan konsultasi chat/foto/suara dan pencatatan aktivitas melalui konfirmasi. Status operasionalnya harus diperiksa sebelum konten diterbitkan. RAG, analitik, transaksi keuangan, marketplace, dan kemampuan multiagent tidak menjadi janji landing page.

Jangan menampilkan nama model AI, message broker, database, atau arsitektur internal pada alur pemasaran. Teknologi tersebut tidak membantu pengunjung menentukan apakah AgriSense relevan bagi kebunnya.

## 2. Hasil riset yang menjadi dasar

### Yang diambil dari Scale AI

Situs dan panduan merek Scale mendukung pendekatan berikut: pesan utama yang jelas, pembagian halaman berdasarkan kegunaan, visual produk yang membantu pemahaman, bukti penggunaan, serta CTA yang mudah ditemukan. Panduan mereknya menekankan tipografi dengan hierarki kuat, warna terkendali, dan fotografi manusia serta sistem dalam konteks nyata. [R1–R5]

Adaptasi untuk AgriSense:
- Gunakan headline pendek dan ruang kosong yang cukup.
- Perlihatkan pengalaman produk sebelum uraian teknis.
- Susun cerita dari masalah lapangan → pengalaman WhatsApp → kemampuan → kepercayaan → pilot.
- Gunakan foto pertanian yang autentik sebagai konteks.
- Tampilkan bukti hanya jika tersedia dan mendapat izin.

Montserrat adalah pilihan AgriSense. Font ini tidak diklaim sebagai font Scale AI. Warna, logo, ilustrasi, dan komposisi tidak menyalin identitas Scale.

### Koreksi istilah layout dan scroll

| Istilah | Makna dan keputusan |
| --- | --- |
| Multi-view / orthographic | Pola editor anotasi 3D; tidak diperlukan untuk landing page |
| Camera–sensor fusion | Penyandingan data sensor dalam alat anotasi; bukan referensi struktur halaman pemasaran |
| Empty Canvas | Template aplikasi pada Scale GenAI Platform; bukan nama layout landing page [R6] |
| Sticky storytelling | Pilihan desain AgriSense untuk menjelaskan alur WhatsApp |
| Scroll-linked / scrubbing | Animasi mengikuti progres scroll; didukung oleh ScrollTrigger [R12] |
| Parallax / transform 3D | Opsional dan sangat ringan; tidak menjadi dasar pengalaman |

Pola animasi dari galeri atau artikel umum tidak cukup untuk memastikan efek yang sedang digunakan pada website Scale. Dokumen ini tidak mengklaim bahwa pinning, parallax, atau scrubbing tertentu telah teramati langsung pada homepage Scale saat ini.

## 3. Prinsip pengalaman

1. **Manfaat sebelum teknologi.** Pengunjung mengetahui siapa yang dibantu, melalui kanal apa, dan untuk kegiatan apa.
2. **Satu cerita utama.** Demo WhatsApp menjelaskan produk; animasi mendukung cerita tersebut.
3. **Baca tanpa interaksi khusus.** Informasi inti tersedia tanpa hover, scroll presisi, atau JavaScript.
4. **Klaim dapat ditelusuri.** Setiap angka, testimoni, dan logo memiliki sumber serta izin.
5. **Mobile sebagai pengalaman penuh.** Demo tetap terbaca tanpa mengecilkan tampilan desktop.
6. **Kepercayaan melalui kendali.** Tunjukkan bahwa catatan diperiksa dan dikonfirmasi sebelum disimpan.
7. **Konten lapangan yang spesifik.** Melon, greenhouse, media tanah, dan kegiatan budidaya menjadi konteks utama.

## 4. Arsitektur informasi

Urutan berikut adalah baseline implementasi. Bagian tidak harus berbentuk kartu; gunakan variasi komposisi untuk menjaga ritme.

| Urutan | Bagian / ID | Tujuan | Komposisi |
| --- | --- | --- | --- |
| 0 | Header | Orientasi dan navigasi | Logo, empat tautan, CTA demo |
| 1 | Hero / `beranda` | Menjelaskan produk dan memberi langkah berikutnya | Headline terpusat, dua CTA, foto landscape + inset chat |
| 2 | Konteks / `produk` | Menghubungkan produk dengan kegiatan petani | Split teks dan foto/detail lapangan |
| 3 | Demo / `demo` | Membuktikan alur penggunaan | Narasi bertahap + panel WhatsApp sticky |
| 4 | Kemampuan / `fitur` | Merangkum cara AgriSense membantu | Grid ringkas empat kemampuan |
| 5 | Cara kerja / `cara-kerja` | Membuat langkah awal mudah dipahami | Tiga langkah sederhana |
| 6 | Kepercayaan / `kendali` | Menjelaskan konfirmasi, konteks, dan keterbatasan | Editorial split atau baris informasi |
| 7 | Pilot / `pilot` | Menetapkan kecocokan dan mengarahkan kontak | Panel hijau muda + aksi kontak nyata |
| 8 | Tentang / `tentang` | Memberi konteks tim/proyek | Foto lapangan dan paragraf singkat |
| 9 | FAQ / `faq` | Menghilangkan pertanyaan utama | Accordion native yang bisa diakses |
| 10 | Penutup dan footer | Memberi aksi terakhir dan informasi dasar | CTA ringkas, kontak, legal, atribusi |

Navigasi desktop: **Produk**, **Cara kerja**, **Pilot**, **Tentang**. Tombol: **Lihat demo**. Tautan anchor harus menuju bagian yang benar dan memperhitungkan tinggi header.

Tidak ada baris logo pelanggan, penghargaan, angka pengguna, atau statistik hasil panen sampai bukti tersebut tersedia.

## 5. Spesifikasi tiap bagian dan copy awal

Copy berikut merupakan rancangan editorial. Pernyataan tentang fungsi harus disesuaikan dengan hasil verifikasi produk.

### 5.1 Header

- Logo AgriSense di kiri, navigasi di tengah/kanan, tombol demo di ujung kanan.
- Tinggi desktop 72 px; mobile 64 px.
- Background putih dengan border bawah halus. Sticky dengan z-index yang ditentukan.
- Logo merupakan tautan ke beranda, bukan tombol.
- Mobile memakai tombol menu berlabel jelas. Menu mendukung keyboard, Escape, dan pengembalian fokus ke tombol pembuka.
- Tidak menggunakan mega-menu untuk empat tautan sederhana.

### 5.2 Hero

**Label:** Asisten budidaya melalui WhatsApp

**Headline:**  
**Budidaya melon, lebih terarah lewat WhatsApp.**

**Deskripsi:**  
Konsultasikan kondisi tanaman dan catat aktivitas greenhouse melalui percakapan yang sudah akrab bagi Anda.

**Aksi:** Lihat demo · Diskusikan pilot

**Catatan singkat:** Dirancang untuk budidaya melon di greenhouse bermedia tanah.

Visual utama berupa foto greenhouse landscape dengan tanaman dan aktivitas petani yang jelas. Inset percakapan memperlihatkan satu pertukaran singkat, tanpa memenuhi hero dengan seluruh transcript. Tambahkan label **Ilustrasi percakapan** jika menggunakan mockup.

Desktop: headline dan deskripsi terpusat; lebar teks dibatasi; foto besar di bawah. Mobile: headline → deskripsi → CTA → visual. Inset chat berubah menjadi panel di bawah foto jika overlay membuat teks terlalu kecil.

Tidak memakai carousel, video autoplay, floating badge berulang, atau latar jaringan AI abstrak.

### 5.3 Konteks lapangan

**Judul:** Banyak kegiatan di kebun. Catatan sering tertinggal.

**Isi:**  
Penyiraman, pengamatan tanaman, dan pertanyaan harian terjadi di sela pekerjaan. AgriSense dirancang agar kegiatan tersebut bisa dibahas dan dicatat melalui WhatsApp.

Tampilkan tiga konteks singkat:
- Pertanyaan muncul saat berada di greenhouse.
- Foto membantu menjelaskan kondisi tanaman.
- Aktivitas harian membutuhkan catatan yang mudah ditinjau.

Gunakan foto/detail lapangan yang berbeda dari hero. Jangan menyatakan besarnya masalah dalam persentase tanpa data.

### 5.4 Demo WhatsApp

**Judul:** Dari percakapan menjadi catatan budidaya.

**Pengantar:**  
Lihat contoh bagaimana konteks kebun dikumpulkan, pertanyaan dibahas, dan aktivitas diperiksa sebelum dicatat.

Empat tahap narasi:
1. **Kenalkan konteks kebun.** Jenis tanaman, greenhouse, dan media tanam memberi konteks awal.
2. **Ceritakan kondisi tanaman.** Teks, foto, atau pesan suara menjadi bahan percakapan.
3. **Periksa ringkasan kegiatan.** AgriSense menampilkan draft aktivitas untuk diperiksa.
4. **Konfirmasikan pencatatan.** Pengguna menyetujui draft sebelum penyimpanan.

#### Transcript demonstrasi

> **Label tetap:** Contoh alur — ilustrasi, bukan percakapan layanan langsung.

**Tahap 1**
- Pengguna: “Saya menanam melon di Greenhouse A, menggunakan media tanah.”
- AgriSense: “Baik. Konteks kebun: melon, Greenhouse A, media tanah.”

**Tahap 2**
- Pengguna: “Beberapa daun terlihat menguning. Saya kirim fotonya.”
- AgriSense: “Bisa ceritakan sejak kapan gejalanya muncul dan bagian tanaman mana yang terdampak?”

**Tahap 3**
- Pengguna: “CATAT penyiraman hari ini di Greenhouse A.”
- AgriSense: “Periksa catatan berikut: kegiatan penyiraman, Greenhouse A, tanggal hari ini. Apakah sudah sesuai?”

**Tahap 4**
- Pengguna: “YA”
- AgriSense: “Catatan penyiraman disimpan.”

Pernyataan “disimpan” hanya muncul di ilustrasi yang diberi label, atau pada demo terhubung setelah backend benar-benar berhasil. Jangan membuat mockup terlihat seperti konfirmasi operasional.

Tidak menampilkan diagnosis penyakit pasti dari satu foto, rekomendasi dosis yang belum tervalidasi, hasil panen rekaan, atau data pribadi petani. Jangan mengarang volume air atau waktu kegiatan yang tidak diberikan pengguna.

Demo visual memiliki indikator tahap 1–4. Narasi dan transcript lengkap tetap dapat dibaca tanpa animasi.

### 5.5 Kemampuan

**Judul:** Bantuan yang mengikuti kegiatan di greenhouse.

| Kemampuan | Copy awal | Aset |
| --- | --- | --- |
| Percakapan budidaya | Bahas pertanyaan dengan konteks tanaman dan kebun Anda. | Ikon chat |
| Foto kondisi tanaman | Sertakan foto untuk membantu menjelaskan gejala yang terlihat. | Ikon kamera |
| Pesan suara | Ceritakan situasi melalui suara saat mengetik kurang praktis. | Ikon mikrofon |
| Catatan kegiatan | Periksa ringkasan aktivitas sebelum mengonfirmasi pencatatan. | Ikon dokumen/check |

Status tiap kemampuan diperiksa sebelum peluncuran. Jika suara belum dapat digunakan pada pilot, tampilkan sebagai **Dalam pengembangan** atau hilangkan dari daftar fungsi aktif.

Grid desktop 2 × 2 atau empat kolom hanya jika copy tetap nyaman dibaca. Tablet dua kolom; mobile satu kolom. Semua ikon memakai keluarga yang sama.

### 5.6 Cara kerja

**Judul:** Mulai dari kebun Anda.

1. **Bagikan konteks.** Kenalkan tanaman, greenhouse, dan media tanam.
2. **Mulai percakapan.** Kirim pertanyaan, foto, atau pesan suara sesuai fitur yang tersedia.
3. **Periksa dan konfirmasi.** Tinjau draft kegiatan sebelum catatan disimpan.

Jangan memberi kesan bahwa pengguna harus mengunduh aplikasi atau membuat akun web jika itu bukan alur sebenarnya. Waktu onboarding tidak dinyatakan dalam menit sampai terukur.

### 5.7 Kepercayaan dan kendali

**Judul:** Anda tetap memegang keputusan di kebun.

- **Konteks membantu percakapan.** Jawaban mempertimbangkan informasi kebun yang diberikan.
- **Catatan melalui konfirmasi.** Ringkasan aktivitas ditinjau sebelum disetujui.
- **Pengamatan lapangan tetap penting.** Respons AI mendukung pertimbangan; kondisi tanaman perlu diperiksa secara langsung.

Jangan memakai badge “100% akurat”, “terjamin aman”, “enterprise-grade”, atau sertifikasi yang belum dimiliki. Kebijakan data harus menjelaskan praktik sebenarnya, termasuk penggunaan foto dan suara, penyedia pemrosesan, penyimpanan, serta jalur permintaan penghapusan.

### 5.8 Pilot

**Judul:** Uji AgriSense di greenhouse Anda.

**Isi:**  
Kami ingin memahami kebutuhan pengelola greenhouse melon bermedia tanah melalui penggunaan awal yang terarah.

**Kecocokan awal:** budidaya melon, greenhouse, media tanah, pengguna WhatsApp yang bersedia memberi umpan balik.

**Aksi kontak:** Diskusikan pilot

Bagian ini tidak menjanjikan pilot gratis, kapasitas tertentu, atau tanggal mulai tanpa keputusan bisnis. Jika belum ada kontak yang siap menerima permintaan, tampilkan status pilot secara jujur dan jangan memasang tombol yang tidak berfungsi.

### 5.9 Tentang

**Judul:** Dikembangkan dengan perhatian pada kegiatan pertanian.

Paragraf berisi fakta yang bisa dibuktikan: siapa pengembangnya, ruang lingkup awal, serta alasan memilih WhatsApp. Gunakan foto tim di lapangan bila tersedia dan diizinkan. Jangan membuat nama tim, institusi, atau riwayat kunjungan.

### 5.10 FAQ

Gunakan `details` / `summary` atau accordion dengan perilaku keyboard setara.

Pertanyaan minimum:
- Untuk jenis kebun apa AgriSense dirancang?
- Apakah saya membutuhkan aplikasi tambahan?
- Apa yang bisa dikirim melalui WhatsApp?
- Bagaimana aktivitas dicatat?
- Apakah respons AI menggantikan pemeriksaan tanaman?
- Bagaimana saya mengikuti pilot?
- Bagaimana foto, suara, dan catatan saya digunakan?

Jawaban harus mengikuti status nyata produk. Pertanyaan data mengarah ke kebijakan yang tersedia, tanpa mengarang masa retensi atau jaminan keamanan.

### 5.11 Penutup dan footer

Penutup: **Mulai dari satu percakapan tentang kebun Anda.**  
Aksi: **Lihat demo** dan kontak pilot bila tersedia.

Footer memuat logo/nama, deskripsi singkat, navigasi, kontak resmi, kebijakan privasi, hak cipta, serta atribusi Icons8 bila diwajibkan lisensi. Tautan legal tidak boleh mengarah ke `#` atau halaman kosong.

## 6. Sistem visual

### 6.1 Warna

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `--color-bg` | `#FFFFFF` | Background utama |
| `--color-surface` | `#F5F8F2` | Bagian alternatif dan panel lembut |
| `--color-primary` | `#176B3A` | CTA utama, tautan, indikator aktif |
| `--color-primary-hover` | `#145B32` | Hover CTA utama |
| `--color-text` | `#123524` | Headline dan teks utama |
| `--color-text-muted` | `#4B6357` | Deskripsi dan metadata |
| `--color-border` | `#DCE6DD` | Pemisah dekoratif |
| `--color-control-border` | `#4B6357` | Batas kontrol yang diperlukan agar terlihat |
| `--color-accent` | `#A6C96A` | Aksen daun, bidang dekoratif |
| `--color-focus` | `#176B3A` | Outline fokus dengan offset |

Kontras terhadap putih, dibulatkan: primary 6,56:1; text 13,46:1; muted 6,52:1; accent 1,88:1. Accent tidak digunakan sebagai teks kecil atau satu-satunya penanda kontrol di atas putih.

Border dekoratif tidak menggantikan batas kontrol yang diperlukan untuk mengenali tombol/input. Status aktif juga diberi teks atau bentuk, bukan hanya perubahan warna.

Dominasi visual: putih dan surface lembut; hijau tua terfokus pada teks serta aksi. Tidak perlu memaksakan rasio persentase warna pada setiap section.

### 6.2 Tipografi

Font utama **Montserrat**, upright variable. Gunakan empat weight: 400, 500, 600, dan 700 hanya bila dibutuhkan. Hindari uppercase panjang dan terlalu banyak weight tebal.

| Peran | Desktop | Mobile | Weight / line-height |
| --- | --- | --- | --- |
| Hero | 68–80 px | 38–46 px | 500–600 / 1,08–1,15 |
| H2 | 42–52 px | 30–36 px | 500 / 1,15–1,25 |
| H3 | 22–26 px | 20–24 px | 600 / 1,3 |
| Lead | 18–20 px | 17–18 px | 400 / 1,6 |
| Body | 16–18 px | 16–18 px | 400 / 1,6 |
| Navigation / button | 14–16 px | 15–16 px | 500–600 / 1,4 |
| Label / caption | 13–14 px | 13–14 px | 500 / 1,5 |

Baseline fluid:
- Hero: `clamp(2.375rem, 1.75rem + 3vw, 5rem)`.
- H2: `clamp(1.875rem, 1.35rem + 2vw, 3.25rem)`.
- Lead: `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)`.

Ukuran tabel adalah kisaran desain, bukan kewajiban memaksimalkan font. Verifikasi wrapping pada copy final. Headline maksimal sekitar 18–22 karakter per baris pada desktop; deskripsi maksimal 60–68 karakter per baris. Jangan menggunakan pemisah baris manual yang merusak mobile.

### 6.3 Layout dan spacing

- Container maksimum: **1200 px**.
- Gutter: 20 px mobile kecil; 24 px mobile/tablet; 32–48 px desktop.
- Grid desktop: 12 kolom; gap 24–32 px.
- Hero: ruang atas 56–80 px setelah header; jarak CTA ke visual 40–56 px.
- Section padding vertikal: 96–128 px desktop; 64–80 px tablet; 48–64 px mobile.
- Skala spacing: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128 px.
- Split umum: 5/7 atau 6/6 kolom sesuai isi; urutan DOM mengikuti urutan baca.
- Radius: tombol 12 px; kartu 16 px; visual besar 24 px; chip pill.
- Shadow: satu bayangan lembut untuk panel demo; mayoritas section tanpa shadow.
- Gunakan whitespace dan garis pembatas sebelum menambahkan kartu.
- Anchor memakai `scroll-margin-top` minimal tinggi header + 24 px.

### 6.4 Tombol dan states

| Jenis | Tampilan | Penggunaan |
| --- | --- | --- |
| Primary | Hijau tua, teks putih | Demo / aksi utama |
| Secondary | Putih/transparan, teks hijau tua, batas fungsional | Pilot |
| Text link | Teks hijau tua, underline atau affordance jelas | Navigasi/kebijakan |
| Disabled | Tetap terbaca, semantik disabled | Hanya kontrol yang memang tidak tersedia |

Tinggi minimum tombol utama 48 px. Area sentuh minimum proyek 44 × 44 px. Gap dua CTA minimal 12 px. Mobile boleh bertumpuk dan full-width; desktop inline.

States wajib: default, hover, focus-visible, active; disabled/loading hanya bila interaksi memerlukannya. Fokus: outline 2–3 px dan offset 3 px, terlihat pada background putih maupun hijau. Tidak mengubah ukuran layout saat hover.

### 6.5 Icons8

Keluarga: **Material Outlined**. Ukuran 20–24 px untuk UI, 32–40 px untuk kemampuan. Warna hijau konsisten; hindari campuran outline, 3D, emoji, dan ilustrasi multicolor.

Konsep aset: chat, kamera, mikrofon, dokumen, kalender, check, arrow, menu, close. Nama ini adalah kebutuhan pencarian aset, bukan konfirmasi bahwa file tertentu telah diunduh.

Aturan lisensi [R10–R11]:
- Lisensi gratis komersial Icons8 mensyaratkan atribusi yang sesuai; gunakan tautan terlihat di footer pada halaman yang memakai aset.
- PNG gratis memiliki batas ukuran menurut paket yang tersedia. SVG atau penghapusan atribusi harus mengikuti lisensi yang benar-benar dimiliki.
- Pilih warna melalui fasilitas resmi sesuai lisensi. Jangan menganggap perubahan path atau recoloring bebas selalu diizinkan.
- Catat URL sumber, keluarga, format, lisensi, tanggal pengambilan, dan teks atribusi dalam manifest aset.
- Logo AgriSense adalah aset merek sendiri; tidak memakai ikon stok sebagai pengganti identitas tanpa keputusan merek.

### 6.6 Fotografi dan aset

| Aset | Kebutuhan | Perlakuan |
| --- | --- | --- |
| Hero | Greenhouse melon dengan aktivitas nyata | Landscape, fokus tetap jelas pada mobile |
| Konteks | Detail tanaman atau kegiatan budidaya | Crop yang menunjukkan kegiatan |
| Tentang | Tim/pengelola di lapangan | Identitas dan izin jelas |
| Chat | Mockup HTML dengan teks nyata | Tidak dibakar menjadi satu gambar |
| Logo | File merek AgriSense | SVG berlisensi atau PNG resolusi memadai |
| OG | Komposisi judul, logo, visual pertanian | Target desain 1200 × 630 px |

Fotografi: cahaya alami, warna hijau wajar, manusia dalam konteks kerja. Hindari stock handshake, chip futuristik, gambar yang menyerupai hasil lapangan tetapi sebenarnya rekaan tanpa label.

Poster resolusi rendah tidak dijadikan hero besar. Minta file foto asli pada tahap pengadaan aset. Sampai tersedia, gunakan placeholder yang jelas di lingkungan pengembangan, lalu ganti sebelum publikasi.

## 7. Responsivitas

| Rentang | Tata letak |
| --- | --- |
| < 768 px | Satu kolom, menu mobile, CTA bertumpuk bila perlu, demo statis per tahap |
| 768–1023 px | Grid dua kolom bila isi cukup; demo tetap tanpa sticky panjang |
| ≥ 1024 px | Navigasi penuh, split editorial, sticky demo bila tinggi layar memadai |
| Layar pendek | Nonaktifkan sticky cerita bila tinggi panel tidak muat |

Breakpoint mengikuti kebutuhan isi. Untuk demo, baseline kondisi desktop adalah lebar ≥ 1024 px dan tinggi ≥ 700 px; ukur panel final dan gunakan fallback jika tidak muat.

Hero photo memakai crop responsif dengan titik fokus yang diatur per aset. Panel chat minimum font 16 px untuk pesan utama. Jangan mengecilkan mockup desktop demi muat di mobile.

Uji minimal 360, 390, 768, 1024, dan 1440 px; uji reflow 320 CSS px dan zoom 200%. Tidak ada scroll horizontal halaman.

## 8. Motion dan perilaku demo

### 8.1 Prioritas

1. Halaman statis lengkap dan bisa dipakai.
2. Reveal halus untuk beberapa elemen.
3. Storytelling sticky desktop.
4. Parallax sangat ringan hanya setelah performa dan aksesibilitas lolos.

Tidak ada scroll hijacking, forced snap, cursor khusus, WebGL wajib, autoplay audio, atau intro yang menunda konten.

### 8.2 Sticky storytelling

- Kolom kiri berisi empat langkah dalam urutan DOM biasa.
- Kolom kanan memakai CSS `position: sticky` dengan offset header.
- ScrollTrigger mendeteksi progres/tahap dan mengendalikan transisi panel demo.
- Gunakan **CSS sticky sebagai mekanisme utama**. Jangan sekaligus memberi GSAP pin pada panel yang sama.
- Satu tahap aktif mengikuti posisi bagian narasi di viewport. Tahap pertama/terakhir tetap jelas sebelum/sesudah wilayah trigger.
- Pesan baru muncul dengan opacity dan translate kecil; jangan mengubah tinggi section secara mendadak.
- Ukuran panel sudah dialokasikan untuk keadaan terpanjang.
- Pengunjung dapat membaca transcript lengkap melalui bagian semantik terpisah.

Jika memakai `scrub: true`, progres animasi mengikuti scroll langsung. Nilai numerik seperti `scrub: 1` memberi waktu mengejar posisi scroll, sehingga animasi dapat tetap bergerak sesaat setelah scroll berhenti. [R12] Pilih direct scrub untuk transisi pendek jika memang dibutuhkan; perubahan tahap diskret tidak wajib menggunakan scrub.

### 8.3 Aksesibilitas motion

- `prefers-reduced-motion: reduce`: hapus scrub, parallax, dan reveal; tampilkan semua informasi.
- Mobile/tablet: setiap tahap tampil dengan ilustrasi terkait secara normal; tidak ada pin.
- Tidak ada `aria-live` yang mengumumkan setiap tahap saat scroll.
- Mockup dekoratif yang menduplikasi transcript dapat memakai `aria-hidden="true"`; transcript yang dapat diakses tetap tersedia.
- Konten tidak dimulai permanen dengan opacity 0 sebelum JavaScript siap.
- No-JavaScript: seluruh langkah dan transcript masih terlihat, anchor masih bekerja.
- Menu tetap dapat diakses melalui navigasi fallback ketika JavaScript tidak tersedia.

### 8.4 Parameter awal

| Efek | Nilai awal |
| --- | --- |
| Reveal | 250–450 ms, translate 12–24 px, opacity |
| Hover tombol | 120–180 ms, perubahan warna |
| Transisi tahap | Opacity/transform, tanpa blur besar |
| Parallax opsional | Total perpindahan maksimal sekitar 16 px |
| 3D opsional | Kemiringan sangat kecil pada panel, bukan teks |

Nilai ini adalah keputusan desain, bukan ukuran yang diambil dari website Scale. Hindari animasi yang membuat pesan sulit dibaca.

GSAP memakai lifecycle dan cleanup yang benar: scope komponen melalui `useGSAP`, responsive conditions melalui `gsap.matchMedia`, revert saat unmount/perubahan mode. Perbarui pengukuran setelah aset/font memengaruhi layout, bukan pada setiap render. [R13]

## 9. Implementasi Next.js

### 9.1 Struktur yang disarankan

Struktur berikut merupakan rencana; file belum dibuat oleh dokumen ini.

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  landing/
    SiteHeader.tsx
    MobileNavigation.tsx
    HeroSection.tsx
    ContextSection.tsx
    WhatsAppStory.tsx
    StoryTranscript.tsx
    CapabilityGrid.tsx
    HowItWorks.tsx
    TrustSection.tsx
    PilotSection.tsx
    AboutSection.tsx
    FAQSection.tsx
    SiteFooter.tsx
    landing.module.css
content/
  landing.ts
  story.ts
lib/
  site-config.ts
public/
  brand/
  images/
  icons/
docs/
  asset-manifest.md
```

Gunakan versi stabil Next.js yang dipilih saat pembangunan dan commit lockfile. Dokumentasi API harus dicocokkan dengan versi terpasang; dokumen ini tidak menetapkan versi patch.

Default komponen adalah Server Components. `MobileNavigation` dan bagian motion `WhatsAppStory` menjadi Client Components. Jangan menambahkan `"use client"` pada seluruh halaman hanya untuk animasi. [R8]

CSS variables + CSS Modules menjadi baseline styling. Jika proyek yang ada memakai Tailwind, map token yang sama ke konfigurasi yang tersedia; jangan membangun dua sistem spacing/warna paralel.

### 9.2 Font

```tsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

// Terapkan montserrat.variable pada elemen html.
// CSS: font-family: var(--font-montserrat), Arial, sans-serif;
```

`next/font` mengoptimalkan dan menyajikan font dari aplikasi. Untuk build yang tidak dapat mengunduh font, simpan WOFF2 yang berlisensi dan gunakan `next/font/local`. Montserrat menggunakan SIL Open Font License; sertakan pemberitahuan lisensi untuk distribusi font sesuai ketentuannya. [R7]

### 9.3 Gambar dan ikon

- Gunakan `next/image` untuk foto raster dengan dimensi/aspect ratio yang diketahui.
- Set `sizes` berdasarkan lebar gambar pada layout; jangan otomatis memakai 100vw untuk inset kecil.
- Hero yang menjadi LCP dimuat lebih awal sesuai API versi terpasang. Pada Next.js 16, `priority` telah deprecated; pilih `loading="eager"` / `fetchPriority="high"` atau `preload` sesuai kebutuhan, tidak menumpuk pengaturan yang bertentangan. [R9]
- Gambar bawah fold menggunakan lazy loading.
- Sisakan tempat gambar untuk menghindari layout shift.
- Ikon kecil lokal tidak membutuhkan pipeline optimasi foto.
- Jangan mengaktifkan konfigurasi SVG berisiko hanya untuk menampilkan ikon lokal.
- Remote image host hanya didaftarkan bila digunakan dan diketahui.

### 9.4 Konfigurasi kontak dan status

`site-config.ts` menjadi sumber tunggal untuk:
- Nama produk, domain produksi, kontak resmi, URL WhatsApp.
- Status penerimaan pilot.
- Status fitur yang boleh dipublikasikan.
- Tautan privasi dan informasi legal.
- Kebutuhan atribusi Icons8.

URL WhatsApp hanya dibuat dari nomor bisnis yang disetujui, dengan pesan awal yang di-encode. Jangan memasukkan nomor dummy. Link demo selalu dapat mengarah ke anchor lokal.

Jika kontak belum dikonfigurasi, CTA hero **Diskusikan pilot** boleh menuju section pilot berisi status yang jujur; tombol kontak keluar tidak dirender. Pilot publik dengan ajakan menghubungi membutuhkan jalur kontak aktif.

Form pendaftaran bukan kebutuhan baseline. Jika kemudian ditambahkan, harus memiliki endpoint nyata, states sukses/gagal, label, validasi, dan kebijakan penggunaan data.

### 9.5 SEO

Judul awal: **AgriSense — Asisten Budidaya Melon melalui WhatsApp**

Deskripsi awal: **Konsultasikan kondisi tanaman dan catat aktivitas greenhouse melon melalui WhatsApp. Pelajari AgriSense dan alur pilotnya.**

Implementasikan metadata di Server Component, `lang="id"`, canonical dari domain produksi yang benar, dan OG image yang tersedia. Jangan menerbitkan canonical placeholder. Structured data hanya memuat identitas dan fakta yang dapat dibuktikan; tidak mengarang rating/review. [R14]

### 9.6 Pengukuran

Event opsional:
- `demo_cta_click`
- `pilot_section_click`
- `pilot_contact_click`
- `faq_open`

Pengukuran diperlukan untuk menilai alur, bukan mengumpulkan isi konsultasi. Jangan mengirim nomor telepon, foto, pesan suara, atau transcript pengguna melalui event analytics. Pemilihan penyedia dan penggunaan cookie mengikuti kebijakan data yang benar-benar diterapkan.

## 10. Aksesibilitas

Target desain: **WCAG 2.2 AA**, kemudian dibuktikan melalui pemeriksaan; bukan klaim sertifikasi. [R15]

- Satu H1; hierarki H2/H3 konsisten; landmark header/nav/main/footer.
- Skip link menuju konten utama.
- Navigasi dan CTA adalah link ketika berpindah lokasi; button untuk perubahan state.
- Normal text kontras minimal 4,5:1; large text minimal 3:1; elemen UI fungsional minimal 3:1.
- Area sentuh proyek minimal 44 × 44 px; ini keputusan desain yang melampaui minimum AA untuk target tertentu.
- Fokus terlihat dan tidak tertutup sticky header.
- Semua interaksi tersedia melalui keyboard; tidak ada hover-only content.
- Alt foto menggambarkan konteks yang terlihat; dekorasi memakai alt kosong.
- Ikon dekoratif tidak dibacakan ulang; tombol ikon mempunyai accessible name.
- Transcript suara/video tersedia bila media digunakan.
- Tidak memakai autoplay sound atau kedipan.
- Zoom dan reflow tidak menghilangkan informasi.
- Accordion menggunakan semantik dan focus states yang benar.
- Reduced motion dan fallback tanpa JavaScript harus diuji manual.

## 11. Performa

Target Core Web Vitals lapangan pada persentil ke-75:
- LCP ≤ 2,5 detik.
- INP ≤ 200 ms.
- CLS ≤ 0,1. [R16]

Target proyek awal, bukan hasil pengukuran:
- Hero mobile sekitar ≤ 250 KB; desktop sekitar ≤ 450 KB.
- Total gambar di initial viewport sekitar ≤ 600 KB.
- JavaScript awal terkompresi sekitar ≤ 150 KB.
- Font yang benar-benar dimuat sekitar ≤ 200 KB.

Jika budget terlampaui, evaluasi dampaknya pada perangkat/jaringan sasaran. Prioritas optimasi: gambar hero → ukuran font → batas Client Components → pemuatan motion.

Motion tidak menghalangi render headline atau CTA. GSAP dibatasi pada komponen cerita; pemuatan tertunda dapat dipakai setelah diukur. Tidak menambahkan library besar hanya untuk reveal sederhana.

Lighthouse membantu pengujian lab, tetapi tidak membuktikan Core Web Vitals lapangan atau seluruh aksesibilitas. Ukur pengalaman nyata setelah trafik tersedia.

## 12. Aturan kebenaran konten

| Materi | Boleh diterbitkan jika | Jika belum terbukti |
| --- | --- | --- |
| Chat/foto/suara | Alur benar-benar tersedia pada lingkungan yang ditawarkan | Tandai rencana atau hilangkan fungsi yang belum siap |
| Penyimpanan catatan | Draft, konfirmasi, dan hasil penyimpanan telah diuji | Demo berlabel ilustrasi |
| Akurasi / produktivitas | Metode, sampel, periode, dan hasil tersedia | Jangan menampilkan angka |
| Pelanggan / mitra | Penggunaan nyata dan izin penggunaan identitas | Hilangkan logo wall |
| Testimoni | Pernyataan autentik dan izin publikasi | Hilangkan testimonial |
| Foto lapangan | Hak penggunaan dan identitas subjek jelas | Placeholder hanya dalam development |
| Privasi | Kebijakan sesuai sistem dan proses nyata | Blokir peluncuran yang mengumpulkan data |
| Gratis / harga | Keputusan bisnis disetujui | Jangan menyatakan harga |
| Ketersediaan WhatsApp | Nomor, onboarding, dan operasi siap | CTA demo dan status pilot |

Lakukan verifikasi internal atas aturan platform WhatsApp yang berlaku untuk bentuk layanan AI ini sebelum aktivasi publik. Ini pekerjaan operasional prapeluncuran; tidak menjadi banner atau hambatan tambahan pada alur pengunjung.

## 13. Kriteria penerimaan

### Konten dan fungsi
- [ ] Headline menjelaskan melon/WhatsApp tanpa jargon.
- [ ] Demo, cara kerja, dan CTA memakai alur yang konsisten.
- [ ] Semua fungsi aktif sesuai produk yang tersedia.
- [ ] Mockup diberi label ilustrasi dan tidak menyerupai transaksi layanan nyata.
- [ ] Tidak ada angka, testimoni, logo, atau diagnosis rekaan.
- [ ] Semua link menuju tujuan nyata; tidak ada href kosong atau tombol mati.
- [ ] Kontak pilot berhasil diuji pada perangkat yang relevan.
- [ ] Kebijakan data, kontak, izin foto, dan atribusi telah tersedia.

### Visual dan responsif
- [ ] Montserrat benar-benar dimuat dan fallback tidak merusak layout.
- [ ] Token warna/spacing/radius konsisten.
- [ ] Ikon berasal dari satu keluarga dan lisensinya tercatat.
- [ ] Teks chat terbaca pada mobile.
- [ ] Crop foto mempertahankan objek penting.
- [ ] Tidak ada overflow pada viewport pengujian.
- [ ] Header sticky tidak menutup anchor atau fokus.

### Motion dan aksesibilitas
- [ ] Urutan baca sama dengan urutan visual.
- [ ] Keyboard dapat mengakses seluruh navigasi dan FAQ.
- [ ] Reduced motion menampilkan informasi lengkap.
- [ ] Tanpa JavaScript, manfaat, transcript, dan tujuan kontak tetap tersedia.
- [ ] Demo tidak memasang CSS sticky dan GSAP pin pada elemen yang sama.
- [ ] Animasi dibersihkan saat unmount dan perubahan breakpoint.
- [ ] Tidak ada pengumuman screen reader berulang karena scroll.
- [ ] Kontras dan ukuran target diuji pada states nyata.

### Teknis
- [ ] Typecheck, lint yang dikonfigurasi, dan production build berhasil.
- [ ] Gambar memiliki dimensi/sizes yang benar.
- [ ] Metadata, bahasa, canonical, dan OG memakai konfigurasi produksi.
- [ ] Tidak ada error console/hydration.
- [ ] Budget awal diperiksa pada production build.
- [ ] Interaksi diuji pada desktop dan mobile; hasil pengujian dicatat.
- [ ] Lighthouse dan pemeriksaan manual dipakai sesuai batasnya.

## 14. Urutan pengerjaan

1. **Verifikasi konten dan aset.** Status fitur, logo, foto asli, kontak pilot, lisensi ikon, kebijakan data.
2. **Bangun versi statis.** Token, struktur semantik, semua section, mobile layout, anchor, transcript.
3. **Tambahkan interaksi dasar.** Menu dan FAQ; uji keyboard serta fallback.
4. **Tambahkan cerita desktop.** Sticky panel, transisi tahap, reduced motion, cleanup.
5. **Optimasi dan pemeriksaan.** Gambar, font, metadata, production build, aksesibilitas, perangkat sasaran.
6. **Review prapeluncuran.** Kebenaran konten, alur kontak, izin aset, dan kesiapan operasi.

Landing page statis yang lengkap harus berfungsi sebelum motion ditambahkan. Penerbitan mengikuti keputusan peluncuran terpisah; dokumen ini tidak mengotorisasi deployment.

## 15. Keputusan yang perlu dilengkapi saat implementasi

| Kebutuhan | Dampak |
| --- | --- |
| File logo dan foto asli | Menentukan crop, alt, dan kualitas hero |
| Identitas pengembang yang dapat dipublikasikan | Melengkapi bagian tentang dan footer |
| Nomor/kanal pilot yang disetujui | Mengaktifkan CTA kontak |
| Fitur yang siap pada pilot | Menentukan copy kemampuan dan FAQ |
| Kebijakan data operasional | Melengkapi informasi penggunaan foto/suara/catatan |
| Paket lisensi Icons8 | Menentukan format, perubahan warna, dan atribusi |
| Domain produksi | Canonical, metadata, dan link resmi |

Kebutuhan ini tidak menghalangi penyusunan layout statis dengan placeholder berlabel. Namun, informasi terkait harus selesai sebelum publikasi fitur atau ajakan yang bergantung padanya.

## 16. Referensi

Diperiksa dalam riset 8 Oktober 2026. Halaman dan ketentuan dapat berubah; cocokkan dokumentasi dengan versi/paket yang digunakan. Bagian ukuran, copy, token, budget, dan arsitektur komponen di atas merupakan rekomendasi AgriSense.

| ID | Sumber primer | Digunakan untuk |
| --- | --- | --- |
| R1 | [Scale AI](https://scale.com/) · [Enterprise](https://scale.com/enterprise) | Struktur pesan, kegunaan, bukti, CTA |
| R2 | [Scale Brand](https://brand.scale.com/) | Arah identitas sebagai referensi |
| R3 | [Scale Typography](https://brand.scale.com/typography) | Hierarki tipografi, bukan pilihan font AgriSense |
| R4 | [Scale Color](https://brand.scale.com/color) | Warna terkendali dan basis netral |
| R5 | [Scale Imagery](https://brand.scale.com/imagery) | Manusia/sistem dalam konteks nyata |
| R6 | [Scale GenAI Platform Templates](https://docs.gp.scale.com/docs/templates) | Arti Empty Canvas |
| R7 | [Next.js Font](https://nextjs.org/docs/app/api-reference/components/font) · [Montserrat metadata](https://github.com/google/fonts/blob/main/ofl/montserrat/METADATA.pb) · [OFL](https://github.com/google/fonts/blob/main/ofl/montserrat/OFL.txt) | Optimasi font dan lisensi |
| R8 | [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) | Batas komponen interaktif |
| R9 | [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image) | Responsivitas dan pemuatan gambar |
| R10 | [Icons8 Material Outlined](https://icons8.com/icons/material-outlined--style-family-material) · [Icons8 License](https://icons8.com/license) | Keluarga ikon dan opsi penggunaan |
| R11 | [Icons8 usage guidance](https://intercom.help/icons8-7fb7577e8170/en/articles/4732904-how-and-where-can-i-use-your-icons) · [License agreement](https://intercom.help/icons8-7fb7577e8170/en/articles/5534926-universal-multimedia-license-agreement-for-icons8) | Atribusi dan ketentuan aset |
| R12 | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Sticky/scroll-linked animation dan scrub |
| R13 | [GSAP React](https://gsap.com/resources/React/) · [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/) | Lifecycle dan responsive motion |
| R14 | [Next.js Metadata and OG](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) | Metadata halaman |
| R15 | [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Target aksesibilitas |
| R16 | [Web.dev Web Vitals](https://web.dev/articles/vitals) | Ambang Core Web Vitals |

