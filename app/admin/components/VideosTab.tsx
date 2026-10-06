'use client'

import { useState } from 'react'
import { Plus, Trash2, Video as VideoIcon, Loader2, ExternalLink } from 'lucide-react'
import { createVideoAction, deleteVideoAction } from '../actions'
import type { SanityVideo } from '@/sanity/lib/fetch'

export function VideosTab({ initialVideos }: { initialVideos: SanityVideo[] }) {
  const [videos, setVideos] = useState(initialVideos)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states
  const [titleFr, setTitleFr] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descriptionFr, setDescriptionFr] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleFr || !youtubeUrl) {
      alert('Veuillez renseigner au moins le titre et le lien YouTube.')
      return
    }

    setSubmitting(true)
    const res = await createVideoAction({
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      youtubeUrl,
      order: videos.length,
    })
    setSubmitting(false)

    if (res.success && res.id) {
      const newVideo: SanityVideo = {
        _id: res.id,
        title: { fr: titleFr, en: titleEn || titleFr },
        description: { fr: descriptionFr, en: descriptionEn || descriptionFr },
        youtubeUrl,
      }
      setVideos([newVideo, ...videos])
      setIsAdding(false)
      setTitleFr('')
      setTitleEn('')
      setDescriptionFr('')
      setDescriptionEn('')
      setYoutubeUrl('')
    } else {
      alert(res.error || 'Erreur lors de l’ajout de la vidéo.')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer la vidéo "${title}" ?`)) return

    setDeletingId(id)
    const res = await deleteVideoAction(id)
    setDeletingId(null)

    if (res.success) {
      setVideos(videos.filter((v) => v._id !== id))
    } else {
      alert(res.error || 'Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <h2 className="heading-md">Enregistrements Vidéo</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Ajoutez vos liens YouTube de captations de concert ou récitals.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-gold text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>{isAdding ? 'Fermer le formulaire' : 'Ajouter une vidéo'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card-border p-6 sm:p-8 bg-cream-50 space-y-6 animate-fade-up">
          <h3 className="font-serif text-lg text-ink-900 border-b border-cream-200 pb-2">
            Nouvelle vidéo YouTube
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Titre de l&apos;air ou du concert (FR) *</label>
              <input
                required
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder='Ex. Donizetti — "Ardon gli incensi"'
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Titre (EN)</label>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder='Ex. Donizetti — "Ardon gli incensi"'
                className="form-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="label-sm block mb-1">Lien de la vidéo YouTube *</label>
            <input
              type="url"
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
              className="form-input text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Description / Distribution (FR)</label>
              <textarea
                rows={2}
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                placeholder="Ex. Accompagnée au piano par Simon Peguiron…"
                className="form-input text-sm resize-none"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Description (EN)</label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Ex. Accompanied on piano by Simon Peguiron…"
                className="form-input text-sm resize-none"
              />
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
              <span>Publier la vidéo</span>
            </button>
          </div>
        </form>
      )}

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.length === 0 ? (
          <div className="col-span-2 card-border p-12 text-center text-ink-400 bg-white">
            Aucune vidéo pour le moment.
          </div>
        ) : (
          videos.map((v) => {
            const title = v.title?.fr || v.title?.en || 'Vidéo'
            const isDeleting = deletingId === v._id

            return (
              <div
                key={v._id}
                className="p-5 bg-white border border-cream-300 flex flex-col justify-between hover:border-gold-300 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-serif text-base text-ink-900 font-medium">
                      {title}
                    </h4>
                    <button
                      onClick={() => handleDelete(v._id, title)}
                      disabled={isDeleting}
                      className="p-1.5 text-ink-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {v.description?.fr && (
                    <p className="text-xs text-ink-500 mb-3 leading-relaxed">
                      {v.description.fr}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-cream-200 flex justify-between items-center text-xs">
                  <a
                    href={v.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Voir sur YouTube</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
