import { NextResponse } from 'next/server'
import { couponsTable } from '@/lib/supabase-helpers'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Código de cupón requerido' },
        { status: 400 }
      )
    }

    // Look up coupon
    const { data: coupon, error } = await couponsTable.findByCode(code)

    if (error || !coupon) {
      return NextResponse.json(
        { valid: false, error: 'Cupón no válido o expirado' },
        { status: 404 }
      )
    }

    // Check if coupon is expired
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Este cupón ha expirado' },
        { status: 400 }
      )
    }

    // Check if max uses reached
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: 'Este cupón ya alcanzó su límite de usos' },
        { status: 400 }
      )
    }

    // Build success message
    let message = ''
    if (coupon.discount_type === 'free_months') {
      message = `${coupon.free_months} meses gratis de Hanna Pro`
    } else if (coupon.discount_type === 'percentage') {
      message = `${coupon.discount_value}% de descuento`
    } else {
      message = `$${coupon.discount_value} de descuento`
    }

    return NextResponse.json({
      valid: true,
      message,
      coupon: {
        id: coupon.id,
        type: coupon.type || 'promo',
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        free_months: coupon.free_months || 0,
      },
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Error al validar cupón' },
      { status: 500 }
    )
  }
}
