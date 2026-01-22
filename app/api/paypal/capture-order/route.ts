import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PAYPAL_API = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

// Supabase client with service role for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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
    const { orderID, email, name } = await request.json()

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID es requerido' },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    // Si el pago fue exitoso, guardar en Supabase
    if (data.status === 'COMPLETED' && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const captureAmount = data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value

      await supabase.from('workshop_registrations').insert({
        email: email,
        name: name,
        payment_method: 'paypal',
        payment_id: orderID,
        amount: parseFloat(captureAmount) || 100,
        status: 'completed',
        workshop_date: '2026-03-07',
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: 'Error al capturar el pago de PayPal' },
      { status: 500 }
    )
  }
}
