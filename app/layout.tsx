import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://victoriareindalesoprano.com"),
  title: {
    default: "Victoria Reindale — Soprano · Artiste Vocale",
    template: "%s | Victoria Reindale",
  },
  description:
    "Victoria Reindale est une soprano professionnelle proposant des prestations musicales pour cérémonies, concerts privés et événements spéciaux.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_GB",
    siteName: "Victoria Reindale",
    title: "Victoria Reindale — Soprano · Artiste Vocale",
    description:
      "Prestations vocales d'exception pour concerts, cérémonies, mariages et événements privés. Musique sacrée, lyrique et grands airs d'opéra.",
    images: [
      {
        url: "/images/victoria-main.png",
        width: 1200,
        height: 630,
        alt: "Victoria Reindale — Soprano · Artiste Vocale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Victoria Reindale — Soprano · Artiste Vocale",
    description:
      "Prestations vocales d'exception pour concerts, cérémonies, mariages et événements privés.",
    images: ["/images/victoria-main.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
