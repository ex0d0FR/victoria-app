import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
