import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

// Type for session data
interface SessionData {
  id: string
  title: string | null
  created_at: string
  updated_at: string
  is_active?: boolean
  hanna_messages?: { count: number }[]
}

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

// GET - List all sessions for current user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get user's sessions with message count
    const { data, error } = await getTable('hanna_sessions')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        is_active,
        hanna_messages(count)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(50)

    const sessions = data as SessionData[] | null

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json(
        { error: 'Error al obtener sesiones' },
        { status: 500 }
      )
    }

    // Format response
    const formattedSessions = sessions?.map(session => ({
      id: session.id,
      title: session.title,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      messageCount: session.hanna_messages?.[0]?.count || 0,
    })) || []

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
    })
  } catch (error) {
    console.error('Sessions GET error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Create a new session
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { title } = await request.json()

    // Create new session
    const { data, error } = await getTable('hanna_sessions')
      .insert({
        user_id: user.id,
        title: title || 'Nueva conversación',
      } as Record<string, unknown>)
      .select()
      .single()

    const session = data as SessionData | null

    if (error || !session) {
      console.error('Error creating session:', error)
      return NextResponse.json(
        { error: 'Error al crear sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        title: session.title,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
      },
    })
  } catch (error) {
    console.error('Sessions POST error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
