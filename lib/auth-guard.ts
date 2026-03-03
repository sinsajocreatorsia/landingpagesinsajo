import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Validates that the request comes from an authenticated user.
 * Returns the user object or a 401 response.
 */
export async function requireAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, error: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) }
  }

  return { user, error: null }
}

/**
 * Validates that the request comes from an authenticated admin user.
 * Checks against the admin_users table in the database.
 * Returns the user + role or a 401/403 response.
 */
export async function requireAdmin() {
  const { user, error } = await requireAuth()

  if (error) {
    return { user: null, role: null, error }
  }

  const { data: adminUser } = await (supabaseAdmin
    .from('admin_users') as ReturnType<typeof supabaseAdmin.from>)
    .select('role')
    .eq('user_id', user!.id)
    .single()

  if (!adminUser) {
    return {
      user: null,
      role: null,
      error: NextResponse.json({ error: 'Acceso denegado: se requiere rol de admin' }, { status: 403 }),
    }
  }

  const record = adminUser as Record<string, unknown>
  return { user: user!, role: (record.role as string) || 'admin', error: null }
}

/**
 * Validates that the request comes from a super_admin.
 * Use for destructive or high-privilege operations.
 */
export async function requireSuperAdmin() {
  const { user, role, error } = await requireAdmin()
  if (error) return { user: null, role: null, error }

  if (role !== 'super_admin') {
    return {
      user: null,
      role: null,
      error: NextResponse.json(
        { error: 'Se requiere rol de super_admin' },
        { status: 403 }
      ),
    }
  }

  return { user, role, error: null }
}

/**
 * Whitelist of valid internal redirect paths.
 * Used to prevent open redirect attacks.
 */
const VALID_REDIRECTS = [
  '/hanna/dashboard',
  '/hanna/upgrade',
  '/hanna/settings',
  '/hanna/profile',
  '/hanna/billing',
  '/hanna/history',
  '/admin',
]

/**
 * Validates a redirect path against the whitelist.
 * Uses exact match or sub-path matching to prevent bypasses.
 */
export function sanitizeRedirect(redirect: string | null, fallback = '/hanna/dashboard'): string {
  if (!redirect) return fallback

  // Block protocol-relative URLs, external URLs, and backslash tricks
  if (redirect.includes('://') || redirect.startsWith('//') || redirect.includes('\\')) {
    return fallback
  }

  // Strip query params and fragments for matching
  const pathOnly = redirect.split('?')[0].split('#')[0]

  // Must exactly match or be a sub-path of a valid redirect
  if (VALID_REDIRECTS.some(valid => pathOnly === valid || pathOnly.startsWith(valid + '/'))) {
    return redirect
  }

  return fallback
}
