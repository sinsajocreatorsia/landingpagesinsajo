import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_HANNA || ''

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

function log(eventType: string, eventId: string, message: string) {
  console.log(`[Stripe Webhook] [${eventType}] [${eventId}] ${message}`)
}

// Check if event was already processed (idempotency)
async function isEventProcessed(eventId: string): Promise<boolean> {
  const { data } = await getTable('stripe_webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .single()
  return !!data
}

// Record event as processed
async function recordEvent(eventId: string, eventType: string) {
  await getTable('stripe_webhook_events')
    .insert({ event_id: eventId, event_type: eventType } as Record<string, unknown>)
}

// Extract subscription ID from invoice (handles different Stripe API structures)
function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const invoiceWithParent = invoice as Stripe.Invoice & {
    parent?: { subscription_details?: { subscription?: string } }
    subscription_details?: { subscription?: string }
  }
  return invoiceWithParent.parent?.subscription_details?.subscription
    || invoiceWithParent.subscription_details?.subscription
    || null
}

export async function POST(request: Request) {
  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET_HANNA is not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Idempotency check
    const alreadyProcessed = await isEventProcessed(event.id)
    if (alreadyProcessed) {
      log(event.type, event.id, 'Event already processed, skipping')
      return NextResponse.json({ received: true })
    }

    // Record event before processing to prevent race conditions
    await recordEvent(event.id, event.type)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const checkoutPlan = subscription.metadata?.plan || 'pro'

          await getTable('profiles')
            .update({
              plan: checkoutPlan,
              subscription_status: 'active',
              stripe_subscription_id: subscription.id,
              plan_started_at: new Date().toISOString(),
              plan_expires_at: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
            } as Record<string, unknown>)
            .eq('id', userId)

          log(event.type, event.id, `User ${userId} upgraded to ${checkoutPlan}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          const status = subscription.status === 'active' || subscription.status === 'trialing'
            ? 'active'
            : subscription.status === 'past_due'
            ? 'past_due'
            : 'cancelled'

          await getTable('profiles')
            .update({
              subscription_status: status,
              plan: status === 'cancelled' ? 'free' : (subscription.metadata?.plan || 'pro'),
            } as Record<string, unknown>)
            .eq('id', userId)

          log(event.type, event.id, `User ${userId} subscription status: ${status}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          await getTable('profiles')
            .update({
              plan: 'free',
              subscription_status: 'cancelled',
              stripe_subscription_id: null,
              plan_expires_at: null,
            } as Record<string, unknown>)
            .eq('id', userId)

          log(event.type, event.id, `User ${userId} subscription cancelled, downgraded to free`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = getSubscriptionIdFromInvoice(invoice)

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata?.user_id

          if (userId) {
            await getTable('profiles')
              .update({
                subscription_status: 'past_due',
              } as Record<string, unknown>)
              .eq('id', userId)

            log(event.type, event.id, `User ${userId} payment failed, marked as past_due`)
          }
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = getSubscriptionIdFromInvoice(invoice)

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata?.user_id

          if (userId) {
            await getTable('profiles')
              .update({
                subscription_status: 'active',
                plan: subscription.metadata?.plan || 'pro',
              } as Record<string, unknown>)
              .eq('id', userId)

            log(event.type, event.id, `User ${userId} payment confirmed, subscription active`)
          }
        }
        break
      }

      default:
        log(event.type, event.id, 'Unhandled event type')
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Stripe Webhook] Handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
