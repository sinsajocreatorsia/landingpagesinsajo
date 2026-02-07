import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/emails'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// GET handler to verify webhook endpoint exists
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Stripe webhook endpoint is active',
    endpoint: '/api/webhooks/stripe',
    method: 'POST only - This endpoint receives webhooks from Stripe',
    events: [
      'checkout.session.completed',
      'checkout.session.expired',
      'payment_intent.succeeded',
      'payment_intent.payment_failed',
      'charge.refunded'
    ]
  })
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      // Create registration in database (using type assertion to bypass strict typing)
      const registrationData = {
        email: session.customer_email || session.metadata?.customer_email || '',
        full_name: session.metadata?.customer_name || '',
        phone: session.metadata?.customer_phone || null,
        country: session.metadata?.customer_country || null,
        payment_status: 'completed',
        payment_method: 'stripe',
        payment_id: session.id,
        amount_paid: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || 'USD',
        registration_status: 'registered',
        utm_source: session.metadata?.utm_source || null,
        utm_medium: session.metadata?.utm_medium || null,
        utm_campaign: session.metadata?.utm_campaign || null,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: registration, error: regError } = await (supabaseAdmin as any)
        .from('workshop_registrations')
        .insert(registrationData)
        .select()
        .single()

      if (regError) {
        console.error('Supabase registration error:', regError)
      } else {
        console.log('Registration created:', registration?.id)

        // Send confirmation email via Resend
        const emailResult = await sendConfirmationEmail({
          to: session.customer_email || session.metadata?.customer_email || '',
          customerName: session.metadata?.customer_name || 'Participante',
          amount: String((session.amount_total || 0) / 100),
          paymentMethod: 'Tarjeta de crédito/débito',
          registrationId: registration?.id,
        })

        if (emailResult.success) {
          console.log('Confirmation email sent:', emailResult.messageId)
        } else {
          console.error('Failed to send confirmation email:', emailResult.error)
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
    }

    console.log('Payment completed for:', session.customer_email)
  }

  // Handle checkout.session.expired event
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Checkout session expired for:', session.customer_email)
  }

  // Handle payment_intent.succeeded event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log('Payment intent succeeded:', paymentIntent.id, 'Amount:', paymentIntent.amount / 100, paymentIntent.currency?.toUpperCase())
  }

  // Handle payment failed event
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    console.log('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)
  }

  // Handle refund event
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge

    // Update registration status (using type assertion to bypass strict typing)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin as any)
      .from('workshop_registrations')
      .update({ payment_status: 'refunded' })
      .eq('payment_id', charge.payment_intent as string)

    console.log('Refund processed for charge:', charge.id)
  }

  return NextResponse.json({ received: true })
}
