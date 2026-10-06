import { isAuthenticated } from './auth'
import { LoginForm } from './components/LoginForm'
import { AdminDashboard } from './components/AdminDashboard'
import {
  getEvents,
  getServices,
  getSettings,
  getGalleryItems,
  getVideos,
} from '@/sanity/lib/fetch'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const isAuthed = await isAuthenticated()

  if (!isAuthed) {
    return <LoginForm />
  }

  const [events, services, settings, galleryItems, videos] = await Promise.all([
    getEvents(),
    getServices(),
    getSettings(),
    getGalleryItems(),
    getVideos(),
  ])

  return (
    <AdminDashboard
      events={events}
      services={services}
      settings={settings}
      galleryItems={galleryItems}
      videos={videos}
    />
  )
}
