import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function getTable(tableName: string) {
  return supabaseAdmin.from(tableName) as ReturnType<typeof supabaseAdmin.from>
}

// GET /api/hanna/prompts/categories - List categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let query = getTable('hanna_prompt_categories')
      .select('*')
      .order('prompt_count', { ascending: false })

    if (type && ['use_case', 'style', 'subject'].includes(type)) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Error al obtener categorias' }, { status: 500 })
    }

    // Group by type
    const grouped = {
      use_cases: (data || []).filter((c: { type: string }) => c.type === 'use_case'),
      styles: (data || []).filter((c: { type: string }) => c.type === 'style'),
      subjects: (data || []).filter((c: { type: string }) => c.type === 'subject'),
    }

    return NextResponse.json({ success: true, categories: type ? data : grouped })
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
