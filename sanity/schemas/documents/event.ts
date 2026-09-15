import { defineType, defineField } from 'sanity'
import { Calendar } from 'lucide-react'

export const event = defineType({
  name: 'event',
  title: 'Events & Performances',
  type: 'document',
  icon: Calendar as any,
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date & Time',
      type: 'datetime',
      description: 'The start date and time of the performance',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time (Optional)',
      type: 'datetime',
      description: 'Useful for multi-day festivals or specific end times',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),
    defineField({
      name: 'venue',
      title: 'Location / Venue',
      type: 'venue',
    }),
    defineField({
      name: 'contacts',
      title: 'Contact Information',
      type: 'contacts',
    }),
    defineField({
      name: 'image',
      title: 'Event Poster / Image',
      type: 'image',
      description: 'Upload an event poster or performance photo',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Important for accessibility and SEO',
        }),
      ],
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Ticket / Reservation Link',
      type: 'url',
      description: 'External link to buy tickets or register',
    }),
    defineField({
      name: 'isPrivate',
      title: 'Private Event?',
      type: 'boolean',
      description: 'If enabled, this event is shown as a private engagement without public links or full details',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Event Description',
      type: 'localeText',
    }),
  ],
  orderings: [
    {
      title: 'Event Date (Upcoming first)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Event Date (Most recent first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      titleFr: 'title.fr',
      titleEn: 'title.en',
      date: 'date',
      city: 'venue.city',
      media: 'image',
      isPrivate: 'isPrivate',
    },
    prepare({ titleFr, titleEn, date, city, media, isPrivate }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'No date'
      const title = titleFr || titleEn || 'Untitled Event'
      const subtitle = `${formattedDate} ${city ? `• ${city}` : ''} ${isPrivate ? '(Private)' : ''}`
      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
