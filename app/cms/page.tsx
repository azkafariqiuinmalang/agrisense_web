import localFont from "next/font/local";
import CmsDashboard from "./CmsDashboard";

const jakarta = localFont({ src: "../../public/fonts/plus-jakarta-variable.woff2", weight: "400 800", display: "swap", variable: "--font-jakarta" });
export const metadata = { title: "CMS Admin — AgriSense", robots: { index: false, follow: false } };
export default function CmsPage() { return <CmsDashboard className={jakarta.variable} />; }
