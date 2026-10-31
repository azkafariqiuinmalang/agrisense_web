import localFont from "next/font/local";
import FarmerDashboard from "./FarmerDashboard";
import { siteConfig } from "@/lib/site-config";

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-variable.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-jakarta",
});
export const metadata = {
  title: "Kebun Anda — AgriSense",
  robots: { index: false, follow: false },
};
export default function DashboardPage() {
  const phone = siteConfig.contact.whatsappNumber?.replace(/\D/g, "");
  return (
    <FarmerDashboard
      className={jakarta.variable}
      whatsappUrl={phone ? "https://wa.me/" + phone : null}
    />
  );
}
