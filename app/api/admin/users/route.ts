import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { supabaseAdmin } from '@/lib/supabase'
import { logAdminAction } from '@/lib/security/audit'

// Type for the enriched user returned by GET
interface UserListItem {
  id: string
  email: string | undefined
  full_name: string | null
  plan: string | null
  subscription_status: string | null
  messages_today: number | null
  created_at: string | undefined
  last_sign_in_at: string | undefined
  is_admin: boolean
}

/**
 * GET /api/admin/users
 * List all users with profiles, admin status, and pagination.
 * Query params: search, plan, page (1-based), perPage
 */
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim().toLowerCase() || ''
    const planFilter = searchParams.get('plan') // 'free' | 'pro' | null
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '20')))

    // 1. Fetch all auth users from Supabase Auth
    const { data: authData, error: authError2 } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    })

    if (authError2) throw authError2

    const authUsers = authData?.users || []

    if (authUsers.length === 0) {
      return NextResponse.json({
        success: true,
        users: [],
        pagination: { page, perPage, total: 0, totalPages: 0 },
      })
    }

    const userIds = authUsers.map((u) => u.id)

    // 2. Fetch profiles for these users
    const { data: profiles } = await (supabaseAdmin
      .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .select('id, email, full_name, plan, subscription_status, messages_today, created_at')
      .in('id', userIds)

    const profileMap = new Map<string, Record<string, unknown>>()
    if (profiles) {
      for (const p of profiles as Record<string, unknown>[]) {
        profileMap.set(p.id as string, p)
      }
    }

    // 3. Fetch admin users
    const { data: adminUsers } = await (supabaseAdmin
      .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
      .select('user_id, role')
      .in('user_id', userIds)

    const adminMap = new Map<string, string>()
    if (adminUsers) {
      for (const a of adminUsers as Record<string, unknown>[]) {
        adminMap.set(a.user_id as string, a.role as string)
      }
    }

    // 4. Merge auth + profile + admin data
    let users: UserListItem[] = authUsers.map((authUser) => {
      const profile = profileMap.get(authUser.id)
      return {
        id: authUser.id,
        email: authUser.email,
        full_name: (profile?.full_name as string | null) ?? null,
        plan: (profile?.plan as string | null) ?? 'free',
        subscription_status: (profile?.subscription_status as string | null) ?? null,
        messages_today: (profile?.messages_today as number | null) ?? 0,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        is_admin: adminMap.has(authUser.id),
      }
    })

    // 5. Apply client-side filters (search and plan)
    if (search) {
      users = users.filter((u) => {
        const email = (u.email || '').toLowerCase()
        const name = (u.full_name || '').toLowerCase()
        return email.includes(search) || name.includes(search)
      })
    }

    if (planFilter && (planFilter === 'free' || planFilter === 'pro' || planFilter === 'business')) {
      users = users.filter((u) => u.plan === planFilter)
    }

    // Note: Supabase Auth listUsers handles server-side pagination.
    // The search/plan filters are applied client-side on the current page.
    const total = authData?.users?.length || 0

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error('Error listing users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Create a new user with auth account and profile.
 * Body: { email, password, full_name, plan }
 */
export async function POST(request: Request) {
  const { user: adminCaller, error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()
    const { email, password, full_name, plan } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 12) {
      return NextResponse.json(
        { error: 'La password debe tener al menos 12 caracteres' },
        { status: 400 }
      )
    }

    // Password complexity: at least one uppercase, one lowercase, one number
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'La password debe contener al menos una mayuscula, una minuscula y un numero' },
        { status: 400 }
      )
    }

    const validPlans = ['free', 'pro']
    const userPlan = validPlans.includes(plan) ? plan : 'free'

    // 1. Create auth user
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || '' },
    })

    if (createError) {
      // Handle duplicate email
      if (createError.message?.includes('already been registered') || createError.message?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Ya existe un usuario con este email' },
          { status: 409 }
        )
      }
      throw createError
    }

    const newUser = authData.user

    // 2. Create profile entry
    const { error: profileError } = await (supabaseAdmin
      .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .insert({
        id: newUser.id,
        email: newUser.email,
        full_name: full_name || null,
        plan: userPlan,
        messages_today: 0,
      } as Record<string, unknown>)

    if (profileError) {
      console.error('Error creating profile (user was created):', profileError)
      // User was created in auth but profile failed - return partial success
    }

    await logAdminAction({
      adminUserId: adminCaller!.id,
      action: 'create_user',
      targetType: 'user',
      targetId: newUser.id,
      details: { email, plan: userPlan },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: full_name || null,
        plan: userPlan,
        created_at: newUser.created_at,
      },
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}
