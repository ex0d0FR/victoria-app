import { defineType, defineField } from 'sanity'

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: false },
    },
  ],
  fields: [
    defineField({
      title: 'Français (FR)',
      name: 'fr',
      type: 'text',
      rows: 4,
    }),
    defineField({
      title: 'English (EN)',
      name: 'en',
      type: 'text',
      rows: 4,
    }),
  ],
})
