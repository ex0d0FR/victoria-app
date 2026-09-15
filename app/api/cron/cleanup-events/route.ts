import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  return handleCleanup(req)
}

export async function POST(req: Request) {
  return handleCleanup(req)
}

async function handleCleanup(req: Request) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const writeToken = process.env.SANITY_API_WRITE_TOKEN

  // Simple token authentication check
  const providedToken = authHeader?.replace('Bearer ', '') || new URL(req.url).searchParams.get('key')

  if (cronSecret && providedToken !== cronSecret && providedToken !== writeToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!writeToken) {
    return NextResponse.json(
      { error: 'SANITY_API_WRITE_TOKEN is not configured on the server' },
      { status: 500 }
    )
  }

  const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  })

  try {
    // Find events that ended more than 24 hours ago (86400 seconds)
    // to prevent timezone edge cases on the day of the event
    const pastEvents = await writeClient.fetch<
      Array<{
        _id: string
        title?: { fr?: string; en?: string }
        date: string
        assetId?: string
      }>
    >(`
      *[_type == "event" && dateTime(date) < (dateTime(now()) - 86400)] {
        _id,
        title,
        date,
        "assetId": image.asset._ref
      }
    `)

    const results: Array<{ id: string; title: string; imageDeleted: boolean }> = []

    for (const event of pastEvents) {
      let imageDeleted = false

      // 1. Delete associated image asset to spare free tier storage
      if (event.assetId) {
        try {
          await writeClient.delete(event.assetId)
          imageDeleted = true
        } catch (imgErr) {
          console.warn(`Failed to delete asset ${event.assetId}:`, imgErr)
        }
      }

      // 2. Delete event document
      try {
        await writeClient.delete(event._id)
        results.push({
          id: event._id,
          title: event.title?.fr || event.title?.en || 'Untitled',
          imageDeleted,
        })
      } catch (docErr) {
        console.error(`Failed to delete event document ${event._id}:`, docErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${results.length} past event(s) and pruned their assets.`,
      cleanedEvents: results,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Error during past events cleanup:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
