import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Vidéo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "string", validation: (R) => R.required() },
        { name: "en", title: "English",  type: "string" },
      ],
    }),
    defineField({
      name: "youtubeUrl",
      title: "URL YouTube",
      type: "url",
      validation: (R) => R.required().uri({ scheme: ["https"] }),
      description: "Ex: https://www.youtube.com/watch?v=xxxxxxx",
    }),
    defineField({
      name: "description",
      title: "Description (optionnel)",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "text", rows: 2 },
        { name: "en", title: "English",  type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "title.fr", subtitle: "youtubeUrl" },
  },
});
