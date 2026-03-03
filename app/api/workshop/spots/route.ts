import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabaseAdmin as any

    // Get max_spots from settings
    const { data: setting } = await sb
      .from('workshop_settings')
      .select('value')
      .eq('key', 'max_spots')
      .single()

    const maxSpots = setting ? Number(setting.value) : 12

    // Count completed registrations
    const { count: registeredCount } = await sb
      .from('workshop_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('payment_status', 'completed')

    const registered = registeredCount ?? 0
    const spotsAvailable = Math.max(0, maxSpots - registered)

    // Count waitlist entries
    const { count: waitlistCount } = await sb
      .from('workshop_waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'waiting')

    return NextResponse.json({
      maxSpots,
      registeredCount: registered,
      spotsAvailable,
      isSoldOut: spotsAvailable === 0,
      waitlistCount: waitlistCount ?? 0,
    })
  } catch (error) {
    console.error('Spots API error:', error)
    return NextResponse.json(
      { error: 'Error al consultar disponibilidad' },
      { status: 500 },
    )
  }
}
