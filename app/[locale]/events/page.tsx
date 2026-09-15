import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getEvents, type SanityEvent } from "@/sanity/lib/fetch";
import { MapPin, Calendar, Clock, Lock, ExternalLink, Mail, Phone, User } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  unstable_setRequestLocale(locale);
  return { title: locale === "fr" ? "Événements — Victoria Reindale" : "Events — Victoria Reindale" };
}

export default async function EventsPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("events");
  const prefix = locale === "en" ? "/en" : "";

  const events = await getEvents();
  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.date) >= now);
  const past = events.filter((e) => new Date(e.date) < now).reverse();

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString(locale === "fr" ? "fr-FR" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderEvent = (ev: SanityEvent) => {
    const evDate = new Date(ev.date);
    const hasTime = evDate.getHours() !== 0 || evDate.getMinutes() !== 0;

    return (
      <article key={ev._id} className="grid grid-cols-1 sm:grid-cols-4 gap-6 py-8 border-b border-cream-300 last:border-0">
        {/* Date column */}
        <div className="sm:col-span-1 flex sm:flex-col items-center sm:items-start gap-3">
          <div className="text-center sm:text-left">
            <p className="font-serif text-4xl text-gold-600 leading-none">
              {evDate.getDate().toString().padStart(2, "0")}
            </p>
            <p className="text-sm text-ink-500 uppercase tracking-wider mt-1">
              {evDate.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", { month: "short" })}
            </p>
            <p className="text-xs text-ink-400">
              {evDate.getFullYear()}
            </p>
            {hasTime && (
              <p className="flex items-center gap-1 text-xs text-gold-700 mt-2">
                <Clock size={12} />
                <span>{formatTime(ev.date)}</span>
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h2 className="font-serif text-xl text-ink-900">
              {ev.title?.[locale as "fr" | "en"] ?? ev.title?.fr ?? "Concert"}
            </h2>
            {ev.isPrivate && (
              <span className="flex items-center gap-1 text-xs text-ink-400 bg-cream-200 px-2 py-0.5 rounded-full">
                <Lock size={10} /> {t("private")}
              </span>
            )}
          </div>

          {ev.venue && (
            <div className="flex items-start gap-1.5 text-sm text-ink-500 mb-3">
              <MapPin size={14} className="text-gold-500 shrink-0 mt-0.5" />
              <span>
                {[ev.venue.name, ev.venue.address, ev.venue.city, ev.venue.country].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}

          {!ev.isPrivate && ev.description?.[locale as "fr" | "en"] && (
            <p className="text-sm text-ink-500 leading-relaxed mb-3 whitespace-pre-line">
              {ev.description[locale as "fr" | "en"]}
            </p>
          )}

          {/* Contacts info if provided */}
          {!ev.isPrivate && ev.contacts && (ev.contacts.email || ev.contacts.phone || ev.contacts.organizer) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400 mt-2 pt-2 border-t border-cream-200">
              {ev.contacts.organizer && (
                <span className="flex items-center gap-1">
                  <User size={11} className="text-gold-500" /> {ev.contacts.organizer}
                </span>
              )}
              {ev.contacts.email && (
                <a href={`mailto:${ev.contacts.email}`} className="flex items-center gap-1 hover:text-gold-600 transition-colors">
                  <Mail size={11} className="text-gold-500" /> {ev.contacts.email}
                </a>
              )}
              {ev.contacts.phone && (
                <a href={`tel:${ev.contacts.phone}`} className="flex items-center gap-1 hover:text-gold-600 transition-colors">
                  <Phone size={11} className="text-gold-500" /> {ev.contacts.phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Image + ticket */}
        <div className="sm:col-span-1 flex flex-col gap-4 items-start sm:items-end">
          {ev.image && !ev.isPrivate && (
            <div className="relative w-full sm:w-28 aspect-square overflow-hidden img-hover rounded-sm shadow-sm bg-cream-100">
              <Image
                src={ev.image}
                alt={ev.imageAlt || ev.title?.fr || "Concert photo"}
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
  };

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
