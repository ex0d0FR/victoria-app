import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/queries";
import { ContactForm } from "@/components/sections/ContactForm";
import { Mail, Phone, Instagram, Youtube } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return { title: locale === "fr" ? "Contact — Victoria Reindale" : "Contact — Victoria Reindale" };
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("contact");
  const settings = await client.fetch(SITE_SETTINGS_QUERY).catch(() => null);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-padding bg-cream-50 pb-12">
        <div className="container-wide">
          <p className="label-sm mb-3">{locale === "fr" ? "Parlons de votre projet" : "Let's talk"}</p>
          <div className="divider-gold" />
          <h1 className="heading-display mt-2">{t("title")}</h1>
        </div>
      </section>

      <section className="section-padding bg-cream-50 pt-0">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="label-sm mb-4">
                {locale === "fr" ? "Informations" : "Information"}
              </p>
              <p className="text-ink-600 leading-relaxed">{t("subtitle")}</p>
            </div>

            <div className="space-y-4">
              {settings?.email && (
                <a href={`mailto:${settings.email}`}
                   className="flex items-center gap-3 text-sm text-ink-600 hover:text-gold-600 transition-colors group">
                  <Mail size={15} className="text-gold-500 group-hover:text-gold-600 shrink-0" />
                  {settings.email}
                </a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`}
                   className="flex items-center gap-3 text-sm text-ink-600 hover:text-gold-600 transition-colors group">
                  <Phone size={15} className="text-gold-500 group-hover:text-gold-600 shrink-0" />
                  {settings.phone}
                </a>
              )}
              {settings?.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-sm text-ink-600 hover:text-gold-600 transition-colors group">
                  <Instagram size={15} className="text-gold-500 group-hover:text-gold-600 shrink-0" />
                  @victoria_soprano_leggero
                </a>
              )}
              {settings?.socialYoutube && (
                <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 text-sm text-ink-600 hover:text-gold-600 transition-colors group">
                  <Youtube size={15} className="text-gold-500 group-hover:text-gold-600 shrink-0" />
                  YouTube
                </a>
              )}
            </div>

            {/* Response time note */}
            <div className="p-5 bg-cream-200 border border-cream-300">
              <p className="text-xs text-ink-500 leading-relaxed">
                {locale === "fr"
                  ? "Je réponds généralement sous 24–48h. Pour les événements proches, n'hésitez pas à m'appeler directement."
                  : "I typically respond within 24–48 hours. For upcoming events, feel free to call me directly."}
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}
