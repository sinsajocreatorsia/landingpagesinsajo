import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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
    const { orderID, email, name, phone, country, utm_source, utm_medium, utm_campaign } = await request.json()

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

    // If payment was successful, save to Supabase
    if (data.status === 'COMPLETED') {
      try {
        const captureAmount = data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value
        const payerEmail = data.payer?.email_address || email

        // Create registration in database
        const { data: registration, error: regError } = await supabaseAdmin
          .from('workshop_registrations')
          .insert({
            email: payerEmail,
            full_name: name || `${data.payer?.name?.given_name || ''} ${data.payer?.name?.surname || ''}`.trim(),
            phone: phone || null,
            country: country || data.payer?.address?.country_code || null,
            payment_status: 'completed',
            payment_method: 'paypal',
            payment_id: orderID,
            amount_paid: parseFloat(captureAmount) || 100,
            currency: 'USD',
            registration_status: 'registered',
            utm_source: utm_source || null,
            utm_medium: utm_medium || null,
            utm_campaign: utm_campaign || null,
          })
          .select()
          .single()

        if (regError) {
          console.error('Supabase registration error:', regError)
        } else {
          console.log('Registration created:', registration?.id)

          // Log confirmation email
          await supabaseAdmin.from('email_logs').insert({
            registration_id: registration?.id,
            email_type: 'confirmation',
            recipient_email: payerEmail,
            subject: 'Confirmación de registro - IA para Empresarias Exitosas',
            status: 'pending',
          })
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
      }

      console.log('PayPal payment completed for:', email)
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
