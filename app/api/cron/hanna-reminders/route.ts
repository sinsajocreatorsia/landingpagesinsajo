import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getRemindersDueForEmail, markEmailSent } from '@/lib/hanna/reminder-service'
import { sendHannaReminderEmail } from '@/lib/emails'

// Cron job: sends reminder emails for due/overdue tasks (Pro/Business users only)
// Schedule: daily at 13:00 UTC (~7-8 AM CST)

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      console.error('CRON_SECRET is not configured')
      return NextResponse.json({ error: 'Cron not configured' }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all reminders that are due and haven't been emailed
    const dueReminders = await getRemindersDueForEmail()

    if (dueReminders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No reminders due',
        sent: 0,
      })
    }

    // Group by user_id
    const byUser = new Map<string, typeof dueReminders>()
    for (const r of dueReminders) {
      const list = byUser.get(r.user_id) || []
      list.push(r)
      byUser.set(r.user_id, list)
    }

    let sent = 0
    let skipped = 0
    let failed = 0

    for (const [userId, reminders] of byUser) {
      try {
        // Check user has Pro/Business plan
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabaseAdmin as any)
          .from('profiles')
          .select('plan, full_name')
          .eq('id', userId)
          .single()

        if (!profile) {
          skipped++
          continue
        }

        const p = profile as { plan: string; full_name: string }
        if (p.plan !== 'pro' && p.plan !== 'business') {
          skipped++
          continue
        }

        // Get user email from auth
        const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId)
        const email = authData?.user?.email
        if (!email) {
          skipped++
          continue
        }

        // Send one consolidated email per user
        const result = await sendHannaReminderEmail({
          to: email,
          customerName: p.full_name || 'Empresaria',
          reminders: reminders.map(r => ({
            task: r.task,
            due: new Date(r.due_at).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            }),
            strategic_context: r.strategic_context || undefined,
            approach_suggestion: r.approach_suggestion || undefined,
          })),
          userId,
        })

        if (result.success) {
          // Mark all reminders as emailed
          for (const r of reminders) {
            await markEmailSent(r.id)
          }
          sent++
        } else {
          console.error(`Reminder email failed for user ${userId}:`, result.error)
          failed++
        }
      } catch (err) {
        console.error(`Reminder email error for user ${userId}:`, err)
        failed++
      }
    }

    console.log(`Hanna reminders: ${sent} sent, ${skipped} skipped, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Sent ${sent} reminder emails`,
      sent,
      skipped,
      failed,
      totalReminders: dueReminders.length,
      totalUsers: byUser.size,
    })
  } catch (error) {
    console.error('Hanna reminders cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Allow POST for manual triggering
export async function POST(request: Request) {
  return GET(request)
}
