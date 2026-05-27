import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { client, urlFor } from "@/sanity/client";
import { EVENTS_QUERY } from "@/sanity/queries";
import { MapPin, Calendar, Lock, ExternalLink } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return { title: locale === "fr" ? "Événements — Victoria Reindale" : "Events — Victoria Reindale" };
}

type Event = {
  _id: string;
  title: { fr: string; en: string };
  date: string;
  endDate?: string;
  venue?: { name?: string; city?: string; country?: string };
  description?: { fr: string; en: string };
  image?: object;
  ticketUrl?: string;
  isPrivate?: boolean;
};

export default async function EventsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("events");
  const prefix = locale === "en" ? "/en" : "";

  const events: Event[] = await client.fetch(EVENTS_QUERY).catch(() => []);
  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past     = events.filter((e) => new Date(e.date) <  now).reverse();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

  const renderEvent = (ev: Event) => (
    <article key={ev._id} className="grid grid-cols-1 sm:grid-cols-4 gap-6 py-8 border-b border-cream-300 last:border-0">
      {/* Date column */}
      <div className="sm:col-span-1 flex sm:flex-col items-center sm:items-start gap-3">
        <div className="text-center sm:text-left">
          <p className="font-serif text-4xl text-gold-600 leading-none">
            {new Date(ev.date).getDate().toString().padStart(2, "0")}
          </p>
          <p className="text-sm text-ink-500 uppercase tracking-wider mt-1">
            {new Date(ev.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { month: "short" })}
          </p>
          <p className="text-xs text-ink-400">
            {new Date(ev.date).getFullYear()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="sm:col-span-2">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="font-serif text-xl text-ink-900">
            {ev.title?.[locale as "fr" | "en"] ?? ev.title?.fr}
          </h2>
          {ev.isPrivate && (
            <span className="flex items-center gap-1 text-xs text-ink-400">
              <Lock size={10} /> {t("private")}
            </span>
          )}
        </div>

        {ev.venue && (
          <div className="flex items-center gap-1.5 text-sm text-ink-500 mb-3">
            <MapPin size={13} className="text-gold-500 shrink-0" />
            <span>
              {[ev.venue.name, ev.venue.city, ev.venue.country].filter(Boolean).join(" · ")}
            </span>
          </div>
        )}

        {!ev.isPrivate && ev.description?.[locale as "fr" | "en"] && (
          <p className="text-sm text-ink-500 leading-relaxed">
            {ev.description[locale as "fr" | "en"]}
          </p>
        )}
      </div>

      {/* Image + ticket */}
      <div className="sm:col-span-1 flex flex-col gap-4 items-start sm:items-end">
        {ev.image && !ev.isPrivate && (
          <div className="relative w-full sm:w-28 aspect-square overflow-hidden img-hover">
            <Image
              src={urlFor(ev.image).width(200).quality(80).url()}
              alt={ev.title?.fr ?? ""}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        )}
        {ev.ticketUrl && !ev.isPrivate && (
          <a
            href={ev.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors"
          >
            {t("tickets")} <ExternalLink size={11} />
          </a>
        )}
      </div>
    </article>
  );

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

      {/* Upcoming */}
      <section className="section-padding bg-cream-50 pt-0">
        <div className="container-wide">
          {upcoming.length === 0 ? (
            <div className="py-20 text-center">
              <Calendar size={32} className="text-ink-300 mx-auto mb-4" />
              <p className="text-ink-400">{t("no_events")}</p>
              <div className="mt-8">
                <Link href={`${prefix}/contact`} className="btn-outline text-sm">
                  {locale === "fr" ? "Contactez-moi pour une prestation privée" : "Contact me for a private performance"}
                </Link>
              </div>
            </div>
          ) : (
            <div>{upcoming.map(renderEvent)}</div>
          )}
        </div>
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section className="section-padding bg-cream-100">
          <div className="container-wide">
            <p className="label-sm mb-6 text-ink-400">
              {locale === "fr" ? "Événements passés" : "Past events"}
            </p>
            <div className="opacity-60">{past.slice(0, 6).map(renderEvent)}</div>
          </div>
        </section>
      )}
    </div>
  );
}
