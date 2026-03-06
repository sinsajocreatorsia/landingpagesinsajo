import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

const VALID_ACTIONS = ['view', 'copy', 'chat_use'] as const
const COUNTER_MAP: Record<string, string> = {
  view: 'view_count',
  copy: 'copy_count',
  chat_use: 'chat_use_count',
}

// POST /api/hanna/prompts/track - Track usage (public)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt_id, action } = body

    if (!prompt_id || !action) {
      return NextResponse.json({ error: 'prompt_id y action requeridos' }, { status: 400 })
    }

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: 'Accion invalida' }, { status: 400 })
    }

    // Insert usage stat
    await getTable('hanna_prompt_usage_stats')
      .insert({ prompt_id, action })

    // Increment counter on prompt
    const counterField = COUNTER_MAP[action]
    if (counterField) {
      const { data: prompt } = await getTable('hanna_prompt_library')
        .select(counterField)
        .eq('id', prompt_id)
        .single()

      if (prompt) {
        await getTable('hanna_prompt_library')
          .update({ [counterField]: ((prompt as Record<string, number>)[counterField] || 0) + 1 })
          .eq('id', prompt_id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track API error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
