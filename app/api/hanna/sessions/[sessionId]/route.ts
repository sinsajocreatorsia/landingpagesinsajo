import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{ sessionId: string }>
}

// Types for session data
interface SessionData {
  id: string
  title: string | null
  created_at: string
  updated_at: string
}

interface MessageData {
  id: string
  role: string
  content: string
  created_at: string
}

// Helper to get untyped table
function getTable(tableName: string) {
  return (supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>)
}

// GET - Get session with messages
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Get session
    const { data: sessionData, error: sessionError } = await getTable('hanna_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    const session = sessionData as SessionData | null

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    // Get messages
    const { data: messagesData, error: messagesError } = await getTable('hanna_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    const messages = messagesData as MessageData[] | null

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        title: session.title,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
      },
      messages: messages?.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at,
      })) || [],
    })
  } catch (error) {
    console.error('Session GET error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PATCH - Update session (title, etc.)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { title } = await request.json()

    // Update session
    const { data: sessionData, error } = await getTable('hanna_sessions')
      .update({ title, updated_at: new Date().toISOString() } as Record<string, unknown>)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    const session = sessionData as SessionData | null

    if (error || !session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        title: session.title,
        updatedAt: session.updated_at,
      },
    })
  } catch (error) {
    console.error('Session PATCH error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete session
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { sessionId } = await params
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Soft delete session
    const { error } = await getTable('hanna_sessions')
      .update({ is_active: false, updated_at: new Date().toISOString() } as Record<string, unknown>)
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Error al eliminar sesión' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Sesión eliminada',
    })
  } catch (error) {
    console.error('Session DELETE error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
