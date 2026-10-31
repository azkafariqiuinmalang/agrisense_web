"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Bot,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  Info
} from "lucide-react";
import styles from "./startup.module.css";

interface Stage {
  side: "user" | "bot";
  text: string;
  photo?: boolean;
}

const stages: Stage[] = [
  { side: "user", text: "Beberapa daun melon saya menguning dan ada bercak. Ini fotonya.", photo: true },
  { side: "bot", text: "Terima kasih atas fotonya. Foto merupakan observasi awal. Berapa umur tanaman (HST) dan jenis media tanam yang digunakan?" },
  { side: "user", text: "Umur 28 HST, ditanam di greenhouse dengan media tanah." },
  { side: "bot", text: "Baik, pada 28 HST kanopi melon mulai rimbun. Perhatikan sirkulasi udara dan pola bercak melingkar khas Alternaria. Verifikasi langsung kebun tetap diutamakan sebelum menentukan fungisida." },
  { side: "user", text: "CATAT: hari ini siram kocor semua baris greenhouse 100 liter" },
  { side: "bot", text: "Draft kegiatan: Penyiraman kocor 100L di semua baris hari ini. Balas YA untuk konfirmasi, UBAH untuk koreksi, atau BATAL." },
  { side: "user", text: "YA" },
  { side: "bot", text: "Catatan berhasil dikonfirmasi dan tersinkronisasi ke Dashboard Petani Anda!" },
];

export function StartupSimulator() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const delay = step === stages.length - 1 ? 5000 : 3200;
    const timer = setTimeout(() => {
      setStep((curr) => (curr + 1) % stages.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step]);

  return (
    <section id="simulasi" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>
            <Bot className="w-3.5 h-3.5" />
            <span>SIMULATOR INTERAKTIF</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Pengalaman WhatsApp yang Nyata dan Responsif.
          </h2>
          <p className={styles.sectionDesc}>
            Lihat bagaimana AgriSense menuntun percakapan mulai dari deteksi daun hingga
            konfirmasi penyimpanan kegiatan.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Controls & Explanation */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Status Simulasi
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  Langkah {step + 1} dari {stages.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-4 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 transition-all duration-300"
                  style={{ width: `${((step + 1) / stages.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lanjutkan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setIsPlaying(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Ulangi</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/60">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Kendali Tetap Milik Anda</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Setiap draft yang dihasilkan model memerlukan jawaban konfirmasi langsung dari petani
                sebelum data disimpan. Tidak ada asumsi otomatis.
              </p>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-zinc-500 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
              <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                Simulasi ini berjalan otomatis di browser Anda untuk keperluan demonstrasi fitur.
              </span>
            </div>
          </div>

          {/* Smartphone mockup */}
          <div className="md:col-span-7 flex justify-center">
            <div className="w-full max-w-[360px] bg-zinc-900 rounded-[38px] p-3 shadow-2xl border-4 border-zinc-800 relative">
              {/* Dynamic Island */}
              <div className="bg-zinc-950 text-white rounded-t-[30px] pt-3 pb-2 px-5 flex items-center justify-between text-xs font-medium">
                <span>09:41</span>
                <div className="w-20 h-4 bg-zinc-800 rounded-full mx-auto" />
                <span className="text-[10px]">5G 100%</span>
              </div>

              {/* Chat screen */}
              <div className="bg-[#efeae2] rounded-b-[30px] overflow-hidden flex flex-col h-[460px]">
                {/* Chat Top Nav */}
                <div className="bg-[#075e54] text-white px-3 py-2.5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      AS
                    </div>
                    <div>
                      <div className="font-semibold text-xs leading-none flex items-center gap-1">
                        <span>AgriSense Assistant</span>
                        <CheckCheck className="w-3 h-3 text-emerald-300" />
                      </div>
                      <div className="text-[10px] text-emerald-100">Akun Bisnis Terverifikasi</div>
                    </div>
                  </div>
                  <MessageSquare className="w-4 h-4 text-emerald-100" />
                </div>

                {/* Messages Body */}
                <div
                  ref={scrollRef}
                  className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs scroll-smooth"
                >
                  <div className="text-center my-1">
                    <span className="bg-white/80 backdrop-blur-xs text-zinc-600 text-[10px] px-2.5 py-0.5 rounded-full shadow-2xs">
                      Hari ini • Enkripsi End-to-End
                    </span>
                  </div>

                  {stages.slice(0, step + 1).map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.side === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 shadow-2xs ${
                          msg.side === "user"
                            ? "bg-[#d9fdd3] text-zinc-900 rounded-tr-none"
                            : "bg-white text-zinc-900 rounded-tl-none border border-zinc-200/50"
                        }`}
                      >
                        {msg.photo && (
                          <div className="rounded overflow-hidden mb-1.5 border border-black/10">
                            <Image
                              src="/images/demo-melon-leaf.jpg"
                              alt="Foto sampel daun melon"
                              width={220}
                              height={130}
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        )}
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className="text-[9px] text-zinc-400 text-right mt-1 flex items-center justify-end gap-1">
                          <span>09:{String(41 + i).padStart(2, "0")}</span>
                          {msg.side === "user" && (
                            <CheckCheck className="w-3 h-3 text-emerald-600 inline" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Simulator Footer */}
                <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-zinc-200">
                  <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-zinc-400 border border-zinc-200">
                    Ketik pesan...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
