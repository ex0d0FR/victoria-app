import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "victoria-soprano",
  title: "Victoria Reindale — Studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenu")
          .items([
            S.listItem()
              .title("⚙️  Paramètres du site")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.divider(),
            S.listItem()
              .title("📅  Événements")
              .schemaType("event")
              .child(S.documentTypeList("event").title("Événements")),
            S.listItem()
              .title("🎵  Services & Formules")
              .schemaType("service")
              .child(S.documentTypeList("service").title("Services")),
            S.listItem()
              .title("🖼️  Galerie photos")
              .schemaType("galleryImage")
              .child(S.documentTypeList("galleryImage").title("Photos")),
            S.listItem()
              .title("🎬  Vidéos")
              .schemaType("video")
              .child(S.documentTypeList("video").title("Vidéos")),
            S.listItem()
              .title("🌟  Témoignages")
              .schemaType("testimonial")
              .child(S.documentTypeList("testimonial").title("Témoignages")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
