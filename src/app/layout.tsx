import type { Metadata, Viewport } from "next";
import { Manrope, Oswald } from "next/font/google";
import { LanguageProvider } from "@/components/providers/language-provider";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./premium.css";

const manrope = Manrope({ variable: "--font-body", subsets: ["latin", "cyrillic"], display: "swap" });
const oswald = Oswald({ variable: "--font-display", subsets: ["latin", "cyrillic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://edil-mashinalary.vercel.app"),
  title: { default: "Спецтехника в Кыргызстане | Edil Mashinalary", template: "%s | Edil Mashinalary" },
  description: "Погрузчики LGZT, экскаваторы, самосвалы и другая спецтехника в Кыргызстане. Рассрочка без банка, гарантия 3000 моточасов.",
  keywords: ["спецтехника Кыргызстан", "LGZT Кыргызстан", "купить погрузчик Кыргызстан", "погрузчик Бишкек", "спецтехника в рассрочку", "HOWO Кыргызстан"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_KG",
    siteName: "Edil Mashinalary",
    title: "Спецтехника в Кыргызстане | Edil Mashinalary",
    description: "Техника со склада и под заказ. Рассрочка без банка и гарантия 3000 моточасов.",
    images: [{ url: "/images/hero-fleet.png", width: 2048, height: 1152, alt: "Парк спецтехники Edil Mashinalary" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#111114" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://edil-mashinalary.vercel.app";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edil Mashinalary",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    telephone: "+996551000303",
    email: "edilmashinalary@gmail.com",
    sameAs: ["https://www.instagram.com/edilmashinalary"],
    address: { "@type": "PostalAddress", streetAddress: "ул. Ленина, 633", addressLocality: "Новопокровка", addressRegion: "Чуйская область", addressCountry: "KG" },
  };

  return (
    <html lang="ru" data-scroll-behavior="smooth" className={`${manrope.variable} ${oswald.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
