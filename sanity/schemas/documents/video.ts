import { defineType, defineField } from 'sanity'

export const video = defineType({
  name: 'video',
  title: 'Videos & Performances',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Piece / Opera Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube or Vimeo Video Link',
      type: 'url',
      description: 'e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description / Performers',
      type: 'localeText',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      titleFr: 'title.fr',
      titleEn: 'title.en',
      url: 'youtubeUrl',
    },
    prepare({ titleFr, titleEn, url }) {
      return {
        title: titleFr || titleEn || 'Untitled Video',
        subtitle: url,
      }
    },
  },
})
