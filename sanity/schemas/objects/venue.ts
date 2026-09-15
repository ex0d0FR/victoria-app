import { defineType, defineField } from 'sanity'

export const venue = defineType({
  name: 'venue',
  title: 'Venue / Location',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Venue Name (e.g. Église Saint-Sulpice)',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City (e.g. Paris, Geneva)',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country (e.g. France, Switzerland)',
      type: 'string',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps Link',
      type: 'url',
    }),
  ],
})
