"use client";

import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandGlyph } from "@/components/landing/Logo";
import styles from "./login.module.css";

export default function LoginForm() {
  const router = useRouter();

  // Tab switcher state
  const [activeTab, setActiveTab] = useState<"phone" | "otp">("phone");

  // Phone input state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentFeedback, setOtpSentFeedback] = useState("");

  // OTP boxes state (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  // Optional 64-char hex token if pasted directly from WhatsApp bot
  const [hexToken, setHexToken] = useState<string>("");

  // Countdown timer state: 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(282); // defaults around 04:42 for initial display
  const [resendCooldown, setResendCooldown] = useState(42);

  // Submission state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Refs for OTP input boxes
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Handle phone change
  const handlePhoneChange = (val: string) => {
    // Strip non-digits and leading +62 or 0
    let cleaned = val.replace(/[^\d]/g, "");
    if (cleaned.startsWith("62")) {
      cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith("0")) {
      cleaned = cleaned.slice(1);
    }
    setPhoneNumber(cleaned);
    setError("");
  };

  // Send OTP trigger
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setError("Masukkan nomor WhatsApp yang valid (minimal 8 angka).");
      phoneInputRef.current?.focus();
      return;
    }
    setOtpSent(true);
    setActiveTab("otp");
    setTimeLeft(300); // 5 minutes
    setResendCooldown(45);
    setOtpSentFeedback("Kirim LOGIN di WhatsApp AgriSense, lalu tempel kode yang diterima. Halaman ini tidak mengirim OTP secara otomatis.");
    setError("");

    // Auto focus first OTP digit box after small delay
    setTimeout(() => {
      digitInputRefs.current[0]?.focus();
    }, 150);
  };

  // Handle individual digit change
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/[^\d]/g, "");
    if (!cleaned) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = "";
      setOtpDigits(nextDigits);
      return;
    }

    const digit = cleaned.slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtpDigits(nextDigits);
    setHexToken(""); // reset hex token when manually typing
    setError("");

    // Move to next input box if available
    if (index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation in OTP boxes
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        digitInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste in OTP inputs
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!pasted) return;

    // Check if pasted is 64-character hex token from WhatsApp
    if (/^[a-f0-9]{64}$/i.test(pasted)) {
      setHexToken(pasted);
      setOtpDigits(["•", "•", "•", "•", "•", "•"]);
      setError("");
      return;
    }

    // Otherwise check for numeric digits
    const digitsOnly = pasted.replace(/[^\d]/g, "").slice(0, 6);
    if (digitsOnly.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = digitsOnly[i] || "";
      }
      setOtpDigits(newDigits);
      setHexToken("");
      setError("");

      const focusIdx = Math.min(digitsOnly.length, 5);
      digitInputRefs.current[focusIdx]?.focus();
    }
  };

  // Submit session
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 8) {
      setError("Masukkan nomor WhatsApp Anda.");
      phoneInputRef.current?.focus();
      return;
    }

    const fullPhone = "+62" + phoneNumber.replace(/\D/g, "");
    const code = hexToken || otpDigits.join("");

    if (!code || (code.length !== 6 && code.length !== 64)) {
      setError("Masukkan 6-digit kode OTP atau salin token dari WhatsApp.");
      digitInputRefs.current[0]?.focus();
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone, code }),
      });
      const value = await response.json();
      if (!response.ok) {
        setError(value.error || "Login gagal. Minta kode baru lewat WhatsApp.");
        return;
      }
      router.replace(value.redirect_to === "/cms" ? "/cms" : "/dashboard");
    } catch {
      setError("Koneksi gagal. Coba lagi sebentar lagi.");
    } finally {
      setBusy(false);
    }
  };

  const isOtpComplete = hexToken.length === 64 || otpDigits.every((d) => d !== "");

  return (
    <div className={styles.pageWrapper}>
      {/* ----------------- Top Header ----------------- */}
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <span className={styles.backIcon} aria-hidden="true">
            ←
          </span>
          <span>Kembali ke Beranda AgriSense</span>
        </Link>

        <Link href="/" className={styles.headerBrand} aria-label="AgriSense Beranda">
          <div className={styles.headerLogoTile}>
            <BrandGlyph />
          </div>
          <span className={styles.headerBrandText}>AgriSense</span>
        </Link>

        {/* Empty placeholder for 3-column balance */}
        <div aria-hidden="true" />
      </header>

      {/* ----------------- Main 2-Column Split ----------------- */}
      <main className={styles.mainContainer}>
        {/* Left Column: Context, Features & PRD Info */}
        <section className={styles.leftColumn} aria-labelledby="login-headline">
          <div className={styles.authBadge}>
            <svg
              className={styles.authBadgeIcon}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                clipRule="evenodd"
              />
            </svg>
            <span>OTENTIKASI AMAN WHATSAPP • PRD F09</span>
          </div>

          <h1 id="login-headline" className={styles.mainHeadline}>
            Masuk ke Kebun Digital Anda
          </h1>

          <p className={styles.mainSubtitle}>
            Akses data catatan kebun, aktivitas budidaya harian, dan asisten agronomi pintar
            Anda langsung tanpa repot mengingat kata sandi.
          </p>

          <div className={styles.featuresList}>
            {/* Feature 1 */}
            <div className={styles.featureItem}>
              <div className={styles.featureIconTile}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h2 className={styles.featureTitle}>Login Instan Tanpa Password</h2>
                <p className={styles.featureDescription}>
                  Gunakan nomor WhatsApp aktif Anda, verifikasi 1 klik dengan token OTP resmi.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureItem}>
              <div className={styles.featureIconTile}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h2 className={styles.featureTitle}>Sinkronisasi Asisten AgriSense</h2>
                <p className={styles.featureDescription}>
                  Percakapan bot dan diagnosis daun langsung tersinkron ke dashboard web.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureItem}>
              <div className={styles.featureIconTile}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className={styles.featureContent}>
                <h2 className={styles.featureTitle}>Standar Keamanan Agro-Data</h2>
                <p className={styles.featureDescription}>
                  Enkripsi End-to-End melalui WhatsApp Cloud API terlisensi Meta.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Info Callout */}
          <div className={styles.infoNoticeCard}>
            <div className={styles.infoNoticeIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <p className={styles.infoNoticeText}>
              <strong>Belum punya akun?</strong> Nomor baru otomatis diarahkan ke formulir aktivasi
              kebun gratis 1 menit.
            </p>
          </div>
        </section>

        {/* Right Column: Interactive WhatsApp Auth Card */}
        <section className={styles.rightColumn} aria-label="Formulir Masuk AgriSense">
          <div className={styles.cardContainer}>
            {/* Card Brand Emblem */}
            <div className={styles.cardHeader}>
              <div className={styles.cardLogoBadge}>
                <BrandGlyph />
              </div>
              <h2 className={styles.cardTitle}>Masuk ke AgriSense</h2>
              <p className={styles.cardSubtitle}>
                Verifikasi aman berbasis WhatsApp untuk seluruh petani & praktisi agribisnis
                Indonesia.
              </p>
            </div>

            {/* Pill Tab Switcher */}
            <div className={styles.tabSwitcher} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "phone"}
                className={`${styles.tabButton} ${activeTab === "phone" ? styles.tabButtonActive : ""}`}
                onClick={() => {
                  setActiveTab("phone");
                  phoneInputRef.current?.focus();
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>Nomor WhatsApp (Utama)</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "otp"}
                className={`${styles.tabButton} ${activeTab === "otp" ? styles.tabButtonActive : ""}`}
                onClick={() => {
                  setActiveTab("otp");
                  digitInputRefs.current[0]?.focus();
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M7 8h2m-1 0v8m6-8h3v4h-3v4h3" />
                </svg>
                <span>Kode OTP Kilat</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Step 1: Phone input */}
              <div className={styles.inputSection}>
                <div className={styles.labelRow}>
                  <label htmlFor="phone-input" className={styles.fieldLabel}>
                    Nomor WhatsApp Aktif
                  </label>
                  <span className={styles.registeredBadge}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Aktif & Terdaftar</span>
                  </span>
                </div>

                <div className={styles.phoneInputGroup}>
                  <div className={styles.countryBadge}>
                    <svg
                      width="18"
                      height="12"
                      viewBox="0 0 18 12"
                      aria-hidden="true"
                      style={{
                        borderRadius: "2px",
                        overflow: "hidden",
                        display: "inline-block",
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.12)",
                      }}
                    >
                      <rect width="18" height="6" fill="#dc2626" />
                      <rect y="6" width="18" height="6" fill="#ffffff" />
                    </svg>
                    <span>+62</span>
                  </div>
                  <input
                    ref={phoneInputRef}
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={phoneNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Contoh: 812-3456-7890"
                    className={styles.phoneInput}
                    maxLength={16}
                  />
                </div>
                <p className={styles.fieldHelperText}>
                  Pastikan nomor ponsel terpasang aplikasi WhatsApp resmi.
                </p>
              </div>

              {/* Action Button: Kirim Kode OTP via WhatsApp */}
              <button
                type="button"
                className={styles.sendOtpButton}
                onClick={handleSendOtp}
                disabled={busy}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.188 8.188 0 0 1-5.83 2.41c-1.47 0-2.91-.39-4.17-1.14l-.3-.18-3.12.82.83-3.04-.2-.32a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.13-.17.25-.64.8-.79.96-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.18-.48-.3" />
                </svg>
                <span>Sudah mengirim LOGIN di WhatsApp</span>
              </button>

              {/* Step 2: 6-Digit OTP Section */}
              <div className={styles.otpSectionBox}>
                <div className={styles.otpHeaderRow}>
                  <span className={styles.otpTitleWithIcon}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Tempel kode LOGIN dari WhatsApp</span>
                  </span>
                  <span className={styles.prdBadge}>Sesuai PRD F09</span>
                </div>

                <label htmlFor="whatsapp-login-code" style={{ display: "block", fontSize: 12, marginBottom: 8 }}>Kode WhatsApp (64 karakter)</label>
                <input id="whatsapp-login-code" type="password" autoComplete="one-time-code" value={hexToken}
                  onChange={event => { setHexToken(event.target.value.trim()); setError(""); }} maxLength={64}
                  placeholder="Tempel kode dari balasan LOGIN" aria-describedby="whatsapp-login-code-help"
                  style={{ width: "100%", minHeight: 48, padding: "12px 14px", border: "1px solid #d7e4d9", borderRadius: 12, font: "inherit", marginBottom: 8 }} />
                <p id="whatsapp-login-code-help" style={{ fontSize: 12, color: "#526951", lineHeight: 1.7, marginBottom: 14 }}>Backend saat ini menggunakan kode 64 karakter, bukan OTP 6 digit. Admin aktif akan diarahkan ke CMS.</p>
                {/* Existing six-box styling retained for compatibility with the user's design. */}
                <div className={styles.otpInputsGrid}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        digitInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      placeholder="•"
                      aria-label={`Digit ke-${idx + 1}`}
                      className={`${styles.otpDigitBox} ${digit ? styles.otpDigitBoxFilled : ""}`}
                    />
                  ))}
                </div>

                {/* Detected hex token from WhatsApp message (bonus compatibility) */}
                {hexToken && (
                  <div className={styles.tokenDetectedBanner}>
                    <span>✓ Token Hex 64-Karakter WhatsApp terdeteksi</span>
                    <button
                      type="button"
                      onClick={() => {
                        setHexToken("");
                        setOtpDigits(["", "", "", "", "", ""]);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        textDecoration: "underline",
                        cursor: "pointer",
                        color: "inherit",
                        fontSize: "0.75rem",
                      }}
                    >
                      Reset
                    </button>
                  </div>
                )}

                {/* Timer & Resend Row */}
                <div className={styles.timerRow}>
                  <div className={styles.timerLabel}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      Berlaku <strong>{formatTimer(timeLeft)}</strong> menit
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (resendCooldown === 0) {
                        handleSendOtp();
                      }
                    }}
                    disabled={resendCooldown > 0}
                    className={styles.resendButton}
                  >
                    {resendCooldown > 0
                      ? `Petunjuk kode (Tunggu ${resendCooldown}s)`
                      : "Petunjuk meminta kode"}
                  </button>
                </div>

                {/* Warning callout card */}
                <div className={styles.securityWarningCard}>
                  <span className={styles.warningIcon} aria-hidden="true">
                    ⚠️
                  </span>
                  <p className={styles.warningText}>
                    Kode rahasia. Jangan berikan kode OTP ini kepada petugas kebun atau siapapun
                    termasuk pihak AgriSense.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className={styles.errorBanner} role="alert">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success feedback if OTP sent */}
                {otpSentFeedback && !error && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#15803d",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <span>✓ {otpSentFeedback}</span>
                  </div>
                )}

                {/* Submit / Verification Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className={styles.verifySubmitButton}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{busy ? "Memverifikasi…" : "Verifikasi & Masuk"}</span>
                </button>

                {/* Bottom Sub-links */}
                <div className={styles.cardSubLinks}>
                  <button
                    type="button"
                    className={styles.subLink}
                    onClick={() => {
                      setActiveTab("phone");
                      phoneInputRef.current?.focus();
                    }}
                  >
                    Ganti nomor telepon
                  </button>
                  <span className={styles.subLinkDivider}>•</span>
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Tim%20AgriSense,%20saya%20butuh%20bantuan%20login%20petani."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.subLink}
                  >
                    🎧 Bantuan Petani
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Security & Cloud API trust note below card */}
          <div className={styles.cardTrustNote}>
            <svg
              className={styles.cardTrustIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>
              Enkripsi End-to-End WhatsApp Cloud API — Data hanya dapat diakses oleh nomor
              terverifikasi Anda.
            </span>
          </div>
        </section>
      </main>

      {/* ----------------- Page Footer ----------------- */}
      <footer className={styles.footerContainer}>
        <div className={styles.footerVerifiedBadge}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            color="#15803d"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>Terenkripsi & Terverifikasi Layanan Pertanian Digital Indonesia</span>
        </div>

        <div className={styles.footerLinksRow}>
          <a href="#kebijakan-privasi" className={styles.footerLink}>
            Kebijakan Privasi
          </a>
          <span style={{ color: "#cbd5e1" }}>•</span>
          <a href="#keamanan-whatsapp" className={styles.footerLink}>
            Keamanan Akun WhatsApp
          </a>
          <span style={{ color: "#cbd5e1" }}>•</span>
          <a href="#pusat-bantuan" className={styles.footerLink}>
            Pusat Bantuan
          </a>
        </div>

        <p className={styles.footerCopyright}>
          © 2025 AgriSense. Membantu petani dengan teknologi ramah WhatsApp.
        </p>
      </footer>
    </div>
  );
}
