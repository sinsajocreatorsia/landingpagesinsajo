import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { supabaseAdmin } from '@/lib/supabase'
import { logAdminAction } from '@/lib/security/audit'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    // Fetch admin emails
    const { data: adminEmails } = await (supabaseAdmin
      .from('admin_emails') as ReturnType<typeof supabaseAdmin.from>)
      .select('id, email, created_at')
      .order('created_at', { ascending: true })

    // Fetch admin users with their auth info
    const { data: adminUsers } = await (supabaseAdmin
      .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
      .select('id, user_id, role, created_at')
      .order('created_at', { ascending: true })

    // Get user emails for admin users
    const adminUsersWithEmail = []
    if (adminUsers) {
      for (const admin of adminUsers as Array<Record<string, unknown>>) {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(admin.user_id as string)
        adminUsersWithEmail.push({
          id: admin.id,
          user_id: admin.user_id,
          role: admin.role,
          email: user?.email || 'Unknown',
          created_at: admin.created_at,
        })
      }
    }

    // System health
    const { count: totalUsers } = await (supabaseAdmin
      .from('profiles') as ReturnType<typeof supabaseAdmin.from>)
      .select('id', { count: 'exact', head: true })

    const stripeConfigured = process.env.STRIPE_SECRET_KEY
      && process.env.STRIPE_SECRET_KEY !== 'PENDING_CREATE_IN_STRIPE'
    const stripeWebhookConfigured = process.env.STRIPE_WEBHOOK_SECRET_HANNA
      && process.env.STRIPE_WEBHOOK_SECRET_HANNA !== 'PENDING_CREATE_IN_STRIPE'

    return NextResponse.json({
      adminEmails: adminEmails || [],
      adminUsers: adminUsersWithEmail,
      system: {
        totalUsers: totalUsers || 0,
        stripeConfigured: !!stripeConfigured,
        stripeWebhookConfigured: !!stripeWebhookConfigured,
        supabaseConnected: true,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'Not configured',
      },
    })
  } catch (err) {
    console.error('Settings fetch error:', err)
    return NextResponse.json({ error: 'Error al cargar configuración' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { user: adminCaller, role, error } = await requireAdmin()
  if (error) return error

  if (role !== 'super_admin') {
    return NextResponse.json({ error: 'Solo super admins pueden modificar configuración' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { action, email } = body

    if (action === 'add_admin_email') {
      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
      }

      const { error: insertError } = await (supabaseAdmin
        .from('admin_emails') as ReturnType<typeof supabaseAdmin.from>)
        .insert({ email: email.toLowerCase().trim() } as Record<string, unknown>)

      if (insertError) {
        if (insertError.code === '23505') {
          return NextResponse.json({ error: 'Este email ya está en la lista' }, { status: 409 })
        }
        throw insertError
      }

      await logAdminAction({
        adminUserId: adminCaller!.id,
        action: 'add_admin_email',
        targetType: 'admin_email',
        details: { email: email.toLowerCase().trim() },
      })

      return NextResponse.json({ success: true, message: `${email} agregado a la lista de admins` })
    }

    if (action === 'remove_admin_email') {
      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
      }

      await (supabaseAdmin
        .from('admin_emails') as ReturnType<typeof supabaseAdmin.from>)
        .delete()
        .eq('email', email.toLowerCase().trim())

      await logAdminAction({
        adminUserId: adminCaller!.id,
        action: 'remove_admin_email',
        targetType: 'admin_email',
        details: { email: email.toLowerCase().trim() },
      })

      return NextResponse.json({ success: true, message: `${email} removido de la lista de admins` })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (err) {
    console.error('Settings update error:', err)
    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}
