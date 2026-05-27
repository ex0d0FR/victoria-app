import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Témoignage",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "text", rows: 4, validation: (R) => R.required() },
        { name: "en", title: "English",  type: "text", rows: 4 },
      ],
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "occasion",
      title: "Occasion",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "string", placeholder: "Ex: Mariage, Château de Versailles" },
        { name: "en", title: "English",  type: "string" },
      ],
    }),
    defineField({
      name: "order",
      title: "Ordre",
      type: "number",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "author", subtitle: "occasion.fr" },
  },
});
