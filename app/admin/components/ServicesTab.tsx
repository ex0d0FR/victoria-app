'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, Loader2, Check } from 'lucide-react'
import { createOrUpdateServiceAction, deleteServiceAction } from '../actions'
import type { SanityService } from '@/sanity/lib/fetch'

export function ServicesTab({ initialServices }: { initialServices: SanityService[] }) {
  const [services, setServices] = useState(initialServices)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form fields
  const [titleFr, setTitleFr] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [descriptionFr, setDescriptionFr] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [occasionsFr, setOccasionsFr] = useState('')
  const [occasionsEn, setOccasionsEn] = useState('')
  const [durationFr, setDurationFr] = useState('')
  const [durationEn, setDurationEn] = useState('')
  const [priceFrom, setPriceFrom] = useState<number | ''>('')
  const [depositAmount, setDepositAmount] = useState<number | ''>('')
  const [order, setOrder] = useState<number>(0)

  const openNew = () => {
    setEditingId(null)
    setTitleFr('')
    setTitleEn('')
    setDescriptionFr('')
    setDescriptionEn('')
    setOccasionsFr('')
    setOccasionsEn('')
    setDurationFr('')
    setDurationEn('')
    setPriceFrom('')
    setDepositAmount('')
    setOrder(services.length)
    setIsEditing(true)
  }

  const openEdit = (s: SanityService) => {
    setEditingId(s._id)
    setTitleFr(s.title?.fr || '')
    setTitleEn(s.title?.en || '')
    setDescriptionFr(s.description?.fr || '')
    setDescriptionEn(s.description?.en || '')

    const occFr = Array.isArray(s.occasions)
      ? s.occasions.join(', ')
      : typeof s.occasions === 'object'
      ? (Array.isArray(s.occasions.fr) ? s.occasions.fr.join(', ') : s.occasions.fr || '')
      : s.occasions || ''
    const occEn = typeof s.occasions === 'object' && !Array.isArray(s.occasions)
      ? (Array.isArray(s.occasions.en) ? s.occasions.en.join(', ') : s.occasions.en || '')
      : ''
    setOccasionsFr(occFr)
    setOccasionsEn(occEn)

    setDurationFr(typeof s.duration === 'string' ? s.duration : s.duration?.fr || '')
    setDurationEn(typeof s.duration === 'object' ? s.duration?.en || '' : '')
    setPriceFrom(s.priceFrom ?? '')
    setDepositAmount(s.depositAmount ?? '')
    setOrder(s.order ?? 0)
    setIsEditing(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleFr) {
      alert('Veuillez renseigner le titre de la formule.')
      return
    }

    setSubmitting(true)
    const res = await createOrUpdateServiceAction({
      id: editingId || undefined,
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      occasionsFr,
      occasionsEn,
      durationFr,
      durationEn,
      priceFrom: priceFrom === '' ? undefined : Number(priceFrom),
      depositAmount: depositAmount === '' ? undefined : Number(depositAmount),
      order,
    })
    setSubmitting(false)

    if (res.success && res.id) {
      const updatedItem: SanityService = {
        _id: res.id,
        title: { fr: titleFr, en: titleEn || titleFr },
        description: { fr: descriptionFr, en: descriptionEn || descriptionFr },
        occasions: occasionsFr,
        duration: durationFr,
        priceFrom: priceFrom === '' ? undefined : Number(priceFrom),
        depositAmount: depositAmount === '' ? undefined : Number(depositAmount),
        order,
      }

      if (editingId) {
        setServices(services.map((item) => (item._id === editingId ? updatedItem : item)))
      } else {
        setServices([...services, updatedItem])
      }
      setIsEditing(false)
    } else {
      alert(res.error || 'Erreur lors de l’enregistrement.')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer la formule "${title}" ?`)) return

    setDeletingId(id)
    const res = await deleteServiceAction(id)
    setDeletingId(null)

    if (res.success) {
      setServices(services.filter((s) => s._id !== id))
    } else {
      alert(res.error || 'Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <h2 className="heading-md">Formules & Tarifs</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Définissez vos prestations musicales, tarifs indicatifs et acomptes de réservation.
          </p>
        </div>
        <button
          onClick={openNew}
          className="btn-gold text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Ajouter une formule</span>
        </button>
      </div>

      {/* Edit/Create Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="card-border p-6 sm:p-8 bg-cream-50 space-y-6 animate-fade-up">
          <h3 className="font-serif text-lg text-ink-900 border-b border-cream-200 pb-2">
            {editingId ? 'Modifier la formule' : 'Nouvelle formule'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Nom de la formule (FR) *</label>
              <input
                required
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex. Solo soprano / Duo voix-piano"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Nom de la formule (EN)</label>
              <input
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Ex. Solo soprano / Voice & piano duo"
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
                placeholder="Description de l'ambiance et des instruments…"
                className="form-input text-sm resize-none"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Description (EN)</label>
              <textarea
                rows={3}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Performance atmosphere, instrumentation…"
                className="form-input text-sm resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm block mb-1">Occasions adaptées (FR, séparées par virgules)</label>
              <input
                value={occasionsFr}
                onChange={(e) => setOccasionsFr(e.target.value)}
                placeholder="Ex. Mariages, Funérailles, Cocktails"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Occasions adaptées (EN)</label>
              <input
                value={occasionsEn}
                onChange={(e) => setOccasionsEn(e.target.value)}
                placeholder="Ex. Weddings, Funerals, Private concerts"
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="label-sm block mb-1">Durée (FR)</label>
              <input
                value={durationFr}
                onChange={(e) => setDurationFr(e.target.value)}
                placeholder="Ex. 1 heure"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Tarif indicatif (€)</label>
              <input
                type="number"
                min="0"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex. 400"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Acompte demandé (€)</label>
              <input
                type="number"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex. 100"
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="label-sm block mb-1">Ordre d&apos;affichage</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="form-input text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
              <span>Enregistrer la formule</span>
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="col-span-2 card-border p-12 text-center text-ink-400 bg-white">
            Aucune formule enregistrée pour le moment.
          </div>
        ) : (
          services.map((s) => {
            const title = s.title?.fr || s.title?.en || 'Formule'
            const isDeleting = deletingId === s._id

            return (
              <div
                key={s._id}
                className="p-5 bg-white border border-cream-300 flex flex-col justify-between hover:border-gold-300 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-serif text-lg text-ink-900 font-medium">
                      {title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 text-ink-400 hover:text-gold-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, title)}
                        disabled={isDeleting}
                        className="p-1.5 text-ink-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {s.description?.fr && (
                    <p className="text-xs text-ink-500 mb-4 leading-relaxed line-clamp-2">
                      {s.description.fr}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-cream-200 flex justify-between items-center text-xs">
                  <span className="font-semibold text-gold-600">
                    {s.priceFrom ? `À partir de ${s.priceFrom} €` : 'Sur devis'}
                  </span>
                  {s.depositAmount && (
                    <span className="text-ink-400">
                      Acompte : {s.depositAmount} €
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
