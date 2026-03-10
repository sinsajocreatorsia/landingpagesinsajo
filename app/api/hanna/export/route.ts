import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/hanna/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTable = (name: string) => (supabaseAdmin as any).from(name)

interface SessionRow {
  id: string
  title: string
  created_at: string
  updated_at: string
}

interface MessageRow {
  role: string
  content: string
  created_at: string
}

// GET - Export all conversations as JSON or TXT
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check plan - only Business can export
    const { data: profile } = await getTable('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = (profile as { plan: string } | null)?.plan || 'free'
    if (plan !== 'business') {
      return NextResponse.json(
        { error: 'La exportación de conversaciones requiere Hanna Business.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const sessionId = searchParams.get('sessionId')

    // Fetch sessions
    let sessionsQuery = getTable('hanna_sessions')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (sessionId) {
      sessionsQuery = sessionsQuery.eq('id', sessionId)
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery

    if (sessionsError) {
      return NextResponse.json({ error: 'Error al obtener sesiones' }, { status: 500 })
    }

    const typedSessions = (sessions || []) as SessionRow[]

    // Fetch messages for each session
    const exportData = await Promise.all(
      typedSessions.map(async (session) => {
        const { data: messages } = await getTable('hanna_messages')
          .select('role, content, created_at')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true })

        return {
          session: {
            id: session.id,
            title: session.title,
            created_at: session.created_at,
            updated_at: session.updated_at,
          },
          messages: ((messages || []) as MessageRow[]).map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.created_at,
          })),
        }
      })
    )

    if (format === 'txt') {
      // Plain text format
      const lines: string[] = [
        `Conversaciones de Hanna - Exportado: ${new Date().toLocaleDateString('es-MX')}`,
        '='.repeat(60),
        '',
      ]

      for (const conv of exportData) {
        lines.push(`Conversacion: ${conv.session.title}`)
        lines.push(`Fecha: ${new Date(conv.session.created_at).toLocaleDateString('es-MX')}`)
        lines.push('-'.repeat(40))

        for (const msg of conv.messages) {
          const role = msg.role === 'user' ? 'Tu' : 'Hanna'
          const time = new Date(msg.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
          lines.push(`[${time}] ${role}: ${msg.content}`)
        }
        lines.push('')
        lines.push('='.repeat(60))
        lines.push('')
      }

      return new Response(lines.join('\n'), {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="hanna-conversaciones-${Date.now()}.txt"`,
        },
      })
    }

    // JSON format (default)
    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="hanna-conversaciones-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Error al exportar conversaciones' }, { status: 500 })
  }
}
