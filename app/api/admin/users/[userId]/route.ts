import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/users/[userId]
 * Get a single user's full details: auth data + profile + admin status.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { userId } = await params

    // 1. Fetch auth user
    const { data: authData, error: authFetchError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (authFetchError || !authData?.user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const authUser = authData.user

    // 2. Fetch profile
    const { data: profile } = await (supabaseAdmin
      .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .select('*')
      .eq('id', userId)
      .single()

    // 3. Fetch admin status
    const { data: adminUser } = await (supabaseAdmin
      .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
      .select('user_id, role, created_at')
      .eq('user_id', userId)
      .single()

    const adminRecord = adminUser as Record<string, unknown> | null
    const profileRecord = profile as Record<string, unknown> | null

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        full_name: profileRecord?.full_name ?? null,
        avatar_url: profileRecord?.avatar_url ?? null,
        plan: profileRecord?.plan ?? 'free',
        subscription_status: profileRecord?.subscription_status ?? null,
        subscription_end_date: profileRecord?.subscription_end_date ?? null,
        stripe_customer_id: profileRecord?.stripe_customer_id ?? null,
        messages_today: profileRecord?.messages_today ?? 0,
        last_message_date: profileRecord?.last_message_date ?? null,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        is_admin: !!adminRecord,
        admin_role: (adminRecord?.role as string) || null,
        admin_since: (adminRecord?.created_at as string) || null,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[userId]
 * Update a user. Supports: plan, password, is_admin, full_name.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { user: adminCaller, error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { userId } = await params
    const body = await request.json()

    // Verify target user exists
    const { data: targetAuth, error: targetError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (targetError || !targetAuth?.user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const results: Record<string, unknown> = {}

    // --- Update password ---
    if (body.password !== undefined) {
      if (typeof body.password !== 'string' || body.password.length < 6) {
        return NextResponse.json(
          { error: 'La password debe tener al menos 6 caracteres' },
          { status: 400 }
        )
      }

      const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: body.password,
      })

      if (pwError) throw pwError
      results.password_updated = true
    }

    // --- Update full_name ---
    if (body.full_name !== undefined) {
      const { error: nameError } = await (supabaseAdmin
        .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
        .update({ full_name: body.full_name } as Record<string, unknown>)
        .eq('id', userId)

      if (nameError) throw nameError

      // Also update user_metadata in auth
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { full_name: body.full_name },
      })

      results.full_name = body.full_name
    }

    // --- Update plan ---
    if (body.plan !== undefined) {
      const validPlans = ['free', 'pro', 'business']
      if (!validPlans.includes(body.plan)) {
        return NextResponse.json(
          { error: 'Plan debe ser "free", "pro" o "business"' },
          { status: 400 }
        )
      }

      const { error: planError } = await (supabaseAdmin
        .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
        .update({ plan: body.plan } as Record<string, unknown>)
        .eq('id', userId)

      if (planError) throw planError
      results.plan = body.plan
    }

    // --- Toggle admin role ---
    if (body.is_admin !== undefined) {
      if (body.is_admin) {
        // Grant admin role
        const { error: insertError } = await (supabaseAdmin
          .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
          .upsert({
            user_id: userId,
            role: 'admin',
          } as Record<string, unknown>, { onConflict: 'user_id' })

        if (insertError) throw insertError
        results.is_admin = true
      } else {
        // Revoke admin role - but check if target is super_admin first
        const { data: existingAdmin } = await (supabaseAdmin
          .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
          .select('role')
          .eq('user_id', userId)
          .single()

        const existingRecord = existingAdmin as Record<string, unknown> | null

        if (existingRecord?.role === 'super_admin') {
          return NextResponse.json(
            { error: 'No se puede revocar el rol de super_admin' },
            { status: 403 }
          )
        }

        const { error: deleteError } = await (supabaseAdmin
          .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
          .delete()
          .eq('user_id', userId)

        if (deleteError) throw deleteError
        results.is_admin = false
      }
    }

    if (Object.keys(results).length === 0) {
      return NextResponse.json(
        { error: 'No hay campos para actualizar' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      updated: results,
      message: 'Usuario actualizado exitosamente',
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[userId]
 * Delete a user. Safety: cannot delete yourself, cannot delete super_admins.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { user: adminCaller, role: callerRole, error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { userId } = await params

    // Safety: cannot delete yourself
    if (adminCaller!.id === userId) {
      return NextResponse.json(
        { error: 'No puedes eliminarte a ti mismo' },
        { status: 403 }
      )
    }

    // Safety: check if target is super_admin
    const { data: targetAdmin } = await (supabaseAdmin
      .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
      .select('role')
      .eq('user_id', userId)
      .single()

    const targetRecord = targetAdmin as Record<string, unknown> | null

    if (targetRecord?.role === 'super_admin') {
      return NextResponse.json(
        { error: 'No se puede eliminar a un super_admin' },
        { status: 403 }
      )
    }

    // Verify target user exists
    const { data: targetAuth, error: targetError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (targetError || !targetAuth?.user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Delete the user from Supabase Auth (cascades to admin_users via FK)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}
