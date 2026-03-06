import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/auth-guard'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Types for profile data
interface ProfileData {
  stripe_customer_id: string | null
  plan: string | null
  email: string | null
  full_name: string | null
}

// Type for coupon data
interface CouponData {
  discount_type: string
  discount_value: number
  free_months?: number | null
}

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

export async function POST(request: Request) {
  // Rate limit: 5 checkout sessions per minute per IP
  const rateLimitResponse = rateLimit(request, { maxRequests: 5, windowMs: 60_000 })
  if (rateLimitResponse) return rateLimitResponse
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { plan = 'pro', couponCode } = await request.json()

    // Validate plan parameter
    if (plan !== 'pro' && plan !== 'business') {
      return NextResponse.json(
        { error: 'Plan no válido' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profileData } = await getTable('profiles')
      .select('stripe_customer_id, plan, email, full_name')
      .eq('id', user.id)
      .single()

    const profile = profileData as ProfileData | null

    // Check if already on same or higher plan (allow pro -> business upgrade)
    if (profile?.plan === 'business') {
      return NextResponse.json(
        { error: 'Ya tienes el plan Business' },
        { status: 400 }
      )
    }
    if (profile?.plan === 'pro' && plan === 'pro') {
      return NextResponse.json(
        { error: 'Ya tienes el plan Pro' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to profile
      await getTable('profiles')
        .update({ stripe_customer_id: customerId } as Record<string, unknown>)
        .eq('id', user.id)
    }

    // Prepare checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan === 'business'
            ? process.env.STRIPE_PRICE_HANNA_BUSINESS!
            : process.env.STRIPE_PRICE_HANNA_PRO!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/hanna/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/hanna/upgrade?cancelled=true`,
      metadata: {
        user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan,
        },
      },
    }

    // Apply coupon if provided
    if (couponCode) {
      const upperCode = couponCode.toUpperCase()

      // Check if valid in our database (using discount_coupons table)
      const { data: couponData } = await getTable('discount_coupons')
        .select('*')
        .eq('code', upperCode)
        .eq('is_active', true)
        .single()

      const coupon = couponData as CouponData | null

      if (coupon) {
        // For free_months coupons, we handle differently - apply trial period
        if (coupon.discount_type === 'free_months' && coupon.free_months && coupon.free_months > 0) {
          sessionParams.subscription_data = {
            ...sessionParams.subscription_data,
            trial_period_days: coupon.free_months * 30,
          }
        } else if (coupon.discount_type === 'percentage' || coupon.discount_type === 'fixed') {
          // Map known coupon codes to their Stripe coupon IDs
          const STRIPE_COUPON_MAP: Record<string, string> = {
            'HANNAPRO': 'HannaPro',
            'CHICASPRO2026': 'CHICASPRO2026',
          }
          const stripeCouponId = STRIPE_COUPON_MAP[upperCode] || null

          if (stripeCouponId) {
            // Use the mapped launch coupon directly by ID
            try {
              await stripe.coupons.retrieve(stripeCouponId)
              sessionParams.discounts = [{ coupon: stripeCouponId }]
            } catch {
              console.log('Launch coupon not found in Stripe:', stripeCouponId)
            }
          } else {
            // Regular coupon: find Stripe coupon by name
            try {
              const stripeCoupons = await stripe.coupons.list({ limit: 100 })
              const stripeCoupon = stripeCoupons.data.find(c => c.name === upperCode)
              if (stripeCoupon) {
                sessionParams.discounts = [{ coupon: stripeCoupon.id }]
              }
            } catch {
              console.log('No Stripe coupon found:', upperCode)
            }
          }
        }
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    )
  }
}
