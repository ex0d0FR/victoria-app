import type { SanityEvent, SanitySettings } from "@/sanity/lib/fetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://victoriareindalesoprano.com";

export function generatePersonSchema(settings?: SanitySettings, locale: string = "fr") {
  const sameAs: string[] = [];
  if (settings?.socialInstagram) sameAs.push(settings.socialInstagram);
  if (settings?.socialYoutube) sameAs.push(settings.socialYoutube);
  if (settings?.socialSpotify) sameAs.push(settings.socialSpotify);

  const heroImage = settings?.heroImage || `${SITE_URL}/images/victoria-main.png`;
  const description =
    settings?.biography?.[locale as "fr" | "en"] ||
    (locale === "fr"
      ? "Victoria Reindale est une soprano professionnelle et artiste vocale pour concerts, cérémonies et événements privés."
      : "Victoria Reindale is a professional soprano and vocal artist for concerts, ceremonies, and private events.");

  return {
    "@context": "https://schema.org",
    "@type": ["Person", "MusicGroup"],
    "@id": `${SITE_URL}/#victoria-reindale`,
    name: "Victoria Reindale",
    alternateName: "Victoria Reindale Soprano",
    url: SITE_URL,
    image: heroImage,
    jobTitle: locale === "fr" ? "Soprano & Artiste Vocale" : "Soprano & Vocal Artist",
    genre: ["Classical", "Opera", "Sacred Music"],
    description,
    email: settings?.email ? `mailto:${settings.email}` : undefined,
    telephone: settings?.phone || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function generateMusicEventSchema(events: SanityEvent[], locale: string = "fr") {
  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.date) >= now && !e.isPrivate);

  return upcomingEvents.map((event) => {
    const title = event.title[locale as "fr" | "en"] || event.title.fr || "Concert";
    const description = event.description?.[locale as "fr" | "en"] || event.description?.fr;
    const imageUrl = event.image || `${SITE_URL}/images/victoria-main.png`;

    return {
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: title,
      startDate: event.date,
      endDate: event.endDate || undefined,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: event.venue?.name || "Lieu à confirmer",
        address: {
          "@type": "PostalAddress",
          streetAddress: event.venue?.address || undefined,
          addressLocality: event.venue?.city || undefined,
          addressCountry: event.venue?.country || "FR",
        },
      },
      image: [imageUrl],
      description: description || undefined,
      performer: {
        "@type": "Person",
        name: "Victoria Reindale",
        url: SITE_URL,
      },
      offers: event.ticketUrl
        ? {
            "@type": "Offer",
            url: event.ticketUrl,
            availability: "https://schema.org/InStock",
          }
        : undefined,
    };
  });
}
