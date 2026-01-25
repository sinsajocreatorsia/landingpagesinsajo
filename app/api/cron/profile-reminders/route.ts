import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendProfileReminderEmail } from '@/lib/emails'

// This endpoint should be called by a cron job (e.g., Vercel Cron)
// It sends reminder emails to users who paid but haven't completed their profile

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find registrations that:
    // 1. Have completed payment
    // 2. Haven't completed their profile
    // 3. Were created more than 1 hour ago (give them time to complete naturally)
    // 4. Were created less than 7 days ago (don't spam old registrations)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: registrations, error: regError } = await (supabaseAdmin as any)
      .from('workshop_registrations')
      .select('id, email, full_name, created_at, profile_completed')
      .eq('payment_status', 'completed')
      .or('profile_completed.is.null,profile_completed.eq.false')
      .lt('created_at', oneHourAgo)
      .gt('created_at', sevenDaysAgo)

    if (regError) {
      console.error('Error fetching registrations:', regError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending profile reminders',
        sent: 0,
      })
    }

    // Check which ones haven't received a reminder in the last 24 hours
    const registrationIds = registrations.map((r: { id: string }) => r.id)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recentReminders } = await (supabaseAdmin as any)
      .from('email_logs')
      .select('registration_id, sent_at')
      .eq('email_type', 'profile_reminder')
      .in('registration_id', registrationIds)
      .gte('sent_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    const recentlyRemindedIds = new Set(
      (recentReminders || []).map((r: { registration_id: string }) => r.registration_id)
    )

    // Filter out recently reminded registrations
    const toRemind = registrations.filter(
      (r: { id: string }) => !recentlyRemindedIds.has(r.id)
    )

    // Send reminder emails
    const results = await Promise.allSettled(
      toRemind.map(async (registration: { id: string; email: string; full_name: string; created_at: string }) => {
        const hoursAfterPayment = Math.floor(
          (Date.now() - new Date(registration.created_at).getTime()) / (1000 * 60 * 60)
        )

        return sendProfileReminderEmail({
          to: registration.email,
          customerName: registration.full_name,
          registrationId: registration.id,
          hoursAfterPayment,
        })
      })
    )

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(`Profile reminders sent: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      message: `Sent ${successful} profile reminders`,
      sent: successful,
      failed,
      total: toRemind.length,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also allow POST for manual triggering
export async function POST(request: Request) {
  return GET(request)
}
