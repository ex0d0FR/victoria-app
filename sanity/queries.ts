import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    heroTitle, heroSubtitle,
    heroImage { asset->{ url, metadata { dimensions } }, hotspot, crop },
    biographyFr, biographyEn,
    bioPhoto { asset->{ url, metadata { dimensions } }, hotspot, crop },
    socialInstagram, socialYoutube, socialFacebook,
    phone, email, seoDescription
  }
`;

export const EVENTS_QUERY = groq`
  *[_type == "event"] | order(date asc) {
    _id, title, date, endDate, venue, description,
    image { asset->{ url, metadata { dimensions } }, hotspot, crop },
    ticketUrl, isPrivate
  }
`;

export const UPCOMING_EVENTS_QUERY = groq`
  *[_type == "event" && date >= now()] | order(date asc) [0...4] {
    _id, title, date, venue, isPrivate, ticketUrl,
    image { asset->{ url, metadata { dimensions } } }
  }
`;

export const SERVICES_QUERY = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, slug, formation, description, occasions,
    priceFrom, depositAmount, duration
  }
`;

export const GALLERY_QUERY = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id, alt, caption, category,
    image { asset->{ url, metadata { dimensions } }, hotspot, crop }
  }
`;

export const VIDEOS_QUERY = groq`
  *[_type == "video"] | order(order asc) {
    _id, title, youtubeUrl, description
  }
`;

export const TESTIMONIALS_QUERY = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, quote, author, occasion
  }
`;
