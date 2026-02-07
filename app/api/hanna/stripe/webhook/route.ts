import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_HANNA!

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

export async function POST(request: Request) {
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
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          // Update user profile to Pro
          await getTable('profiles')
            .update({
              plan: 'pro',
              subscription_status: 'active',
              stripe_subscription_id: subscription.id,
              plan_started_at: new Date().toISOString(),
              plan_expires_at: subscription.trial_end
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
            } as Record<string, unknown>)
            .eq('id', userId)

          console.log(`User ${userId} upgraded to Pro`)
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
              plan: status === 'cancelled' ? 'free' : 'pro',
            } as Record<string, unknown>)
            .eq('id', userId)

          console.log(`User ${userId} subscription updated to ${status}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.user_id

        if (userId) {
          // Downgrade to free
          await getTable('profiles')
            .update({
              plan: 'free',
              subscription_status: 'cancelled',
              stripe_subscription_id: null,
              plan_expires_at: null,
            } as Record<string, unknown>)
            .eq('id', userId)

          console.log(`User ${userId} subscription cancelled, downgraded to free`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Get subscription ID from invoice using parent field
        const invoiceWithParent = invoice as Stripe.Invoice & {
          parent?: { subscription_details?: { subscription?: string } }
          subscription_details?: { subscription?: string }
        }
        const subscriptionId = invoiceWithParent.parent?.subscription_details?.subscription
          || invoiceWithParent.subscription_details?.subscription

        if (subscriptionId) {
          // Get subscription to find user
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const userId = subscription.metadata?.user_id

          if (userId) {
            await getTable('profiles')
              .update({
                subscription_status: 'past_due',
              } as Record<string, unknown>)
              .eq('id', userId)

            console.log(`User ${userId} payment failed, marked as past_due`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
