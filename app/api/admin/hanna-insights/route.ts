import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = (name: string) => (supabaseAdmin as any).from(name)

export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '30d'
  const periodDays = period === '90d' ? 90 : period === '30d' ? 30 : 7
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  try {
    // Parallel queries for performance
    const [
      profilesRes,
      sessionsRes,
      messagesRes,
      businessProfilesRes,
      memoriesRes,
      remindersRes,
      feedbackRes,
      usageLogsRes,
    ] = await Promise.all([
      // All user profiles
      table('profiles').select('id, plan, subscription_status, messages_today, last_message_date, created_at'),
      // Sessions in period
      table('hanna_sessions').select('id, user_id, created_at, updated_at, is_active').gte('created_at', since),
      // Messages in period (count per session)
      table('hanna_messages').select('id, session_id, role, created_at').gte('created_at', since),
      // Business profiles (feature adoption)
      table('hanna_business_profiles').select('user_id, business_name, business_type, target_audience, brand_voice, products_services, created_at'),
      // Memories (feature adoption)
      table('hanna_user_memory').select('user_id, category, is_active, created_at').gte('created_at', since),
      // Reminders (feature adoption)
      table('hanna_reminders').select('user_id, status, created_at').gte('created_at', since),
      // Feedback
      table('hanna_message_feedback').select('feedback_type, created_at').gte('created_at', since),
      // Usage logs for engagement patterns
      table('api_usage_logs').select('user_id, user_plan, query_category, created_at, response_time_ms').gte('created_at', since),
    ])

    const profiles = (profilesRes.data || []) as Array<Record<string, unknown>>
    const sessions = (sessionsRes.data || []) as Array<Record<string, unknown>>
    const messages = (messagesRes.data || []) as Array<Record<string, unknown>>
    const businessProfiles = (businessProfilesRes.data || []) as Array<Record<string, unknown>>
    const memories = (memoriesRes.data || []) as Array<Record<string, unknown>>
    const reminders = (remindersRes.data || []) as Array<Record<string, unknown>>
    const feedback = (feedbackRes.data || []) as Array<Record<string, unknown>>
    const usageLogs = (usageLogsRes.data || []) as Array<Record<string, unknown>>

    // === USER BASE ===
    const totalUsers = profiles.length
    const proUsers = profiles.filter(p => p.plan === 'pro').length
    const businessUsers = profiles.filter(p => p.plan === 'business').length
    const freeUsers = profiles.filter(p => p.plan === 'free').length

    // === ENGAGEMENT ===
    const activeUserIds = new Set(sessions.map(s => s.user_id as string))
    const activeUsers = activeUserIds.size
    const engagementRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

    // Messages per session
    const msgPerSession: Record<string, number> = {}
    for (const m of messages) {
      const sid = m.session_id as string
      if (sid) msgPerSession[sid] = (msgPerSession[sid] || 0) + 1
    }
    const sessionMsgCounts = Object.values(msgPerSession)
    const avgMsgsPerSession = sessionMsgCounts.length > 0
      ? Math.round(sessionMsgCounts.reduce((a, b) => a + b, 0) / sessionMsgCounts.length)
      : 0

    // Sessions per user
    const sessionsPerUser: Record<string, number> = {}
    for (const s of sessions) {
      const uid = s.user_id as string
      sessionsPerUser[uid] = (sessionsPerUser[uid] || 0) + 1
    }
    const sessionCounts = Object.values(sessionsPerUser)
    const avgSessionsPerUser = sessionCounts.length > 0
      ? Math.round((sessionCounts.reduce((a, b) => a + b, 0) / sessionCounts.length) * 10) / 10
      : 0

    // Returning users (>1 session)
    const returningUsers = sessionCounts.filter(c => c > 1).length
    const retentionRate = activeUsers > 0 ? Math.round((returningUsers / activeUsers) * 100) : 0

    // Power users (5+ sessions)
    const powerUsers = sessionCounts.filter(c => c >= 5).length

    // === FEATURE ADOPTION ===
    const usersWithBusinessProfile = businessProfiles.length
    const businessProfileCompleteness = businessProfiles.map(bp => {
      let filled = 0
      if (bp.business_name) filled++
      if (bp.business_type) filled++
      if (bp.target_audience) filled++
      if (bp.brand_voice) filled++
      if (bp.products_services) filled++
      return filled
    })
    const avgProfileCompleteness = businessProfileCompleteness.length > 0
      ? Math.round((businessProfileCompleteness.reduce((a, b) => a + b, 0) / (businessProfileCompleteness.length * 5)) * 100)
      : 0

    const usersWithMemories = new Set(memories.map(m => m.user_id as string)).size
    const totalMemories = memories.length

    const usersWithReminders = new Set(reminders.map(r => r.user_id as string)).size
    const totalReminders = reminders.length
    const completedReminders = reminders.filter(r => r.status === 'completed').length

    // === TEMPORAL PATTERNS ===
    const hourCounts: Record<number, number> = {}
    const dayCounts: Record<number, number> = {}
    for (const log of usageLogs) {
      const date = new Date(log.created_at as string)
      const hour = date.getUTCHours()
      const day = date.getUTCDay()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
      dayCounts[day] = (dayCounts[day] || 0) + 1
    }

    const peakHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    const peakDay = Object.entries(dayCounts).sort(([, a], [, b]) => b - a)[0]

    const hourlyUsage: Record<string, number> = {}
    for (let h = 0; h < 24; h++) {
      hourlyUsage[`${h}:00`] = hourCounts[h] || 0
    }

    const dailyUsage: Record<string, number> = {}
    for (let d = 0; d < 7; d++) {
      dailyUsage[dayNames[d]] = dayCounts[d] || 0
    }

    // === QUERY CATEGORIES (what users ask about) ===
    const categories: Record<string, number> = {}
    for (const log of usageLogs) {
      const cat = (log.query_category as string) || 'general'
      categories[cat] = (categories[cat] || 0) + 1
    }

    // === FEEDBACK ANALYSIS ===
    const thumbsUp = feedback.filter(f => f.feedback_type === 'positive').length
    const thumbsDown = feedback.filter(f => f.feedback_type === 'negative').length
    const totalFeedback = feedback.length
    const satisfactionRate = totalFeedback > 0 ? Math.round((thumbsUp / totalFeedback) * 100) : null

    // === CONVERSION OPPORTUNITIES ===
    // Free users who hit message limits (potential Pro converts)
    const freeUsersAtLimit = profiles.filter(p => {
      const today = new Date().toISOString().split('T')[0]
      return p.plan === 'free' && (p.last_message_date as string)?.startsWith(today) && (p.messages_today as number) >= 5
    }).length

    // Active free users (engaged but not paying)
    const activeFreeUserIds = [...activeUserIds].filter(uid =>
      profiles.find(p => p.id === uid && p.plan === 'free')
    )

    // === IMPROVEMENT OPPORTUNITIES ===
    const opportunities: string[] = []

    if (engagementRate < 30) {
      opportunities.push(`Solo ${engagementRate}% de usuarios estan activos. Considerar onboarding mejorado o re-engagement emails.`)
    }
    if (retentionRate < 50) {
      opportunities.push(`Retencion ${retentionRate}%. Mejorar primera experiencia y follow-up proactivo.`)
    }
    if (avgProfileCompleteness < 60) {
      opportunities.push(`Perfil de negocio ${avgProfileCompleteness}% completo en promedio. Incentivar completar perfil para mejor personalizacion.`)
    }
    if (usersWithReminders === 0 && totalUsers > 3) {
      opportunities.push('Nadie usa recordatorios aun. Promover la funcionalidad en onboarding o tips in-app.')
    }
    if (thumbsDown > thumbsUp && totalFeedback > 5) {
      opportunities.push(`Mas feedback negativo (${thumbsDown}) que positivo (${thumbsUp}). Revisar prompts y calidad de respuestas.`)
    }
    if (freeUsersAtLimit > 0) {
      opportunities.push(`${freeUsersAtLimit} usuario(s) free llegaron al limite hoy. Oportunidad de conversion a Pro.`)
    }
    if (activeFreeUserIds.length > proUsers && proUsers < 5) {
      opportunities.push(`${activeFreeUserIds.length} usuarios free activos vs ${proUsers} Pro. Gran oportunidad de conversion.`)
    }
    if (avgMsgsPerSession < 3) {
      opportunities.push(`Promedio ${avgMsgsPerSession} msgs/sesion es bajo. Las conversaciones no son profundas. Mejorar engagement de Hanna.`)
    }

    return NextResponse.json({
      success: true,
      period,
      userBase: {
        total: totalUsers,
        pro: proUsers,
        business: businessUsers,
        free: freeUsers,
      },
      engagement: {
        activeUsers,
        engagementRate,
        avgMsgsPerSession,
        avgSessionsPerUser,
        returningUsers,
        retentionRate,
        powerUsers,
        totalSessions: sessions.length,
        totalMessages: messages.filter(m => m.role === 'user').length,
      },
      featureAdoption: {
        businessProfiles: usersWithBusinessProfile,
        avgProfileCompleteness,
        memories: { users: usersWithMemories, total: totalMemories },
        reminders: { users: usersWithReminders, total: totalReminders, completed: completedReminders },
      },
      temporal: {
        peakHourUTC: peakHour ? `${peakHour[0]}:00 UTC (${peakHour[1]} msgs)` : 'N/A',
        peakDay: peakDay ? `${dayNames[Number(peakDay[0])]} (${peakDay[1]} msgs)` : 'N/A',
        hourlyUsage,
        dailyUsage,
      },
      quality: {
        thumbsUp,
        thumbsDown,
        totalFeedback,
        satisfactionRate,
      },
      categories,
      conversion: {
        activeFreeUsers: activeFreeUserIds.length,
        freeUsersAtLimit,
      },
      opportunities,
    })
  } catch (error) {
    console.error('Hanna insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
