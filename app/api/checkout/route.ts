import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { email, name, phone, country, utm_source, utm_medium, utm_campaign } = await request.json()

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.screatorsai.com'

    // Use the pre-defined Stripe Price ID for the Workshop
    const workshopPriceId = process.env.STRIPE_WORKSHOP_PRICE_ID

    if (!workshopPriceId) {
      console.error('STRIPE_WORKSHOP_PRICE_ID is not configured')
      return NextResponse.json(
        { error: 'Configuración de precio no disponible' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session using the pre-defined Price ID
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: workshopPriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/academy/workshop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/academy/workshop`,
      customer_email: email,
      metadata: {
        customer_name: name,
        customer_email: email,
        customer_phone: phone || '',
        customer_country: country || '',
        product: 'ia-empresarias-exitosas-workshop',
        workshop_date: '2026-03-07',
        utm_source: utm_source || '',
        utm_medium: utm_medium || '',
        utm_campaign: utm_campaign || '',
      },
      // Additional options
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
