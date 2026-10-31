import localFont from "next/font/local";
import LoginForm from "./LoginForm";
import { siteConfig } from "@/lib/site-config";

const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-variable.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-jakarta",
});
export const metadata = {
  title: "Masuk dengan WhatsApp — AgriSense",
  robots: { index: false, follow: false },
};
export default function LoginPage() {
  const phone = siteConfig.contact.whatsappNumber?.replace(/\D/g, "");
  return (
    <LoginForm
      className={jakarta.variable}
      whatsappUrl={phone ? "https://wa.me/" + phone + "?text=LOGIN" : null}
      privacyUrl={siteConfig.legal.privacyPolicyUrl}
    />
  );
}
