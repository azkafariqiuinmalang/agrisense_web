"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BrandGlyph } from "@/components/landing/Logo";
import { Icon } from "@/components/landing/Icon";
import styles from "./landing.module.css";

const stages = [
  { side: "user", text: "Beberapa daun melon saya menguning. Saya kirim fotonya.", photo: true },
  { side: "bot", text: "Terima kasih. Foto belum cukup untuk memastikan penyebabnya. Berapa umur tanaman dan media tanamnya?" },
  { side: "user", text: "Melon 28 hari, di greenhouse dengan media tanah." },
  { side: "bot", text: "Mari amati pola bercak, kondisi media, dan sejak kapan gejala muncul. Hasil foto tetap perlu pemeriksaan lapangan." },
  { side: "user", text: "CATAT hari ini menyiram semua greenhouse" },
  { side: "bot", text: "Draft kegiatan: penyiraman semua greenhouse, hari ini. Balas YA untuk konfirmasi, UBAH untuk revisi, atau BATAL." },
  { side: "user", text: "YA" },
  { side: "bot", text: "Contoh catatan dikonfirmasi. Ini hanya simulasi: tidak ada data yang ditulis ke database." },
] as const;
const lastStep = stages.length - 1;

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function readMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
function readVisibility() { return document.visibilityState === "visible"; }

export function ChatSimulator() {
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, readMotion, () => false);
  const tabVisible = useSyncExternalStore(subscribeVisibility, readVisibility, () => true);
  const rootRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const running = inView && tabVisible && !paused && !focused && !reducedMotion;
  const visibleStep = reducedMotion ? lastStep : step;

  useEffect(() => {
    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting), { threshold: .12 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!running) return;
    const delay = step === lastStep ? 5500 : step === 5 ? 4200 : 3000;
    const timer = setTimeout(() => setStep(current => (current + 1) % stages.length), delay);
    return () => clearTimeout(timer);
  }, [running, step]);
  useEffect(() => {
    const panel = messagesRef.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, [visibleStep]);

  return <div ref={rootRef} className={styles.simulatorLayout}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className={styles.demoNarrative}>
      <span className={styles.eyebrow}>DEMO PERCAKAPAN OTOMATIS</span>
      <h2>Setiap catatan tetap<br className={styles.desktopBreak} /> dalam kendali Anda.</h2>
      <p>Percakapan yang akrab, dengan langkah yang jelas. Dari memahami kondisi daun sampai meninjau kegiatan sebelum dicatat.</p>
      <div className={styles.noteCard}><Icon name="confirmed" size={23} /><div>
        <h3>Anda yang memberi persetujuan.</h3>
        <p>Periksa ringkasan, lalu pilih <strong>YA</strong>, <strong>UBAH</strong>, atau <strong>BATAL</strong>. Model AI tidak menggantikan keputusan Anda.</p>
      </div></div>
      <div className={styles.autoStatus}>
        <span className={styles.statusDot} />
        <div><strong>{reducedMotion ? "Percakapan lengkap" : `Alur ${visibleStep + 1} dari ${stages.length}`}</strong>
          <small>{reducedMotion ? "Animasi mengikuti preferensi perangkat Anda" : paused || focused ? "Jeda untuk membaca" : "Berjalan otomatis · berulang saat terlihat"}</small>
        </div>
        <span className={styles.loopLabel}>↻ AUTO LOOP</span>
      </div>
      <div className={styles.loopTrack} aria-hidden="true"><span style={{ transform: `scaleX(${(visibleStep + 1) / stages.length})` }} /></div>
      {!reducedMotion && <label className={styles.pauseOption}><input type="checkbox" checked={paused} onChange={event => setPaused(event.target.checked)} />Hentikan animasi</label>}
      <p className={styles.demoDisclaimer}>Pesan contoh, bukan chat langsung. Konfirmasi YA pada demo juga hanya ilustrasi. Tidak menghubungi WhatsApp atau menyimpan data kebun.</p>
      <details className={styles.transcript}><summary>Baca seluruh percakapan</summary>
        <ol>{stages.map((message, index) => <li key={index}><strong>{message.side === "user" ? "Petani" : "AgriSense"}:</strong> {message.text}</li>)}</ol>
      </details>
    </div>
    <div className={styles.phoneArea}>
      <div className={styles.phone} aria-label="Contoh percakapan WhatsApp AgriSense">
        <div className={styles.phoneStatus}><span>09.41</span><span className={styles.island} /><span aria-label="Baterai penuh">▰</span></div>
        <div className={styles.chatHeader}><span aria-hidden="true">‹</span><span className={styles.chatAvatar}><BrandGlyph /></span><div><strong>AgriSense</strong><small>Contoh asisten kebun</small></div><Icon name="chat" size={20} /></div>
        <div className={styles.chatMessages} ref={messagesRef} tabIndex={0} aria-label="Riwayat demo otomatis, fokus untuk menjeda dan menggulir" aria-live="off">
          <span className={styles.chatDate}>Hari ini · Simulasi</span>
          <p className={styles.chatPrivacy}>Percakapan berikut adalah ilustrasi alur, bukan layanan WhatsApp aktif.</p>
          {stages.slice(0, visibleStep + 1).map((message, index) => <div key={index} className={`${styles.bubble} ${styles.animatedBubble} ${message.side === "user" ? styles.userBubble : styles.botBubble}`}>
            {"photo" in message && message.photo && <Image src="/images/demo-melon-leaf.jpg" alt="Foto contoh daun melon dengan bercak, bukan hasil diagnosis" width={240} height={154} sizes="260px" className={styles.chatPhoto} />}
            <p>{message.text}</p><small>{`09:${String(41 + index).padStart(2, "0")}`}<span aria-hidden="true">{message.side === "user" ? " ✓✓" : ""}</span></small>
          </div>)}
          {running && step < lastStep && <div className={styles.typing} aria-label="Melanjutkan contoh percakapan"><span /><span /><span /></div>}
        </div>
        <div className={styles.composer}><span>Pesan contoh, bukan input bebas</span><Icon name="microphone" size={20} /></div>
        <div className={styles.homeIndicator} />
      </div>
      <span className={styles.phoneCaption}>SIMULASI · BUKAN APLIKASI WHATSAPP ASLI</span>
    </div>
  </div>;
}
