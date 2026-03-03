import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient, HANNA_PROTECTED_ROUTES, HANNA_AUTH_ROUTES } from '@/lib/hanna/auth'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareSupabaseClient(request)
  const pathname = request.nextUrl.pathname

  // Safely get user - if Supabase fails or cookie is corrupt, treat as unauthenticated
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }
  } catch {
    // Supabase unreachable or malformed cookie - continue as unauthenticated
  }

  // Check if this is an ADMIN route
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = new URL('/hanna/login', request.url)
      redirectUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminUser) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return response
  }

  // Check if this is a HANNA route
  const isHannaProtectedRoute = HANNA_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isHannaAuthRoute = HANNA_AUTH_ROUTES.some(route => pathname.startsWith(route))

  if (!isHannaProtectedRoute && !isHannaAuthRoute) {
    return response
  }

  // Redirect to login if trying to access protected route without valid user
  if (isHannaProtectedRoute && !user) {
    const redirectUrl = new URL('/hanna/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth routes (login, signup, forgot-password, reset-password) are always accessible
  // even if the user is logged in (they may want to switch accounts or reset password)
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/hanna/:path*',
  ],
}
