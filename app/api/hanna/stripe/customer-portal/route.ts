import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get user profile to find stripe_customer_id
    const { data: profileData } = await getTable('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    const profile = profileData as { stripe_customer_id: string | null } | null

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No se encontró una suscripción activa' },
        { status: 400 }
      )
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/hanna/billing`,
    })

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    })
  } catch (error) {
    console.error('Customer portal error:', error)
    return NextResponse.json(
      { error: 'Error al acceder al portal de facturación' },
      { status: 500 }
    )
  }
}
