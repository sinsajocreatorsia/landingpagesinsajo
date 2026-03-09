import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Cron job: downgrades expired trial users to free plan
// Schedule: daily at 6:00 UTC (~midnight CST)

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

    const now = new Date().toISOString()

    // Find users whose trial has expired (plan_expires_at < now, still on pro, no Stripe subscription)
    const { data: expiredUsers, error } = await (supabaseAdmin.from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .select('id, email, full_name, plan_expires_at')
      .eq('plan', 'pro')
      .eq('subscription_status', 'active')
      .is('stripe_subscription_id', null) // No Stripe subscription = trial user
      .lt('plan_expires_at', now)

    if (error) {
      console.error('Error fetching expired trials:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!expiredUsers || expiredUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired trials',
        downgraded: 0,
      })
    }

    let downgraded = 0
    let failed = 0

    for (const user of expiredUsers) {
      const { error: updateError } = await (supabaseAdmin.from('profiles') as ReturnType<typeof supabaseAdmin.from>)
        .update({
          plan: 'free',
          subscription_status: 'expired',
        })
        .eq('id', user.id)

      if (updateError) {
        failed++
        console.error(`Failed to downgrade user ${user.id}:`, updateError)
      } else {
        downgraded++
        console.log(`Trial expired - downgraded ${user.email} to free plan`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Trial expiry processed`,
      total: expiredUsers.length,
      downgraded,
      failed,
    })
  } catch (error) {
    console.error('Trial expiry cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
