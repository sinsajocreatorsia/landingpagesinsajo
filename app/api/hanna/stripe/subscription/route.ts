import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

interface ProfileData {
  plan: string | null
  subscription_status: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_started_at: string | null
  plan_expires_at: string | null
}

interface InvoiceData {
  id: string
  amount_paid: number
  currency: string
  status: string | null
  created: string
  invoice_pdf: string | null
  hosted_invoice_url: string | null
}

interface PaymentMethodData {
  brand: string
  last4: string
  exp_month: number
  exp_year: number
}

interface SubscriptionResponse {
  plan: string
  subscription_status: string
  plan_started_at: string | null
  plan_expires_at: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  payment_method: PaymentMethodData | null
  invoices: InvoiceData[]
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { data: profileData } = await getTable('profiles')
      .select('plan, subscription_status, stripe_customer_id, stripe_subscription_id, plan_started_at, plan_expires_at')
      .eq('id', user.id)
      .single()

    const profile = profileData as ProfileData | null

    if (!profile) {
      return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    // Base response
    const response: SubscriptionResponse = {
      plan: profile.plan || 'free',
      subscription_status: profile.subscription_status || 'none',
      plan_started_at: profile.plan_started_at,
      plan_expires_at: profile.plan_expires_at,
      current_period_end: null,
      cancel_at_period_end: false,
      payment_method: null,
      invoices: [],
    }

    // Fetch Stripe details for users with active subscription
    if (profile.stripe_subscription_id) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription: any = await stripe.subscriptions.retrieve(
          profile.stripe_subscription_id,
          { expand: ['default_payment_method', 'latest_invoice'] }
        )

        response.current_period_end = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null
        response.cancel_at_period_end = subscription.cancel_at_period_end

        // Payment method last 4
        const pm = subscription.default_payment_method as Stripe.PaymentMethod | null
        if (pm?.card) {
          response.payment_method = {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
          }
        }

        // Recent invoices
        if (profile.stripe_customer_id) {
          const invoices = await stripe.invoices.list({
            customer: profile.stripe_customer_id,
            limit: 10,
          })

          response.invoices = invoices.data.map(inv => ({
            id: inv.id,
            amount_paid: inv.amount_paid,
            currency: inv.currency,
            status: inv.status,
            created: new Date(inv.created * 1000).toISOString(),
            invoice_pdf: inv.invoice_pdf ?? null,
            hosted_invoice_url: inv.hosted_invoice_url ?? null,
          }))
        }
      } catch (stripeError) {
        console.error('Stripe subscription fetch error:', stripeError)
        // Return what we have from DB even if Stripe call fails
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Subscription info error:', error)
    return NextResponse.json(
      { error: 'Error al obtener información de suscripción' },
      { status: 500 }
    )
  }
}
