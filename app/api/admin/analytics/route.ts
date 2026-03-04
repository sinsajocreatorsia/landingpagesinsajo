import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '7d' // 7d, 30d, 90d

  const periodDays = period === '90d' ? 90 : period === '30d' ? 30 : 7
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  try {
    // Fetch usage logs for the period
    const { data: logs, error: logsError } = await (supabaseAdmin.from('api_usage_logs') as ReturnType<typeof supabaseAdmin.from>)
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: true })

    if (logsError) {
      console.error('Analytics logs error:', logsError)
      return NextResponse.json({ error: 'Error fetching logs' }, { status: 500 })
    }

    const records = (logs || []) as Array<Record<string, unknown>>

    // --- Usage Metrics ---
    const totalMessages = records.length
    const uniqueUsers = new Set(records.map(r => r.user_id)).size
    const uniqueSessions = new Set(records.filter(r => r.session_id).map(r => r.session_id)).size

    // Messages per day
    const messagesPerDay: Record<string, number> = {}
    for (const r of records) {
      const day = (r.created_at as string).split('T')[0]
      messagesPerDay[day] = (messagesPerDay[day] || 0) + 1
    }

    // --- Cost Metrics ---
    const totalCost = records.reduce((sum, r) => sum + ((r.total_cost as number) || 0), 0)
    const totalInputTokens = records.reduce((sum, r) => sum + ((r.input_tokens as number) || 0), 0)
    const totalOutputTokens = records.reduce((sum, r) => sum + ((r.output_tokens as number) || 0), 0)

    // Cost per model
    const costPerModel: Record<string, { cost: number; count: number; tokens: number }> = {}
    for (const r of records) {
      const model = (r.model as string) || 'unknown'
      if (!costPerModel[model]) costPerModel[model] = { cost: 0, count: 0, tokens: 0 }
      costPerModel[model].cost += (r.total_cost as number) || 0
      costPerModel[model].count += 1
      costPerModel[model].tokens += (r.total_tokens as number) || 0
    }

    // Cost per day
    const costPerDay: Record<string, number> = {}
    for (const r of records) {
      const day = (r.created_at as string).split('T')[0]
      costPerDay[day] = (costPerDay[day] || 0) + ((r.total_cost as number) || 0)
    }

    // Avg cost per conversation
    const avgCostPerSession = uniqueSessions > 0 ? totalCost / uniqueSessions : 0

    // --- Quality Metrics ---
    const withSatisfaction = records.filter(r => r.user_satisfaction !== null && r.user_satisfaction !== undefined)
    const thumbsUp = withSatisfaction.filter(r => (r.user_satisfaction as number) === 1).length
    const thumbsDown = withSatisfaction.filter(r => (r.user_satisfaction as number) === -1).length
    const satisfactionRate = withSatisfaction.length > 0 ? thumbsUp / withSatisfaction.length : null

    // Avg response length
    const withResponseLength = records.filter(r => r.response_length)
    const avgResponseLength = withResponseLength.length > 0
      ? withResponseLength.reduce((sum, r) => sum + ((r.response_length as number) || 0), 0) / withResponseLength.length
      : 0

    // Avg response time
    const withResponseTime = records.filter(r => r.response_time_ms)
    const avgResponseTime = withResponseTime.length > 0
      ? withResponseTime.reduce((sum, r) => sum + ((r.response_time_ms as number) || 0), 0) / withResponseTime.length
      : 0

    // --- Plan Distribution ---
    const planDistribution: Record<string, number> = {}
    for (const r of records) {
      const plan = (r.user_plan as string) || 'unknown'
      planDistribution[plan] = (planDistribution[plan] || 0) + 1
    }

    // --- Query Category Distribution ---
    const categoryDistribution: Record<string, number> = {}
    for (const r of records) {
      const cat = (r.query_category as string) || 'uncategorized'
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1
    }

    // --- Model Distribution ---
    const modelDistribution: Record<string, number> = {}
    for (const r of records) {
      const model = (r.model as string) || 'unknown'
      modelDistribution[model] = (modelDistribution[model] || 0) + 1
    }

    // --- Error Metrics ---
    const failedRecords = records.filter(r => r.was_successful === false)
    const totalErrors = failedRecords.length
    const errorRate = totalMessages > 0 ? (totalErrors / totalMessages) * 100 : 0

    const errorsByModel: Record<string, number> = {}
    for (const r of failedRecords) {
      const model = (r.model as string) || 'unknown'
      errorsByModel[model] = (errorsByModel[model] || 0) + 1
    }

    const errorsPerDay: Record<string, number> = {}
    for (const r of failedRecords) {
      const day = (r.created_at as string).split('T')[0]
      errorsPerDay[day] = (errorsPerDay[day] || 0) + 1
    }

    const recentErrors = failedRecords
      .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
      .slice(0, 20)
      .map(r => ({
        model: r.model,
        error_message: r.error_message || 'Error desconocido',
        user_plan: r.user_plan,
        created_at: r.created_at,
      }))

    // --- Profitability ---
    // Fetch Pro subscription count for revenue estimate
    const { count: proUsers } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('plan', 'pro')
      .eq('subscription_status', 'active')

    const monthlyRevenue = (proUsers || 0) * 19.99
    const projectedMonthlyCost = (totalCost / periodDays) * 30
    const projectedMonthlyMargin = monthlyRevenue - projectedMonthlyCost

    return NextResponse.json({
      period,
      periodDays,
      usage: {
        totalMessages,
        uniqueUsers,
        uniqueSessions,
        messagesPerDay,
        avgMessagesPerDay: totalMessages / periodDays,
      },
      costs: {
        totalCost: Math.round(totalCost * 10000) / 10000,
        totalInputTokens,
        totalOutputTokens,
        costPerModel,
        costPerDay,
        avgCostPerSession: Math.round(avgCostPerSession * 10000) / 10000,
        avgCostPerMessage: totalMessages > 0 ? Math.round((totalCost / totalMessages) * 10000) / 10000 : 0,
      },
      quality: {
        thumbsUp,
        thumbsDown,
        totalFeedback: withSatisfaction.length,
        satisfactionRate: satisfactionRate !== null ? Math.round(satisfactionRate * 100) : null,
        avgResponseLength: Math.round(avgResponseLength),
        avgResponseTimeMs: Math.round(avgResponseTime),
      },
      distribution: {
        plan: planDistribution,
        category: categoryDistribution,
        model: modelDistribution,
      },
      errors: {
        totalErrors,
        errorRate: Math.round(errorRate * 100) / 100,
        errorsByModel,
        errorsPerDay,
        recentErrors,
      },
      profitability: {
        proUsers: proUsers || 0,
        estimatedMonthlyRevenue: monthlyRevenue,
        projectedMonthlyCost: Math.round(projectedMonthlyCost * 100) / 100,
        projectedMonthlyMargin: Math.round(projectedMonthlyMargin * 100) / 100,
        marginPercentage: monthlyRevenue > 0 ? Math.round((projectedMonthlyMargin / monthlyRevenue) * 100) : 0,
      },
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
