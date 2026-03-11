import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500)
  const offset = parseInt(searchParams.get('offset') || '0')
  const eventType = searchParams.get('type') || null
  const severity = searchParams.get('severity') || null
  const period = searchParams.get('period') || '7d'

  const periodDays = period === '30d' ? 30 : period === '90d' ? 90 : 7
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  try {
    // Build query
    let query = (supabaseAdmin.from('app_events') as ReturnType<typeof supabaseAdmin.from>)
      .select('*', { count: 'exact' })
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (eventType) query = query.eq('event_type', eventType)
    if (severity) query = query.eq('severity', severity)

    const { data: events, error, count } = await query

    if (error) {
      console.error('Events query error:', error)
      return NextResponse.json({ error: 'Error fetching events' }, { status: 500 })
    }

    const records = (events || []) as Array<Record<string, unknown>>

    // Summary counts by event type
    const byType: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}

    // Separate query for summary (all events in period, no pagination)
    const { data: allEvents } = await (supabaseAdmin.from('app_events') as ReturnType<typeof supabaseAdmin.from>)
      .select('event_type, severity')
      .gte('created_at', since)

    for (const e of (allEvents || []) as Array<Record<string, unknown>>) {
      const t = e.event_type as string
      const s = e.severity as string
      byType[t] = (byType[t] || 0) + 1
      bySeverity[s] = (bySeverity[s] || 0) + 1
    }

    return NextResponse.json({
      events: records,
      total: count ?? 0,
      summary: { byType, bySeverity },
      period,
      periodDays,
    })
  } catch (error) {
    console.error('Admin events error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
