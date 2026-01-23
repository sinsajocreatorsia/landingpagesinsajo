import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface RegistrationRow {
  id: string
  payment_status: string
  payment_method: string | null
  amount_paid: number | null
  registration_status: string
  created_at: string
}

interface ProfileRow {
  id: string
  profile_completed: boolean
  profile_completion_percentage: number
}

interface AnalysisRow {
  id: string
  readiness_score: number | null
  engagement_level_text: string | null
  follow_up_priority: string | null
  analysis_type: string
}

interface EmailRow {
  id: string
  email_type: string
  status: string
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
 * GET /api/admin/stats
 * Get dashboard statistics
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Get registration stats
    const { data: registrationsData, error: regError } = await supabaseAdmin
      .from('workshop_registrations')
      .select('id, payment_status, payment_method, amount_paid, registration_status, created_at')

    const registrations = registrationsData as RegistrationRow[] | null

    if (regError) {
      throw new Error(`Registration query error: ${regError.message}`)
    }

    // Get profile completion stats
    const { data: profilesData, error: profileError } = await supabaseAdmin
      .from('workshop_profiles')
      .select('id, profile_completed, profile_completion_percentage')

    const profiles = profilesData as ProfileRow[] | null

    if (profileError) {
      throw new Error(`Profile query error: ${profileError.message}`)
    }

    // Get analysis stats
    const { data: analysesData, error: analysisError } = await supabaseAdmin
      .from('hanna_analysis')
      .select('id, readiness_score, engagement_level_text, follow_up_priority, analysis_type')
      .eq('analysis_type', 'profile')

    const analyses = analysesData as AnalysisRow[] | null

    if (analysisError) {
      throw new Error(`Analysis query error: ${analysisError.message}`)
    }

    // Get email stats
    const { data: emailsData, error: emailError } = await supabaseAdmin
      .from('email_logs')
      .select('id, email_type, status')

    const emails = emailsData as EmailRow[] | null

    if (emailError) {
      throw new Error(`Email query error: ${emailError.message}`)
    }

    // Calculate stats
    const totalRegistrations = registrations?.length || 0
    const paidRegistrations = registrations?.filter(r => r.payment_status === 'completed') || []
    const totalRevenue = paidRegistrations.reduce((sum, r) => sum + (r.amount_paid || 0), 0)

    const paymentMethodCounts = paidRegistrations.reduce((acc, r) => {
      const method = r.payment_method || 'unknown'
      acc[method] = (acc[method] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusCounts = (registrations || []).reduce((acc, r) => {
      const status = r.registration_status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const completedProfiles = profiles?.filter(p => p.profile_completed).length || 0
    const avgProfileCompletion = profiles?.length
      ? Math.round(profiles.reduce((sum, p) => sum + (p.profile_completion_percentage || 0), 0) / profiles.length)
      : 0

    const analyzedProfiles = analyses?.length || 0
    const avgReadinessScore = analyses?.length
      ? (analyses.reduce((sum, a) => sum + (a.readiness_score || 0), 0) / analyses.length).toFixed(1)
      : '0'

    const engagementDistribution = (analyses || []).reduce((acc, a) => {
      const level = a.engagement_level_text || 'unknown'
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const followUpPriorityCounts = (analyses || []).reduce((acc, a) => {
      const priority = a.follow_up_priority || 'unknown'
      acc[priority] = (acc[priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const emailStats = {
      total: emails?.length || 0,
      sent: emails?.filter(e => e.status === 'sent').length || 0,
      delivered: emails?.filter(e => e.status === 'delivered').length || 0,
      opened: emails?.filter(e => e.status === 'opened').length || 0,
      failed: emails?.filter(e => e.status === 'failed').length || 0,
      byType: (emails || []).reduce((acc, e) => {
        const type = e.email_type || 'unknown'
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
    }

    // Calculate daily registrations for chart
    const dailyRegistrations = (registrations || []).reduce((acc, r) => {
      const date = new Date(r.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { total: 0, paid: 0, revenue: 0 }
      }
      acc[date].total++
      if (r.payment_status === 'completed') {
        acc[date].paid++
        acc[date].revenue += r.amount_paid || 0
      }
      return acc
    }, {} as Record<string, { total: number; paid: number; revenue: number }>)

    // Convert to array and sort
    const dailyData = Object.entries(dailyRegistrations)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30) // Last 30 days

    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalRegistrations,
          paidRegistrations: paidRegistrations.length,
          conversionRate: totalRegistrations > 0
            ? Math.round((paidRegistrations.length / totalRegistrations) * 100)
            : 0,
          totalRevenue: totalRevenue.toFixed(2),
          avgTicketValue: paidRegistrations.length > 0
            ? (totalRevenue / paidRegistrations.length).toFixed(2)
            : '0',
        },
        payments: {
          byMethod: paymentMethodCounts,
          byStatus: statusCounts,
        },
        profiles: {
          total: profiles?.length || 0,
          completed: completedProfiles,
          completionRate: profiles?.length
            ? Math.round((completedProfiles / profiles.length) * 100)
            : 0,
          avgCompletion: avgProfileCompletion,
        },
        analysis: {
          total: analyzedProfiles,
          pendingAnalysis: completedProfiles - analyzedProfiles,
          avgReadinessScore,
          engagementDistribution,
          followUpPriority: followUpPriorityCounts,
        },
        emails: emailStats,
        dailyData,
      },
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
