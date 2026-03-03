import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/hanna/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { updateMemory, deleteMemory } from '@/lib/hanna/memory-service'
import { VALID_CATEGORIES } from '@/types/memory'
import type { MemoryCategory, UpdateMemoryInput } from '@/types/memory'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

// PATCH - Update a memory item
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { memoryId } = await params

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

    const body = await request.json()
    const input: UpdateMemoryInput = {}

    if (body.content !== undefined) {
      if (typeof body.content !== 'string' || body.content.length > 500) {
        return NextResponse.json(
          { error: 'Contenido invalido (max 500 caracteres)' },
          { status: 400 }
        )
      }
      input.content = body.content
    }

    if (body.category !== undefined) {
      if (!VALID_CATEGORIES.includes(body.category as MemoryCategory)) {
        return NextResponse.json(
          { error: 'Categoria invalida' },
          { status: 400 }
        )
      }
      input.category = body.category as MemoryCategory
    }

    if (body.is_active !== undefined) input.is_active = Boolean(body.is_active)
    if (body.is_pinned !== undefined) input.is_pinned = Boolean(body.is_pinned)

    const memory = await updateMemory(user.id, memoryId, input)

    if (!memory) {
      return NextResponse.json(
        { error: 'Memoria no encontrada o error al actualizar' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, memory })
  } catch (error) {
    console.error('Memory PATCH error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a memory item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ memoryId: string }> }
) {
  try {
    const { memoryId } = await params

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

    const success = await deleteMemory(user.id, memoryId)

    if (!success) {
      return NextResponse.json(
        { error: 'Memoria no encontrada o error al eliminar' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Memory DELETE error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
