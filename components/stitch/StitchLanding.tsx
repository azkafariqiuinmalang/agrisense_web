import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { LeafGlyph } from "@/components/landing/Logo";
import { Icon, type IconName } from "@/components/landing/Icon";
import { siteConfig, getPilotWhatsAppUrl } from "@/lib/site-config";
import { StitchHeader } from "./StitchHeader";
import { ChatSimulator } from "./ChatSimulator";
import { LandingMotion } from "./LandingMotion";
import styles from "./landing.module.css";

const jakarta=localFont({src:"../../public/fonts/plus-jakarta-variable.woff2",weight:"400 800",display:"swap",variable:"--font-jakarta"});
const steps:{icon:IconName;title:string;text:string}[]=[
 {icon:"chat",title:"Mulai chat",text:"Bagikan konteks kebun dan ceritakan apa yang Anda temukan di lapangan."},
 {icon:"inspection",title:"Catat kebun",text:"Tinjau ringkasan kegiatan. Catatan disimpan setelah Anda mengonfirmasi."},
 {icon:"soil",title:"Dapatkan insight",text:"Baca informasi tanaman, riwayat kegiatan, dan ringkasan melalui dashboard."},
];
const knowledge:{icon:IconName;title:string;text:string}[]=[
 {icon:"calendar",title:"Konteks yang tersedia",text:"Informasi kebun, media, dan umur tanaman membantu pertanyaan menjadi lebih terarah."},
 {icon:"leaf",title:"Observasi, bukan kepastian",text:"Gejala dari foto adalah awal pemeriksaan. Kemungkinan penyebab tetap perlu diverifikasi."},
 {icon:"info",title:"Sumber & batasan",text:"Panduan tervalidasi diprioritaskan. Ketika bukti tidak cukup, jawaban tidak seharusnya dipaksakan."},
];
const trust:{icon:IconName;title:string;text:string}[]=[
 {icon:"greenhouse",title:"Data milik Anda",text:"Dashboard memakai identitas petani yang login. Data kebun lain tidak ikut ditampilkan."},
 {icon:"confirmed",title:"Konfirmasi eksplisit",text:"Draft kegiatan dan pengeluaran menunggu keputusan pemilik: YA, UBAH, atau BATAL."},
 {icon:"info",title:"Batasan KUR",text:"Permohonan hanya untuk review internal. Bukan persetujuan kredit atau pengiriman ke bank."},
];
const faqs=[
 ["Apakah harus memasang aplikasi baru?","Percakapan dirancang melalui WhatsApp yang sudah Anda gunakan. Dashboard dibuka melalui browser, tanpa aplikasi tambahan."],
 ["Bagaimana cara masuk ke dashboard?","Kirim LOGIN ke WhatsApp AgriSense yang terhubung. Masukkan nomor dan kode sekali pakai di halaman login. Kode berlaku 5 menit dan hanya bisa digunakan sekali."],
 ["Apakah foto tanaman menghasilkan diagnosis pasti?","Tidak. Foto membantu memahami gejala, tetapi pemeriksaan lapangan dan penilaian agronomis tetap dibutuhkan. Jangan menentukan dosis atau tindakan berisiko dari dugaan saja."],
 ["Apakah data langsung tersimpan saat saya mengirim pesan?","Pencatatan kegiatan dan finansial melewati ringkasan draft dan konfirmasi. Mengirim pertanyaan tidak otomatis memberi model izin menyimpan transaksi."],
 ["Apakah AgriSense menyetujui pengajuan KUR?","Tidak. Alur yang tersedia sebatas pencatatan permohonan untuk review internal. Tidak ada jaminan kelayakan, persetujuan kredit, atau pengajuan ke bank."],
 ["Apakah semua fitur di halaman ini sudah tersedia?","Produk masih dalam pengembangan dan pengujian. Simulator memakai pesan contoh, dashboard lokal memakai database uji, dan layanan WhatsApp nyata perlu konfigurasi serta verifikasi kanal sebelum digunakan."],
];
function WhatsAppAction({url,className,label="Mulai via WhatsApp"}:{url:string|null;className?:string;label?:string}){
 return url?<a href={url} rel="noopener noreferrer" target="_blank" className={className}><Icon name="chat" size={20}/>{label}</a>
  :<a href="#demo" className={className}><Icon name="chat" size={20}/>Coba simulasi WhatsApp</a>;
}
export function StitchLanding(){
 const whatsappUrl=getPilotWhatsAppUrl();
 return <LandingMotion className={`${styles.landing} ${jakarta.variable}`}>
  <StitchHeader whatsappUrl={whatsappUrl}/>
  <main id="main">
   <section id="beranda" className={styles.hero}>
    <Image src="/images/stitch-hero.jpg" alt="Ilustrasi petani memeriksa ponsel di greenhouse, dari desain Stitch" fill preload sizes="100vw" className={styles.heroImage}/>
    <div className={styles.heroShade}/>
    <div className={`${styles.container} ${styles.heroContent}`}>
     <span className={styles.heroEyebrow}><span/> WHATSAPP UNTUK KEBUN ANDA</span>
     <h1>Kelola kebun lebih mudah,<br/> cukup lewat <span>WhatsApp.</span></h1>
     <p>Catat kegiatan, pahami kondisi tanaman, dan lihat informasi kebun melalui percakapan yang sudah akrab bagi Anda.</p>
     <div className={styles.heroActions}><WhatsAppAction url={whatsappUrl} className={styles.primaryButton}/><a href="#cara-kerja" className={styles.glassButton}>Lihat cara kerja <span aria-hidden="true">↓</span></a></div>
     <div className={styles.heroChecks}><span><Icon name="confirmed" size={18}/>Tanpa aplikasi tambahan</span><span><Icon name="leaf" size={18}/>Keputusan tetap di tangan Anda</span></div>
     <span className={styles.heroFootnote}>PENGEMBANGAN & UJI LOKAL · BUKAN LAYANAN PUBLIK AKTIF</span>
    </div>
    <svg className={styles.wave} viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 44C180 114 350 6 535 51S820 99 1050 55s285-4 390 14V100H0Z" fill="currentColor"/></svg>
   </section>
   <section id="tentang" className={styles.about}>
    <div className={`${styles.container} ${styles.aboutGrid}`}>
     <div className={styles.aboutText}><span className={styles.eyebrow}><Icon name="leaf" size={16}/> MENGENAL AGRISENSE</span>
      <h2>Satu percakapan{" "}<br/>untuk memahami{" "}<br/>kebun Anda.</h2><p>Teknologi yang mengikuti ritme bertani. Lebih dekat dengan kegiatan harian, lebih mudah meninjau apa yang sudah dilakukan.</p>
      <div className={styles.whatsappCard}><span><Icon name="chat" size={23}/></span><div><strong>WhatsApp-first</strong><small>Percakapan di kebun. Ringkasan di web.</small></div></div>
      <Link href="/login" className={styles.goldButton}>Lihat dashboard petani <span aria-hidden="true">↗</span></Link>
     </div>
     <div className={styles.melonVisual}><span className={styles.melonTag}><Icon name="leaf" size={16}/> Kebun melon Anda</span><Image src="/images/stitch-melon.png" alt="Ilustrasi dua tangan memegang buah melon" width={900} height={890} sizes="(max-width: 800px) 90vw, 440px"/></div>
     <aside className={styles.aboutAside}><span className={styles.roundIcon}><Icon name="leaf" size={24}/></span><span className={styles.smallLabel}>TEMAN BERTANI DIGITAL</span><p>Membantu mencatat kegiatan, meninjau informasi, dan mengajukan pertanyaan dengan konteks yang lebih jelas.</p><a href="#demo" className={styles.miniPreview}><Image src="/images/demo-melon-leaf.jpg" alt="" width={70} height={52}/><span>Lihat contoh percakapan <span aria-hidden="true">→</span></span></a></aside>
    </div>
   </section>
   <section id="manfaat" className={`${styles.section} ${styles.mintSection}`}><div className={styles.container}>
    <div className={styles.sectionHeading}><span className={styles.eyebrow}>DARI PERCAKAPAN KE CATATAN</span><h2>Mulai AgriSense dalam 3 langkah.</h2><p>Alur sederhana untuk memahami, mencatat, dan meninjau kegiatan kebun.</p></div>
    <div className={styles.stepGrid}>{steps.map((step,i)=><article key={step.title} className={styles.stepCard}><span className={styles.stepNumber}>0{i+1}</span><div className={styles.stepIllustration}><Icon name={step.icon} size={48}/><span className={styles.illustrationLeaf}><Icon name="leaf" size={22}/></span></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
   </div></section>
   <section id="cara-kerja" className={`${styles.section} ${styles.whiteSection}`}><div id="demo" className={styles.container}><ChatSimulator/></div></section>
   <section className={`${styles.section} ${styles.softSection}`}><div className={styles.container}>
    <div className={styles.sectionHeading}><span className={styles.eyebrow}>AI & TRANSPARANSI</span><h2>Informasi yang jelas,<br/>termasuk saat jawabannya belum pasti.</h2><p>Asisten untuk membantu berpikir, bukan menggantikan pengamatan dan keputusan di lapangan.</p></div>
    <div className={styles.cardGrid}>{knowledge.map(k=><article className={styles.infoCard} key={k.title}><span className={styles.iconTile}><Icon name={k.icon} size={25}/></span><h3>{k.title}</h3><p>{k.text}</p></article>)}</div>
    <div className={styles.evidenceStrip}><Icon name="info" size={23}/><p>Panduan pendamping budidaya, <strong>bukan diagnosis pasti.</strong></p><span>Pengetahuan melon · dalam pengembangan</span></div>
   </div></section>
   <section id="kepercayaan" className={`${styles.section} ${styles.whiteSection}`}><div className={`${styles.container} ${styles.trustGrid}`}>
    <div><span className={styles.eyebrow}>KEAMANAN & KENDALI</span><h2>Kepercayaan Anda{" "}<br/>dimulai dari{" "}<br/>kendali yang jelas.</h2><p>Siapa yang boleh melihat data, kapan catatan disimpan, dan sejauh mana informasi dapat digunakan—semuanya harus jelas.</p><div className={styles.trustNote}><Icon name="confirmed" size={22}/><span>Login dengan nomor WhatsApp dan kode sekali pakai. Bukan nomor saja.</span></div></div>
    <div className={styles.trustCards}>{trust.map(k=><article className={styles.infoCard} key={k.title}><span className={styles.iconTile}><Icon name={k.icon} size={23}/></span><h3>{k.title}</h3><p>{k.text}</p></article>)}</div>
   </div></section>
   <section id="faq" className={`${styles.section} ${styles.softSection}`}><div className={styles.faqContainer}>
    <div className={styles.sectionHeading}><span className={styles.eyebrow}>PERTANYAAN UMUM</span><h2>Yang ingin Anda ketahui.</h2><p>Tentang cara kerja, akses data, dan batas layanan AgriSense.</p></div>
    <div className={styles.faqList}>{faqs.map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div>
   </div></section>
   <section className={`${styles.section} ${styles.whiteSection}`}><div className={styles.container}><div className={styles.closing}>
    <span className={styles.darkEyebrow}>SATU KEBUN. SATU PERCAKAPAN.</span><h2>Mulai kelola kebun dengan{" "}<br/>cara yang lebih sederhana.</h2><p>Kenali alurnya lewat simulasi, atau masuk untuk meninjau data kebun Anda di dashboard petani.</p>
    <div className={styles.heroActions}><WhatsAppAction url={whatsappUrl} className={styles.primaryButton}/><Link href="/login" className={styles.textButton}>Masuk dashboard <span aria-hidden="true">↗</span></Link></div><small>{whatsappUrl?"Ketersediaan layanan mengikuti konfigurasi dan tahap pilot.":"Nomor WhatsApp publik belum dikonfigurasi. Simulator tidak mengirim pesan."}</small><div className={styles.closingLeaf} aria-hidden="true"><LeafGlyph/></div>
   </div></div></section>
  </main>
  <footer className={styles.footer}><div className={styles.container}><div className={styles.footerGrid}>
   <div><Link href="/" className={styles.brand}><span className={styles.brandMark}><LeafGlyph/></span><span>AgriSense</span></Link><p>Teman bertani digital. Menghubungkan percakapan harian dengan catatan kebun yang lebih terarah.</p><span className={styles.footerStatus}><span/>Pengembangan & uji lokal</span></div>
   <nav aria-label="Navigasi footer"><h3>Jelajahi AgriSense</h3><a href="#tentang">Tentang AgriSense</a><a href="#manfaat">Manfaat platform</a><a href="#cara-kerja">Cara kerja & simulasi</a><a href="#faq">Pertanyaan umum</a><Link href="/login">Dashboard petani ↗</Link></nav>
   <div><h3>Transparansi layanan</h3><div className={styles.footerNote}><Icon name="confirmed" size={20}/><div><strong>Data sesuai identitas</strong><p>Dashboard hanya menampilkan data pemilik yang login.</p></div></div><div className={styles.footerNote}><Icon name="info" size={20}/><div><strong>Pendamping, bukan diagnosis</strong><p>Informasi tanaman tetap membutuhkan verifikasi kondisi lapangan.</p></div></div></div>
  </div><div className={styles.footerBottom}><span>© {siteConfig.copyrightYear} AgriSense.</span><span>Ilustrasi visual dari desain Stitch pengguna.</span>{siteConfig.legal.privacyPolicyUrl&&<a href={siteConfig.legal.privacyPolicyUrl}>Kebijakan privasi</a>}</div>
   <details className={styles.photoCredits}><summary>Sumber foto contoh & aset</summary><p>Hero dan ilustrasi melon diadaptasi dari screen Stitch yang dipilih; bukan bukti pelanggan atau hasil pilot.</p><p>Foto daun pada simulator: {siteConfig.attribution.photos[0].author}. <a href={siteConfig.attribution.photos[0].sourceUrl} target="_blank" rel="noopener noreferrer">Sumber foto</a> · <a href={siteConfig.attribution.photos[0].licenseUrl} target="_blank" rel="noopener noreferrer">{siteConfig.attribution.photos[0].license}</a>. Thumbnail diperkecil/dipotong.</p></details>
  </div></footer>
 </LandingMotion>;
}
