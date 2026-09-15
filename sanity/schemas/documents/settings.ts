import { defineType, defineField } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings & Content',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'localeString',
      description: 'Main heading on homepage hero (e.g. Victoria Reindale)',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'localeString',
      description: 'Tagline beneath the name (e.g. Soprano · Vocal Artist)',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background / Portrait Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bioPhoto',
      title: 'Biography Section Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'biography',
      title: 'Biography Text',
      type: 'localeText',
      description: 'Full artist biography presented on the About & Home pages',
    }),
    defineField({
      name: 'email',
      title: 'Primary Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Primary Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'socialInstagram',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'socialYoutube',
      title: 'YouTube Channel URL',
      type: 'url',
    }),
    defineField({
      name: 'socialSpotify',
      title: 'Spotify / Streaming URL',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle.fr',
      subtitle: 'heroSubtitle.fr',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Site Settings',
        subtitle: subtitle || 'Global website texts and branding',
      }
    },
  },
})
