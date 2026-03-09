import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const table = supabaseAdmin.from('workshop_surveys') as ReturnType<typeof supabaseAdmin.from>

    await table
      .update({ google_review_clicked: true } as Record<string, unknown>)
      .eq('email', email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Google click tracking error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
