import { supabaseAdmin } from '@/lib/supabase'
import type { HannaReminder, CreateReminderInput, PendingRemindersResponse } from '@/types/reminder'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remindersTable = () => (supabaseAdmin as any).from('hanna_reminders')

export async function createReminder(
  userId: string,
  input: CreateReminderInput
): Promise<HannaReminder | null> {
  const { data, error } = await remindersTable()
    .insert({
      user_id: userId,
      task: input.task.slice(0, 500),
      strategic_context: input.strategic_context?.slice(0, 500) || null,
      approach_suggestion: input.approach_suggestion?.slice(0, 500) || null,
      due_at: input.due_iso,
      session_id: input.session_id || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating reminder:', error)
    return null
  }

  return data as HannaReminder
}

export async function getPendingReminders(userId: string): Promise<PendingRemindersResponse> {
  const { data, error } = await remindersTable()
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('due_at', { ascending: true })
    .limit(20)

  if (error || !data) {
    console.error('Error fetching reminders:', error)
    return { overdue: [], today: [], upcoming: [] }
  }

  const reminders = data as HannaReminder[]
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)

  const overdue: HannaReminder[] = []
  const today: HannaReminder[] = []
  const upcoming: HannaReminder[] = []

  for (const r of reminders) {
    const due = new Date(r.due_at)
    if (due < todayStart) {
      overdue.push(r)
    } else if (due < todayEnd) {
      today.push(r)
    } else {
      upcoming.push(r)
    }
  }

  return { overdue, today, upcoming }
}

export async function completeReminder(userId: string, reminderId: string): Promise<boolean> {
  const { error } = await remindersTable()
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', reminderId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error completing reminder:', error)
    return false
  }
  return true
}

export async function dismissReminder(userId: string, reminderId: string): Promise<boolean> {
  const { error } = await remindersTable()
    .update({ status: 'dismissed' })
    .eq('id', reminderId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error dismissing reminder:', error)
    return false
  }
  return true
}

export async function deleteReminder(userId: string, reminderId: string): Promise<boolean> {
  const { error } = await remindersTable()
    .delete()
    .eq('id', reminderId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting reminder:', error)
    return false
  }
  return true
}

export async function getRemindersDueForEmail(): Promise<(HannaReminder & { user_id: string })[]> {
  const { data, error } = await remindersTable()
    .select('*')
    .eq('status', 'pending')
    .eq('email_sent', false)
    .lte('due_at', new Date().toISOString())
    .order('due_at', { ascending: true })
    .limit(100)

  if (error || !data) {
    console.error('Error fetching due reminders:', error)
    return []
  }

  return data as (HannaReminder & { user_id: string })[]
}

export async function markEmailSent(reminderId: string): Promise<void> {
  const { error } = await remindersTable()
    .update({ email_sent: true })
    .eq('id', reminderId)

  if (error) {
    console.error('Error marking email sent:', error)
  }
}

export function buildReminderContext(pending: PendingRemindersResponse): string {
  const { overdue, today, upcoming } = pending

  if (overdue.length === 0 && today.length === 0 && upcoming.length === 0) {
    return ''
  }

  let context = '\n\nRECORDATORIOS PENDIENTES DEL USUARIO (menciona los mas urgentes al saludar):'

  if (overdue.length > 0) {
    context += '\nVENCIDOS (urgente):'
    for (const r of overdue.slice(0, 3)) {
      const dueDate = new Date(r.due_at).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
      context += `\n- "${r.task}" (vencio: ${dueDate})`
    }
    if (overdue.length > 3) {
      context += `\n- ...y ${overdue.length - 3} mas`
    }
  }

  if (today.length > 0) {
    context += '\nPARA HOY:'
    for (const r of today.slice(0, 3)) {
      context += `\n- "${r.task}"`
    }
    if (today.length > 3) {
      context += `\n- ...y ${today.length - 3} mas`
    }
  }

  if (upcoming.length > 0) {
    context += '\nPROXIMOS:'
    for (const r of upcoming.slice(0, 3)) {
      const dueDate = new Date(r.due_at).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
      context += `\n- "${r.task}" (para: ${dueDate})`
    }
    if (upcoming.length > 3) {
      context += `\n- ...y ${upcoming.length - 3} mas`
    }
  }

  return context
}
