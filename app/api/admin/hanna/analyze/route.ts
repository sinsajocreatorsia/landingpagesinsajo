import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { analyzeProfile, saveAnalysis, getAnalysis } from '@/lib/hanna/analysis'

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
 * POST /api/admin/hanna/analyze
 * Analyze a single participant's profile
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { registrationId, forceReanalyze = false } = await request.json()

    if (!registrationId) {
      return NextResponse.json(
        { error: 'registrationId es requerido' },
        { status: 400 }
      )
    }

    // Check if analysis already exists
    if (!forceReanalyze) {
      const existingAnalysis = await getAnalysis(registrationId)
      if (existingAnalysis) {
        return NextResponse.json({
          success: true,
          analysis: existingAnalysis,
          cached: true,
        })
      }
    }

    // Get registration and profile data
    const { data: registration, error: regError } = await supabaseAdmin
      .from('workshop_registrations')
      .select(`
        id,
        full_name,
        email,
        workshop_profiles (
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
          profile_completed
        )
      `)
      .eq('id', registrationId)
      .single()

    if (regError || !registration) {
      return NextResponse.json(
        { error: 'Registro no encontrado' },
        { status: 404 }
      )
    }

    const profile = registration.workshop_profiles?.[0]
    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado para este registro' },
        { status: 404 }
      )
    }

    // Run Hanna's analysis
    const analysis = await analyzeProfile({
      registrationId: registration.id,
      fullName: registration.full_name,
      email: registration.email,
      businessName: profile.business_name,
      businessType: profile.business_type,
      industry: profile.industry,
      yearsInBusiness: profile.years_in_business,
      monthlyRevenue: profile.monthly_revenue,
      teamSize: profile.team_size,
      challenges: profile.challenges || [],
      primaryGoal: profile.primary_goal,
      expectedOutcome: profile.expected_outcome,
      currentTools: profile.current_tools || [],
      aiExperience: profile.ai_experience,
      communicationPreference: profile.communication_preference,
    })

    // Save analysis to database
    const saveResult = await saveAnalysis(registrationId, analysis)

    if (!saveResult.success) {
      console.error('Failed to save analysis:', saveResult.error)
    }

    return NextResponse.json({
      success: true,
      analysis,
      saved: saveResult.success,
      cached: false,
    })
  } catch (error) {
    console.error('Hanna analysis API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/hanna/analyze?registrationId=xxx
 * Get existing analysis for a participant
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
    const registrationId = searchParams.get('registrationId')

    if (!registrationId) {
      return NextResponse.json(
        { error: 'registrationId es requerido' },
        { status: 400 }
      )
    }

    const analysis = await getAnalysis(registrationId)

    if (!analysis) {
      return NextResponse.json(
        { error: 'Análisis no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Get analysis API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
