import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

interface ReminderRow {
  id: string
  user_id: string
  task: string
  strategic_context: string | null
  approach_suggestion: string | null
  due_at: string
  status: string
  email_sent: boolean
  completed_at: string | null
  created_at: string
}

export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '7d'

  const periodDays = period === '90d' ? 90 : period === '30d' ? 30 : 7
  const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

  try {
    // Fetch all reminders in period
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: reminders, error: remError } = await (supabaseAdmin as any)
      .from('hanna_reminders')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: true })

    if (remError) {
      console.error('Reminders stats error:', remError)
      return NextResponse.json({ error: 'Error fetching reminders' }, { status: 500 })
    }

    const records = (reminders || []) as ReminderRow[]

    // --- Overview ---
    const total = records.length
    const pending = records.filter(r => r.status === 'pending').length
    const completed = records.filter(r => r.status === 'completed').length
    const dismissed = records.filter(r => r.status === 'dismissed').length
    const emailsSent = records.filter(r => r.email_sent).length
    const uniqueUsers = new Set(records.map(r => r.user_id)).size

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const dismissRate = total > 0 ? Math.round((dismissed / total) * 100) : 0

    // --- Per Day ---
    const perDay: Record<string, { created: number; completed: number; dismissed: number }> = {}
    for (const r of records) {
      const day = r.created_at.split('T')[0]
      if (!perDay[day]) perDay[day] = { created: 0, completed: 0, dismissed: 0 }
      perDay[day].created++
    }
    for (const r of records) {
      if (r.completed_at) {
        const day = r.completed_at.split('T')[0]
        if (!perDay[day]) perDay[day] = { created: 0, completed: 0, dismissed: 0 }
        perDay[day].completed++
      }
      if (r.status === 'dismissed') {
        const day = r.created_at.split('T')[0]
        if (perDay[day]) perDay[day].dismissed++
      }
    }

    // --- Overdue Analysis ---
    const now = new Date()
    const overdue = records.filter(r => r.status === 'pending' && new Date(r.due_at) < now).length

    // --- Avg time to complete ---
    const completedWithTime = records.filter(r => r.status === 'completed' && r.completed_at)
    let avgCompletionHours = 0
    if (completedWithTime.length > 0) {
      const totalHours = completedWithTime.reduce((sum, r) => {
        const created = new Date(r.created_at).getTime()
        const done = new Date(r.completed_at!).getTime()
        return sum + (done - created) / (1000 * 60 * 60)
      }, 0)
      avgCompletionHours = Math.round(totalHours / completedWithTime.length)
    }

    // --- Recent reminders (last 10) ---
    const recent = records.slice(-10).reverse().map(r => ({
      id: r.id,
      task: r.task,
      status: r.status,
      due_at: r.due_at,
      email_sent: r.email_sent,
      created_at: r.created_at,
    }))

    // --- Fetch all-time totals for context ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: allTimeTotal } = await (supabaseAdmin as any)
      .from('hanna_reminders')
      .select('*', { count: 'exact', head: true })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: allTimeCompleted } = await (supabaseAdmin as any)
      .from('hanna_reminders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    return NextResponse.json({
      success: true,
      period,
      overview: {
        total,
        pending,
        completed,
        dismissed,
        overdue,
        emailsSent,
        uniqueUsers,
        completionRate,
        dismissRate,
        avgCompletionHours,
      },
      allTime: {
        total: allTimeTotal || 0,
        completed: allTimeCompleted || 0,
      },
      perDay,
      recent,
    })
  } catch (error) {
    console.error('Admin reminders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
