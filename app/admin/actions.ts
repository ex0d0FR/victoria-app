'use server'

import { revalidatePath } from 'next/cache'
import { getWriteClient } from '@/sanity/lib/writeClient'
import { verifyAndCreateSession, clearSession, isAuthenticated } from './auth'

async function assertAuth() {
  const authed = await isAuthenticated()
  if (!authed) {
    throw new Error('Non autorisé. Veuillez vous connecter.')
  }
}

function revalidateAllPages() {
  revalidatePath('/', 'layout')
}

// ── Authentication ──────────────────────────────────────────────────────────

export async function loginAction(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await verifyAndCreateSession(password)
    if (!success) {
      return { success: false, error: 'Mot de passe incorrect.' }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la connexion.' }
  }
}

export async function logoutAction(): Promise<void> {
  await clearSession()
}

// ── Asset Upload ────────────────────────────────────────────────────────────

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; assetId?: string; url?: string; error?: string }> {
  try {
    await assertAuth()
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) {
      return { success: false, error: 'Aucun fichier sélectionné.' }
    }

    const client = getWriteClient()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const asset = await client.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return { success: true, assetId: asset._id, url: asset.url }
  } catch (err: any) {
    console.error('Image upload failed:', err)
    return { success: false, error: err?.message || "Échec du téléversement de l'image." }
  }
}

// ── Events ──────────────────────────────────────────────────────────────────

export async function createEventAction(data: {
  titleFr: string
  titleEn: string
  date: string
  venueName?: string
  city?: string
  address?: string
  country?: string
  descriptionFr?: string
  descriptionEn?: string
  ticketUrl?: string
  isPrivate?: boolean
  assetId?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()

    const doc: any = {
      _type: 'event',
      title: { fr: data.titleFr || '', en: data.titleEn || data.titleFr || '' },
      date: new Date(data.date).toISOString(),
      isPrivate: Boolean(data.isPrivate),
    }

    if (data.venueName || data.city || data.address || data.country) {
      doc.venue = {
        name: data.venueName || '',
        city: data.city || '',
        address: data.address || '',
        country: data.country || 'France',
      }
    }

    if (data.descriptionFr || data.descriptionEn) {
      doc.description = {
        fr: data.descriptionFr || '',
        en: data.descriptionEn || data.descriptionFr || '',
      }
    }

    if (data.ticketUrl) {
      doc.ticketUrl = data.ticketUrl
    }

    if (data.assetId) {
      doc.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.assetId },
      }
    }

    const created = await client.create(doc)
    revalidateAllPages()
    return { success: true, id: created._id }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la création de l’événement.' }
  }
}

export async function deleteEventAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()
    await client.delete(id)
    revalidateAllPages()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression.' }
  }
}

// ── Services ────────────────────────────────────────────────────────────────

export async function createOrUpdateServiceAction(data: {
  id?: string
  titleFr: string
  titleEn: string
  descriptionFr?: string
  descriptionEn?: string
  occasionsFr?: string
  occasionsEn?: string
  durationFr?: string
  durationEn?: string
  priceFrom?: number
  depositAmount?: number
  order?: number
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()

    const doc: any = {
      _type: 'service',
      title: { fr: data.titleFr || '', en: data.titleEn || data.titleFr || '' },
      description: { fr: data.descriptionFr || '', en: data.descriptionEn || data.descriptionFr || '' },
      occasions: { fr: data.occasionsFr || '', en: data.occasionsEn || data.occasionsFr || '' },
      duration: { fr: data.durationFr || '', en: data.durationEn || data.durationFr || '' },
      priceFrom: data.priceFrom ? Number(data.priceFrom) : undefined,
      depositAmount: data.depositAmount ? Number(data.depositAmount) : undefined,
      order: data.order !== undefined ? Number(data.order) : 0,
    }

    if (data.id) {
      await client.patch(data.id).set(doc).commit()
      revalidateAllPages()
      return { success: true, id: data.id }
    } else {
      const created = await client.create(doc)
      revalidateAllPages()
      return { success: true, id: created._id }
    }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de l’enregistrement de la formule.' }
  }
}

export async function deleteServiceAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()
    await client.delete(id)
    revalidateAllPages()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression de la formule.' }
  }
}

// ── Settings (Bio & Profile) ────────────────────────────────────────────────

export async function updateSettingsAction(data: {
  heroTitleFr?: string
  heroTitleEn?: string
  heroSubtitleFr?: string
  heroSubtitleEn?: string
  biographyFr?: string
  biographyEn?: string
  email?: string
  phone?: string
  socialInstagram?: string
  socialYoutube?: string
  socialSpotify?: string
  heroImageAssetId?: string
  bioPhotoAssetId?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()

    const patch: any = {
      heroTitle: { fr: data.heroTitleFr || '', en: data.heroTitleEn || '' },
      heroSubtitle: { fr: data.heroSubtitleFr || '', en: data.heroSubtitleEn || '' },
      biography: { fr: data.biographyFr || '', en: data.biographyEn || '' },
      email: data.email || '',
      phone: data.phone || '',
      socialInstagram: data.socialInstagram || '',
      socialYoutube: data.socialYoutube || '',
      socialSpotify: data.socialSpotify || '',
    }

    if (data.heroImageAssetId) {
      patch.heroImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.heroImageAssetId },
      }
    }

    if (data.bioPhotoAssetId) {
      patch.bioPhoto = {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.bioPhotoAssetId },
      }
    }

    await client.createOrReplace({
      _id: 'settings',
      _type: 'settings',
      ...patch,
    })

    revalidateAllPages()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la mise à jour des paramètres.' }
  }
}

// ── Gallery ─────────────────────────────────────────────────────────────────

export async function createGalleryItemAction(data: {
  titleFr?: string
  titleEn?: string
  captionFr?: string
  captionEn?: string
  category: string
  assetId: string
  order?: number
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()

    const doc: any = {
      _type: 'galleryItem',
      title: { fr: data.titleFr || '', en: data.titleEn || data.titleFr || '' },
      caption: { fr: data.captionFr || '', en: data.captionEn || data.captionFr || '' },
      category: data.category || 'portrait',
      order: data.order !== undefined ? Number(data.order) : 0,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: data.assetId },
      },
    }

    const created = await client.create(doc)
    revalidateAllPages()
    return { success: true, id: created._id }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de l’ajout de la photo.' }
  }
}

export async function deleteGalleryItemAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()
    await client.delete(id)
    revalidateAllPages()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression.' }
  }
}

// ── Videos ──────────────────────────────────────────────────────────────────

export async function createVideoAction(data: {
  titleFr: string
  titleEn?: string
  descriptionFr?: string
  descriptionEn?: string
  youtubeUrl: string
  order?: number
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()

    const doc = {
      _type: 'video',
      title: { fr: data.titleFr || '', en: data.titleEn || data.titleFr || '' },
      description: { fr: data.descriptionFr || '', en: data.descriptionEn || data.descriptionFr || '' },
      youtubeUrl: data.youtubeUrl,
      order: data.order !== undefined ? Number(data.order) : 0,
    }

    const created = await client.create(doc)
    revalidateAllPages()
    return { success: true, id: created._id }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de l’ajout de la vidéo.' }
  }
}

export async function deleteVideoAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAuth()
    const client = getWriteClient()
    await client.delete(id)
    revalidateAllPages()
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression.' }
  }
}
