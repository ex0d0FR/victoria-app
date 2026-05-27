import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { client, urlFor } from "@/sanity/client";
import { GALLERY_QUERY, VIDEOS_QUERY } from "@/sanity/queries";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { YoutubeEmbed } from "@/components/ui/YoutubeEmbed";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return { title: locale === "fr" ? "Galerie — Victoria Reindale" : "Gallery — Victoria Reindale" };
}

type GalleryImage = {
  _id: string;
  image: object;
  alt: { fr: string; en: string };
  caption: { fr: string; en: string };
  category: string;
};

type Video = {
  _id: string;
  title: { fr: string; en: string };
  youtubeUrl: string;
  description: { fr: string; en: string };
};

export default async function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("gallery");

  const [images, videos]: [GalleryImage[], Video[]] = await Promise.all([
    client.fetch(GALLERY_QUERY).catch(() => []),
    client.fetch(VIDEOS_QUERY).catch(() => []),
  ]);

  // Local fallbacks shown before Sanity is configured
  const LOCAL_FALLBACKS = [
    {
      id: "local-1",
      src: "/images/victoria-main.png",
      thumb: "/images/victoria-main.png",
      alt: locale === "fr" ? "Victoria Reindale — portrait" : "Victoria Reindale — portrait",
      caption: "",
      category: "portrait",
    },
    {
      id: "local-2",
      src: "/images/victoria-gallery-1.png",
      thumb: "/images/victoria-gallery-1.png",
      alt: locale === "fr" ? "Victoria Reindale" : "Victoria Reindale",
      caption: "",
      category: "portrait",
    },
    {
      id: "local-3",
      src: "/images/victoria-gallery-2.png",
      thumb: "/images/victoria-gallery-2.png",
      alt: locale === "fr" ? "Victoria au piano Steinway" : "Victoria at the Steinway piano",
      caption: locale === "fr" ? "Au piano" : "At the piano",
      category: "backstage",
    },
    {
      id: "local-4",
      src: "/images/victoria-gallery-3.png",
      thumb: "/images/victoria-gallery-3.png",
      alt: locale === "fr" ? "Victoria en studio" : "Victoria in studio",
      caption: locale === "fr" ? "En studio" : "In studio",
      category: "backstage",
    },
    {
      id: "local-5",
      src: "/images/victoria-gallery-4.png",
      thumb: "/images/victoria-gallery-4.png",
      alt: "Victoria Reindale",
      caption: "",
      category: "portrait",
    },
  ];

  // Build image data for the client component — use Sanity if available, otherwise locals
  const galleryItems = images.length > 0
    ? images.map((img) => ({
        id: img._id,
        src: urlFor(img.image).width(1200).quality(85).url(),
        thumb: urlFor(img.image).width(600).quality(80).url(),
        alt: img.alt?.[locale as "fr" | "en"] ?? img.alt?.fr ?? "",
        caption: img.caption?.[locale as "fr" | "en"] ?? img.caption?.fr ?? "",
        category: img.category ?? "portrait",
      }))
    : LOCAL_FALLBACKS;

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
          <GalleryGrid items={galleryItems} locale={locale} />
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
