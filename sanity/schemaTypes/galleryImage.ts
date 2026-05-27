import { defineField, defineType } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Photo de galerie",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "alt",
      title: "Description (alt text)",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "string" },
        { name: "en", title: "English",  type: "string" },
      ],
    }),
    defineField({
      name: "caption",
      title: "Légende (optionnel)",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "string" },
        { name: "en", title: "English",  type: "string" },
      ],
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Concert",  value: "concert" },
          { title: "Mariage",  value: "wedding" },
          { title: "Portrait", value: "portrait" },
          { title: "Coulisse", value: "backstage" },
        ],
      },
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: "Ordre", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "alt.fr", media: "image" },
    prepare({ title, media }) {
      return { title: title ?? "Sans titre", media };
    },
  },
});
