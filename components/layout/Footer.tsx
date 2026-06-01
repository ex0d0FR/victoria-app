import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";
import { settings } from "@/data/mock";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");


  const prefix = locale === "en" ? "/en" : "";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-cream-200">
      <div className="container-wide px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl text-cream-50 mb-2">Victoria Reindale</p>
            <p className="label-sm text-gold-400 mb-6">{t("tagline")}</p>
            <div className="flex gap-4">
              {settings?.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer"
                   aria-label="Instagram"
                   className="text-ink-300 hover:text-gold-400 transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {settings?.socialYoutube && (
                <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer"
                   aria-label="YouTube"
                   className="text-ink-300 hover:text-gold-400 transition-colors">
                  <Youtube size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-sm text-gold-400 mb-5">Navigation</p>
            <nav className="space-y-2">
              {(["about", "services", "gallery", "events", "contact"] as const).map((key) => (
                <Link
                  key={key}
                  href={`${prefix}/${key}`}
                  className="block text-sm text-ink-300 hover:text-cream-50 transition-colors"
                >
                  {tNav(key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="label-sm text-gold-400 mb-5">Contact</p>
            <div className="space-y-3">
              {settings?.email && (
                <a href={`mailto:${settings.email}`}
                   className="flex items-center gap-2 text-sm text-ink-300 hover:text-cream-50 transition-colors">
                  <Mail size={14} />
                  {settings.email}
                </a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`}
                   className="flex items-center gap-2 text-sm text-ink-300 hover:text-cream-50 transition-colors">
                  <Phone size={14} />
                  {settings.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ink-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-cream-50">
          <p>© {year} Victoria Reindale. {t("rights")}</p>
          <p>
            Developed with ❤️ by{" "}
            <a 
              href="https://engadi.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-4"
            >
              engadi.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
