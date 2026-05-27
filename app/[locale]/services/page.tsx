import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/data/mock";
import { BookingButton } from "@/components/ui/BookingButton";
import { Check } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  return {
    title: locale === "fr" ? "Services & Formules — Victoria Reindale" : "Services — Victoria Reindale",
  };
}

type Service = {
  _id: string;
  title: { fr: string; en: string };
  formation: string;
  description: { fr: string; en: string };
  occasions: { fr: string[]; en: string[] };
  priceFrom?: number;
  depositAmount?: number;
  duration: { fr: string; en: string };
};

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("services");
  const prefix = locale === "en" ? "/en" : "";

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-padding bg-cream-50 pb-12">
        <div className="container-wide">
          <p className="label-sm mb-3">{t("title")}</p>
          <div className="divider-gold" />
          <h1 className="heading-display mt-2">{t("subtitle")}</h1>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding bg-cream-100 pt-0">
        <div className="container-wide">
          {services.length === 0 ? (
            /* Fallback — show Victoria's real offerings even without CMS */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: "solo",       title: locale === "fr" ? "Solo soprano" : "Soprano solo",              desc: locale === "fr" ? "Prestation vocale solo, idéale pour cérémonies intimes et événements élégants." : "Solo vocal performance, ideal for intimate ceremonies and elegant events." },
                { key: "duo-piano",  title: locale === "fr" ? "Duo voix – piano" : "Voice & piano duo",     desc: locale === "fr" ? "Harmonie raffinée entre voix et piano pour une atmosphère musicale complète." : "Refined harmony between voice and piano for a complete musical atmosphere." },
                { key: "duo-cello",  title: locale === "fr" ? "Duo soprano – violoncelle" : "Soprano & cello", desc: locale === "fr" ? "Alliance poétique du soprano et du violoncelle, profonde et émouvante." : "Poetic alliance of soprano and cello, deep and moving." },
                { key: "trio-flute", title: locale === "fr" ? "Trio soprano – flûte – piano" : "Soprano, flute & piano", desc: locale === "fr" ? "Ensemble aérien et délicat pour des occasions d'exception." : "Airy and delicate ensemble for exceptional occasions." },
                { key: "trio-tenor", title: locale === "fr" ? "Trio soprano – ténor – piano" : "Soprano, tenor & piano", desc: locale === "fr" ? "Voix puissantes et complémentaires, idéales pour les grandes cérémonies." : "Powerful and complementary voices, ideal for grand ceremonies." },
                { key: "ensemble",   title: locale === "fr" ? "Ensemble vocal (SATB)" : "Vocal ensemble (SATB)", desc: locale === "fr" ? "Formation chorale complète pour vos événements les plus solennels." : "Full choral formation for your most solemn events." },
              ].map((s) => (
                <div key={s.key} className="card-border p-8 flex flex-col">
                  <h2 className="heading-md mb-3">{s.title}</h2>
                  <p className="text-sm text-ink-500 leading-relaxed flex-1 mb-6">{s.desc}</p>
                  <p className="text-gold-600 text-sm font-medium mb-6">{t("on_quote")}</p>
                  <Link href={`${prefix}/contact`} className="btn-outline text-center text-xs">
                    {t("book_now")}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => {
                const title    = s.title?.[locale as "fr" | "en"]       ?? s.title?.fr;
                const desc     = s.description?.[locale as "fr" | "en"] ?? s.description?.fr;
                const duration = s.duration?.[locale as "fr" | "en"]    ?? s.duration?.fr;
                const occasions = s.occasions?.[locale as "fr" | "en"]  ?? s.occasions?.fr ?? [];

                return (
                  <div key={s._id} className="card-border p-8 flex flex-col">
                    <h2 className="heading-md mb-3">{title}</h2>
                    <p className="text-sm text-ink-500 leading-relaxed mb-5">{desc}</p>

                    {occasions.length > 0 && (
                      <ul className="space-y-1.5 mb-6">
                        {occasions.map((occ) => (
                          <li key={occ} className="flex items-center gap-2 text-xs text-ink-600">
                            <Check size={12} className="text-gold-500 shrink-0" />
                            {occ}
                          </li>
                        ))}
                      </ul>
                    )}

                    {duration && (
                      <p className="text-xs text-ink-400 mb-5">⏱ {duration}</p>
                    )}

                    <p className="text-gold-600 font-medium text-sm mb-6 mt-auto">
                      {s.priceFrom
                        ? `${t("price_from")} ${s.priceFrom.toLocaleString(locale === "fr" ? "fr-FR" : "en-GB")} €`
                        : t("on_quote")}
                    </p>

                    <div className="flex flex-col gap-2">
                      {s.depositAmount ? (
                        <BookingButton
                          serviceId={s._id}
                          serviceTitle={title}
                          depositAmount={s.depositAmount}
                          locale={locale}
                        />
                      ) : (
                        <Link href={`${prefix}/contact`} className="btn-outline text-center text-xs">
                          {t("book_now")}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-cream-50">
        <div className="container-narrow text-center">
          <p className="text-sm text-ink-400">
            {locale === "fr"
              ? "Toutes les prestations sont personnalisables. Contactez-moi pour un devis sur mesure adapté à votre événement."
              : "All performances are customisable. Contact me for a bespoke quote tailored to your event."}
          </p>
          <div className="mt-6">
            <Link href={`${prefix}/contact`} className="btn-primary">
              {locale === "fr" ? "Demander un devis" : "Request a quote"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
