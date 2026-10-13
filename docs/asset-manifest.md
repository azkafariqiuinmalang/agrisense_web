# Manifest aset AgriSense

Diperbarui 13 Oktober 2026. Manifest ini membedakan aset yang dirender, aset lokal pendukung, dan arsip yang masih tersedia di repo.

## Foto yang dirender

Keempat foto tercatat di `lib/site-config.ts`. Footer merender pembuat, tautan sumber, lisensi, dan keterangan perubahan.

| Berkas                                                    | Penggunaan                      | Pembuat                                                                   | Sumber dan lisensi                                                                                                                                                           |
| --------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/images/greenhouse-melon-harvest.jpg`              | Foto hero                       | Emmanuel Ssekaggo                                                         | [Commons](https://commons.wikimedia.org/wiki/File:A_man_showing_melons_grown_in_their_green_house_farm.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |
| `public/images/greenhouse-melon-tumpakkepuh-interior.jpg` | Konteks greenhouse              | Pancoffee                                                                 | [Commons](https://commons.wikimedia.org/wiki/File:Greenhouse_Melon_Desa_Tumpakkepuh.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)                          |
| `public/images/greenhouse-melon-tumpakkepuh-exterior.jpg` | Section tentang                 | Ayamayam123                                                               | [Commons](https://commons.wikimedia.org/wiki/File:Greenhouse_Melon_di_Desa_Tumpakkepuh.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)                       |
| `public/images/demo-melon-leaf.jpg`                       | Lampiran contoh dan dialog foto | Clemson University - USDA Cooperative Extension Slide Series, Bugwood.org | [Commons](<https://commons.wikimedia.org/wiki/File:Alternaria_leaf_blight_(Alternaria_cucumerina)_1436121.jpg>), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)   |

Keterangan perubahan pada config: harvest diperkecil/dipotong; interior dan exterior dipotong; foto daun menggunakan rendition thumbnail sumber dan preview yang dipotong secara visual. Foto daun disimpan tanpa retouch/crop lokal; rincian ada di [provenance foto](demo-photo-source.md). Pernyataan crop pada tampilan tidak berarti file asli lokal selalu telah diedit dengan crop.

Foto mendukung konteks editorial. Tidak ada bukti bahwa subjeknya merupakan pelanggan, kebun pilot, hasil AgriSense, atau pendukung resmi proyek.

## Font dan ikon aktif

| Aset                            | Lokasi/implementasi                                                               | Lisensi                                                  |
| ------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Google Sans variable Latin      | `public/fonts/google-sans-latin-variable.woff2`, dimuat melalui `next/font/local` | SIL OFL 1.1, `public/fonts/OFL.txt`                      |
| Material Symbols Rounded        | Path inline `components/landing/Icon.tsx`; SVG sumber `public/material-symbols/`  | Apache-2.0, `public/material-symbols/LICENSE`            |
| Glyph logo AgriSense            | SVG pada komponen brand                                                           | Glyph proyek; bukan logo Google/WhatsApp                 |
| Frame/status bar/chat wallpaper | CSS/SVG lokal, termasuk `public/images/demo-chat-wallpaper.svg`                   | Dibuat dalam proyek; bukan aset frame Apple yang diunduh |

Sumber unduhan font/ikon dan mapping nama ada di [aset Google](google-assets.md). Tidak ada icon font penuh atau request Google Fonts pada runtime. Logo/aset Google tidak menyatakan afiliasi proyek.

## Arsip Icons8 versi awal

PNG berikut masih tersimpan di `public/icons/`, tetapi tidak lagi dirender oleh UI saat ini. Warna sumber: hijau `176B3A`, teks `123524`, putih `FFFFFF`, muted `4B6357`. Keluarga tercatat: Icons8 Material Outlined.

| Berkas                                           | Sumber tercatat                                                                    |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `chat-176b3a-48.png`, `chat-176b3a-96.png`       | [chat](https://icons8.com/icon/set/chat/material-outlined)                         |
| `camera-176b3a-48.png`, `camera-176b3a-96.png`   | [camera](https://icons8.com/icon/set/camera/material-outlined)                     |
| `microphone-176b3a-96.png`                       | [microphone](https://icons8.com/icon/set/microphone/material-outlined)             |
| `task-176b3a-96.png`                             | [task](https://icons8.com/icon/set/task/material-outlined)                         |
| `leaf-176b3a-96.png`                             | [leaf](https://icons8.com/icon/set/leaf/material-outlined)                         |
| `inspection-176b3a-96.png`                       | [inspection](https://icons8.com/icon/set/inspection/material-outlined)             |
| `checked-checkbox-176b3a-96.png`                 | [checked-checkbox](https://icons8.com/icon/set/checked-checkbox/material-outlined) |
| `calendar-176b3a-48.png`                         | [calendar](https://icons8.com/icon/set/calendar/material-outlined)                 |
| `menu-123524-48.png`                             | [menu](https://icons8.com/icon/set/menu/material-outlined)                         |
| `multiply-123524-48.png`                         | [multiply](https://icons8.com/icon/set/multiply/material-outlined)                 |
| `forward-ffffff-48.png`, `forward-176b3a-48.png` | [forward](https://icons8.com/icon/set/forward/material-outlined)                   |
| `expand-arrow-176b3a-48.png`                     | [expand-arrow](https://icons8.com/icon/set/expand-arrow/material-outlined)         |
| `checkmark-176b3a-48.png`                        | [checkmark](https://icons8.com/icon/set/checkmark/material-outlined)               |
| `info-4b6357-48.png`                             | [info](https://icons8.com/icon/set/info/material-outlined)                         |

Catatan implementasi awal menyebut penggunaan dengan atribusi “Ikon oleh Icons8” yang menaut ke [Icons8](https://icons8.com). UI saat ini menonaktifkan atribusi Icons8 karena ikon tidak dirender. Lisensi aset arsip tidak diverifikasi ulang dari situs penerbit pada pembaruan dokumentasi ini. Jika dipakai kembali, periksa ketentuan penggunaan/atribusi yang berlaku; penyimpanan arsip tidak mengubah ketentuan penerbit.

## Screenshot dan aset starter

- `docs/previews/`: bukti visual dokumentasi, dengan status milestone di [validasi](redesign-validation.md).
- `docs/evidence/`: hasil JSON smoke checks, bukan data pengguna atau CI.
- `public/screenshot-*.png`: 13 screenshot lama masih tersimpan dan dapat disajikan sebagai aset publik; bukan preview terbaru.
- `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, dan favicon awal masih ada. Provenance starter tidak ditulis ulang sebagai aset buatan AgriSense.

Tidak ada penghapusan aset pada pembaruan dokumentasi. Review arsip public dan pemilihan favicon merupakan backlog sebelum rilis. Proyek belum memiliki berkas lisensi tingkat repo untuk kode sendiri; lisensi foto/font/ikon berlaku pada aset masing-masing.
