import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createReminder, getPendingReminders } from '@/lib/hanna/reminder-service'
import type { CreateReminderInput } from '@/types/reminder'
import { PLAN_LIMITS } from '@/types/hanna'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTable = (name: string) => (supabaseAdmin as any).from(name)

// GET - List pending reminders for current user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check plan
    const { data: profile } = await getTable('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = (profile as { plan: string } | null)?.plan || 'free'
    if (plan !== 'pro' && plan !== 'business') {
      return NextResponse.json(
        { error: 'Los recordatorios requieren Hanna Pro o Business' },
        { status: 403 }
      )
    }

    const reminders = await getPendingReminders(user.id)

    return NextResponse.json({
      success: true,
      reminders,
    })
  } catch (error) {
    console.error('Reminders GET error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Create a new reminder
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check plan
    const { data: profile } = await getTable('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = (profile as { plan: string } | null)?.plan || 'free'
    if (plan !== 'pro' && plan !== 'business') {
      return NextResponse.json(
        { error: 'Los recordatorios requieren Hanna Pro o Business' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { task, strategic_context, approach_suggestion, due_iso, session_id } = body as CreateReminderInput

    if (!task || !due_iso) {
      return NextResponse.json(
        { error: 'Se requiere task y due_iso' },
        { status: 400 }
      )
    }

    // Validate due_iso is a valid date
    const dueDate = new Date(due_iso)
    if (isNaN(dueDate.getTime())) {
      return NextResponse.json(
        { error: 'Fecha invalida' },
        { status: 400 }
      )
    }

    // Limit active reminders per user based on plan
    const planKey = (plan === 'pro' || plan === 'business') ? plan : 'free'
    const maxReminders = PLAN_LIMITS[planKey as keyof typeof PLAN_LIMITS].reminders_limit

    const { count } = await getTable('hanna_reminders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'pending')

    if ((count || 0) >= maxReminders) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de recordatorios activos (${maxReminders}) para tu plan.` },
        { status: 429 }
      )
    }

    const reminder = await createReminder(user.id, {
      task,
      strategic_context,
      approach_suggestion,
      due_iso,
      session_id,
    })

    if (!reminder) {
      return NextResponse.json({ error: 'Error creando recordatorio' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reminder,
    })
  } catch (error) {
    console.error('Reminders POST error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
