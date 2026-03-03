import { NextResponse } from 'next/server'
import { couponsTable, profilesTable, redemptionsTable } from '@/lib/supabase-helpers'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuth, rateLimit } from '@/lib/auth-guard'

// Helper for checking existing redemptions
async function getExistingRedemption(couponId: string, userId: string) {
  const { data } = await (supabaseAdmin.from('hanna_coupon_redemptions') as ReturnType<typeof supabaseAdmin.from>)
    .select('id')
    .eq('coupon_id', couponId)
    .eq('user_id', userId)
    .single()
  return data
}

export async function POST(request: Request) {
  // Rate limit: 5 requests per minute
  const rateLimitResponse = rateLimit(request, { maxRequests: 5, windowMs: 60_000 })
  if (rateLimitResponse) return rateLimitResponse

  // Require authenticated user
  const { user, error: authError } = await requireAuth()
  if (authError) return authError

  try {
    const { code, userId } = await request.json()

    if (!code || !userId) {
      return NextResponse.json(
        { success: false, error: 'Código y usuario requeridos' },
        { status: 400 }
      )
    }

    // Verify the authenticated user matches the requested userId
    if (user!.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'No autorizado para redimir cupones para otro usuario' },
        { status: 403 }
      )
    }

    // Look up coupon
    const { data: coupon, error: couponError } = await couponsTable.findByCode(code)

    if (couponError || !coupon) {
      return NextResponse.json(
        { success: false, error: 'Cupón no válido' },
        { status: 404 }
      )
    }

    // Check if already redeemed by this user
    const existingRedemption = await getExistingRedemption(coupon.id, userId)

    if (existingRedemption) {
      return NextResponse.json(
        { success: false, error: 'Ya has usado este cupón' },
        { status: 400 }
      )
    }

    // Calculate plan expiry for free months
    let planExpiresAt: string | null = null
    if (coupon.discount_type === 'free_months' && coupon.free_months && coupon.free_months > 0) {
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + coupon.free_months)
      planExpiresAt = expiryDate.toISOString()
    }

    // Update user's profile with Pro plan
    const { error: profileError } = await profilesTable.updatePlan(userId, 'pro', {
      subscription_status: 'active',
      plan_started_at: new Date().toISOString(),
      plan_expires_at: planExpiresAt,
    })

    if (profileError) {
      console.error('Error updating profile:', profileError)
      return NextResponse.json(
        { success: false, error: 'Error al aplicar cupón' },
        { status: 500 }
      )
    }

    // Record redemption
    const { error: redemptionError } = await redemptionsTable.create(coupon.id, userId)

    if (redemptionError) {
      console.error('Error recording redemption:', redemptionError)
    }

    // Increment coupon usage
    await couponsTable.incrementUses(coupon.id, coupon.current_uses)

    return NextResponse.json({
      success: true,
      message: coupon.free_months
        ? `¡Felicidades! Tienes ${coupon.free_months} meses gratis de Hanna Pro`
        : 'Cupón aplicado correctamente',
      plan_expires_at: planExpiresAt,
    })
  } catch (error) {
    console.error('Coupon redemption error:', error)
    return NextResponse.json(
      { success: false, error: 'Error al canjear cupón' },
      { status: 500 }
    )
  }
}
