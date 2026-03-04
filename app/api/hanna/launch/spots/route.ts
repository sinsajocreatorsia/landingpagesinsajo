import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface CouponRow {
  max_uses: number | null
  times_used: number
}

function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

function getMarchSpotsRemaining(totalSpots: number, realUsed: number): number {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed, March = 2

  // Only apply time-based reduction during March 2026
  if (year !== 2026 || month !== 2) {
    return Math.max(0, totalSpots - realUsed)
  }

  const dayOfMonth = now.getDate()
  const totalDays = 31 // March has 31 days

  // Reserve 3 spots minimum so it never hits 0 too early
  const minSpots = 3
  const availableToReduce = totalSpots - minSpots

  // Time-based reduction: lose spots progressively through the month
  const timeReduction = Math.floor((dayOfMonth / totalDays) * availableToReduce)

  const remaining = totalSpots - timeReduction - realUsed
  return Math.max(minSpots, Math.min(remaining, totalSpots - realUsed))
}

export async function GET() {
  try {
    const { data, error } = await getTable('discount_coupons')
      .select('max_uses, times_used')
      .eq('code', 'HannaPro')
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
    const remaining = getMarchSpotsRemaining(total, used)

    return NextResponse.json({
      active: remaining > 0,
      total,
      used,
      remaining,
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
