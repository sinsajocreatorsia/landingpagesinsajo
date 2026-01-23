import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { analyzeProfile, saveAnalysis, getAnalysis } from '@/lib/hanna/analysis'

// Type definitions for Supabase query results
interface WorkshopProfileData {
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
}

interface RegistrationWithProfile {
  id: string
  full_name: string
  email: string
  workshop_profiles: WorkshopProfileData[] | null
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
    const { data: registrationData, error: regError } = await supabaseAdmin
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

    // Type assertion for Supabase query result
    const registration = registrationData as RegistrationWithProfile | null

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

    // Run Hanna's analysis (convert null to undefined for ProfileData interface)
    const analysis = await analyzeProfile({
      registrationId: registration.id,
      fullName: registration.full_name,
      email: registration.email,
      businessName: profile.business_name ?? undefined,
      businessType: profile.business_type ?? undefined,
      industry: profile.industry ?? undefined,
      yearsInBusiness: profile.years_in_business ? parseInt(profile.years_in_business) : undefined,
      monthlyRevenue: profile.monthly_revenue ?? undefined,
      teamSize: profile.team_size ?? undefined,
      challenges: profile.challenges || [],
      primaryGoal: profile.primary_goal ?? undefined,
      expectedOutcome: profile.expected_outcome ?? undefined,
      currentTools: profile.current_tools || [],
      aiExperience: profile.ai_experience ?? undefined,
      communicationPreference: profile.communication_preference ?? undefined,
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
