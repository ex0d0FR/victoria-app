import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service / Formule",
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
      name: "slug",
      title: "Identifiant unique",
      type: "slug",
      options: { source: "title.fr" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "formation",
      title: "Formation musicale",
      type: "string",
      options: {
        list: [
          { title: "Solo (soprano)",                       value: "solo" },
          { title: "Duo voix – piano",                     value: "duo-piano" },
          { title: "Duo soprano – violoncelle",            value: "duo-cello" },
          { title: "Trio soprano – flûte – piano",         value: "trio-flute" },
          { title: "Trio soprano – ténor – piano",         value: "trio-tenor" },
          { title: "Trio soprano – mezzo – piano",         value: "trio-mezzo" },
          { title: "Ensemble vocal (SATB)",                value: "ensemble" },
        ],
      },
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
      name: "occasions",
      title: "Occasions idéales",
      type: "object",
      fields: [
        {
          name: "fr", title: "Français", type: "array",
          of: [{ type: "string" }],
          description: "Ex: Mariage, Concert privé, Gala…",
        },
        {
          name: "en", title: "English", type: "array",
          of: [{ type: "string" }],
        },
      ],
    }),
    defineField({
      name: "priceFrom",
      title: "Prix à partir de (€)",
      type: "number",
      description: "Laisser vide pour afficher « Sur devis »",
    }),
    defineField({
      name: "depositAmount",
      title: "Acompte de réservation (€)",
      type: "number",
      description: "Montant de l'acompte via Stripe. Ex: 150",
    }),
    defineField({
      name: "duration",
      title: "Durée typique",
      type: "object",
      fields: [
        { name: "fr", title: "Français", type: "string", placeholder: "Ex: 45 min – 1h30" },
        { name: "en", title: "English",  type: "string", placeholder: "Ex: 45 min – 1h30" },
      ],
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 99,
    }),
  ],
  orderings: [
    { title: "Ordre d'affichage", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title.fr", subtitle: "formation" },
  },
});
