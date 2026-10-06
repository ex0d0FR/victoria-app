'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Save, Loader2, Check, Upload } from 'lucide-react'
import { updateSettingsAction, uploadImageAction } from '../actions'
import type { SanitySettings } from '@/sanity/lib/fetch'

export function SettingsTab({ initialSettings }: { initialSettings: SanitySettings }) {
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  // Field states
  const [heroTitleFr, setHeroTitleFr] = useState(initialSettings?.heroTitle?.fr || 'Victoria Reindale')
  const [heroTitleEn, setHeroTitleEn] = useState(initialSettings?.heroTitle?.en || 'Victoria Reindale')
  const [heroSubtitleFr, setHeroSubtitleFr] = useState(initialSettings?.heroSubtitle?.fr || 'Soprano · Artiste Vocale')
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(initialSettings?.heroSubtitle?.en || 'Soprano · Vocal Artist')
  const [biographyFr, setBiographyFr] = useState(initialSettings?.biography?.fr || '')
  const [biographyEn, setBiographyEn] = useState(initialSettings?.biography?.en || '')
  const [email, setEmail] = useState(initialSettings?.email || 'contact@victoriareindale.com')
  const [phone, setPhone] = useState(initialSettings?.phone || '')
  const [socialInstagram, setSocialInstagram] = useState(initialSettings?.socialInstagram || '')
  const [socialYoutube, setSocialYoutube] = useState(initialSettings?.socialYoutube || '')
  const [socialSpotify, setSocialSpotify] = useState(initialSettings?.socialSpotify || '')

  // Images
  const [heroImagePreview, setHeroImagePreview] = useState(initialSettings?.heroImage || null)
  const [heroImageAssetId, setHeroImageAssetId] = useState<string | null>(null)
  const [bioPhotoPreview, setBioPhotoPreview] = useState(initialSettings?.bioPhoto || null)
  const [bioPhotoAssetId, setBioPhotoAssetId] = useState<string | null>(null)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingBio, setUploadingBio] = useState(false)

  const handleUpload = async (file: File, type: 'hero' | 'bio') => {
    const formData = new FormData()
    formData.append('file', file)

    if (type === 'hero') setUploadingHero(true)
    else setUploadingBio(true)

    const res = await uploadImageAction(formData)

    if (type === 'hero') setUploadingHero(false)
    else setUploadingBio(false)

    if (res.success && res.assetId) {
      if (type === 'hero') {
        setHeroImageAssetId(res.assetId)
        setHeroImagePreview(res.url || URL.createObjectURL(file))
      } else {
        setBioPhotoAssetId(res.assetId)
        setBioPhotoPreview(res.url || URL.createObjectURL(file))
      }
    } else {
      alert(res.error || 'Erreur lors du téléversement de la photo.')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSaved(false)

    const res = await updateSettingsAction({
      heroTitleFr,
      heroTitleEn,
      heroSubtitleFr,
      heroSubtitleEn,
      biographyFr,
      biographyEn,
      email,
      phone,
      socialInstagram,
      socialYoutube,
      socialSpotify,
      heroImageAssetId: heroImageAssetId || undefined,
      bioPhotoAssetId: bioPhotoAssetId || undefined,
    })

    setSubmitting(false)
    if (res.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert(res.error || 'Erreur lors de la sauvegarde.')
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <h2 className="heading-md">Profil, Biographie & Contact</h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Modifiez votre présentation générale, vos textes d&apos;accueil et vos coordonnées.
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          {submitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : saved ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Save size={14} />
          )}
          <span>{saved ? 'Enregistré !' : 'Enregistrer les modifications'}</span>
        </button>
      </div>

      {/* Section 1: Hero Titles */}
      <div className="card-border p-6 bg-white space-y-4">
        <h3 className="font-serif text-base text-ink-900 border-b border-cream-200 pb-2">
          1. Titres de la page d&apos;accueil (Hero)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-sm block mb-1">Titre principal (FR)</label>
            <input
              value={heroTitleFr}
              onChange={(e) => setHeroTitleFr(e.target.value)}
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="label-sm block mb-1">Titre principal (EN)</label>
            <input
              value={heroTitleEn}
              onChange={(e) => setHeroTitleEn(e.target.value)}
              className="form-input text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-sm block mb-1">Sous-titre (FR)</label>
            <input
              value={heroSubtitleFr}
              onChange={(e) => setHeroSubtitleFr(e.target.value)}
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="label-sm block mb-1">Sous-titre (EN)</label>
            <input
              value={heroSubtitleEn}
              onChange={(e) => setHeroSubtitleEn(e.target.value)}
              className="form-input text-sm"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Photos */}
      <div className="card-border p-6 bg-white space-y-4">
        <h3 className="font-serif text-base text-ink-900 border-b border-cream-200 pb-2">
          2. Photos principales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <label className="label-sm block mb-2">Photo d&apos;accueil (Hero Photo)</label>
            {heroImagePreview && (
              <div className="relative aspect-[4/3] w-full max-w-[240px] mb-3 border border-cream-300 overflow-hidden bg-ink-900">
                <Image src={heroImagePreview} alt="Hero" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'hero')}
              disabled={uploadingHero}
              className="text-xs text-ink-600 file:mr-2 file:py-1 file:px-3 file:border-0 file:text-xs file:bg-gold-50 file:text-gold-700"
            />
            {uploadingHero && <p className="text-xs text-gold-600 mt-1">Téléversement…</p>}
          </div>

          <div>
            <label className="label-sm block mb-2">Photo de profil (À propos)</label>
            {bioPhotoPreview && (
              <div className="relative aspect-[3/4] w-full max-w-[180px] mb-3 border border-cream-300 overflow-hidden bg-ink-900">
                <Image src={bioPhotoPreview} alt="Bio" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'bio')}
              disabled={uploadingBio}
              className="text-xs text-ink-600 file:mr-2 file:py-1 file:px-3 file:border-0 file:text-xs file:bg-gold-50 file:text-gold-700"
            />
            {uploadingBio && <p className="text-xs text-gold-600 mt-1">Téléversement…</p>}
          </div>
        </div>
      </div>

      {/* Section 3: Biography */}
      <div className="card-border p-6 bg-white space-y-4">
        <h3 className="font-serif text-base text-ink-900 border-b border-cream-200 pb-2">
          3. Texte de biographie (Présentation)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-sm block mb-1">Biographie (FR)</label>
            <textarea
              rows={6}
              value={biographyFr}
              onChange={(e) => setBiographyFr(e.target.value)}
              className="form-input text-sm leading-relaxed"
            />
          </div>
          <div>
            <label className="label-sm block mb-1">Biographie (EN)</label>
            <textarea
              rows={6}
              value={biographyEn}
              onChange={(e) => setBiographyEn(e.target.value)}
              className="form-input text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Contact & Socials */}
      <div className="card-border p-6 bg-white space-y-4">
        <h3 className="font-serif text-base text-ink-900 border-b border-cream-200 pb-2">
          4. Coordonnées & Réseaux Sociaux
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-sm block mb-1">Email de contact</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="label-sm block mb-1">Téléphone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label-sm block mb-1">Lien Instagram</label>
            <input
              type="url"
              value={socialInstagram}
              onChange={(e) => setSocialInstagram(e.target.value)}
              placeholder="https://instagram.com/..."
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="label-sm block mb-1">Lien YouTube</label>
            <input
              type="url"
              value={socialYoutube}
              onChange={(e) => setSocialYoutube(e.target.value)}
              placeholder="https://youtube.com/..."
              className="form-input text-sm"
            />
          </div>
          <div>
            <label className="label-sm block mb-1">Lien Spotify (Optionnel)</label>
            <input
              type="url"
              value={socialSpotify}
              onChange={(e) => setSocialSpotify(e.target.value)}
              placeholder="https://spotify.com/..."
              className="form-input text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary text-xs flex items-center gap-2 py-3 px-8"
        >
          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Enregistrer toutes les modifications</span>
        </button>
      </div>
    </form>
  )
}
