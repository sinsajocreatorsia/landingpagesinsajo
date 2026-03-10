import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWeeklySummaryEmail } from '@/lib/emails'
import OpenAI from 'openai'

// Cron job: generates and sends weekly summaries for Business plan users
// Schedule: every Monday at 14:00 UTC (~8-9 AM CST)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTable = (name: string) => (supabaseAdmin as any).from(name)

interface BusinessUser {
  id: string
  email: string
  full_name: string | null
}

interface MessageRow {
  role: string
  content: string
  created_at: string
  session_id: string
}

interface SessionRow {
  id: string
  title: string
}

function getAnalysisClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY_SAAS || process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OpenRouter API key not configured')
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://www.screatorsai.com',
      'X-Title': 'Sinsajo Creators - Hanna Weekly Summary',
    },
  })
}

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret) {
      return NextResponse.json({ error: 'Cron not configured' }, { status: 500 })
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all Business plan users
    const { data: businessProfiles } = await getTable('profiles')
      .select('id, plan')
      .eq('plan', 'business')

    if (!businessProfiles || businessProfiles.length === 0) {
      return NextResponse.json({ success: true, message: 'No business users', sent: 0 })
    }

    // Get user emails from auth
    const userIds = (businessProfiles as { id: string }[]).map(p => p.id)
    const users: BusinessUser[] = []

    for (const userId of userIds) {
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)
      if (user?.email) {
        // Get display name from profile or auth metadata
        const { data: profileData } = await getTable('profiles')
          .select('full_name')
          .eq('id', userId)
          .single()

        users.push({
          id: userId,
          email: user.email,
          full_name: (profileData as { full_name: string | null } | null)?.full_name
            || user.user_metadata?.full_name
            || user.email.split('@')[0],
        })
      }
    }

    // Date range: last 7 days
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekRange = `${weekAgo.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} - ${now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`

    let sentCount = 0
    const client = getAnalysisClient()

    for (const user of users) {
      try {
        // Get sessions from last 7 days
        const { data: sessions } = await getTable('hanna_sessions')
          .select('id, title')
          .eq('user_id', user.id)
          .gte('updated_at', weekAgo.toISOString())
          .order('updated_at', { ascending: false })

        const typedSessions = (sessions || []) as SessionRow[]
        if (typedSessions.length === 0) continue // Skip users with no activity

        const sessionIds = typedSessions.map(s => s.id)

        // Get messages from those sessions
        const { data: messages } = await getTable('hanna_messages')
          .select('role, content, created_at, session_id')
          .in('session_id', sessionIds)
          .gte('created_at', weekAgo.toISOString())
          .order('created_at', { ascending: true })

        const typedMessages = (messages || []) as MessageRow[]
        const totalMessages = typedMessages.length
        const totalSessions = typedSessions.length

        if (totalMessages < 5) continue // Skip if too few messages for meaningful summary

        // Use AI to analyze the week's conversations
        const conversationSample = typedMessages
          .filter(m => m.role === 'user')
          .slice(0, 30)
          .map(m => m.content)
          .join('\n---\n')

        const analysis = await client.chat.completions.create({
          model: 'google/gemini-2.0-flash-001',
          temperature: 0.3,
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: `Analiza las conversaciones de esta semana de un usuario de Hanna (consultora de negocios AI).
Responde SOLO en JSON valido con este formato exacto:
{
  "topTopics": ["tema1", "tema2", "tema3"],
  "keyInsights": ["insight1", "insight2"],
  "actionItems": ["accion1", "accion2"]
}
- topTopics: 3 temas principales discutidos (cortos, 3-5 palabras)
- keyInsights: 2-3 insights o aprendizajes clave de la semana
- actionItems: 2-3 acciones pendientes o recomendaciones
Todo en espanol. Se conciso.`,
            },
            {
              role: 'user',
              content: `Mensajes del usuario esta semana (${totalMessages} mensajes en ${totalSessions} conversaciones):\n\n${conversationSample}`,
            },
          ],
        })

        let topTopics: string[] = []
        let keyInsights: string[] = []
        let actionItems: string[] = []

        try {
          const raw = analysis.choices[0]?.message?.content || '{}'
          // Extract JSON from potential markdown code blocks
          const jsonMatch = raw.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            topTopics = parsed.topTopics || []
            keyInsights = parsed.keyInsights || []
            actionItems = parsed.actionItems || []
          }
        } catch {
          // Fallback: session titles as topics
          topTopics = typedSessions.slice(0, 3).map(s => s.title)
        }

        await sendWeeklySummaryEmail({
          to: user.email,
          customerName: user.full_name || 'Empresaria',
          weekRange,
          totalMessages,
          totalSessions,
          topTopics,
          keyInsights,
          actionItems,
          userId: user.id,
        })

        sentCount++
      } catch (userError) {
        console.error(`Weekly summary failed for user ${user.id}:`, userError)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Weekly summaries sent: ${sentCount}/${users.length}`,
      sent: sentCount,
      total: users.length,
    })
  } catch (error) {
    console.error('Weekly summary cron error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
