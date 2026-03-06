import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

// GET /api/hanna/prompts/[id] - Get single prompt with related
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch prompt
    const { data: prompt, error } = await getTable('hanna_prompt_library')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !prompt) {
      return NextResponse.json({ error: 'Prompt no encontrado' }, { status: 404 })
    }

    // Increment view count (fire-and-forget)
    getTable('hanna_prompt_library')
      .update({ view_count: (prompt.view_count || 0) + 1 })
      .eq('id', id)
      .then(() => {})

    // Log usage stat
    getTable('hanna_prompt_usage_stats')
      .insert({ prompt_id: id, action: 'view' })
      .then(() => {})

    // Check if favorited by current user
    let isFavorited = false
    try {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: fav } = await getTable('hanna_prompt_favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('prompt_id', id)
          .maybeSingle()
        isFavorited = !!fav
      }
    } catch {
      // Not authenticated
    }

    // Fetch related prompts (same categories)
    const categories = [
      ...(prompt.use_cases || []),
      ...(prompt.styles || []),
      ...(prompt.subjects || []),
    ]

    let related: Record<string, unknown>[] = []
    if (categories.length > 0) {
      // Try to find prompts with overlapping categories
      const { data: relatedData } = await getTable('hanna_prompt_library')
        .select('*')
        .neq('id', id)
        .or(
          [
            prompt.use_cases?.length ? `use_cases.ov.{${prompt.use_cases.join(',')}}` : null,
            prompt.styles?.length ? `styles.ov.{${prompt.styles.join(',')}}` : null,
            prompt.subjects?.length ? `subjects.ov.{${prompt.subjects.join(',')}}` : null,
          ].filter(Boolean).join(',')
        )
        .limit(6)

      related = relatedData || []
    }

    // Fallback: random prompts if no related found
    if (related.length === 0) {
      const { data: fallback } = await getTable('hanna_prompt_library')
        .select('*')
        .neq('id', id)
        .order('favorite_count', { ascending: false })
        .limit(6)
      related = fallback || []
    }

    return NextResponse.json({
      success: true,
      prompt: { ...prompt, is_favorited: isFavorited },
      related,
    })
  } catch (error) {
    console.error('Prompt detail API error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
