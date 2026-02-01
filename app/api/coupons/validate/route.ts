import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface Coupon {
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  max_uses: number | null
  times_used: number
  valid_until: string | null
  is_active: boolean
  applicable_plans: string[]
}

// POST - Validate coupon code
export async function POST(request: Request) {
  try {
    const { code, plan = 'pro' } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Código de cupón requerido' }, { status: 400 })
    }

    // Fetch coupon
    const { data, error } = await supabaseAdmin
      .from('discount_coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    const coupon = data as Coupon | null

    if (error || !coupon) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Cupón no válido o expirado',
        },
        { status: 404 }
      )
    }

    // Validate expiry
    if (coupon.valid_until) {
      const now = new Date()
      const expiryDate = new Date(coupon.valid_until)
      if (now > expiryDate) {
        return NextResponse.json(
          {
            valid: false,
            error: 'Este cupón ha expirado',
          },
          { status: 400 }
        )
      }
    }

    // Validate usage limit
    if (coupon.max_uses !== null && coupon.times_used >= coupon.max_uses) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Este cupón ya alcanzó su límite de usos',
        },
        { status: 400 }
      )
    }

    // Validate applicable plans
    if (!coupon.applicable_plans.includes(plan)) {
      return NextResponse.json(
        {
          valid: false,
          error: `Este cupón no aplica para el plan ${plan}`,
        },
        { status: 400 }
      )
    }

    // Calculate final price
    const basePrice = plan === 'pro' ? 19.99 : 0 // Base price for pro plan
    let finalPrice = basePrice

    if (coupon.discount_type === 'percentage') {
      finalPrice = basePrice * (1 - coupon.discount_value / 100)
    } else if (coupon.discount_type === 'fixed') {
      finalPrice = Math.max(0, basePrice - coupon.discount_value)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
      pricing: {
        base_price: basePrice,
        discount_amount:
          coupon.discount_type === 'percentage'
            ? basePrice * (coupon.discount_value / 100)
            : Math.min(coupon.discount_value, basePrice),
        final_price: finalPrice,
        currency: 'USD',
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      {
        error: 'Error al validar cupón',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
