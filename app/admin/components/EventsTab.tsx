'use client'

import { useState } from 'react'
import { Plus, Trash2, Calendar, MapPin, ExternalLink, Lock, Upload, Loader2, Check } from 'lucide-react'
import { createEventAction, deleteEventAction, uploadImageAction } from '../actions'
import type { SanityEvent } from '@/sanity/lib/fetch'

export function EventsTab({ initialEvents }: { initialEvents: SanityEvent[] }) {
  const [events, setEvents] = useState(initialEvents)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedAssetId, setUploadedAssetId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state
  const [titleFr, setTitleFr] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [date, setDate] = useState('')
  const [venueName, setVenueName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [ticketUrl, setTicketUrl] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [descriptionFr, setDescriptionFr] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadImageAction(formData)
    setUploadingImage(false)

    if (res.success && res.assetId) {
      setUploadedAssetId(res.assetId)
      setImagePreview(res.url || URL.createObjectURL(file))
    } else {
      alert(res.error || 'Erreur lors du téléversement de l’image.')
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleFr || !date) {
      alert('Veuillez renseigner au moins le titre et la date.')
      return
    }

    setSubmitting(true)
    const res = await createEventAction({
      titleFr,
      titleEn,
      date,
      venueName,
      city,
      address,
      ticketUrl,
      isPrivate,
      descriptionFr,
      descriptionEn,
      assetId: uploadedAssetId || undefined,
    })
    setSubmitting(false)

    if (res.success && res.id) {
      const newEv: SanityEvent = {
        _id: res.id,
        title: { fr: titleFr, en: titleEn || titleFr },
        date: new Date(date).toISOString(),
        venue: { name: venueName, city, address },
        description: { fr: descriptionFr, en: descriptionEn || descriptionFr },
        ticketUrl,
        isPrivate,
        image: imagePreview || undefined,
      }
      setEvents([newEv, ...events])
      setIsAdding(false)
      // Reset
      setTitleFr('')
      setTitleEn('')
      setDate('')
      setVenueName('')
      setCity('')
      setAddress('')
      setTicketUrl('')
      setIsPrivate(false)
      setDescriptionFr('')
      setDescriptionEn('')
      setUploadedAssetId(null)
      setImagePreview(null)
    } else {
      alert(res.error || 'Erreur lors de la création.')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'événement "${title}" ?`)) return

    setDeletingId(id)
    const res = await deleteEventAction(id)
    setDeletingId(id)

    if (res.success) {
      setEvents(events.filter((e) => e._id !== id))
    } else {
      alert(res.error || 'Erreur lors de la suppression.')
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <h2 className="heading-md">Concerts & Événements</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Gérez vos apparitions publiques, dates de récitals et concerts privés.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-gold text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>{isAdding ? 'Fermer le formulaire' : 'Ajouter un événement'}</span>
        </button>
      </div>

      {/* Add Event Form Modal/Panel */}
      {isAdding && (
        <form onSubmit={handleCreate} className="card-border p-6 sm:p-8 bg-cream-50 space-y-6 animate-fade-up">
          <h3 className="font-serif text-lg text-ink-900 border-b border-cream-200 pb-2">
            Nouvel événement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Titre (Français) *</label>
              <input
                required
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex. Récital d'airs sacrés"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Titre (English)</label>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Ex. Sacred Arias Recital"
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Date & Heure *</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Lien billetterie (Optionnel)</label>
              <input
                type="url"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://billetterie.com/..."
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-sm block mb-1">Nom du lieu</label>
              <input
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Ex. Cathédrale Saint-Pierre"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Ville</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex. Genève / Paris"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Adresse</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex. Cour Saint-Pierre 6"
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Description (FR)</label>
              <textarea
                rows={3}
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                placeholder="Détails du programme, accompagnateurs…"
                className="form-input text-sm resize-none"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Description (EN)</label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Program details, accompanists…"
                className="form-input text-sm resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="label-sm block mb-1">Affiche / Photo (Optionnel)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="text-xs text-ink-600 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
              />
              {uploadingImage && <span className="text-xs text-gold-600 ml-2">Téléversement…</span>}
              {imagePreview && (
                <div className="mt-2 text-xs text-green-700 flex items-center gap-1">
                  <Check size={12} /> Image prête
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4 sm:pt-0">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-cream-300 text-gold-600 focus:ring-gold-500"
              />
              <label htmlFor="isPrivate" className="text-xs text-ink-700 cursor-pointer">
                Événement privé (masque les détails publics sur le site)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="btn-outline py-2 px-4 text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5"
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              <span>Enregistrer l&apos;événement</span>
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="card-border p-12 text-center text-ink-400 bg-white">
            Aucun événement enregistré pour le moment.
          </div>
        ) : (
          events.map((ev) => {
            const evDate = new Date(ev.date)
            const title = ev.title?.fr || ev.title?.en || 'Événement'
            const isDeleting = deletingId === ev._id

            return (
              <div
                key={ev._id}
                className="p-4 sm:p-5 bg-white border border-cream-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cream-100 border border-cream-200 text-center shrink-0 min-w-[60px]">
                    <span className="block font-serif text-xl font-bold text-gold-600 leading-none">
                      {evDate.getDate().toString().padStart(2, '0')}
                    </span>
                    <span className="block text-[10px] text-ink-500 uppercase mt-0.5">
                      {evDate.toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="block text-[9px] text-ink-400">
                      {evDate.getFullYear()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif text-base text-ink-900 font-medium">
                        {title}
                      </h4>
                      {ev.isPrivate && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-cream-200 text-ink-600 px-2 py-0.5 rounded-full">
                          <Lock size={9} /> Privé
                        </span>
                      )}
                    </div>

                    {ev.venue && (
                      <p className="text-xs text-ink-500 flex items-center gap-1">
                        <MapPin size={11} className="text-gold-500 shrink-0" />
                        <span>{[ev.venue.name, ev.venue.city].filter(Boolean).join(' · ')}</span>
                      </p>
                    )}

                    {ev.ticketUrl && (
                      <a
                        href={ev.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-gold-600 hover:underline inline-flex items-center gap-1"
                      >
                        Billetterie <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDelete(ev._id, title)}
                    disabled={isDeleting}
                    className="p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
