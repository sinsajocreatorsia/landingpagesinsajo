import { NextResponse } from 'next/server'

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

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

    const accessToken = await getPayPalAccessToken()
    const workshopPrice = price || '100.00'
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
              value: workshopPrice,
            },
            description: workshopName || 'Latina Smart-Scaling Workshop - 7 de Marzo 2026',
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
