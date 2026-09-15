import { defineType, defineField } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized String',
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
      type: 'string',
    }),
    defineField({
      title: 'English (EN)',
      name: 'en',
      type: 'string',
    }),
  ],
})
