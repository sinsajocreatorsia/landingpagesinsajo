import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

export async function GET() {
  // Check if requester is admin for detailed info
  const { error: adminError } = await requireAdmin()

  // Public: return minimal health status
  if (adminError) {
    try {
      const { error } = await supabaseAdmin.from('profiles').select('id').limit(1)
      return NextResponse.json({
        status: error ? 'degraded' : 'ok',
        timestamp: new Date().toISOString(),
      })
    } catch {
      return NextResponse.json({ status: 'error' }, { status: 503 })
    }
  }

  // Admin: return aggregated health status without exposing specific secret names
  const checks: Record<string, boolean | string | null> = {
    database_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    payments_configured: !!process.env.STRIPE_SECRET_KEY,
    app_url: process.env.NEXT_PUBLIC_APP_URL || null,
    database_connection: false,
  }

  try {
    const { error } = await supabaseAdmin.from('profiles').select('id').limit(1)
    checks.database_connection = !error
  } catch {
    checks.database_connection = false
  }

  return NextResponse.json(checks)
}
