"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  Calendar,
  AlertTriangle,
  Bot,
  Check,
  Edit3
} from "lucide-react";
import styles from "./startup.module.css";

export function StartupHero({ whatsappUrl }: { whatsappUrl: string | null }) {
  const [draftConfirmed, setDraftConfirmed] = useState<boolean | null>(null);

  return (
    <section id="beranda" className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.badgePill}>
            <span className={styles.pulseDot} />
            <span>AgriSense 2.0 • AI Copilot Greenhouse Melon</span>
          </div>

          <h1 className={styles.heroTitle}>
            Kelola Greenhouse Melon Lebih Presisi,{" "}
            <span className={styles.heroTitleGradient}>Cukup Lewat WhatsApp.</span>
          </h1>

          <p className={styles.heroDesc}>
            Asisten agronomis digital siap 24/7 di kontak WhatsApp Anda. Analisis gejala
            daun via foto, catat aktivitas harian, dan pantau kondisi kebun tanpa perlu
            menginstal aplikasi tambahan.
          </p>

          <div className={styles.heroActions}>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.heroBtnPrimary}
              >
                <MessageSquare className="w-5 h-5" strokeWidth={2} />
                <span>Mulai Percakapan WhatsApp</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            ) : (
              <a href="#simulasi" className={styles.heroBtnPrimary}>
                <Sparkles className="w-5 h-5" strokeWidth={2} />
                <span>Coba Simulasi AI</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            )}

            <Link href="/login" className={styles.heroBtnOutline}>
              <span>Buka Dashboard Petani</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" strokeWidth={2} />
            </Link>
          </div>

          <div className={styles.heroTrustList}>
            <span className={styles.trustItem}>
              <CheckCircle2 className={`w-4 h-4 ${styles.trustIcon}`} strokeWidth={2.2} />
              <span>Tanpa install aplikasi baru</span>
            </span>
            <span className={styles.trustItem}>
              <CheckCircle2 className={`w-4 h-4 ${styles.trustIcon}`} strokeWidth={2.2} />
              <span>Konfirmasi draft eksplisit</span>
            </span>
            <span className={styles.trustItem}>
              <CheckCircle2 className={`w-4 h-4 ${styles.trustIcon}`} strokeWidth={2.2} />
              <span>Didukung panduan agronomis</span>
            </span>
          </div>
        </div>

        {/* Startup Interactive Product Console */}
        <div className={styles.showcaseWrapper}>
          <div className={styles.showcaseTopBar}>
            <div className={styles.trafficLights}>
              <span className={styles.dotRed} />
              <span className={styles.dotYellow} />
              <span className={styles.dotGreen} />
            </div>
            <div className={styles.showcaseUrlPill}>
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>agrisense.app/copilot — Melon Greenhouse Interactive View</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Active</span>
            </div>
          </div>

          <div className={styles.showcaseBody}>
            {/* Left: Chat stream */}
            <div className={styles.showcaseChatSide}>
              <div className={styles.chatHeaderBar}>
                <div className={styles.chatAvatarGroup}>
                  <div className={styles.chatAvatar}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={styles.chatAgentName}>AgriSense Assistant</div>
                    <div className={styles.chatAgentStatus}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Online • Kontak WhatsApp Terverifikasi</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 font-mono">256-bit TLS</span>
              </div>

              <div className={styles.chatStream}>
                {/* Farmer Message 1 */}
                <div className={styles.bubbleUser}>
                  <p>Pak, daun melon baris C ada bercak kuning kecokelatan. Ini fotonya.</p>
                  <div className={styles.photoPreviewCard}>
                    <Image
                      src="/images/demo-melon-leaf.jpg"
                      alt="Foto gejala bercak daun melon"
                      width={320}
                      height={180}
                      className="w-full h-36 object-cover"
                    />
                    <div className={styles.photoBadge}>Foto Lapangan • Greenhouse 1</div>
                  </div>
                  <div className="text-[11px] text-emerald-800 text-right mt-1 font-mono">08:42 ✓✓</div>
                </div>

                {/* Bot Response 1 */}
                <div className={styles.bubbleBot}>
                  <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-emerald-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hasil Pengamatan Visual (Dugaan Awal):</span>
                  </div>
                  <p className="text-sm text-zinc-700 mb-2 leading-relaxed">
                    Pola bercak konsentris menyerupai gejala awal <strong>Alternaria leaf blight</strong>. 
                    Mengingat umur melon saat ini <strong>28 HST</strong> dan media tanah, mohon cek kelembaban kanopi bawah. 
                    <em>(Rekomendasi ini perlu verifikasi fisik lapangan sebelum aplikasi fungisida).</em>
                  </p>
                  <div className="text-[11px] text-zinc-400 font-mono">08:43</div>
                </div>

                {/* Farmer Message 2 */}
                <div className={styles.bubbleUser}>
                  <p>CATAT: pemupukan kocor AB Mix 100 liter EC 2.2 hari ini jam 9.</p>
                  <div className="text-[11px] text-emerald-800 text-right mt-1 font-mono">08:45 ✓✓</div>
                </div>

                {/* Bot Response 2 with Interactive Confirmation Gate */}
                <div className={styles.bubbleBot}>
                  <p className="text-sm font-medium text-zinc-800">
                    Draft kegiatan telah disiapkan. Apakah data berikut sudah sesuai?
                  </p>

                  <div className={styles.draftCard}>
                    <div className={styles.draftTitle}>📋 DRAFT KEGIATAN KEBUN</div>
                    <div className="text-xs text-zinc-700 space-y-1">
                      <div>• Jenis: <strong>Pemupukan Kocor (AB Mix)</strong></div>
                      <div>• Volume / Target: <strong>100 Liter • EC 2.2 mS/cm</strong></div>
                      <div>• Waktu: <strong>Hari ini, 09:00 WIB</strong></div>
                    </div>

                    {draftConfirmed === null ? (
                      <div className={styles.draftPillRow}>
                        <button
                          type="button"
                          onClick={() => setDraftConfirmed(true)}
                          className={`${styles.draftPillBtn} ${styles.draftPillYes}`}
                        >
                          <Check className="w-3 h-3 inline mr-1" />
                          YA, Konfirmasi Catatan
                        </button>
                        <button
                          type="button"
                          onClick={() => setDraftConfirmed(false)}
                          className={`${styles.draftPillBtn} ${styles.draftPillEdit}`}
                        >
                          <Edit3 className="w-3 h-3 inline mr-1" />
                          UBAH
                        </button>
                      </div>
                    ) : draftConfirmed ? (
                      <div className="mt-2.5 p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Tersimpan di log kebun petani (Simulasi UI)</span>
                      </div>
                    ) : (
                      <div className="mt-2.5 p-2 rounded bg-zinc-100 text-zinc-700 text-xs font-medium flex items-center justify-between">
                        <span>Draft dibatalkan / siap diedit ulang</span>
                        <button
                          onClick={() => setDraftConfirmed(null)}
                          className="text-[11px] text-emerald-600 underline font-semibold"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-2">08:46</div>
                </div>
              </div>
            </div>

            {/* Right: Realtime Telemetry Panel */}
            <div className={styles.showcaseTelemetrySide}>
              <div className={styles.telemetryHeader}>
                <div className={styles.telemetryTitle}>Status Greenhouse #1</div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                  Live Telemetry
                </span>
              </div>

              <div className={styles.sensorGrid}>
                <div className={styles.sensorCard}>
                  <div className={styles.sensorLabel}>
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                    <span>Suhu Kanopi</span>
                  </div>
                  <div className={styles.sensorVal}>29.4 °C</div>
                  <div className={styles.sensorSub}>Optimal Vegetatif</div>
                </div>

                <div className={styles.sensorCard}>
                  <div className={styles.sensorLabel}>
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>Kelembaban (RH)</span>
                  </div>
                  <div className={styles.sensorVal}>71 %</div>
                  <div className={styles.sensorSub}>Batas Waspada Jamur</div>
                </div>

                <div className={styles.sensorCard}>
                  <div className={styles.sensorLabel}>
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    <span>EC Nutrisi</span>
                  </div>
                  <div className={styles.sensorVal}>2.2 mS/cm</div>
                  <div className={styles.sensorSub}>Sesuai Standar Melon</div>
                </div>

                <div className={styles.sensorCard}>
                  <div className={styles.sensorLabel}>
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>Fase Tanam</span>
                  </div>
                  <div className={styles.sensorVal}>28 HST</div>
                  <div className={styles.sensorSub}>Pembesaran Buah Awal</div>
                </div>
              </div>

              <div className={styles.insightCard}>
                <div className={styles.insightCardHeader}>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Pengingat Agronomis Lapangan</span>
                </div>
                <div className={styles.insightCardDesc}>
                  Kelembaban 71% dengan gejala bercak daun memerlukan sirkulasi udara lebih lancar. 
                  Buka ventilasi samping greenhouse antara jam 09.00 - 15.00 WIB.
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900">Sinkronisasi Database</div>
                    <div className="text-[11px] text-zinc-500">Tersinkron ke Dashboard Petani</div>
                  </div>
                </div>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Buka</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
