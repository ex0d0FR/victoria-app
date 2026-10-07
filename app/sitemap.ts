import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://victoriareindalesoprano.com'
  const currentDate = new Date()

  const routes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: 'about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: 'services', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: 'events', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: 'gallery', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: 'contact', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: 'payment', changeFrequency: 'yearly' as const, priority: 0.5 },
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    const frUrl = route.path ? `${baseUrl}/${route.path}` : baseUrl
    const enUrl = route.path ? `${baseUrl}/en/${route.path}` : `${baseUrl}/en`

    // French (default) entry
    sitemapEntries.push({
      url: frUrl,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          fr: frUrl,
          en: enUrl,
          'x-default': frUrl,
        },
      },
    })

    // English entry
    sitemapEntries.push({
      url: enUrl,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          fr: frUrl,
          en: enUrl,
          'x-default': frUrl,
        },
      },
    })
  }

  return sitemapEntries
}
