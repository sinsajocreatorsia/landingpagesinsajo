import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { completeReminder, dismissReminder, deleteReminder } from '@/lib/hanna/reminder-service'

// PATCH - Update reminder status (complete or dismiss)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reminderId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { reminderId } = await params
    const { status } = await request.json()

    if (!status || !['completed', 'dismissed'].includes(status)) {
      return NextResponse.json(
        { error: 'Status debe ser "completed" o "dismissed"' },
        { status: 400 }
      )
    }

    const success = status === 'completed'
      ? await completeReminder(user.id, reminderId)
      : await dismissReminder(user.id, reminderId)

    if (!success) {
      return NextResponse.json({ error: 'Error actualizando recordatorio' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reminder PATCH error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Remove a reminder
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ reminderId: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { reminderId } = await params

    const success = await deleteReminder(user.id, reminderId)

    if (!success) {
      return NextResponse.json({ error: 'Error eliminando recordatorio' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reminder DELETE error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
