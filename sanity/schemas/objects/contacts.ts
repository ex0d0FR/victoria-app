import { defineType, defineField } from 'sanity'

export const contacts = defineType({
  name: 'contacts',
  title: 'Event Contact & Info',
  type: 'object',
  fields: [
    defineField({
      name: 'organizer',
      title: 'Organizer / Host Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Contact Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Additional Booking Notes',
      type: 'string',
    }),
  ],
})
