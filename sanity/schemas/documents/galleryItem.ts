import { defineType, defineField } from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Alt Description',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption / Location',
      type: 'localeString',
    }),
    defineField({
      name: 'image',
      title: 'Photo File',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Portrait', value: 'portrait' },
          { title: 'Concert & Scene', value: 'concert' },
          { title: 'Backstage & Rehearsal', value: 'backstage' },
        ],
        layout: 'radio',
      },
      initialValue: 'portrait',
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
      category: 'category',
      media: 'image',
    },
    prepare({ titleFr, titleEn, category, media }) {
      return {
        title: titleFr || titleEn || 'Untitled Photo',
        subtitle: category ? `Category: ${category}` : '',
        media,
      }
    },
  },
})
