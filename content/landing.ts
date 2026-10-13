import type { FeatureKey } from "@/lib/site-config";

/** Editorial copy for the landing page. Baseline: DESIGN.md §5. */

export const navLinks = [
  { href: "#produk", label: "Produk" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#pilot", label: "Pilot" },
  { href: "#tentang", label: "Tentang" },
] as const;

export const hero = {
  eyebrow: "Asisten budidaya melalui WhatsApp",
  title: "Budidaya melon, lebih terarah lewat WhatsApp.",
  description:
    "Konsultasikan kondisi tanaman dan catat aktivitas greenhouse melalui percakapan yang sudah akrab bagi Anda.",
  note: "Dirancang untuk budidaya melon di greenhouse bermedia tanah.",
  image: {
    src: "/images/greenhouse-melon-harvest.jpg",
    width: 1920,
    height: 1411,
    alt: "Seorang petani membungkuk memeriksa media tanam di bedengan greenhouse, dengan tanaman melon merambat ke atas dan buah melon tergantung dalam jaring.",
  },
  inset: {
    user: "Beberapa daun terlihat menguning. Saya kirim fotonya.",
    bot: "Bisa ceritakan sejak kapan gejalanya muncul dan bagian tanaman mana yang terdampak?",
  },
};

export const context = {
  id: "produk",
  eyebrow: "Konteks lapangan",
  title: "Banyak kegiatan di kebun. Catatan sering tertinggal.",
  body: "Penyiraman, pengamatan tanaman, dan pertanyaan harian terjadi di sela pekerjaan. AgriSense dirancang agar kegiatan tersebut bisa dibahas dan dicatat melalui WhatsApp.",
  points: [
    { icon: "chat", text: "Pertanyaan muncul saat berada di greenhouse." },
    { icon: "camera", text: "Foto membantu menjelaskan kondisi tanaman." },
    { icon: "calendar", text: "Aktivitas harian membutuhkan catatan yang mudah ditinjau." },
  ],
  image: {
    src: "/images/greenhouse-melon-tumpakkepuh-interior.jpg",
    width: 1200,
    height: 1600,
    alt: "Sisi greenhouse berdinding plastik dengan rangka bambu; di dalamnya tanaman melon tumbuh di tanah dan buah melon kuning terlihat di dekat permukaan.",
    caption: "Greenhouse melon di Desa Tumpakkepuh, Blitar.",
  },
} as const;

export const capabilities: {
  title: string;
  intro: string;
  items: { key: FeatureKey; icon: string; title: string; body: string }[];
  prototypeNote: string;
} = {
  title: "Bantuan yang mengikuti kegiatan di greenhouse.",
  intro: "Empat cara AgriSense mendampingi percakapan budidaya Anda.",
  items: [
    {
      key: "chat",
      icon: "chat",
      title: "Percakapan budidaya",
      body: "Bahas pertanyaan dengan konteks tanaman dan kebun Anda.",
    },
    {
      key: "photo",
      icon: "camera",
      title: "Foto kondisi tanaman",
      body: "Sertakan foto untuk membantu menjelaskan gejala yang terlihat.",
    },
    {
      key: "voice",
      icon: "microphone",
      title: "Pesan suara",
      body: "Ceritakan situasi melalui suara saat mengetik kurang praktis.",
    },
    {
      key: "activityLog",
      icon: "task",
      title: "Catatan kegiatan",
      body: "Periksa ringkasan aktivitas sebelum mengonfirmasi pencatatan.",
    },
  ],
  prototypeNote:
    "Kemampuan ini sedang diuji pada tahap prototipe. Ketersediaannya untuk pilot dikonfirmasi saat diskusi.",
};

export const howItWorks = {
  id: "cara-kerja",
  title: "Mulai dari kebun Anda.",
  steps: [
    {
      title: "Bagikan konteks.",
      body: "Kenalkan tanaman, greenhouse, dan media tanam.",
    },
    {
      title: "Mulai percakapan.",
      body: "Kirim pertanyaan, foto, atau pesan suara sesuai fitur yang tersedia.",
    },
    {
      title: "Periksa dan konfirmasi.",
      body: "Tinjau draft kegiatan sebelum catatan disimpan.",
    },
  ],
} as const;

export const trust = {
  id: "kendali",
  eyebrow: "Kepercayaan dan kendali",
  title: "Anda tetap memegang keputusan di kebun.",
  points: [
    {
      icon: "leaf",
      title: "Konteks membantu percakapan.",
      body: "Jawaban mempertimbangkan informasi kebun yang diberikan.",
    },
    {
      icon: "checked-checkbox",
      title: "Catatan melalui konfirmasi.",
      body: "Ringkasan aktivitas ditinjau sebelum disetujui.",
    },
    {
      icon: "inspection",
      title: "Pengamatan lapangan tetap penting.",
      body: "Respons AI mendukung pertimbangan; kondisi tanaman perlu diperiksa secara langsung.",
    },
  ],
} as const;

export const pilot = {
  id: "pilot",
  eyebrow: "Program pilot",
  title: "Uji AgriSense di greenhouse Anda.",
  body: "Kami ingin memahami kebutuhan pengelola greenhouse melon bermedia tanah melalui penggunaan awal yang terarah.",
  fitTitle: "Kecocokan awal",
  fit: [
    "Budidaya melon",
    "Greenhouse",
    "Media tanah",
    "Pengguna WhatsApp yang bersedia memberi umpan balik",
  ],
  closedStatus: {
    title: "Pendaftaran pilot belum dibuka melalui halaman ini.",
    body: "Kanal kontak resmi akan dicantumkan di sini setelah tersedia. Sementara itu, Anda dapat mempelajari alur penggunaan melalui demo.",
  },
} as const;

export const about = {
  id: "tentang",
  eyebrow: "Tentang",
  title: "Dikembangkan dengan perhatian pada kegiatan pertanian.",
  paragraphs: [
    "AgriSense berfokus pada satu lingkup awal: budidaya melon di greenhouse bermedia tanah. Lingkup yang sempit membantu percakapan tetap relevan dengan kegiatan yang benar-benar terjadi di kebun.",
    "WhatsApp dipilih karena sudah menjadi alat komunikasi sehari-hari bagi banyak petani dan pengelola greenhouse. Pengguna tidak perlu mempelajari aplikasi baru untuk mulai bertanya atau mencatat.",
  ],
  image: {
    src: "/images/greenhouse-melon-tumpakkepuh-exterior.jpg",
    width: 720,
    height: 1280,
    alt: "Greenhouse melon beratap plastik di tengah pepohonan bambu dan pisang pada siang hari.",
    caption: "Greenhouse melon di Kecamatan Bakung, Blitar.",
  },
} as const;

export const faq = {
  id: "faq",
  title: "Pertanyaan yang sering diajukan",
  items: [
    {
      q: "Untuk jenis kebun apa AgriSense dirancang?",
      a: "AgriSense dirancang untuk budidaya melon di greenhouse bermedia tanah. Lingkup awal ini dipilih agar percakapan dan catatan tetap relevan dengan kegiatan di kebun tersebut.",
    },
    {
      q: "Apakah saya membutuhkan aplikasi tambahan?",
      a: "AgriSense dirancang untuk digunakan melalui WhatsApp, sehingga tidak dirancang sebagai aplikasi terpisah. Detail cara memulai disampaikan saat pilot dibuka.",
    },
    {
      q: "Apa yang bisa dikirim melalui WhatsApp?",
      a: "Prototipe AgriSense dirancang untuk menerima pesan teks, foto kondisi tanaman, dan pesan suara. Fitur yang tersedia untuk pilot dikonfirmasi saat diskusi.",
    },
    {
      q: "Bagaimana aktivitas dicatat?",
      a: "Anda menyampaikan kegiatan melalui percakapan. AgriSense menampilkan ringkasan draft untuk diperiksa, dan catatan disimpan hanya setelah Anda mengonfirmasinya.",
    },
    {
      q: "Apakah respons AI menggantikan pemeriksaan tanaman?",
      a: "Tidak. Respons AI membantu pertimbangan, tetapi kondisi tanaman tetap perlu diperiksa secara langsung di lapangan.",
    },
    {
      q: "Bagaimana saya mengikuti pilot?",
      a: "Lihat bagian Pilot di halaman ini untuk status terbaru. Kanal kontak resmi akan dicantumkan di sana ketika pendaftaran dibuka.",
      link: { href: "#pilot", label: "Lihat status pilot" },
    },
    {
      q: "Bagaimana foto, suara, dan catatan saya digunakan?",
      a: "Kebijakan penggunaan data sedang disusun dan akan dipublikasikan sebelum layanan menerima data pengguna. Kebijakan tersebut akan menjelaskan penggunaan foto, suara, dan catatan, termasuk penyimpanan dan cara meminta penghapusan.",
    },
  ],
} satisfies {
  id: string;
  title: string;
  items: { q: string; a: string; link?: { href: string; label: string } }[];
};

export const closing = {
  title: "Mulai dari satu percakapan tentang kebun Anda.",
};

export const footer = {
  description: "Asisten budidaya melon melalui WhatsApp untuk greenhouse bermedia tanah.",
};
