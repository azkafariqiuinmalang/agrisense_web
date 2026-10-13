import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const googleSans = localFont({
  src: "../public/fonts/google-sans-latin-variable.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "AgriSense — Asisten Budidaya Melon melalui WhatsApp",
  description:
    "Konsultasikan kondisi tanaman dan catat aktivitas greenhouse melon melalui WhatsApp. Pelajari AgriSense dan alur pilotnya.",
  metadataBase: siteConfig.productionUrl
    ? new URL(siteConfig.productionUrl)
    : undefined,
  openGraph: {
    title: "AgriSense — Asisten Budidaya Melon melalui WhatsApp",
    description:
      "Konsultasikan kondisi tanaman dan catat aktivitas greenhouse melon melalui WhatsApp. Pelajari AgriSense dan alur pilotnya.",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fcfcf8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-js="false"
      className={`${googleSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-bg font-sans text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
