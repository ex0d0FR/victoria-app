import { defineType, defineField } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Musical Services',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Name (e.g. Solo soprano, Duo voix-piano)',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localeText',
    }),
    defineField({
      name: 'occasions',
      title: 'Suitable Occasions (comma-separated or list)',
      type: 'localeString',
      description: 'e.g. Mariages, Funérailles, Concerts privés',
    }),
    defineField({
      name: 'duration',
      title: 'Typical Duration',
      type: 'localeString',
      description: 'e.g. 1 heure / 1 hour',
    }),
    defineField({
      name: 'priceFrom',
      title: 'Starting Price (CHF / EUR)',
      type: 'number',
    }),
    defineField({
      name: 'depositAmount',
      title: 'Deposit Amount (CHF / EUR)',
      type: 'number',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      titleFr: 'title.fr',
      titleEn: 'title.en',
      price: 'priceFrom',
    },
    prepare({ titleFr, titleEn, price }) {
      return {
        title: titleFr || titleEn || 'Service',
        subtitle: price ? `From ${price} CHF` : '',
      }
    },
  },
})
