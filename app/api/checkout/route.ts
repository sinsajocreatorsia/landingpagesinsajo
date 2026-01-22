import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { email, name, price, workshopName } = await request.json()

    // Validación
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.screatorsai.com'

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: workshopName || 'Latina Smart-Scaling Workshop',
              description: 'Workshop exclusivo de estrategia AI para fundadoras latinas - 7 de Marzo 2026',
              images: [`${baseUrl}/images/workshop-og.png`],
            },
            unit_amount: Math.round((parseFloat(price) || 100) * 100), // Convertir a centavos
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
        product: 'latina-smart-scaling-workshop',
        workshop_date: '2026-03-07',
      },
      // Opciones adicionales
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
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
