import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/emails'

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

        // Create registration in database (using type assertion to bypass strict typing)
        const registrationData = {
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
          const customerName = name || `${data.payer?.name?.given_name || ''} ${data.payer?.name?.surname || ''}`.trim() || 'Participante'
          const emailResult = await sendConfirmationEmail({
            to: payerEmail,
            customerName,
            amount: String(parseFloat(captureAmount) || 100),
            paymentMethod: 'PayPal',
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
