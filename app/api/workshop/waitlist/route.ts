import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { leadsLimiter, getClientIdentifier, rateLimitHeaders } from '@/lib/security/rate-limit'
import { sendWaitlistConfirmationEmail } from '@/lib/emails'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIdentifier(request)
    const rateCheck = leadsLimiter.check(clientIp)
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta en un momento.' },
        { status: 429, headers: rateLimitHeaders(rateCheck) },
      )
    }

    const { email, name, phone } = await request.json()

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 },
      )
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Por favor ingresa un email válido' },
        { status: 400 },
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabaseAdmin as any

    // Check if already on waitlist
    const { data: existing } = await sb
      .from('workshop_waitlist')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .eq('workshop_edition', 'next')
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Ya estás en la lista de espera. Te notificaremos cuando abramos el próximo workshop.' },
        { status: 409 },
      )
    }

    // Insert into waitlist
    const { data: inserted, error: insertError } = await sb
      .from('workshop_waitlist')
      .insert({
        email: email.trim().toLowerCase(),
        full_name: name.trim(),
        phone: phone?.trim() || null,
        workshop_edition: 'next',
        status: 'waiting',
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Waitlist insert error:', insertError)
      return NextResponse.json(
        { error: 'Error al registrar. Intenta de nuevo.' },
        { status: 500 },
      )
    }

    // Get position in waitlist
    const { count: position } = await sb
      .from('workshop_waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('workshop_edition', 'next')
      .eq('status', 'waiting')

    // Send confirmation email
    try {
      await sendWaitlistConfirmationEmail({
        to: email.trim().toLowerCase(),
        customerName: name.trim(),
        position: position ?? 1,
      })
    } catch (emailError) {
      console.error('Waitlist email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      waitlistId: inserted?.id || null,
      position: position ?? 1,
      message: '¡Estás en la lista de espera!',
    })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
