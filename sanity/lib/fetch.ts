import { client } from './client'
import {
  allEventsQuery,
  settingsQuery,
  videosQuery,
  galleryQuery,
  servicesQuery,
  testimonialsQuery,
} from './queries'
import * as mockData from '@/data/mock'

export type SanityEvent = {
  _id: string
  title: { fr: string; en: string }
  date: string
  endDate?: string
  venue?: {
    name?: string
    address?: string
    city?: string
    country?: string
    mapUrl?: string
  }
  contacts?: {
    organizer?: string
    email?: string
    phone?: string
    notes?: string
  }
  description?: { fr: string; en: string }
  image?: string
  imageAlt?: string
  ticketUrl?: string
  isPrivate?: boolean
}

export type SanitySettings = {
  heroTitle?: { fr: string; en: string }
  heroSubtitle?: { fr: string; en: string }
  heroImage?: string
  bioPhoto?: string
  biography?: { fr: string; en: string }
  email?: string
  phone?: string
  socialInstagram?: string
  socialYoutube?: string
  socialSpotify?: string
}

export type SanityVideo = {
  _id: string
  title: { fr: string; en: string }
  description?: { fr: string; en: string }
  youtubeUrl: string
}

export type SanityGalleryItem = {
  _id: string
  title?: { fr: string; en: string }
  caption?: { fr: string; en: string }
  category?: string
  src: string
  alt?: { fr: string; en: string }
}

export type SanityService = {
  _id: string
  title: { fr: string; en: string }
  description?: { fr: string; en: string }
  occasions?: { fr: string; en: string }
  duration?: { fr: string; en: string }
  priceFrom?: number
  depositAmount?: number
}

export type SanityTestimonial = {
  _id: string
  author: string
  occasion?: { fr: string; en: string }
  quote: { fr: string; en: string }
}

export async function getEvents(): Promise<SanityEvent[]> {
  try {
    const data = await client.fetch<SanityEvent[]>(
      allEventsQuery,
      {},
      { next: { revalidate: 30 } }
    )
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Failed to fetch events from Sanity, falling back to mock data:', err)
  }
  return mockData.events as unknown as SanityEvent[]
}

export async function getSettings(): Promise<SanitySettings> {
  try {
    const data = await client.fetch<SanitySettings>(
      settingsQuery,
      {},
      { next: { revalidate: 60 } }
    )
    if (data && (data.heroTitle || data.biography || data.heroImage)) {
      return {
        ...mockData.settings,
        ...data,
      }
    }
  } catch (err) {
    console.warn('Failed to fetch settings from Sanity, falling back to mock data:', err)
  }
  return mockData.settings as unknown as SanitySettings
}

export async function getVideos(): Promise<SanityVideo[]> {
  try {
    const data = await client.fetch<SanityVideo[]>(
      videosQuery,
      {},
      { next: { revalidate: 60 } }
    )
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Failed to fetch videos from Sanity, falling back to mock data:', err)
  }
  return mockData.videos as unknown as SanityVideo[]
}

export async function getGalleryItems(): Promise<any[]> {
  try {
    const data = await client.fetch<SanityGalleryItem[]>(
      galleryQuery,
      {},
      { next: { revalidate: 60 } }
    )
    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item._id,
        src: item.src,
        thumb: item.src,
        alt: item.title || { fr: 'Victoria Reindale', en: 'Victoria Reindale' },
        caption: item.caption || { fr: '', en: '' },
        category: item.category || 'portrait',
      }))
    }
  } catch (err) {
    console.warn('Failed to fetch gallery from Sanity, falling back to mock data:', err)
  }
  return mockData.galleryItems
}

export async function getServices(): Promise<any[]> {
  try {
    const data = await client.fetch<SanityService[]>(
      servicesQuery,
      {},
      { next: { revalidate: 60 } }
    )
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Failed to fetch services from Sanity, falling back to mock data:', err)
  }
  return mockData.services
}

export async function getTestimonials(): Promise<SanityTestimonial[]> {
  try {
    const data = await client.fetch<SanityTestimonial[]>(
      testimonialsQuery,
      {},
      { next: { revalidate: 60 } }
    )
    if (data && data.length > 0) return data
  } catch (err) {
    console.warn('Failed to fetch testimonials from Sanity, falling back to mock data:', err)
  }
  return mockData.testimonials as unknown as SanityTestimonial[]
}
