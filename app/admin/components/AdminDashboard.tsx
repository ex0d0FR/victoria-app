'use client'

import { useState } from 'react'
import { Calendar, Tag, User, Image as ImageIcon, Video as VideoIcon } from 'lucide-react'
import { EventsTab } from './EventsTab'
import { ServicesTab } from './ServicesTab'
import { SettingsTab } from './SettingsTab'
import { GalleryTab } from './GalleryTab'
import { VideosTab } from './VideosTab'
import type { SanityEvent, SanityService, SanitySettings, SanityVideo } from '@/sanity/lib/fetch'

type Props = {
  events: SanityEvent[]
  services: SanityService[]
  settings: SanitySettings
  galleryItems: any[]
  videos: SanityVideo[]
}

const TABS = [
  { id: 'events', label: 'Concerts & Événements', icon: Calendar },
  { id: 'services', label: 'Formules & Tarifs', icon: Tag },
  { id: 'settings', label: 'Profil & Biographie', icon: User },
  { id: 'gallery', label: 'Galerie Photo', icon: ImageIcon },
  { id: 'videos', label: 'Enregistrements Vidéo', icon: VideoIcon },
] as const

export function AdminDashboard({
  events,
  services,
  settings,
  galleryItems,
  videos,
}: Props) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('events')

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Metric summary badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('events')}
          className={`p-4 text-left border transition-all ${
            activeTab === 'events'
              ? 'bg-white border-gold-500 shadow-sm'
              : 'bg-white/70 border-cream-300 hover:border-gold-300'
          }`}
        >
          <span className="block text-xs text-ink-400 uppercase tracking-wider font-medium">Événements</span>
          <span className="font-serif text-2xl font-bold text-ink-900 mt-1 block">
            {events.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`p-4 text-left border transition-all ${
            activeTab === 'services'
              ? 'bg-white border-gold-500 shadow-sm'
              : 'bg-white/70 border-cream-300 hover:border-gold-300'
          }`}
        >
          <span className="block text-xs text-ink-400 uppercase tracking-wider font-medium">Formules</span>
          <span className="font-serif text-2xl font-bold text-ink-900 mt-1 block">
            {services.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`p-4 text-left border transition-all ${
            activeTab === 'gallery'
              ? 'bg-white border-gold-500 shadow-sm'
              : 'bg-white/70 border-cream-300 hover:border-gold-300'
          }`}
        >
          <span className="block text-xs text-ink-400 uppercase tracking-wider font-medium">Photos</span>
          <span className="font-serif text-2xl font-bold text-ink-900 mt-1 block">
            {galleryItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`p-4 text-left border transition-all ${
            activeTab === 'videos'
              ? 'bg-white border-gold-500 shadow-sm'
              : 'bg-white/70 border-cream-300 hover:border-gold-300'
          }`}
        >
          <span className="block text-xs text-ink-400 uppercase tracking-wider font-medium">Vidéos</span>
          <span className="font-serif text-2xl font-bold text-ink-900 mt-1 block">
            {videos.length}
          </span>
        </button>
      </div>

      {/* Tabs navigation bar */}
      <div className="border-b border-cream-300">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-xs sm:text-sm font-medium tracking-wide transition-colors relative flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'text-gold-600 font-semibold'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[500px]">
        {activeTab === 'events' && <EventsTab initialEvents={events} />}
        {activeTab === 'services' && <ServicesTab initialServices={services} />}
        {activeTab === 'settings' && <SettingsTab initialSettings={settings} />}
        {activeTab === 'gallery' && <GalleryTab initialItems={galleryItems} />}
        {activeTab === 'videos' && <VideosTab initialVideos={videos} />}
      </div>
    </div>
  )
}
