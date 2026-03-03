import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface CouponRow {
  max_uses: number | null
  times_used: number
}

function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

export async function GET() {
  try {
    const { data, error } = await getTable('discount_coupons')
      .select('max_uses, times_used')
      .eq('code', 'FUNDADOR')
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({
        active: false,
        total: 0,
        used: 0,
        remaining: 0,
      })
    }

    const coupon = data as CouponRow
    const total = coupon.max_uses || 50
    const used = coupon.times_used || 0

    return NextResponse.json({
      active: used < total,
      total,
      used,
      remaining: Math.max(0, total - used),
    })
  } catch {
    return NextResponse.json({
      active: false,
      total: 0,
      used: 0,
      remaining: 0,
    })
  }
}
