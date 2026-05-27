import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { galleryItems, videos } from "@/data/mock";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { YoutubeEmbed } from "@/components/ui/YoutubeEmbed";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  return { title: locale === "fr" ? "Galerie — Victoria Reindale" : "Gallery — Victoria Reindale" };
}

export default async function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("gallery");

  const localizedItems = galleryItems.map(item => ({
    ...item,
    alt: item.alt[locale as "fr" | "en"] || item.alt.fr,
    caption: item.caption[locale as "fr" | "en"] || item.caption.fr,
  }));

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-padding bg-cream-50 pb-12">
        <div className="container-wide">
          <p className="label-sm mb-3">{t("subtitle")}</p>
          <div className="divider-gold" />
          <h1 className="heading-display mt-2">{t("title")}</h1>
        </div>
      </section>

      {/* Photos */}
      <section className="section-padding bg-cream-50 pt-0">
        <div className="container-wide">
          <GalleryGrid items={localizedItems} locale={locale} />
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="section-padding bg-cream-100">
          <div className="container-wide">
            <p className="label-sm mb-3 text-center">{locale === "fr" ? "À l'écoute" : "Listen"}</p>
            <div className="divider-gold mx-auto mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((v) => (
                <div key={v._id}>
                  <YoutubeEmbed url={v.youtubeUrl} title={v.title?.[locale as "fr" | "en"] ?? v.title?.fr} />
                  <p className="mt-3 font-serif text-lg">
                    {v.title?.[locale as "fr" | "en"] ?? v.title?.fr}
                  </p>
                  {v.description?.[locale as "fr" | "en"] && (
                    <p className="text-sm text-ink-500 mt-1">
                      {v.description?.[locale as "fr" | "en"]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
