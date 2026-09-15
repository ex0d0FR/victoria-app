import { groq } from 'next-sanity'

// Events Queries
export const upcomingEventsQuery = groq`
  *[_type == "event" && dateTime(date) >= dateTime(now())] | order(date asc) {
    _id,
    title,
    date,
    endDate,
    venue,
    contacts,
    ticketUrl,
    isPrivate,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt
  }
`

export const pastEventsQuery = groq`
  *[_type == "event" && dateTime(date) < dateTime(now())] | order(date desc) {
    _id,
    title,
    date,
    endDate,
    venue,
    contacts,
    ticketUrl,
    isPrivate,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt
  }
`

export const allEventsQuery = groq`
  *[_type == "event"] | order(date asc) {
    _id,
    title,
    date,
    endDate,
    venue,
    contacts,
    ticketUrl,
    isPrivate,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt
  }
`

// Settings Query (Global texts, bio, social links)
export const settingsQuery = groq`
  *[_type == "settings"][0] {
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url,
    "bioPhoto": bioPhoto.asset->url,
    biography,
    email,
    phone,
    socialInstagram,
    socialYoutube,
    socialSpotify
  }
`

// Videos Query
export const videosQuery = groq`
  *[_type == "video"] | order(order asc, _createdAt desc) {
    _id,
    title,
    youtubeUrl,
    description
  }
`

// Gallery Query
export const galleryQuery = groq`
  *[_type == "galleryItem"] | order(order asc, _createdAt desc) {
    _id,
    title,
    caption,
    category,
    "src": image.asset->url,
    "alt": title
  }
`

// Services Query
export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    description,
    occasions,
    duration,
    priceFrom,
    depositAmount
  }
`

// Testimonials Query
export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id,
    author,
    occasion,
    quote
  }
`
