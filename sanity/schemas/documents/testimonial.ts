import { defineType, defineField } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonials & Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Client / Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'occasion',
      title: 'Occasion / Event Context',
      type: 'localeString',
      description: 'e.g. Mariage à Paris / Private Wedding in Paris',
    }),
    defineField({
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'localeText',
      validation: (Rule) => Rule.required(),
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
      title: 'author',
      subtitle: 'occasion.fr',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      }
    },
  },
})
