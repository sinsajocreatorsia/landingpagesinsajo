import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/hanna/auth'

export async function POST(request: Request) {
  try {
    // Authenticate user
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { sessionId, messageIndex, rating } = await request.json()

    // Validate rating (1 = thumbs up, -1 = thumbs down)
    if (rating !== 1 && rating !== -1) {
      return NextResponse.json({ error: 'Rating inválido' }, { status: 400 })
    }

    if (!sessionId || messageIndex === undefined) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    // Verify session belongs to user
    const { data: session } = await (supabaseAdmin.from('hanna_sessions') as ReturnType<typeof supabaseAdmin.from>)
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
    }

    // Find the most recent API usage log for this session to attach satisfaction
    const { data: logs } = await (supabaseAdmin.from('api_usage_logs') as ReturnType<typeof supabaseAdmin.from>)
      .select('id')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (logs && logs.length > 0) {
      const logRecord = logs[0] as { id: string }
      await (supabaseAdmin.from('api_usage_logs') as ReturnType<typeof supabaseAdmin.from>)
        .update({ user_satisfaction: rating } as Record<string, unknown>)
        .eq('id', logRecord.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
