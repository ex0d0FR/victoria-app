'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  basePath: '/studio',
  projectId: projectId || 'demo-project-id',
  dataset: dataset || 'production',
  title: 'Victoria Soprano CMS',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title('Site Settings & Biography')
              .id('settings')
              .child(
                S.document()
                  .schemaType('settings')
                  .documentId('settings')
              ),
            S.divider(),
            // Regular document types
            S.documentTypeListItem('event').title('Events & Performances'),
            S.documentTypeListItem('video').title('Videos & Performance Recordings'),
            S.documentTypeListItem('galleryItem').title('Photo Gallery'),
            S.documentTypeListItem('service').title('Services & Rates'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
          ]),
    }),
  ],
})
