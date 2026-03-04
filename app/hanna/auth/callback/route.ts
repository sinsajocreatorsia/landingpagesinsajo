import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { sanitizeRedirect } from '@/lib/auth-guard'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = sanitizeRedirect(searchParams.get('redirect'))

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // setAll can fail in Server Components - safe to ignore with middleware
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Ensure profile exists for new user
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, plan')
          .eq('id', user.id)
          .single()

        // Create profile if it doesn't exist (use admin client to bypass RLS)
        if (!profile) {
          const { error: insertError } = await supabaseAdmin.from('profiles').insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url,
            plan: 'free',
            subscription_status: 'active',
            messages_today: 0,
          })

          if (insertError) {
            console.error('Profile creation failed:', insertError)
            return NextResponse.redirect(`${origin}/hanna/login?error=auth_failed&detail=profile_creation`)
          }
        }

        // Track if coupon was redeemed (determines redirect)
        let couponRedeemed = false

        // Redeem pending coupon from signup (stored in user metadata)
        const pendingCoupon = user.user_metadata?.pending_coupon_code
        if (pendingCoupon && typeof pendingCoupon === 'string') {
          try {
            // Try hanna_coupons first, then discount_coupons as fallback
            let coupon = null
            const { data: hannaCoupon } = await (supabaseAdmin.from('hanna_coupons') as ReturnType<typeof supabaseAdmin.from>)
              .select('id, code, discount_type, free_months, max_uses, current_uses, is_active, valid_until')
              .eq('code', pendingCoupon.toUpperCase())
              .eq('is_active', true)
              .single()

            if (hannaCoupon) {
              coupon = hannaCoupon
            } else {
              // Fallback to discount_coupons table
              const { data: discountCoupon } = await (supabaseAdmin.from('discount_coupons') as ReturnType<typeof supabaseAdmin.from>)
                .select('id, code, discount_type, discount_value, free_months, max_uses, times_used, is_active, valid_until')
                .eq('code', pendingCoupon.toUpperCase())
                .eq('is_active', true)
                .single()
              if (discountCoupon) {
                // Normalize field names
                const dc = discountCoupon as Record<string, unknown>
                coupon = { ...dc, current_uses: dc.times_used }
              }
            }

            if (coupon) {
              const couponRecord = coupon as Record<string, unknown>
              const isExpired = couponRecord.valid_until && new Date(couponRecord.valid_until as string) < new Date()
              const maxReached = couponRecord.max_uses && (couponRecord.current_uses as number) >= (couponRecord.max_uses as number)

              if (!isExpired && !maxReached) {
                // Check not already redeemed by this user
                const { data: existingRedemption } = await (supabaseAdmin.from('hanna_coupon_redemptions') as ReturnType<typeof supabaseAdmin.from>)
                  .select('id')
                  .eq('coupon_id', couponRecord.id as string)
                  .eq('user_id', user.id)
                  .single()

                if (!existingRedemption) {
                  // Apply coupon benefits
                  if (couponRecord.discount_type === 'free_months' && couponRecord.free_months) {
                    const freeMonths = couponRecord.free_months as number
                    const expiresAt = new Date()
                    expiresAt.setMonth(expiresAt.getMonth() + freeMonths)

                    await (supabaseAdmin.from('profiles') as ReturnType<typeof supabaseAdmin.from>)
                      .update({
                        plan: 'pro',
                        subscription_status: 'active',
                        plan_started_at: new Date().toISOString(),
                        plan_expires_at: expiresAt.toISOString(),
                      } as Record<string, unknown>)
                      .eq('id', user.id)

                    couponRedeemed = true
                  }

                  // Record redemption
                  await (supabaseAdmin.from('hanna_coupon_redemptions') as ReturnType<typeof supabaseAdmin.from>)
                    .insert({
                      coupon_id: couponRecord.id,
                      user_id: user.id,
                    } as Record<string, unknown>)

                  // Increment coupon usage (handle both table schemas)
                  if (hannaCoupon) {
                    await (supabaseAdmin.from('hanna_coupons') as ReturnType<typeof supabaseAdmin.from>)
                      .update({ current_uses: ((couponRecord.current_uses as number) || 0) + 1 } as Record<string, unknown>)
                      .eq('id', couponRecord.id as string)
                  } else {
                    await (supabaseAdmin.from('discount_coupons') as ReturnType<typeof supabaseAdmin.from>)
                      .update({ times_used: ((couponRecord.current_uses as number) || 0) + 1 } as Record<string, unknown>)
                      .eq('id', couponRecord.id as string)
                  }
                }
              }
            }

            // Clear pending coupon from user metadata
            await supabase.auth.updateUser({
              data: { pending_coupon_code: null, selected_plan: null },
            })
          } catch (couponError) {
            console.error('Coupon redemption in callback failed:', couponError)
          }
        }

        // Determine redirect based on selected plan and coupon status
        const selectedPlan = user.user_metadata?.selected_plan
        let finalRedirect = redirect

        if (couponRedeemed) {
          // Coupon gave them Pro, go straight to dashboard
          finalRedirect = '/hanna/dashboard'
        } else if (selectedPlan === 'pro' && !couponRedeemed) {
          // User chose Pro but no coupon, send to upgrade/checkout
          finalRedirect = '/hanna/upgrade'
        } else if (redirect === '/hanna/dashboard') {
          // Default redirect is fine
          finalRedirect = '/hanna/dashboard'
        }

        // Clear selected_plan metadata
        if (selectedPlan) {
          await supabase.auth.updateUser({
            data: { selected_plan: null },
          })
        }

        return NextResponse.redirect(`${origin}${finalRedirect}`)
      }

      return NextResponse.redirect(`${origin}${redirect}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/hanna/login?error=auth_failed`)
}
