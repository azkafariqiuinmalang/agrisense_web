# Aset desain Google

Diperbarui 13 Oktober 2026. AgriSense memakai Google Sans dan Material Symbols Rounded sebagai aset lokal. Styling dibuat khusus dalam React/Tailwind/CSS dan terinspirasi Material 3/Expressive.

Ini bukan implementasi MUI atau `@material/web`, dan bukan bukti afiliasi/sertifikasi Google. Pengunjung tidak perlu meminta font/ikon ke layanan Google; tautan di bawah merupakan provenance unduhan.

## Google Sans

| Properti        | Catatan implementasi                                          |
| --------------- | ------------------------------------------------------------- |
| Berkas          | `public/fonts/google-sans-latin-variable.woff2`               |
| Varian          | Normal, variable weight 400–700, Latin                        |
| Ukuran tercatat | 35.968 byte                                                   |
| Loader          | `next/font/local`, `weight: "400 700"`, `display: "swap"`     |
| Lisensi         | SIL Open Font License 1.1, disimpan di `public/fonts/OFL.txt` |

Sumber CSS: [Google Fonts CSS](https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&display=swap).

Sumber file exact: [Google Sans WOFF2 v71](https://fonts.gstatic.com/s/googlesans/v71/4UasrENHsxJlGDuGo1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6cAwhX9RPjIUvQ.woff2).

Upstream: [googlefonts/googlesans](https://github.com/googlefonts/googlesans). Sumber lisensi: [OFL.txt](https://raw.githubusercontent.com/googlefonts/googlesans/main/OFL.txt).

Pada pengadaan aset, signature biner `wOF2` diperiksa. Source/font lokal membuat build terbaru tidak bergantung pada unduhan font eksternal. Latin subset bukan klaim dukungan semua aksara; karakter di luar subset mengikuti fallback browser.

## Material Symbols Rounded

SVG sumber disimpan di `public/material-symbols/`. Path diembed di `components/landing/Icon.tsx`, memakai coordinate system asli dan `currentColor`. Komponen icon tidak memerlukan icon font atau library icon client.

Pola sumber:

```text
https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/{symbol}/materialsymbolsrounded/{symbol}_24px.svg
```

| Nama API komponen     | Symbol sumber   |
| --------------------- | --------------- |
| chat                  | chat_bubble     |
| camera                | photo_camera    |
| microphone            | mic             |
| task                  | task_alt        |
| leaf                  | eco             |
| inspection            | fact_check      |
| confirmed             | check_box       |
| calendar              | calendar_month  |
| check                 | check           |
| chevron               | expand_more     |
| arrow / arrow-inverse | arrow_forward   |
| menu                  | menu            |
| close                 | close           |
| info                  | info            |
| sparkle               | auto_awesome    |
| sun                   | sunny           |
| water                 | water_drop      |
| soil                  | grass           |
| greenhouse            | home_and_garden |

Ada 19 file SVG sumber dan 20 nama API, karena dua nama arrow memakai sumber yang sama. Tidak setiap ikon dipakai pada setiap section; hero terbaru hanya memakai panah CTA. Glyph brand dan sebagian status/icon frame demo digambar terpisah.

Upstream: [google/material-design-icons](https://github.com/google/material-design-icons). Lisensi: Apache 2.0 di `public/material-symbols/LICENSE`; sumber [LICENSE](https://raw.githubusercontent.com/google/material-design-icons/master/LICENSE).

Pada pengadaan aset, setiap file diparse sebagai SVG dan diperiksa path-nya sebelum komponen dihasilkan. Lisensi lokal disertakan; tautan upstream dicatat sebagai provenance, bukan klaim bahwa konten remote diperiksa ulang pada setiap pembaruan dokumentasi.

## Palet warna

`scripts/generate-material-theme.mjs` memakai `@material/material-color-utilities@0.3.0` untuk menghasilkan `app/material-tokens.css`.

Seed: hijau `#23864e`, biru `#4285f4`, kuning `#fbbc04`, coral `#ea6652`, ungu `#9273cc`. Tone: 10, 30, 40, 80, 90, 95, 98. Generator dijalankan dengan `npm run design:tokens`.

Utility ini dependency development, bukan bundle browser. 0.4.0 pernah gagal pada Node lokal akibat import ESM tanpa ekstensi; versi 0.3.0 dipilih untuk generator saat ini. Token HCT tidak menjamin seluruh kombinasi UI memenuhi kontras aksesibilitas.

[Manifest aset](asset-manifest.md), [desain](../DESIGN.md), dan [validasi](redesign-validation.md) mencatat penggunaan dan batasnya.
