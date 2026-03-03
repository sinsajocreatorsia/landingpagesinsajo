import { NextRequest, NextResponse } from 'next/server'
import { paymentLimiter, getClientIdentifier, rateLimitHeaders } from '@/lib/security/rate-limit'

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

// Server-side fixed price - NEVER accept price from client
const WORKSHOP_PRICE = '100.00'

async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIdentifier(request)
    const rateCheck = paymentLimiter.check(clientIp)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta en un momento.' },
        { status: 429, headers: rateLimitHeaders(rateCheck) }
      )
    }

    const { email, name } = await request.json()

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Basic email format validation
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.screatorsai.com'

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: WORKSHOP_PRICE,
            },
            description: 'Latina Smart-Scaling Workshop - 7 de Marzo 2026',
            custom_id: `workshop_${Date.now()}_${email.replace('@', '_at_')}`,
            soft_descriptor: 'SINSAJO WORKSHOP',
          },
        ],
        application_context: {
          brand_name: 'Sinsajo Creators',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${baseUrl}/academy/workshop/success`,
          cancel_url: `${baseUrl}/academy/workshop`,
        },
      }),
    })

    const order = await response.json()

    if (order.error) {
      console.error('PayPal order error:', order)
      return NextResponse.json(
        { error: 'Error al crear orden de PayPal' },
        { status: 500 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json(
      { error: 'Error al crear orden de PayPal' },
      { status: 500 }
    )
  }
}
