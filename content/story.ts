/** WhatsApp demo storyline. Baseline: DESIGN.md §5.4. Illustrative only. */

export type StoryMessage = {
  from: "user" | "agrisense";
  text: string;
  /** Optional attachment chip shown inside the bubble (illustration only). */
  attachment?: "photo";
};

export type StoryStage = {
  title: string;
  body: string;
  messages: StoryMessage[];
};

export type Story = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  label: string;
  transcriptSummary: string;
  stages: StoryStage[];
};

export const story: Story = {
  id: "demo",
  eyebrow: "Demo",
  title: "Dari percakapan menjadi catatan budidaya.",
  intro:
    "Lihat contoh bagaimana konteks kebun dikumpulkan, pertanyaan dibahas, dan aktivitas diperiksa sebelum dicatat.",
  label: "Contoh alur — ilustrasi, bukan percakapan layanan langsung.",
  transcriptSummary: "Baca contoh percakapan lengkap",
  stages: [
    {
      title: "Kenalkan konteks kebun.",
      body: "Jenis tanaman, greenhouse, dan media tanam memberi konteks awal.",
      messages: [
        { from: "user", text: "Saya menanam melon di Greenhouse A, menggunakan media tanah." },
        { from: "agrisense", text: "Baik. Konteks kebun: melon, Greenhouse A, media tanah." },
      ],
    },
    {
      title: "Ceritakan kondisi tanaman.",
      body: "Teks, foto, atau pesan suara menjadi bahan percakapan.",
      messages: [
        {
          from: "user",
          text: "Beberapa daun terlihat menguning. Saya kirim fotonya.",
          attachment: "photo",
        },
        {
          from: "agrisense",
          text: "Bisa ceritakan sejak kapan gejalanya muncul dan bagian tanaman mana yang terdampak?",
        },
      ],
    },
    {
      title: "Periksa ringkasan kegiatan.",
      body: "AgriSense menampilkan draft aktivitas untuk diperiksa.",
      messages: [
        { from: "user", text: "CATAT penyiraman hari ini di Greenhouse A." },
        {
          from: "agrisense",
          text: "Periksa catatan berikut: kegiatan penyiraman, Greenhouse A, tanggal hari ini. Apakah sudah sesuai?",
        },
      ],
    },
    {
      title: "Konfirmasikan pencatatan.",
      body: "Pengguna menyetujui draft sebelum penyimpanan.",
      messages: [
        { from: "user", text: "YA" },
        { from: "agrisense", text: "Catatan penyiraman disimpan." },
      ],
    },
  ],
};

export const speakerLabel: Record<StoryMessage["from"], string> = {
  user: "Pengguna",
  agrisense: "AgriSense",
};
