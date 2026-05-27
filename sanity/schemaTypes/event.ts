import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Événement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "object",
      validation: (R) => R.required(),
      fields: [
        { name: "fr", title: "Français", type: "string", validation: (R) => R.required() },
        { name: "en", title: "English",  type: "string" },
      ],
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "endDate",
      title: "Date de fin (optionnel)",
      type: "datetime",
    }),
    defineField({
      name: "venue",
      title: "Lieu",
      type: "object",
      fields: [
        { name: "name", title: "Nom du lieu", type: "string" },
        { name: "city", title: "Ville",       type: "string" },
        { name: "country", title: "Pays",     type: "string", initialValue: "France" },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "text", rows: 3 },
        { name: "en", title: "English",  type: "text", rows: 3 },
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ticketUrl",
      title: "Lien billetterie (optionnel)",
      type: "url",
    }),
    defineField({
      name: "isPrivate",
      title: "Événement privé",
      type: "boolean",
      initialValue: false,
      description: "Les événements privés n'affichent pas les détails complets",
    }),
  ],
  orderings: [
    {
      title: "Date (croissant)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title.fr",
      date:  "date",
      media: "image",
    },
    prepare({ title, date, media }) {
      const d = date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "";
      return { title, subtitle: d, media };
    },
  },
});
