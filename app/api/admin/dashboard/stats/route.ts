import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// Admin client with service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    // Verify user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Fetch all metrics in parallel
    const [usersResult, revenueResult, costsResult, marginsResult, couponsResult] =
      await Promise.all([
        // Users metrics
        supabaseAdmin.rpc('get_user_stats'),

        // Revenue metrics
        supabaseAdmin.rpc('get_revenue_stats'),

        // Costs metrics (last 30 days)
        supabaseAdmin.rpc('get_costs_stats'),

        // Margin analysis
        supabaseAdmin.rpc('get_margin_stats'),

        // Coupon stats
        supabaseAdmin.from('coupon_stats').select('*').single(),
      ])

    // Handle RPC fallback - if functions don't exist, query tables directly
    let users, revenue, costs, margin

    if (usersResult.error) {
      // Fallback: Query users table directly
      const { data: allUsers } = await supabaseAdmin.from('users').select('plan')
      const proUsers = allUsers?.filter((u) => u.plan === 'pro').length || 0
      const freeUsers = allUsers?.filter((u) => u.plan === 'free').length || 0

      // Active users in last 30 days from api_usage_logs
      const { data: activeUsersData } = await supabaseAdmin
        .from('api_usage_logs')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      const activeUsers = new Set(activeUsersData?.map((log) => log.user_id) || []).size

      users = {
        total: allUsers?.length || 0,
        pro: proUsers,
        free: freeUsers,
        active_30d: activeUsers,
      }
    } else {
      users = usersResult.data
    }

    if (revenueResult.error) {
      // Fallback: Calculate from subscriptions table
      const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('stripe_plan_id, status')
        .eq('status', 'active')

      const proSubs = subscriptions?.filter((s) => s.stripe_plan_id === 'pro').length || 0
      const mrr = proSubs * 19.99

      const { data: allSubs } = await supabaseAdmin
        .from('subscriptions')
        .select('created_at, stripe_plan_id')

      const lifetimeRevenue =
        allSubs?.reduce((sum, sub) => {
          if (sub.stripe_plan_id === 'pro') {
            const monthsActive =
              (Date.now() - new Date(sub.created_at).getTime()) / (30 * 24 * 60 * 60 * 1000)
            return sum + monthsActive * 19.99
          }
          return sum
        }, 0) || 0

      revenue = {
        mrr,
        total_lifetime: lifetimeRevenue,
      }
    } else {
      revenue = revenueResult.data
    }

    if (costsResult.error) {
      // Fallback: Calculate from api_usage_logs (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const { data: usageLogs } = await supabaseAdmin
        .from('api_usage_logs')
        .select('total_cost, user_plan')
        .gte('created_at', thirtyDaysAgo)

      const total30d = usageLogs?.reduce((sum, log) => sum + (log.total_cost || 0), 0) || 0
      const proCosts =
        usageLogs
          ?.filter((log) => log.user_plan === 'pro')
          .reduce((sum, log) => sum + (log.total_cost || 0), 0) || 0
      const freeCosts =
        usageLogs
          ?.filter((log) => log.user_plan === 'free')
          .reduce((sum, log) => sum + (log.total_cost || 0), 0) || 0

      const totalUsers = users.total || 1
      const avgCostPerUser = total30d / totalUsers

      costs = {
        total_30d: total30d,
        pro_costs: proCosts,
        free_costs: freeCosts,
        avg_cost_per_user: avgCostPerUser,
      }
    } else {
      costs = costsResult.data
    }

    if (marginsResult.error) {
      // Fallback: Calculate margin from revenue and costs
      const revenue30d = revenue.mrr // Approximate monthly revenue
      const costs30d = costs.total_30d
      const profit30d = revenue30d - costs30d
      const marginPercentage = revenue30d > 0 ? (profit30d / revenue30d) * 100 : 0

      margin = {
        revenue_30d: revenue30d,
        costs_30d: costs30d,
        profit_30d: profit30d,
        margin_percentage: marginPercentage,
      }
    } else {
      margin = marginsResult.data
    }

    const coupons = couponsResult.data || {
      total: 0,
      active: 0,
      total_redemptions: 0,
      total_discount_given: 0,
    }

    // Return structured response
    return NextResponse.json({
      success: true,
      stats: {
        users,
        revenue,
        costs,
        margin,
        coupons,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cargar estadísticas' },
      { status: 500 }
    )
  }
}
