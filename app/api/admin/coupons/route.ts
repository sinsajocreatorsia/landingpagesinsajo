import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-guard'
import { logAdminAction } from '@/lib/security/audit'

// GET - List all coupons (requires admin auth)
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = supabaseAdmin
      .from('discount_coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data: coupons, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      coupons,
    })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      {
        error: 'Error al obtener cupones',
        // Error details logged server-side only (see console)
      },
      { status: 500 }
    )
  }
}

// POST - Create new coupon (requires admin auth)
export async function POST(request: Request) {
  const { user: adminCaller, error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const {
      code,
      discount_type,
      discount_value,
      max_uses,
      valid_until,
      applicable_plans,
      created_by,
    } = body

    // Validation
    if (!code || !discount_type || !discount_value) {
      return NextResponse.json(
        { error: 'Código, tipo y valor de descuento son requeridos' },
        { status: 400 }
      )
    }

    // Validate discount value
    if (discount_type === 'percentage' && discount_value > 100) {
      return NextResponse.json(
        { error: 'El porcentaje de descuento no puede ser mayor a 100%' },
        { status: 400 }
      )
    }

    if (discount_value <= 0) {
      return NextResponse.json(
        { error: 'El valor de descuento debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const { data: existingCoupon } = await supabaseAdmin
      .from('discount_coupons')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Ya existe un cupón con este código' },
        { status: 409 }
      )
    }

    // Create coupon
    const { data: coupon, error } = await supabaseAdmin
      .from('discount_coupons')
      // @ts-expect-error - dynamic insert fields
      .insert({
        code: code.toUpperCase(),
        discount_type,
        discount_value,
        max_uses: max_uses || null,
        valid_until: valid_until || null,
        applicable_plans: applicable_plans || ['pro'],
        created_by: created_by || null,
      })
      .select()
      .single()

    if (error) throw error

    await logAdminAction({
      adminUserId: adminCaller!.id,
      action: 'create_coupon',
      targetType: 'coupon',
      targetId: (coupon as Record<string, unknown>)?.id as string,
      details: { code: code.toUpperCase(), discount_type, discount_value },
    })

    return NextResponse.json({
      success: true,
      coupon,
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      {
        error: 'Error al crear cupón',
        // Error details logged server-side only (see console)
      },
      { status: 500 }
    )
  }
}
