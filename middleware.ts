import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient, HANNA_PROTECTED_ROUTES, HANNA_AUTH_ROUTES } from '@/lib/hanna/auth'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareSupabaseClient(request)
  const pathname = request.nextUrl.pathname

  // Check if this is an ADMIN route
  if (pathname.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession()

    // Not authenticated - redirect to login
    if (!session) {
      const redirectUrl = new URL('/hanna/login', request.url)
      redirectUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!adminUser) {
      // Not an admin - redirect to unauthorized page
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // User is authenticated and is admin - allow access
    return response
  }

  // Check if this is a HANNA route
  const isHannaProtectedRoute = HANNA_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isHannaAuthRoute = HANNA_AUTH_ROUTES.some(route => pathname.startsWith(route))

  if (!isHannaProtectedRoute && !isHannaAuthRoute) {
    return response
  }

  // Get current session
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect to login if trying to access protected route without session
  if (isHannaProtectedRoute && !session) {
    const redirectUrl = new URL('/hanna/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if trying to access auth route with active session
  if (isHannaAuthRoute && session) {
    return NextResponse.redirect(new URL('/hanna/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/hanna/:path*',
  ],
}
