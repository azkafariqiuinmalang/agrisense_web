"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BrandGlyph } from "@/components/landing/Logo";
import s from "./login.module.css";

export default function LoginForm({
  className = "",
  whatsappUrl,
  privacyUrl,
}: {
  className?: string;
  whatsappUrl: string | null;
  privacyUrl: string | null;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText("LOGIN");
      setCopied(true);
    } catch {
      setError("Buka percakapan WhatsApp AgriSense dan ketik LOGIN.");
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    let number = phone.trim().replace(/[\s()-]/g, "");
    if (number.startsWith("08")) number = "+62" + number.slice(1);
    else if (number.startsWith("62")) number = "+" + number;
    if (!/^\+[1-9]\d{7,14}$/.test(number)) {
      setError(
        "Masukkan nomor WhatsApp yang Anda gunakan di AgriSense, misalnya 0812… atau +62812….",
      );
      return;
    }
    const token = code.trim();
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      setError(
        "Tempel kode lengkap 64 karakter dari balasan LOGIN di WhatsApp.",
      );
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: number, code: token }),
      });
      const value = await response.json();
      if (!response.ok) {
        setError(
          typeof value.error === "string"
            ? value.error
            : "Login belum berhasil. Minta kode baru melalui WhatsApp.",
        );
        return;
      }
      setCode("");
      setPhone("");
      router.replace(value.redirect_to === "/cms" ? "/cms" : "/dashboard");
    } catch {
      setError("Koneksi belum tersedia. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.page + " " + className}>
      <header className={s.header}>
        <Link href="/" className={s.brand}>
          <BrandGlyph className={s.logo} />
          <span>AgriSense</span>
        </Link>
        <Link href="/" className={s.back}>
          Kembali ke website ↗
        </Link>
      </header>
      <main id="main" className={s.layout}>
        <section
          className={s.introduction}
          aria-labelledby="login-introduction"
        >
          <span className={s.eyebrow}>RUANG PETANI AGRISENSE</span>
          <h1 id="login-introduction">
            Percakapan Anda.
            <br />
            Catatan kebun Anda.
          </h1>
          <p>
            Masuk dengan akun WhatsApp yang Anda gunakan di AgriSense. Catatan
            yang tersimpan mengikuti Anda di dashboard.
          </p>
          <div className={s.illustration} aria-hidden="true">
            <div className={s.circle} />
            <div className={s.leafOne} />
            <div className={s.leafTwo} />
            <div className={s.stem} />
            <span className={s.grain} />
          </div>
          <div className={s.steps}>
            <span>01 · Minta kode lewat WhatsApp</span>
            <span>02 · Tempel kode untuk masuk</span>
            <span>03 · Pantau data kebun Anda</span>
          </div>
          <p className={s.caption}>
            Pencatatan tetap melalui percakapan WhatsApp. Dashboard menampilkan
            data yang dapat dibaca dari layanan Anda.
          </p>
        </section>
        <section className={s.card} aria-labelledby="login-title">
          <span className={s.smallLabel}>MASUK KE RUANG PETANI</span>
          <h2 id="login-title">
            Kebun Anda,
            <br />
            sudah menunggu.
          </h2>
          <p className={s.description}>
            Gunakan nomor dan kode dari percakapan WhatsApp AgriSense Anda.
          </p>
          <div className={s.instruction}>
            <div>
              <strong>Ketik LOGIN di WhatsApp.</strong>
              <p>
                Salin kode pada balasan AgriSense. Kode berlaku 5 menit dan
                hanya bisa digunakan sekali.
              </p>
            </div>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Buka WhatsApp ↗
              </a>
            ) : (
              <button type="button" onClick={() => void copy()}>
                {copied ? "LOGIN tersalin" : "Salin LOGIN"}
              </button>
            )}
          </div>
          <form onSubmit={(event) => void submit(event)}>
            <fieldset disabled={busy}>
              <label htmlFor="farmer-phone">
                Nomor WhatsApp
                <input
                  id="farmer-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0812 3456 7890"
                  value={phone}
                  maxLength={25}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setError("");
                  }}
                  required
                  aria-describedby="phone-help"
                />
              </label>
              <p id="phone-help" className={s.help}>
                Nomor yang sama dengan percakapan AgriSense Anda.
              </p>
              <label htmlFor="whatsapp-login-code">
                Kode login dari WhatsApp
                <input
                  id="whatsapp-login-code"
                  type="password"
                  autoComplete="one-time-code"
                  placeholder="Tempel kode lengkap di sini"
                  value={code}
                  maxLength={64}
                  onChange={(event) => {
                    setCode(event.target.value);
                    setError("");
                  }}
                  required
                  aria-describedby="code-help"
                />
              </label>
              <p id="code-help" className={s.help}>
                64 karakter dari balasan LOGIN. Nomor WhatsApp saja belum cukup
                untuk masuk.
              </p>
              {error && (
                <p role="alert" className={s.error}>
                  {error}
                </p>
              )}
              <button type="submit" className={s.submit}>
                {busy ? "Memverifikasi…" : "Masuk ke dashboard"}
                <span aria-hidden="true">→</span>
              </button>
            </fieldset>
          </form>
          <p className={s.security}>
            Kode login bersifat rahasia. Jangan membagikannya kepada orang lain.
            Jika kedaluwarsa, ketik LOGIN kembali di WhatsApp.
          </p>
          <div className={s.bottomLinks}>
            <Link href="/#faq">Pertanyaan umum</Link>
            {privacyUrl && <a href={privacyUrl}>Kebijakan privasi</a>}
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <span>AgriSense · Catatan kebun dalam satu tempat.</span>
        <span>Data sesuai akun WhatsApp Anda.</span>
      </footer>
    </div>
  );
}
