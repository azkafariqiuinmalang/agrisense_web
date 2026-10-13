import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

// Montserrat is a variable font, so no weight list is needed: one file covers
// every weight the page uses and keeps the font budget down (DESIGN.md §11).
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "AgriSense — Asisten Budidaya Melon melalui WhatsApp",
  description:
    "Konsultasikan kondisi tanaman dan catat aktivitas greenhouse melon melalui WhatsApp. Pelajari AgriSense dan alur pilotnya.",
  metadataBase: siteConfig.productionUrl ? new URL(siteConfig.productionUrl) : undefined,
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
  themeColor: "#ffffff",
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
      className={`${montserrat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Mark JavaScript availability synchronously before paint so the no-JS
          fallbacks and the reveal animations apply without a flash
          (DESIGN.md §8.3).
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-js','true');`,
          }}
        />
      </head>
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
