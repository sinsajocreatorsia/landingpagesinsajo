import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-guard'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/audit
 * List admin audit logs with pagination and filters.
 * Query params: page, perPage, action, targetType
 */
export async function GET(request: Request) {
  const { error: authError } = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '30')))
    const actionFilter = searchParams.get('action') || ''
    const targetTypeFilter = searchParams.get('targetType') || ''

    const offset = (page - 1) * perPage

    // Build query
    let query = (supabaseAdmin
      .from('admin_audit_logs') as ReturnType<typeof supabaseAdmin.from>)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (actionFilter) {
      query = query.eq('action', actionFilter)
    }
    if (targetTypeFilter) {
      query = query.eq('target_type', targetTypeFilter)
    }

    const { data: logs, count, error } = await query

    if (error) throw error

    const records = (logs || []) as Array<Record<string, unknown>>

    // Fetch admin user emails for display
    const adminIds = [...new Set(records.map(r => r.admin_user_id as string).filter(Boolean))]
    const emailMap = new Map<string, string>()

    for (const adminId of adminIds) {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(adminId)
      if (user?.email) {
        emailMap.set(adminId, user.email)
      }
    }

    const enrichedLogs = records.map(r => ({
      id: r.id,
      admin_email: emailMap.get(r.admin_user_id as string) || 'Unknown',
      action: r.action,
      target_type: r.target_type,
      target_id: r.target_id,
      details: r.details,
      ip_address: r.ip_address,
      created_at: r.created_at,
    }))

    return NextResponse.json({
      success: true,
      logs: enrichedLogs,
      pagination: {
        page,
        perPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / perPage),
      },
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Error al obtener logs de auditoría' },
      { status: 500 }
    )
  }
}
