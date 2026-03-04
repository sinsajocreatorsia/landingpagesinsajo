import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

// ============================================
// Server-side Supabase client for Route Handlers
// ============================================
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
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
}

// ============================================
// Middleware Supabase client
// ============================================
export function createMiddlewareSupabaseClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response }
}

// ============================================
// Get current user (server-side)
// ============================================
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

// ============================================
// Get user with profile (server-side)
// ============================================
export async function getUserWithProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { user: null, profile: null }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return { user, profile: null }
  }

  return { user, profile }
}

// ============================================
// Check if user has HANNA Pro plan
// ============================================
export async function isHannaPro() {
  const { profile } = await getUserWithProfile()
  return profile?.plan === 'pro' && profile?.subscription_status === 'active'
}

// ============================================
// Protected routes list for HANNA
// ============================================
export const HANNA_PROTECTED_ROUTES = [
  '/hanna/dashboard',
  '/hanna/chat',
  '/hanna/history',
  '/hanna/settings',
  '/hanna/profile',
  '/hanna/billing',
]

export const HANNA_AUTH_ROUTES = [
  '/hanna/login',
  '/hanna/signup',
  '/hanna/forgot-password',
  '/hanna/reset-password',
]
