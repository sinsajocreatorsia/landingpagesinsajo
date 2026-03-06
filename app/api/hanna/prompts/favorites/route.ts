import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

// POST /api/hanna/prompts/favorites - Toggle favorite (auth required)
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt_id } = body

    if (!prompt_id) {
      return NextResponse.json({ error: 'prompt_id requerido' }, { status: 400 })
    }

    // Check if prompt exists
    const { data: prompt } = await getTable('hanna_prompt_library')
      .select('id, favorite_count')
      .eq('id', prompt_id)
      .single()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt no encontrado' }, { status: 404 })
    }

    // Check if already favorited
    const { data: existing } = await getTable('hanna_prompt_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', prompt_id)
      .maybeSingle()

    let favorited: boolean

    if (existing) {
      // Unfavorite
      await getTable('hanna_prompt_favorites')
        .delete()
        .eq('id', existing.id)

      await getTable('hanna_prompt_library')
        .update({ favorite_count: Math.max(0, (prompt.favorite_count || 0) - 1) })
        .eq('id', prompt_id)

      getTable('hanna_prompt_usage_stats')
        .insert({ prompt_id, user_id: user.id, action: 'unfavorite' })
        .then(() => {})

      favorited = false
    } else {
      // Favorite
      await getTable('hanna_prompt_favorites')
        .insert({ user_id: user.id, prompt_id })

      await getTable('hanna_prompt_library')
        .update({ favorite_count: (prompt.favorite_count || 0) + 1 })
        .eq('id', prompt_id)

      getTable('hanna_prompt_usage_stats')
        .insert({ prompt_id, user_id: user.id, action: 'favorite' })
        .then(() => {})

      favorited = true
    }

    return NextResponse.json({ success: true, favorited })
  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
