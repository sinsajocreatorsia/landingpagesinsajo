import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

// GET /api/hanna/prompts - List/search prompts (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const useCases = searchParams.get('use_cases')?.split(',').filter(Boolean) || []
    const styles = searchParams.get('styles')?.split(',').filter(Boolean) || []
    const subjects = searchParams.get('subjects')?.split(',').filter(Boolean) || []
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'popular'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24')))
    const offset = (page - 1) * limit

    let query = getTable('hanna_prompt_library')
      .select('*', { count: 'exact' })

    // Full-text search
    if (q.trim()) {
      query = query.textSearch('search_vector', q.trim(), { type: 'plain' })
    }

    // Category filters (array overlap)
    if (useCases.length > 0) {
      query = query.overlaps('use_cases', useCases)
    }
    if (styles.length > 0) {
      query = query.overlaps('styles', styles)
    }
    if (subjects.length > 0) {
      query = query.overlaps('subjects', subjects)
    }

    // Featured filter
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Sort
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'most_copied':
        query = query.order('copy_count', { ascending: false })
        break
      case 'popular':
      default:
        query = query.order('favorite_count', { ascending: false })
          .order('view_count', { ascending: false })
        break
    }

    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching prompts:', error)
      return NextResponse.json({ error: 'Error al obtener prompts' }, { status: 500 })
    }

    // Check if user is authenticated to add is_favorited
    let favoriteIds: Set<string> = new Set()
    try {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && data && data.length > 0) {
        const promptIds = data.map((p: { id: string }) => p.id)
        const { data: favs } = await getTable('hanna_prompt_favorites')
          .select('prompt_id')
          .eq('user_id', user.id)
          .in('prompt_id', promptIds)
        if (favs) {
          favoriteIds = new Set(favs.map((f: { prompt_id: string }) => f.prompt_id))
        }
      }
    } catch {
      // Not authenticated, skip favorites
    }

    const prompts = (data || []).map((p: Record<string, unknown>) => ({
      ...p,
      is_favorited: favoriteIds.has(p.id as string),
    }))

    const total = count || 0

    return NextResponse.json({
      success: true,
      prompts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Prompts API error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
