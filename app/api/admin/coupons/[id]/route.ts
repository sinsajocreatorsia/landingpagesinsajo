import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'

// GET - Get single coupon (requires admin auth)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params

    const { data: coupon, error } = await supabaseAdmin
      .from('discount_coupons')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!coupon) {
      return NextResponse.json({ error: 'Cupón no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      coupon,
    })
  } catch (error) {
    console.error('Error fetching coupon:', error)
    return NextResponse.json(
      {
        error: 'Error al obtener cupón',
        // Error details logged server-side only
      },
      { status: 500 }
    )
  }
}

// PATCH - Update coupon (requires admin auth)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, unknown> = {}

    // Only update provided fields
    if (body.discount_value !== undefined) {
      if (body.discount_value <= 0) {
        return NextResponse.json(
          { error: 'El valor de descuento debe ser mayor a 0' },
          { status: 400 }
        )
      }
      updates.discount_value = body.discount_value
    }

    if (body.max_uses !== undefined) {
      updates.max_uses = body.max_uses || null
    }

    if (body.valid_until !== undefined) {
      updates.valid_until = body.valid_until || null
    }

    if (body.is_active !== undefined) {
      updates.is_active = body.is_active
    }

    if (body.applicable_plans !== undefined) {
      updates.applicable_plans = body.applicable_plans
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      )
    }

    const { data: coupon, error } = await supabaseAdmin
      .from('discount_coupons')
      // @ts-expect-error - dynamic update fields
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      coupon,
    })
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json(
      {
        error: 'Error al actualizar cupón',
        // Error details logged server-side only
      },
      { status: 500 }
    )
  }
}

// DELETE - Deactivate coupon (requires admin auth)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { id } = await params

    const { data: coupon, error } = await supabaseAdmin
      .from('discount_coupons')
      // @ts-expect-error - dynamic update fields
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      coupon,
      message: 'Cupón desactivado exitosamente',
    })
  } catch (error) {
    console.error('Error deactivating coupon:', error)
    return NextResponse.json(
      {
        error: 'Error al desactivar cupón',
        // Error details logged server-side only
      },
      { status: 500 }
    )
  }
}
