import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Type definitions for Supabase query results
interface WorkshopProfile {
  id: string
  business_name: string | null
  business_type: string | null
  industry: string | null
  years_in_business: string | null
  monthly_revenue: string | null
  team_size: string | null
  challenges: string[] | null
  primary_goal: string | null
  expected_outcome: string | null
  current_tools: string[] | null
  ai_experience: string | null
  communication_preference: string | null
  profile_completed: boolean | null
  profile_completion_percentage: number | null
  completed_at: string | null
}

interface HannaAnalysis {
  id: string
  analysis_type: string
  summary: string | null
  readiness_score: number | null
  key_insights: string[] | null
  challenges_prioritized: string[] | null
  recommended_focus: string | null
  potential_quick_wins: string[] | null
  customized_tips: string[] | null
  engagement_level_text: string | null
  follow_up_suggestions: string[] | null
  follow_up_priority: string | null
  analyzed_at: string | null
}

interface ParticipantRow {
  id: string
  email: string
  full_name: string
  phone: string | null
  country: string | null
  payment_status: string
  payment_method: string | null
  amount_paid: number | null
  currency: string | null
  registration_status: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  created_at: string
  confirmed_at: string | null
  attended_at: string | null
  workshop_profiles: WorkshopProfile[] | null
  hanna_analysis: HannaAnalysis[] | null
}

// Admin API key check
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedKey = `Bearer ${process.env.ADMIN_API_KEY}`

  if (process.env.NODE_ENV !== 'production') {
    return true // Allow in development
  }

  return authHeader === expectedKey
}

/**
 * GET /api/admin/participants
 * Get all participants with their profiles and analyses
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'all', 'completed', 'pending'
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabaseAdmin
      .from('workshop_registrations')
      .select(`
        id,
        email,
        full_name,
        phone,
        country,
        payment_status,
        payment_method,
        amount_paid,
        currency,
        registration_status,
        utm_source,
        utm_medium,
        utm_campaign,
        created_at,
        confirmed_at,
        attended_at,
        workshop_profiles (
          id,
          business_name,
          business_type,
          industry,
          years_in_business,
          monthly_revenue,
          team_size,
          challenges,
          primary_goal,
          expected_outcome,
          current_tools,
          ai_experience,
          communication_preference,
          profile_completed,
          profile_completion_percentage,
          completed_at
        ),
        hanna_analysis (
          id,
          analysis_type,
          summary,
          readiness_score,
          key_insights,
          challenges_prioritized,
          recommended_focus,
          potential_quick_wins,
          customized_tips,
          engagement_level_text,
          follow_up_suggestions,
          follow_up_priority,
          analyzed_at
        )
      `, { count: 'exact' })

    // Filter by payment status
    if (status === 'completed') {
      query = query.eq('payment_status', 'completed')
    } else if (status === 'pending') {
      query = query.eq('payment_status', 'pending')
    }

    // Sort
    const validSortFields = ['created_at', 'full_name', 'email', 'amount_paid']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    query = query.order(sortField, { ascending: sortOrder === 'asc' })

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching participants:', error)
      return NextResponse.json(
        { error: 'Error al obtener participantes' },
        { status: 500 }
      )
    }

    // Type assertion for Supabase query result
    const participantData = data as ParticipantRow[] | null

    // Transform data for easier consumption
    const participants = (participantData || []).map((participant) => {
      const profile = participant.workshop_profiles?.[0] || null
      const analysis = participant.hanna_analysis?.find(
        (a: { analysis_type: string }) => a.analysis_type === 'profile'
      ) || null

      return {
        id: participant.id,
        email: participant.email,
        fullName: participant.full_name,
        phone: participant.phone,
        country: participant.country,
        paymentStatus: participant.payment_status,
        paymentMethod: participant.payment_method,
        amountPaid: participant.amount_paid,
        currency: participant.currency,
        registrationStatus: participant.registration_status,
        utmSource: participant.utm_source,
        utmMedium: participant.utm_medium,
        utmCampaign: participant.utm_campaign,
        createdAt: participant.created_at,
        confirmedAt: participant.confirmed_at,
        attendedAt: participant.attended_at,
        profile: profile ? {
          businessName: profile.business_name,
          businessType: profile.business_type,
          industry: profile.industry,
          yearsInBusiness: profile.years_in_business,
          monthlyRevenue: profile.monthly_revenue,
          teamSize: profile.team_size,
          challenges: profile.challenges,
          primaryGoal: profile.primary_goal,
          expectedOutcome: profile.expected_outcome,
          currentTools: profile.current_tools,
          aiExperience: profile.ai_experience,
          communicationPreference: profile.communication_preference,
          profileCompleted: profile.profile_completed,
          completionPercentage: profile.profile_completion_percentage,
          completedAt: profile.completed_at,
        } : null,
        analysis: analysis ? {
          summary: analysis.summary,
          readinessScore: analysis.readiness_score,
          keyInsights: analysis.key_insights,
          challengesPrioritized: analysis.challenges_prioritized,
          recommendedFocus: analysis.recommended_focus,
          potentialQuickWins: analysis.potential_quick_wins,
          customizedTips: analysis.customized_tips,
          engagementLevel: analysis.engagement_level_text,
          followUpSuggestions: analysis.follow_up_suggestions,
          followUpPriority: analysis.follow_up_priority,
          analyzedAt: analysis.analyzed_at,
        } : null,
      }
    })

    return NextResponse.json({
      success: true,
      participants,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error) {
    console.error('Participants API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
