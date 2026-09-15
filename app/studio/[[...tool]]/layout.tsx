import type { Metadata, Viewport } from 'next'
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Victoria Soprano — Studio CMS',
}

export const viewport: Viewport = {
  ...studioViewport,
  interactiveWidget: 'resizes-content',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ height: '100vh', margin: 0, padding: 0 }}>
      {children}
    </div>
  )
}
