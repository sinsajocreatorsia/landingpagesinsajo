import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const registrationId = searchParams.get('registrationId')

    // Support both sessionId (from Stripe redirect) and registrationId (from reminder email)
    if (!sessionId && !registrationId) {
      return NextResponse.json(
        { error: 'Session ID o Registration ID es requerido' },
        { status: 400 }
      )
    }

    // If we have a registrationId, fetch directly from database
    if (registrationId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: registration, error } = await (supabaseAdmin as any)
        .from('workshop_registrations')
        .select('id, full_name, email, payment_status')
        .eq('id', registrationId)
        .single()

      if (error || !registration) {
        return NextResponse.json(
          { error: 'Registro no encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        registrationId: registration.id,
        customerName: registration.full_name || '',
        customerEmail: registration.email || '',
        paymentStatus: registration.payment_status === 'completed' ? 'paid' : registration.payment_status,
      })
    }

    // If we have a sessionId, fetch from Stripe first
    const session = await stripe.checkout.sessions.retrieve(sessionId!)

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    // Find registration in database (using type assertion to bypass strict typing)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: registrationData } = await (supabaseAdmin as any)
      .from('workshop_registrations')
      .select('id, full_name, email')
      .eq('payment_id', sessionId)
      .single()

    const registration = registrationData as { id: string; full_name: string; email: string } | null

    return NextResponse.json({
      registrationId: registration?.id || null,
      customerName: registration?.full_name || session.metadata?.customer_name || '',
      customerEmail: registration?.email || session.customer_email || '',
      paymentStatus: session.payment_status,
    })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
