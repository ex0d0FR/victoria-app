import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { client, urlFor } from "@/sanity/client";
import {
  SITE_SETTINGS_QUERY,
  UPCOMING_EVENTS_QUERY,
  SERVICES_QUERY,
  TESTIMONIALS_QUERY,
  VIDEOS_QUERY,
} from "@/sanity/queries";
import { YoutubeEmbed } from "@/components/ui/YoutubeEmbed";
import { ChevronDown } from "lucide-react";

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t   = await getTranslations("hero");
  const tS  = await getTranslations("services");
  const tE  = await getTranslations("events");
  const prefix = locale === "en" ? "/en" : "";

  const [settings, events, services, testimonials, videos] = await Promise.all([
    client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
    client.fetch(UPCOMING_EVENTS_QUERY).catch(() => []),
    client.fetch(SERVICES_QUERY).catch(() => []),
    client.fetch(TESTIMONIALS_QUERY).catch(() => []),
    client.fetch(VIDEOS_QUERY).catch(() => []),
  ]);

  const heroTitle    = settings?.heroTitle?.[locale]    ?? "Victoria Reindale";
  const heroSubtitle = settings?.heroSubtitle?.[locale] ?? "Soprano · Artiste Vocale";

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-ink-900 flex flex-col lg:flex-row overflow-hidden">

        {/* ── Photo — top on mobile, right on desktop ── */}
        <div className="
          relative order-first lg:order-last
          w-full h-[60vw] sm:h-[55vw]
          lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full
          overflow-hidden
        ">
          <Image
            src={
              settings?.heroImage
                ? urlFor(settings.heroImage).width(1200).quality(90).url()
                : "/images/victoria-main.png"
            }
            alt={heroTitle}
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "50% 18%" }}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Mobile: fade bottom edge into dark section below */}
          <div className="lg:hidden absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900 to-transparent" />
          {/* Desktop: fade left edge so text section blends in */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-ink-900 to-transparent" />
        </div>

        {/* ── Text — below photo on mobile, left half on desktop ── */}
        <div className="
          relative z-10 order-last lg:order-first
          w-full lg:w-1/2
          flex flex-col justify-center
          px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24
          pt-2 pb-20 lg:py-0 lg:min-h-screen
        ">
          <div className="max-w-lg animate-fade-up">
            <p className="label-sm text-gold-400 mb-4">Soprano</p>
            <h1 className="heading-display text-cream-50 mb-6">{heroTitle}</h1>
            <p className="text-cream-200 text-base sm:text-lg md:text-xl font-light mb-10 max-w-md leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link href={`${prefix}/contact`} className="btn-gold">
                {t("cta_primary")}
              </Link>
              <Link
                href={`${prefix}/about`}
                className="btn-outline border-cream-200 text-cream-200 hover:bg-cream-50 hover:text-ink-900"
              >
                {t("cta_secondary")}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cream-200/60 animate-bounce z-10">
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ── UPCOMING EVENTS STRIP ─────────────────────────────── */}
      {events?.length > 0 && (
        <section className="bg-cream-200 border-y border-cream-300 overflow-hidden">
          <div className="container-wide px-6 md:px-12 lg:px-20 py-5 flex items-center gap-6">
            <span className="label-sm text-gold-600 whitespace-nowrap shrink-0">{tE("subtitle")}</span>
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {events.map((ev: { _id: string; title: { fr: string; en: string }; date: string; venue?: { city?: string }; isPrivate?: boolean }) => (
                <div key={ev._id} className="flex items-center gap-3 shrink-0">
                  <span className="text-gold-600 font-serif text-sm">
                    {new Date(ev.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
                      day: "2-digit", month: "short",
                    })}
                  </span>
                  <span className="text-sm text-ink-700">
                    {ev.title?.[locale as "fr" | "en"] ?? ev.title?.fr}
                    {ev.venue?.city && ` · ${ev.venue.city}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT TEASER ──────────────────────────────────────── */}
      <section className="section-padding bg-cream-50">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="label-sm mb-4">Victoria Reindale</p>
            <div className="divider-gold" />
            <h2 className="heading-lg mb-6">
              {locale === "fr"
                ? "Une voix pour chaque moment précieux"
                : "A voice for every precious moment"}
            </h2>
            <p className="text-ink-500 leading-relaxed mb-8 max-w-lg">
              {locale === "fr"
                ? "Soprano lyrique légère, Victoria Reindale propose des prestations musicales raffinées pour vos cérémonies de mariage, concerts privés et événements d'exception."
                : "Lyric soprano, Victoria Reindale offers refined musical performances for wedding ceremonies, private concerts and exclusive events."}
            </p>
            <Link href={`${prefix}/about`} className="btn-outline">
              {locale === "fr" ? "En savoir plus" : "Learn more"}
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative aspect-[3/4] overflow-hidden img-hover">
            <Image
              src={
                settings?.bioPhoto
                  ? urlFor(settings.bioPhoto).width(800).quality(85).url()
                  : "/images/victoria-gallery-3.png"
              }
              alt="Victoria Reindale"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ──────────────────────────────────── */}
      {services?.length > 0 && (
        <section className="section-padding bg-cream-100">
          <div className="container-wide">
            <div className="text-center mb-14">
              <p className="label-sm mb-3">{tS("title")}</p>
              <div className="divider-gold mx-auto" />
              <h2 className="heading-lg">{tS("subtitle")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((s: {
                _id: string;
                title: { fr: string; en: string };
                description: { fr: string; en: string };
                priceFrom?: number;
                depositAmount?: number;
              }) => (
                <div key={s._id} className="card-border p-8 group">
                  <h3 className="heading-md mb-3">
                    {s.title?.[locale as "fr" | "en"] ?? s.title?.fr}
                  </h3>
                  <p className="text-sm text-ink-500 leading-relaxed mb-6">
                    {s.description?.[locale as "fr" | "en"] ?? s.description?.fr}
                  </p>
                  <p className="text-gold-600 font-medium text-sm">
                    {s.priceFrom
                      ? `${tS("price_from")} ${s.priceFrom.toLocaleString(locale === "fr" ? "fr-FR" : "en-GB")} €`
                      : tS("on_quote")}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href={`${prefix}/services`} className="btn-outline">
                {locale === "fr" ? "Voir toutes les formules" : "View all services"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      {testimonials?.length > 0 && (
        <section className="section-padding bg-ink-900 text-cream-50">
          <div className="container-narrow text-center">
            <p className="label-sm text-gold-400 mb-6">
              {locale === "fr" ? "Témoignages" : "Testimonials"}
            </p>
            <div className="divider-gold mx-auto bg-gold-400" />
            <div className="mt-10 space-y-14">
              {testimonials.slice(0, 2).map((tm: {
                _id: string;
                quote: { fr: string; en: string };
                author: string;
                occasion: { fr: string; en: string };
              }) => (
                <blockquote key={tm._id}>
                  <p className="font-serif text-2xl md:text-3xl text-cream-100 leading-relaxed mb-6 italic">
                    &ldquo;{tm.quote?.[locale as "fr" | "en"] ?? tm.quote?.fr}&rdquo;
                  </p>
                  <footer>
                    <p className="font-medium text-cream-50">{tm.author}</p>
                    <p className="text-sm text-ink-300 mt-1">
                      {tm.occasion?.[locale as "fr" | "en"] ?? tm.occasion?.fr}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEO PREVIEW ─────────────────────────────────────── */}
      {videos?.length > 0 && (
        <section className="section-padding bg-cream-50">
          <div className="container-wide">
            <div className="text-center mb-12">
              <p className="label-sm mb-3">{locale === "fr" ? "À l'écoute" : "Listen"}</p>
              <div className="divider-gold mx-auto" />
              <h2 className="heading-lg">{locale === "fr" ? "Vidéos" : "Videos"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.slice(0, 2).map((v: { _id: string; title: { fr: string; en: string }; youtubeUrl: string }) => (
                <div key={v._id}>
                  <YoutubeEmbed url={v.youtubeUrl} title={v.title?.[locale as "fr" | "en"] ?? v.title?.fr} />
                  <p className="mt-3 text-sm text-ink-500">
                    {v.title?.[locale as "fr" | "en"] ?? v.title?.fr}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href={`${prefix}/gallery`} className="btn-outline">
                {locale === "fr" ? "Voir la galerie complète" : "View full gallery"}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BAND ──────────────────────────────────────────── */}
      <section className="section-padding bg-cream-200">
        <div className="container-narrow text-center">
          <p className="label-sm mb-4">{locale === "fr" ? "Votre événement" : "Your event"}</p>
          <div className="divider-gold mx-auto" />
          <h2 className="heading-lg mb-6">
            {locale === "fr" ? "Donnez voix à votre moment" : "Give voice to your moment"}
          </h2>
          <p className="text-ink-500 mb-10 max-w-lg mx-auto">
            {locale === "fr"
              ? "Contactez-moi pour discuter de votre projet et recevoir un devis personnalisé."
              : "Contact me to discuss your project and receive a personalised quote."}
          </p>
          <Link href={`${prefix}/contact`} className="btn-primary">
            {locale === "fr" ? "Prendre contact" : "Get in touch"}
          </Link>
        </div>
      </section>
    </>
  );
}
