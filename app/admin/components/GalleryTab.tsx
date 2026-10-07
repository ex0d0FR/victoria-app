'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Loader2, Upload, Check } from 'lucide-react'
import { createGalleryItemAction, deleteGalleryItemAction, uploadImageAction } from '../actions'

const CATEGORIES = [
  { id: 'concert', label: 'Concert' },
  { id: 'wedding', label: 'Mariage' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'backstage', label: 'Coulisses' },
]

export function GalleryTab({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems)
  const [isAdding, setIsAdding] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form states
  const [category, setCategory] = useState('portrait')
  const [titleFr, setTitleFr] = useState('')
  const [captionFr, setCaptionFr] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadedAssetId, setUploadedAssetId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
      alert(res.error || 'Erreur lors du téléversement de la photo.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedAssetId) {
      alert('Veuillez sélectionner et téléverser une photo.')
      return
    }

    setSubmitting(true)
    const res = await createGalleryItemAction({
      titleFr,
      captionFr,
      category,
      assetId: uploadedAssetId,
      order: items.length,
    })
    setSubmitting(false)

    if (res.success && res.id) {
      const newItem = {
        id: res.id,
        src: imagePreview || '',
        thumb: imagePreview || '',
        alt: { fr: titleFr || 'Photo', en: titleFr || 'Photo' },
        caption: { fr: captionFr, en: captionFr },
        category,
      }
      setItems([newItem, ...items])
      setIsAdding(false)
      setTitleFr('')
      setCaptionFr('')
      setUploadedAssetId(null)
      setImagePreview(null)
    } else {
      alert(res.error || 'Erreur lors de l’ajout de la photo.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette photo de la galerie ?')) return

    setDeletingId(id)
    const res = await deleteGalleryItemAction(id)
    setDeletingId(null)

    if (res.success) {
      setItems(items.filter((item) => (item.id || item._id) !== id))
    } else {
      alert(res.error || 'Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <h2 className="heading-md">Galerie Photo</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Ajoutez de nouvelles photographies de concerts, récitals et cérémonies.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-gold text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>{isAdding ? 'Fermer le formulaire' : 'Ajouter une photo'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card-border p-6 sm:p-8 bg-cream-50 space-y-6 animate-fade-up">
          <h3 className="font-serif text-lg text-ink-900 border-b border-cream-200 pb-2">
            Nouvelle photographie
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="label-sm block mb-1">Sélectionner la photo *</label>
                <p className="text-[11px] text-ink-400 mb-2">
                  Format conseillé : JPG ou WebP, max 3 Mo (haute résolution pour la grille).
                </p>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                  className="text-xs text-ink-600 file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-xs file:bg-gold-50 file:text-gold-700"
                />
                {uploadingImage && <p className="text-xs text-gold-600 mt-1">Téléversement…</p>}
              </div>

              <div>
                <label className="label-sm block mb-1">Catégorie *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-sm block mb-1">Titre / Sujet (Optionnel)</label>
                <input
                  value={titleFr}
                  onChange={(e) => setTitleFr(e.target.value)}
                  placeholder="Ex. Concert à l'Opéra de Lyon"
                  className="form-input text-sm"
                />
              </div>

              <div>
                <label className="label-sm block mb-1">Légende (Optionnel)</label>
                <input
                  value={captionFr}
                  onChange={(e) => setCaptionFr(e.target.value)}
                  placeholder="Ex. Récital avec Simon Peguiron au piano"
                  className="form-input text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white border border-cream-300 min-h-[200px]">
              {imagePreview ? (
                <div className="relative aspect-square w-full max-w-[200px] overflow-hidden">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover" />
                </div>
              ) : (
                <p className="text-xs text-ink-400 text-center">
                  L&apos;aperçu de la photo s&apos;affichera ici après sélection
                </p>
              )}
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
              disabled={submitting || !uploadedAssetId}
              className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5"
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              <span>Publier dans la galerie</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full card-border p-12 text-center text-ink-400 bg-white">
            Aucune photo dans la galerie.
          </div>
        ) : (
          items.map((item) => {
            const itemId = item.id || item._id
            const isDeleting = deletingId === itemId

            return (
              <div
                key={itemId}
                className="group relative aspect-[3/4] bg-cream-100 border border-cream-300 overflow-hidden"
              >
                {item.src && (
                  <Image
                    src={item.src}
                    alt={item.alt?.fr || 'Photo'}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                )}
                <div className="absolute inset-0 bg-ink-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-gold-600/90 self-start px-2 py-0.5">
                    {item.category}
                  </span>
                  <div className="flex justify-between items-center">
                    <p className="text-xs truncate max-w-[120px]">
                      {item.alt?.fr || item.caption?.fr || 'Photo'}
                    </p>
                    <button
                      onClick={() => handleDelete(itemId)}
                      disabled={isDeleting}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
