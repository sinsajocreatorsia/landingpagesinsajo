import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { email, name, phone, country, price, workshopName, utm_source, utm_medium, utm_campaign } = await request.json()

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.screatorsai.com'
    const workshopPrice = Math.round((parseFloat(price) || 100) * 100) // Convert to cents

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: workshopName || 'IA para Empresarias Exitosas - Workshop',
              description: 'Workshop exclusivo de estrategia AI para empresarias de habla hispana - 7 de Marzo 2026',
              images: [`${baseUrl}/images/workshop-og.png`],
            },
            unit_amount: workshopPrice,
          },
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
