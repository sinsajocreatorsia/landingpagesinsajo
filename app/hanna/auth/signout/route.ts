import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'

export async function POST() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()

  return NextResponse.redirect(new URL('/hanna/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), {
    status: 302,
  })
}

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()

  const url = new URL(request.url)
  return NextResponse.redirect(new URL('/hanna/login', url.origin), {
    status: 302,
  })
}
