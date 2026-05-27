import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Titre principal (Hero)",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "string" },
        { name: "en", title: "English",  type: "string" },
      ],
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre (Hero)",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "text", rows: 2 },
        { name: "en", title: "English",  type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Photo principale (Hero)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "biographyFr",
      title: "Biographie (Français)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "biographyEn",
      title: "Biography (English)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "bioPhoto",
      title: "Photo biographie",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialInstagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "socialYoutube",
      title: "YouTube URL",
      type: "url",
    }),
    defineField({
      name: "socialFacebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email de contact",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Description SEO",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "text", rows: 2 },
        { name: "en", title: "English",  type: "text", rows: 2 },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Paramètres du site" }),
  },
});
