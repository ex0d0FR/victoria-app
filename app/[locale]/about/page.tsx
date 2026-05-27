import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { settings } from "@/data/mock";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  return {
    title: locale === "fr" ? "À propos — Victoria Reindale" : "About — Victoria Reindale",
    description: locale === "fr"
      ? "Découvrez le parcours de Victoria Reindale, soprano professionnelle."
      : "Discover Victoria Reindale's journey as a professional soprano.",
  };
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("about");
  const prefix = locale === "en" ? "/en" : "";

  const bio = locale === "fr" ? settings?.biographyFr : settings?.biographyEn;

  return (
    <div className="pt-20">
      {/* Page header */}
      <section className="section-padding bg-cream-50 pb-0">
        <div className="container-wide">
          <p className="label-sm mb-3">{t("subtitle")}</p>
          <div className="divider-gold" />
          <h1 className="heading-display mt-2">{t("title")}</h1>
        </div>
      </section>

      {/* Bio */}
      <section className="section-padding bg-cream-50">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Photo */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/4] overflow-hidden img-hover">
              {/* Sanity image when configured, otherwise local B&W piano portrait */}
              <Image
                src={settings?.bioPhoto || "/images/victoria-gallery-2.png"}
                alt="Victoria Reindale"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-3">
            {bio ? (
              <div className="prose prose-lg max-w-none font-sans text-ink-700
                prose-headings:font-serif prose-headings:font-normal
                prose-p:leading-relaxed prose-p:text-ink-600">
                <p>{bio}</p>
              </div>
            ) : (
              <div className="space-y-4 text-ink-600 leading-relaxed">
                <p>
                  {locale === "fr"
                    ? "Victoria Reindale est une soprano professionnelle dont la voix lyrique légère enchante cérémonies, concerts privés et événements d'exception."
                    : "Victoria Reindale is a professional soprano whose light lyric voice enchants ceremonies, private concerts and exceptional events."}
                </p>
                <p>
                  {locale === "fr"
                    ? "Formée au conservatoire, elle propose des formations allant du solo soprano jusqu'à l'ensemble vocal SATB, s'adaptant à chaque occasion avec raffinement."
                    : "Trained at the conservatory, she offers formations ranging from solo soprano to SATB vocal ensemble, adapting to each occasion with refinement."}
                </p>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-cream-300">
              <p className="label-sm mb-4">
                {locale === "fr" ? "Formations disponibles" : "Available formations"}
              </p>
              <ul className="space-y-2 text-sm text-ink-600">
                {[
                  locale === "fr" ? "Solo (soprano)" : "Solo (soprano)",
                  locale === "fr" ? "Duo voix – piano" : "Voice & piano duo",
                  locale === "fr" ? "Duo soprano – violoncelle" : "Soprano & cello duo",
                  locale === "fr" ? "Trio soprano – flûte – piano" : "Soprano, flute & piano trio",
                  locale === "fr" ? "Trio soprano – ténor – piano" : "Soprano, tenor & piano trio",
                  locale === "fr" ? "Ensemble vocal (SATB)" : "Vocal ensemble (SATB)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <Link href={`${prefix}/contact`} className="btn-primary">
                {locale === "fr" ? "Prendre contact" : "Get in touch"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
