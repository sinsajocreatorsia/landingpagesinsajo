import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendTrialReminderEmail } from '@/lib/emails'

// Cron job: sends reminder emails to users whose trial expires in 5 days
// Schedule: daily at 14:00 UTC (~8-9 AM CST)

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

    // Find users whose trial expires in ~5 days (between 4.5 and 5.5 days from now)
    const now = new Date()
    const minDate = new Date(now.getTime() + 4.5 * 24 * 60 * 60 * 1000)
    const maxDate = new Date(now.getTime() + 5.5 * 24 * 60 * 60 * 1000)

    const { data: expiringUsers, error } = await (supabaseAdmin.from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .select('id, email, full_name, plan_expires_at')
      .eq('plan', 'pro')
      .eq('subscription_status', 'active')
      .is('stripe_subscription_id', null) // No Stripe subscription = trial user
      .gte('plan_expires_at', minDate.toISOString())
      .lte('plan_expires_at', maxDate.toISOString())

    if (error) {
      console.error('Error fetching expiring trials:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!expiringUsers || expiringUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No trials expiring in 5 days',
        sent: 0,
      })
    }

    let sent = 0
    let failed = 0

    for (const user of expiringUsers) {
      if (!user.email) continue

      const expiryDate = new Date(user.plan_expires_at as string)
      const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

      // Format expiration date in Spanish
      const formattedDate = expiryDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const result = await sendTrialReminderEmail({
        to: user.email as string,
        customerName: (user.full_name as string) || 'Empresaria',
        daysRemaining,
        expirationDate: formattedDate,
        userId: user.id as string,
      })

      if (result.success) {
        sent++
        console.log(`Trial reminder sent to ${user.email}`)
      } else {
        failed++
        console.error(`Failed to send trial reminder to ${user.email}:`, result.error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Trial reminders processed`,
      total: expiringUsers.length,
      sent,
      failed,
    })
  } catch (error) {
    console.error('Trial reminders cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
