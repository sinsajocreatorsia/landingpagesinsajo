import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const minRating = searchParams.get('minRating')
    const npsCategory = searchParams.get('npsCategory')
    const offset = (page - 1) * limit

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabaseAdmin as any)
      .from('workshop_surveys')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (minRating) {
      query = query.gte('overall_rating', parseInt(minRating))
    }

    if (npsCategory === 'promoters') {
      query = query.gte('nps_score', 9)
    } else if (npsCategory === 'passives') {
      query = query.gte('nps_score', 7).lte('nps_score', 8)
    } else if (npsCategory === 'detractors') {
      query = query.lte('nps_score', 6)
    }

    const { data: surveys, error, count } = await query

    if (error) throw error

    // Get stats from view
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: statsData } = await (supabaseAdmin as any)
      .from('v_survey_stats')
      .select('*')
      .single()

    const stats = statsData
      ? {
          totalResponses: statsData.total_responses || 0,
          avgRating: parseFloat(statsData.avg_rating) || 0,
          avgNps: parseFloat(statsData.avg_nps) || 0,
          npsCalculated: parseFloat(statsData.nps_calculated) || 0,
          promoters: statsData.promoters || 0,
          passives: statsData.passives || 0,
          detractors: statsData.detractors || 0,
          communityYes: statsData.community_yes || 0,
          communityMaybe: statsData.community_maybe || 0,
          googleReviewsSent: statsData.google_reviews_sent || 0,
          avgContinuingInterest: parseFloat(statsData.avg_continuing_interest) || 0,
        }
      : null

    return NextResponse.json({
      success: true,
      surveys: surveys || [],
      total: count || 0,
      stats,
    })
  } catch (error) {
    console.error('Error fetching surveys:', error)
    return NextResponse.json(
      { error: 'Error al obtener encuestas' },
      { status: 500 }
    )
  }
}
