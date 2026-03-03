import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { getUserMemories, createMemory } from '@/lib/hanna/memory-service'
import { VALID_CATEGORIES } from '@/types/memory'
import type { MemoryCategory } from '@/types/memory'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

// GET - List all active memories for current user (all plans)
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get user plan for limit calculation
    const { data: profile } = await getTable('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const plan = (profile as { plan: string } | null)?.plan || 'free'

    // Optional category filter
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let memories
    if (category && VALID_CATEGORIES.includes(category as MemoryCategory)) {
      // For filtered queries, apply plan-based date limits inline
      let query = getTable('hanna_user_memory')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('category', category)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false })

      // Free users: only last 7 days
      if (plan === 'free') {
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - 7)
        query = query.gte('created_at', cutoff.toISOString())
      }

      const { data } = await query
      memories = data || []
    } else {
      // getUserMemories applies plan limits internally
      const maxItems = ['pro', 'business'].includes(plan) ? 100 : 10
      memories = await getUserMemories(user.id, maxItems, plan)
    }

    return NextResponse.json({
      success: true,
      memories,
      total: memories.length,
      plan,
    })
  } catch (error) {
    console.error('Memory GET error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Manually create a memory item
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Check Pro plan
    const { data: profile } = await getTable('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (!profile || !['pro', 'business'].includes((profile as { plan: string }).plan)) {
      return NextResponse.json(
        { error: 'Esta funcionalidad requiere Hanna Pro' },
        { status: 403 }
      )
    }

    const { category, content } = await request.json()

    if (!category || !content) {
      return NextResponse.json(
        { error: 'Categoria y contenido son requeridos' },
        { status: 400 }
      )
    }

    if (!VALID_CATEGORIES.includes(category as MemoryCategory)) {
      return NextResponse.json(
        { error: 'Categoria invalida' },
        { status: 400 }
      )
    }

    if (typeof content !== 'string' || content.length > 500) {
      return NextResponse.json(
        { error: 'Contenido invalido (max 500 caracteres)' },
        { status: 400 }
      )
    }

    const memory = await createMemory(user.id, {
      category: category as MemoryCategory,
      content,
      confidence: 1.0,
    })

    if (!memory) {
      return NextResponse.json(
        { error: 'Error al crear memoria' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, memory })
  } catch (error) {
    console.error('Memory POST error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
